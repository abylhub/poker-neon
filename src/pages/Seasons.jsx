import { useSeasons } from '../hooks/useData.js'

export default function Seasons() {
  const { seasons, loading } = useSeasons()
  if (loading) return <div className="text-center py-20"><div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto" /></div>
  return (
    <div>
      <div className="mb-5"><div className="label mb-1">Архив</div><h1 className="font-display text-lg text-white">Сезоны</h1></div>
      {seasons.length === 0
        ? <div className="card p-12 text-center text-white/25 text-sm">Сезонов ещё нет</div>
        : (
          <div className="space-y-3">
            {seasons.map(s => (
              <div key={s.id} className="card p-4 flex items-center justify-between">
                <div>
                  <div className="font-display text-sm text-white mb-0.5">{s.name}</div>
                  <div className="text-[10px] text-white/30 font-mono">{new Date(s.createdAt).toLocaleDateString('ru')}</div>
                </div>
                {s.isActive ? <span className="badge-season">Активный</span> : <span className="text-xs text-white/25">Завершён</span>}
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
