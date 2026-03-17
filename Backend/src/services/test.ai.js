require('dotenv').config({ path: __dirname + '/../.env' });

const generateInterviewReport = require('./ai.services');
const { resume, jobDescription, selfDescription } = require('./temp');

(async () => {
    console.log("⏳ Calling Gemini AI...\n");
    const result = await generateInterviewReport(resume, jobDescription, selfDescription);
    console.log("\n✅ AI Response:\n", JSON.stringify(result, null, 2));
})();
