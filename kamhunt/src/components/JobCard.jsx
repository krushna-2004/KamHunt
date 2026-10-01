import Logo from './Logo'
import { timeAgo, isSafeUrl } from '../lib/utils'

export default function JobCard({ job, onOpen }) {
  const tags = [job.job_type, job.experience, job.salary].filter(Boolean)

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-teal-600">
      <div className="flex items-start gap-3">
        <Logo src={job.company_logo} name={job.company} />
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold leading-snug">{job.title}</h2>
          <p className="truncate text-sm text-slate-600">{job.company}</p>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-500">
        {job.location || 'Location not specified'} · {timeAgo(job.created_at)}
      </p>

      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex gap-2 pt-1">
        <button
          onClick={() => onOpen(job)}
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-teal-700"
        >
          View details
        </button>
        {isSafeUrl(job.apply_link) && (
          <a
            href={job.apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-xl bg-teal-700 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Apply Now
          </a>
        )}
      </div>
    </article>
  )
}
