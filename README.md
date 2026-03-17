Resume Tailor is an elite career-optimization engine designed to bridge the gap between candidates and ATS (Applicant Tracking Systems). Using Google Gemini 2.5 Flash, it transforms static resumes into targeted, high-fidelity interview roadmaps and tailored PDFs.

🛠 Tech Stack
Frontend: React.js (Vite), SCSS (Glassmorphism), Axios

Backend: Node.js, Express.js, MongoDB (Mongoose)

AI Engine: Google Gemini 2.5 API

Rendering: Puppeteer (Headless Chromium)

Auth: JWT, HTTP-only Cookies

Deployment: Vercel (Frontend), Railway (Backend)

✨ Key Features
🧠 AI-Powered Analysis
Utilizes a custom prompt-chaining pipeline with Gemini 2.5 to perform:

Keyword Alignment: Identifies missing terminology required by the Job Description.

Behavioral Simulation: Predicts interview questions based on user history.

Strategic Roadmap: Provides a structured plan to address skill gaps.

📄 Dynamic PDF Generation
Unlike standard text exports, Resume Tailor uses Puppeteer to render enterprise-grade documents. It dynamically injects AI-curated content into an ATS-friendly template, ensuring your profile clears automated filters with a professional layout.

🛡 Secure Session Architecture
Hardened Auth: Uses HTTP-only, cross-site proxy-trusted cookies.

CORS Management: Orchestrates secure data flow between the Vercel-hosted client and the Railway-hosted API.

🏗 System Architecture
Ingestion: User uploads a Resume (PDF) and Job Description (Text).

Processing: Node.js backend sends data to Gemini 2.5 for multi-vector analysis.

Synthesis: AI returns structured JSON containing interview prep and resume enhancements.

Rendering: Puppeteer spins up a headless browser, renders the tailored resume as HTML, and prints it to a high-fidelity PDF.

Persistence: History and reports are saved to MongoDB for low-latency retrieval.

🚀 Deployment & Engineering Challenges
Headless Chromium on Railway
Running Puppeteer in a PaaS environment requires specific system-level libraries. This project uses a custom nixpacks.toml to ensure the Linux environment is provisioned with the necessary Chromium dependencies:

Ini, TOML
[phases.setup]
nixPkgs = ["...", "google-chrome", "glib", "nss"]
AI Prompt Engineering
The Gemini integration uses structured output parsing to ensure the AI returns valid JSON every time, preventing UI crashes and ensuring the "Skill Gap Analysis" remains data-driven and objective.

📦 Installation
Clone the repo:

Bash
git clone https://github.com/yourusername/resume-tailor.git
Setup Environment Variables:
Create a .env file in the root:

Code snippet
GEMINI_API_KEY=your_key_here
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
Install & Run:

Bash
npm install
npm run dev
