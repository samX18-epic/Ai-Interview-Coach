import { useState, useCallback } from 'react'
import { generateInterviewReport, getAllInterviewReports, getInterviewReportById, downloadResumePdf, generateResumePdf } from "../service/interview.api"
export const useInterview = () => {
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null)
    const [pdfFilename, setPdfFilename] = useState(null)

    const generateReport = useCallback(async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const data = await generateInterviewReport(jobDescription, resumeFile, selfDescription)
            setReport(data)
            setError(null)
            return data
        } catch (err) {
            setError(err.message)
            console.error('Error generating interview report:', err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const getReportById = useCallback(async (interviewId) => {
        setLoading(true)
        try {
            const data = await getInterviewReportById(interviewId)
            setReport(data)
            setError(null)
            return data
        } catch (err) {
            setError(err.message)
            console.error('Error fetching interview report:', err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const getAllReports = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getAllInterviewReports()
            const list = Array.isArray(data) ? data : (data?.data ?? [])
            setReports(list)
            setError(null)
            return list
        } catch (err) {
            setError(err.message)
            console.error('Error fetching all reports:', err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const getResumePdf = useCallback(async (interviewId) => {
        setLoading(true)
        try {
            const { blobUrl, filename } = await generateResumePdf(interviewId)
            setPdfBlobUrl(blobUrl)
            setPdfFilename(filename)
        } catch (err) {
            setError(err.message)
            console.error('Error downloading resume:', err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    // Call this to close the preview modal and free the blob URL
    const clearPdf = useCallback(() => {
        if (pdfBlobUrl) window.URL.revokeObjectURL(pdfBlobUrl)
        setPdfBlobUrl(null)
        setPdfFilename(null)
    }, [pdfBlobUrl])

    return {
        report,
        reports,
        loading,
        error,
        pdfBlobUrl,
        pdfFilename,
        generateReport,
        getReportById,
        getAllReports,
        getResumePdf,
        clearPdf
    }
}
