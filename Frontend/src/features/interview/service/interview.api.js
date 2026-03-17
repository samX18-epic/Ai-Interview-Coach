import axios from 'axios';
const api=axios.create({
    baseURL: 'http://localhost:3000',
   withCredentials: true,
})
export const generateInterviewReport = async(jobDescription, resume, selfDescription) => {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("resume", resume);
    formData.append("selfDescription", selfDescription);
    
    console.log("📤 Uploading:", {
        jobDescriptionLength: jobDescription.length,
        resumeType: resume?.type,
        resumeSize: resume?.size,
        selfDescriptionLength: selfDescription.length
    });
    
    const response = await api.post('/api/interview', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    
    console.log("📥 Response:", response.data);
    
    // Unwrap the response - backend returns { status, message, data: {...} }
    if (response.data.data) {
        return response.data.data;
    }
    return response.data;
};

export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/${interviewId}/report`);
    // Backend returns { status, data: report } — unwrap the inner data
    return response.data.data || response.data;
};

export const getAllInterviewReports = async () => {
    const response = await api.get('/api/interview');
    // Backend returns { status, data: reports } — unwrap the inner data
    return response.data.data || response.data;
};

export const downloadResumePdf = async (interviewId) => {
    const response = await api.get(`/api/interview/${interviewId}/resume/pdf`, {
        responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `resume-${interviewId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
};

export const generateResumePdf = async (interviewId) => {
    // responseType:'blob' is essential — without it Axios returns garbled text
    const response = await api.get(`/api/interview/resume/pdf/${interviewId}`, {
        responseType: 'blob'
    });
    // Return a blob URL — caller can embed in <iframe> for preview
    const blobUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
    );
    return { blobUrl, filename: `resume-${interviewId}.pdf` };
};