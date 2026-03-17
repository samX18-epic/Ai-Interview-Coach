const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

const MODEL = "gemini-2.5-flash";
const MAX_RETRIES = 3;

// Retry with exponential backoff on 429 rate limit errors
async function withRetry(fn, retries = MAX_RETRIES) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`⏳ Attempt ${attempt}/${retries} to call Gemini API...`);
            return await fn();
        } catch (err) {
            const is429 = err?.status === 429;
            const isRateLimit = err?.message?.includes("429");
            console.error(`❌ Attempt ${attempt} failed:`, err.message);

            if ((is429 || isRateLimit) && attempt < retries) {
                const retryAfterMs = (() => {
                    try {
                        const details = JSON.parse(err.message)?.error?.details;
                        const retryInfo = details?.find(d => d["@type"]?.includes("RetryInfo"));
                        const secs = parseInt(retryInfo?.retryDelay);
                        return isNaN(secs) ? null : secs * 1000;
                    } catch { return null; }
                })() ?? (2 ** attempt * 1000);

                console.warn(`⚠️  Rate limited. Retrying in ${retryAfterMs / 1000}s... (attempt ${attempt}/${retries})`);
                await new Promise(res => setTimeout(res, retryAfterMs));
            } else {
                throw err;
            }
        }
    }
}

// Native Gemini schema — exactly mirrors interviewReport.model.js
const responseSchema = {
    type: "object",
    properties: {
        matchScore: {
            type: "number",
            description: "A score from 0-100 representing how well the resume matches the job description"
        },
        technicalQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "A technical question likely to be asked in the interview" },
                    intention: { type: "string", description: "What the interviewer is trying to assess with this question" },
                    answer: { type: "string", description: "How to answer this question — key points, approach, and structure" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "A behavioral question likely to be asked in the interview" },
                    intention: { type: "string", description: "What the interviewer is trying to assess with this question" },
                    answer: { type: "string", description: "How to answer this question using the STAR method or similar" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string", description: "A skill required by the job that is missing or weak in the resume" },
                    description: { type: "string", description: "Why this skill matters and how the candidate can develop it" }
                },
                required: ["skill", "description"]
            }
        },
        preparationPlan: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day: { type: "number", description: "Day number of the preparation plan (e.g. 1, 2, 3...)" },
                    focus: { type: "string", description: "What the candidate should focus on studying or practicing on this day" },
                    tasks: { type: "array", items: { type: "string" }, description: "Specific tasks or activities to complete on this day" }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"],
    title: "Interview Preparation Report"
};

// Plain JSON schema for resume HTML generation (Gemini format, not Zod)
const resumeHtmlSchema = {
    type: "object",
    properties: {
        html: { type: "string", description: "Full HTML content of a professional resume, ready to render in a browser and print to PDF" }
    },
    required: ["html"]
};

async function generateInterviewReport(resume, jobDescription, selfDescription) {
    try {
        if (!process.env.GOOGLE_GENAI_API_KEY) {
            throw new Error("GOOGLE_GENAI_API_KEY is not set in environment variables");
        }

        const result = await withRetry(() =>
            ai.models.generateContent({
                model: MODEL,
                contents: `You are an expert career coach. Analyze the following resume against the job description and generate a comprehensive interview preparation report.

Resume:
${resume}

Job Description:
${jobDescription}

Candidate's Self Description:
${selfDescription}

Generate the report strictly following the provided JSON schema.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema
                }
            })
        );

        console.log("Gemini API Response structure:", Object.keys(result));

        // Handle different response structures
        let textContent = null;
        if (result?.response?.text) {
            textContent = typeof result.response.text === 'function' ? result.response.text() : result.response.text;
        } else if (result?.text) {
            textContent = typeof result.text === 'function' ? result.text() : result.text;
        } else if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
            textContent = result.candidates[0].content.parts[0].text;
        } else {
            throw new Error("Could not extract text from Gemini response. Structure: " + JSON.stringify(Object.keys(result)));
        }

        const parsed = JSON.parse(textContent);
        console.log("✅ Interview Report Generated:\n", JSON.stringify(parsed, null, 2));
        return parsed;
    } catch (err) {
        console.error("🔴 AI Service Error:", err);
        throw err;
    }
}

// Generate a full HTML resume via Gemini, then convert to PDF via Puppeteer
async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const prompt = `Role: You are an Elite Technical Career Architect. 

Task: Generate a high-density, strictly ONE-PAGE professional HTML resume. 

CRITICAL - CONTENT AUGMENTATION:
1. Synthesize & Expand: The provided data may be brief. You MUST use the provided context to extrapolate detailed, professional bullet points. For the TPC role, include corporate outreach and placement coordination. For "ConsumerGuard," detail the integration of Blockchain and BIS compliance.
2. The XYZ Formula: Every bullet must follow: "Accomplished [X] as measured by [Y], by doing [Z]". If metrics aren't provided, estimate realistic industry-standard figures (e.g., "Increased efficiency by 20%").
3. Strictly Mirror Sections: You must include: Education, Experience, Projects (with tech stacks), Leadership/Positions of Responsibility, Technical Skills, and Certifications.

Design Specifications:
- Layout: Modern two-column "Executive" layout using CSS Flexbox (no tables).
- Typography: Inter/Roboto; 10pt body for maximum content density.
- Visuals: Clean professional dividers. Primary Color: Slate (#1e293b); Accent: Emerald (#059669).
- Single Page: Use tight margins (8mm) and optimized padding to ensure a perfect one-page fit regardless of content length.

Input Data:
Raw Resume Data: ${resume}
Candidate Self-Description: ${selfDescription}
Target Job Description: ${jobDescription}

Return a JSON object with a single field "html".
`;

    const result = await withRetry(() =>
        ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: resumeHtmlSchema
            }
        })
    );

    let textContent = null;
    if (result?.response?.text) {
        textContent = typeof result.response.text === 'function' ? result.response.text() : result.response.text;
    } else if (result?.text) {
        textContent = typeof result.text === 'function' ? result.text() : result.text;
    } else if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
        textContent = result.candidates[0].content.parts[0].text;
    } else {
        throw new Error("Could not extract text from Gemini response for resume PDF.");
    }

    const { html } = JSON.parse(textContent);

    // Convert HTML to PDF buffer using Puppeteer
    const browser = await puppeteer.launch({ 
        headless: true, 
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4',margin:{bottom:"20mm",top:"20mm",left:"15mm",right:"15mm"} });
        return pdfBuffer;
    } finally {
        await browser.close();
    }
}

module.exports = { generateInterviewReport, generateResumePdf };