const express = require("express");
const interviewRouter = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReport);

// Must be before /:interviewId routes to avoid 'resume' being matched as an interviewId
interviewRouter.get("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdf);

interviewRouter.get("/:interviewId/report", authMiddleware.authUser, interviewController.getInterviewReportById);

interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReports);

module.exports = interviewRouter;