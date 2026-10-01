import { useState } from 'react'
import { isSafeUrl } from '../lib/utils'

export default function Logo({ src, name, size = 'h-12 w-12' }) {
  const [failed, setFailed] = useState(false)
  if (isSafeUrl(src) && !failed) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className={`${size} shrink-0 rounded-xl border border-slate-200 bg-white object-contain p-1`}
      />
    )
  }
  return (
    <div className={`${size} flex shrink-0 items-center justify-center rounded-xl bg-teal-50 text-lg font-bold text-teal-700`}>
      {(name || '?').charAt(0).toUpperCase()}
    </div>
  )
}
