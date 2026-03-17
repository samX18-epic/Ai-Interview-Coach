const pdfParse = require('pdf-parse');
const { generateInterviewReport: generateInterviewReportAI, generateResumePdf: generateResumePdfAI } = require("../services/ai.services");
const interviewReportModel = require("../models/interviewReport.model");

async function extractTextFromPDF(buffer) {
    if (!buffer || buffer.length === 0) {
        throw new Error("PDF buffer is empty");
    }
    console.log(`📖 Parsing PDF buffer (${buffer.length} bytes)...`);
    const data = await pdfParse(buffer);
    const text = data.text;
    console.log(`✅ PDF parsed successfully: ${text.length} characters`);
    return text;
}

async function generateInterviewReport(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ status: "error", message: "Resume PDF is required" });
        }

        const { selfDescription, jobDescription } = req.body;
        if (!selfDescription || !jobDescription) {
            return res.status(400).json({ status: "error", message: "selfDescription and jobDescription are required" });
        }

        // Parse text from the uploaded PDF buffer
        console.log(`📄 Processing PDF file: ${req.file.originalname} (${req.file.size} bytes)`);
        const resumeContent = await extractTextFromPDF(req.file.buffer);
        console.log(`✅ PDF parsed successfully, extracted ${resumeContent.length} characters`);

        // Call Gemini AI
        console.log(`🤖 Calling Gemini AI to generate interview report...`);
        const aiReport = await generateInterviewReportAI(resumeContent, jobDescription, selfDescription);
        console.log(`✅ AI report generated successfully`);

        // Generate title from job description
        const titleMatch = jobDescription.match(/(?:position|role|job|title)[:\s]+([^\n]+)/i);
        const title = titleMatch ? titleMatch[1].trim().slice(0, 100) : "Interview Preparation Report";

        // Save report to DB
        console.log(`💾 Saving report to database...`);
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            jobDescription,
            title,
            matchScore: aiReport.matchScore,
            technicalQuestions: aiReport.technicalQuestions,
            behavioralQuestions: aiReport.behavioralQuestions,
            skillGaps: aiReport.skillGaps,
            preparationPlan: aiReport.preparationPlan
        });
        console.log(`✅ Report saved successfully with ID: ${interviewReport._id}`);

        return res.status(201).json({
            status: "success",
            message: "Interview report generated successfully",
            data: { ...interviewReport.toObject(), reportId: interviewReport._id }
        });

    } catch (err) {
        console.error("🔴 Interview Report Generation Error:", {
            message: err.message,
            stack: err.stack,
            details: err.response?.data || err
        });
        return res.status(500).json({
            status: "error",
            message: err.message || "Failed to generate interview report",
            details: process.env.NODE_ENV === "development" ? err.toString() : undefined
        });
    }
}

async function getInterviewReportById(req, res) {
    try {
        const { interviewId } = req.params;
        const report = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });
        if (!report) {
            return res.status(404).json({ status: "error", message: "Interview report not found" });
        }
        return res.status(200).json({ status: "success", data: report });
    } catch (err) {
        console.error("Get interview report error:", err.message);
        return res.status(500).json({ status: "error", message: err.message });
    }
}

async function getAllInterviewReports(req, res) {
    try {
        const reports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json({ status: "success", data: reports });
    } catch (err) {
        console.error("Get all interview reports error:", err.message);
        return res.status(500).json({ status: "error", message: err.message });
    }
}

async function generateResumePdf(req, res) {
    try {
        const { interviewReportId } = req.params;
        const report = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id });
        if (!report) {
            return res.status(404).json({ status: "error", message: "Interview report not found" });
        }

        console.log(`🤖 Generating PDF resume for report: ${interviewReportId}`);
        const pdfBuffer = await generateResumePdfAI({
            resume: report.resume,
            selfDescription: "",          // not stored on report; omit gracefully
            jobDescription: report.jobDescription
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=resume_${interviewReportId}.pdf`);
        res.send(pdfBuffer);
    } catch (err) {
        console.error("🔴 Generate Resume PDF Error:", err.message);
        return res.status(500).json({ status: "error", message: err.message });
    }
}

module.exports = { generateInterviewReport, getInterviewReportById, getAllInterviewReports, generateResumePdf };