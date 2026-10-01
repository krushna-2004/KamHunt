import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from './lib/supabase'
import JobCard from './components/JobCard'
import JobModal from './components/JobModal'

const getIdFromUrl = () => new URLSearchParams(window.location.search).get('job')

export default function App() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedId, setSelectedId] = useState(getIdFromUrl)

  // Keep the open job in sync with the URL (?job=<id>), including Back/Forward
  useEffect(() => {
    const onPop = () => setSelectedId(getIdFromUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const openJob = useCallback((job) => {
    window.history.pushState({}, '', `?job=${job.id}`)
    setSelectedId(String(job.id))
  }, [])

  const closeModal = useCallback(() => {
    window.history.replaceState({}, '', window.location.pathname)
    setSelectedId(null)
  }, [])

  useEffect(() => {
    if (!supabase) {
      setError('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
      setLoading(false)
      return
    }
    supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data, error }) => {
        if (error) setError('Could not load jobs. Please try again later.')
        else setJobs(data ?? [])
        setLoading(false)
      })
  }, [])

  const categories = useMemo(
    () => ['All', ...new Set(jobs.map((j) => j.category).filter(Boolean))],
    [jobs]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return jobs.filter((j) => {
      if (category !== 'All' && j.category !== category) return false
      if (!q) return true
      return [j.title, j.company, j.location, j.category].some((f) => (f || '').toLowerCase().includes(q))
    })
  }, [jobs, query, category])

  const selected = jobs.find((j) => String(j.id) === selectedId)
  const jobMissing = !loading && !error && selectedId && !selected

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 pb-8 pt-6 sm:pb-10">
          <p className="text-2xl font-extrabold tracking-tight text-teal-700">KamHunt</p>
          <h1 className="mt-6 max-w-xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Find your next job, fresh from the source.
          </h1>
          <p className="mt-2 text-slate-600">New vacancies added regularly. Apply directly on the employer's page.</p>

          <div className="mt-6 max-w-xl">
            <label htmlFor="search" className="sr-only">Search jobs</label>
            <input
              id="search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, company or location"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {jobMissing && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <span>This job is no longer available. Here are the latest openings.</span>
            <button onClick={closeModal} className="shrink-0 font-semibold underline">Dismiss</button>
          </div>
        )}
        {categories.length > 1 && (
          <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1" role="tablist" aria-label="Job categories">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  category === c
                    ? 'border-teal-700 bg-teal-700 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-teal-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-bold">No jobs found</p>
            <p className="mt-1 text-sm text-slate-600">
              {jobs.length === 0 ? 'No vacancies are open right now. Check back soon.' : 'Try a different search or category.'}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="mb-4 text-sm text-slate-500">
              {filtered.length} {filtered.length === 1 ? 'job' : 'jobs'}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} onOpen={openJob} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-500">
        © {new Date().getFullYear()} KamHunt
      </footer>

      {selected && <JobModal job={selected} onClose={closeModal} />}
    </div>
  )
}
