import { useEffect, useState } from 'react'
import Logo from './Logo'
import { isSafeUrl, lines, timeAgo } from '../lib/utils'

export default function JobModal({ job, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    const prevTitle = document.title
    document.title = `${job.title} at ${job.company} - KamHunt`
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      document.title = prevTitle
    }
  }, [onClose, job])

  const [copied, setCopied] = useState(false)
  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}?job=${job.id}`
    try {
      if (navigator.share) {
        await navigator.share({ title: `${job.title} at ${job.company}`, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      /* user cancelled sharing */
    }
  }

  const details = [
    ['Location', job.location],
    ['Job type', job.job_type],
    ['Experience', job.experience],
    ['Salary', job.salary],
    ['Category', job.category],
    ['Posted', timeAgo(job.created_at)],
  ].filter(([, v]) => v)
  const reqs = lines(job.requirements)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={job.title}
    >
      <div
        className="flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white sm:max-w-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 border-b border-slate-200 p-5 sm:p-6">
          <Logo src={job.company_logo} name={job.company} size="h-14 w-14" />
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-extrabold leading-tight">{job.title}</h2>
            <p className="text-slate-600">{job.company}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-teal-700"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto p-5 sm:p-6">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {details.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-slate-500">{k}</dt>
                <dd className="text-sm font-semibold">{v}</dd>
              </div>
            ))}
          </dl>

          {job.description && (
            <section>
              <h3 className="mb-2 font-bold">About the job</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{job.description}</p>
            </section>
          )}

          {reqs.length > 0 && (
            <section>
              <h3 className="mb-2 font-bold">Requirements</h3>
              <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700">
                {reqs.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </section>
          )}
        </div>

        <div className="flex gap-2 border-t border-slate-200 p-4 sm:p-5">
          <button
            onClick={share}
            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-teal-700"
          >
            {copied ? 'Link copied' : 'Share'}
          </button>
          {isSafeUrl(job.apply_link) && (
            <a
              href={job.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-xl bg-teal-700 px-5 py-3 text-center font-semibold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Apply Now
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
