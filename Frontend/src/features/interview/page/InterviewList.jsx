import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllInterviewReports } from '../service/interview.api'
import '../style/interview-list.scss'

const ScoreTag = ({ score }) => {
    const cls = score >= 80 ? 'high' : score >= 60 ? 'mid' : 'low'
    return <span className={`il-score il-score--${cls}`}>{score ?? '–'}%</span>
}

const EmptyState = ({ onNew }) => (
    <div className="il-empty">
        <div className="il-empty__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
        </div>
        <h3>No reports yet</h3>
        <p>Generate your first AI-powered interview prep report to get started.</p>
        <button className="il-btn il-btn--primary" onClick={onNew}>
            Generate your first report
        </button>
    </div>
)

const InterviewList = () => {
    const navigate = useNavigate()
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        getAllInterviewReports()
            .then(data => setReports(Array.isArray(data) ? data : (data?.data ?? [])))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="il-page il-page--center">
            <div className="il-spinner" />
            <p className="il-muted">Loading your reports…</p>
        </div>
    )

    if (error) return (
        <div className="il-page il-page--center">
            <p className="il-error">Something went wrong: {error}</p>
            <button className="il-btn il-btn--primary" onClick={() => navigate('/')}>Go Home</button>
        </div>
    )

    return (
        <div className="il-page">
            {/* Top bar */}
            <header className="il-header">
                <div className="il-header__left">
                    <div className="il-logo">
                        <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="il-header__title">Interview Reports</h1>
                        <p className="il-header__sub">{reports.length} report{reports.length !== 1 ? 's' : ''} generated</p>
                    </div>
                </div>
                <button className="il-btn il-btn--primary" onClick={() => navigate('/')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New Report
                </button>
            </header>

            {reports.length === 0
                ? <EmptyState onNew={() => navigate('/')} />
                : (
                    <div className="il-grid">
                        {reports.map(r => (
                            <article
                                key={r._id}
                                className="il-card"
                                onClick={() => navigate(`/interview/${r._id}`)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => e.key === 'Enter' && navigate(`/interview/${r._id}`)}
                            >
                                <div className="il-card__top">
                                    <ScoreTag score={r.matchScore} />
                                    <span className="il-card__date">
                                        {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>

                                <h2 className="il-card__title">{r.title || 'Interview Report'}</h2>

                                <div className="il-card__meta">
                                    <span className="il-card__badge">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                                        {r.technicalQuestions?.length ?? 0} technical
                                    </span>
                                    <span className="il-card__badge">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                        {r.behavioralQuestions?.length ?? 0} behavioral
                                    </span>
                                </div>

                                <div className="il-card__arrow">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                                    </svg>
                                </div>
                            </article>
                        ))}
                    </div>
                )
            }
        </div>
    )
}

export default InterviewList
