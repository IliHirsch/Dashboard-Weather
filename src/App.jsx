import React, { useEffect, useState } from 'react'
import {
  CloudSun,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  ThermometerSun,
  Umbrella,
  Gauge,
  SunMedium,
  MapPin,
  CalendarDays,
  Search,
} from 'lucide-react'

const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date)

const StatPanel = ({ label, value, unit, detail, icon: Icon }) => (
  <div className="relative flex flex-col gap-2 rounded-2xl bg-[#090913] px-4 py-3 border border-[#1b1b2a]">
    <div className="flex items-center justify-between text-[11px] tracking-[0.18em] uppercase text-[#8f8fb0]">
      <span className="flex items-center gap-1">
        {Icon && <Icon className="h-3 w-3 text-[#9b5de5]" />}
        <span>{label}</span>
      </span>
      <span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-[#2a2a3d] to-transparent" />
    </div>
    <div className="flex items-end gap-1">
      <span className="text-xl md:text-2xl font-semibold text-white">{value}</span>
      {unit && <span className="text-xs text-[#b8a7ff]">{unit}</span>}
    </div>
    {detail && <p className="text-[11px] text-[#8f8fb0] tracking-wide">{detail}</p>}
    <div className="absolute inset-x-3 bottom-1 h-px bg-gradient-to-r from-transparent via-[#00b4fc33] to-transparent" />
  </div>
)

function App() {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchInput, setSearchInput] = useState('')

  const fetchWeather = async (cityName) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY
    if (!apiKey) {
      setError('Missing OpenWeather API key')
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`),
      ])
      if (!currentRes.ok || !forecastRes.ok) throw new Error('City not found')
      setCurrentWeather(await currentRes.json())
      setForecast(await forecastRes.json())
    } catch (err) {
      setError(err.message || 'Failed to load weather data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchWeather('Berlin') }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      fetchWeather(searchInput.trim())
      setSearchInput('')
    }
  }

  const cityName = currentWeather?.name || '—'
  const country = currentWeather?.sys?.country || ''
  const condition = currentWeather?.weather?.[0]?.description || 'Waiting for data'
  const currentTemp = currentWeather?.main?.temp ?? null
  const feelsLike = currentWeather?.main?.feels_like ?? null
  const humidity = currentWeather?.main?.humidity ?? null
  const windSpeedKmh = currentWeather?.wind?.speed != null ? Math.round(currentWeather.wind.speed * 3.6) : null
  const cloudiness = currentWeather?.clouds?.all ?? null

  let dailyForecast = [], minTemp = null, maxTemp = null, chanceOfRain = null

  if (forecast?.list?.length > 0) {
    const temps = forecast.list.map(i => i.main?.temp).filter(t => typeof t === 'number')
    if (temps.length) { minTemp = Math.floor(Math.min(...temps)); maxTemp = Math.ceil(Math.max(...temps)) }

    const byDay = new Map()
    forecast.list.forEach((item) => {
      const dayKey = new Date(item.dt * 1000).toISOString().slice(0, 10)
      const temp = item.main?.temp
      if (typeof temp !== 'number') return
      const existing = byDay.get(dayKey) || { min: temp, max: temp, dt: item.dt, weatherMain: item.weather?.[0]?.main || '' }
      existing.min = Math.min(existing.min, temp)
      existing.max = Math.max(existing.max, temp)
      byDay.set(dayKey, existing)
    })

    const pickIcon = (w) => {
      const m = (w || '').toLowerCase()
      if (m.includes('rain') || m.includes('drizzle') || m.includes('thunder')) return CloudRain
      if (m.includes('cloud')) return CloudSun
      return Sun
    }

    const today = new Date().toISOString().slice(0, 10)
    dailyForecast = Array.from(byDay.entries())
      .sort((a, b) => a[0] < b[0] ? -1 : 1)
      .filter(([dayKey]) => dayKey > today)
      .slice(0, 7)
      .map(([dayKey, info]) => ({
        day: new Date(dayKey).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        high: Math.round(info.max),
        low: Math.round(info.min),
        icon: pickIcon(info.weatherMain),
      }))

    const pops = forecast.list.slice(0, 8).map(i => i.pop).filter(p => typeof p === 'number')
    if (pops.length) chanceOfRain = Math.round(Math.max(...pops) * 100)
  }

  const effectiveMin = typeof minTemp === 'number' ? minTemp : currentTemp != null ? Math.floor(currentTemp - 10) : 0
  const effectiveMax = typeof maxTemp === 'number' ? maxTemp : currentTemp != null ? Math.ceil(currentTemp + 10) : 40
  const range = effectiveMax - effectiveMin || 1
  const progress = currentTemp != null ? Math.min(Math.max(currentTemp - effectiveMin, 0), range) / range : 0
  const displayDate = currentWeather ? new Date(currentWeather.dt * 1000) : new Date()

  return (
    <div className="flex flex-col min-h-screen w-screen bg-[#080810] text-white overflow-x-hidden overflow-y-auto">

      {/* Search Bar */}
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 pt-4 pb-2">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8f8fb0]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search city... (e.g. Stuttgart, München, Tokyo)"
              className="w-full rounded-2xl bg-[#0f0f1a] border border-[#1b1b2a] pl-10 pr-4 py-3 text-sm text-white placeholder-[#8f8fb0] focus:outline-none focus:border-[#9b5de5] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-gradient-to-r from-[#00b4fc] to-[#9b5de5] px-5 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </form>
        {error && <p className="mt-2 text-xs text-red-400 pl-2">⚠ {error} — please try another city name</p>}
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">

        {/* Left - Next days */}
        <section className="flex h-full flex-col gap-4 order-3 md:order-1 rounded-3xl bg-[#0f0f1a] border border-[#1b1b2a] px-5 py-4">
          <header className="flex items-center justify-between mb-1">
            <div className="flex flex-col">
              <span className="text-[11px] tracking-[0.24em] uppercase text-[#8f8fb0]">Next days</span>
              <span className="mt-1 h-[1px] w-16 bg-gradient-to-r from-[#00b4fc] via-[#9b5de5] to-transparent" />
            </div>
            <Gauge className="h-4 w-4 text-[#00b4fc]" />
          </header>
          <div className="flex flex-col gap-2 font-mono">
            {loading && <span className="text-[11px] text-[#6f6f93]">Loading...</span>}
            {!loading && dailyForecast.map((day) => {
              const Icon = day.icon
              return (
                <div key={day.day} className="group relative flex items-center justify-between rounded-2xl px-3 py-2 bg-[#090913] border border-transparent hover:border-[#9b5de5] hover:bg-[#131327] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-10 text-xs tracking-[0.22em] text-[#8f8fb0]">{day.day}</span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-[#00b4fc] to-[#9b5de5]">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-3 text-xs">
                    <span className="text-[#f5f3ff]">{day.high}<span className="text-[10px] text-[#b8a7ff]">°C</span></span>
                    <span className="text-[#6f6f93]">{day.low}<span className="text-[10px] text-[#6f6f93]">°C</span></span>
                  </div>
                </div>
              )
            })}
            {!loading && !dailyForecast.length && <span className="text-[11px] text-[#6f6f93]">No forecast data available.</span>}
          </div>
        </section>

        {/* Center - Gauge */}
        <section className="relative flex flex-col items-center justify-center order-1 md:order-2 rounded-3xl bg-[#0f0f1a] border border-[#1b1b2a] px-6 py-6 shadow-[0_0_80px_rgba(0,180,252,0.32)] overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#00b4fc33] blur-3xl" />
            <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-[#9b5de533] blur-3xl" />
          </div>
          <header className="relative z-10 flex w-full items-center justify-between mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] tracking-[0.24em] uppercase text-[#8f8fb0]">Cabin climate</span>
              <div className="flex items-center gap-2 text-xs text-[#b8a7ff]">
                <MapPin className="h-3 w-3 text-[#00b4fc]" />
                <span>{cityName}{country ? `, ${country}` : ''}</span>
              </div>
            </div>
            <div className="flex flex-col items-end text-[11px] text-[#8f8fb0]">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3 text-[#9b5de5]" />
                <span>{formatDate(displayDate)}</span>
              </span>
              <span className="mt-1 h-[1px] w-16 bg-gradient-to-l from-[#00b4fc] via-[#9b5de5] to-transparent" />
            </div>
          </header>
          <div className="relative z-10 flex flex-col items-center justify-center mt-2">
            <div className="relative">
              <svg viewBox="0 0 200 200" className="h-56 w-56 drop-shadow-[0_0_45px_rgba(0,180,252,0.65)]">
                <defs>
                  <linearGradient id="tempGradient" x1="0%" y1="100%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00b4fc" />
                    <stop offset="100%" stopColor="#9b5de5" />
                  </linearGradient>
                </defs>
                <path d="M 43.43 156.57 A 80 80 0 1 1 156.57 156.57" fill="transparent" stroke="#181827" strokeWidth="14" strokeLinecap="round" pathLength="100" strokeDasharray="100 0" />
                <path d="M 43.43 156.57 A 80 80 0 1 1 156.57 156.57" fill="transparent" stroke="url(#tempGradient)" strokeWidth="14" strokeLinecap="round" pathLength="100" strokeDasharray={`${progress * 100} 100`} />
              </svg>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-[#080810] border border-[#2a2a3d] shadow-[0_0_35px_rgba(155,93,229,0.4)]">
                  <div className="flex items-center gap-2">
                    <ThermometerSun className="h-5 w-5 text-[#00b4fc]" />
                    <span className="text-[11px] tracking-[0.22em] uppercase text-[#8f8fb0]">Temp</span>
                  </div>
                  <div className="mt-2 flex items-end">
                    <span className="text-3xl md:text-4xl font-semibold text-white">
                      {loading ? '…' : currentTemp != null ? Math.round(currentTemp) : '—'}
                    </span>
                    <span className="ml-1 text-sm text-[#b8a7ff]">°C</span>
                  </div>
                  <span className="mt-1 text-[10px] text-[#6f6f93]">Min {Math.round(effectiveMin)}° / Max {Math.round(effectiveMax)}°</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col items-center gap-1">
              <span className="text-[11px] md:text-xs tracking-[0.24em] uppercase text-[#8f8fb0]">{loading ? 'Loading...' : condition}</span>
              <div className="flex items-center gap-2 text-xs md:text-sm text-[#b8a7ff]">
                <SunMedium className="h-4 w-4 text-[#ffdd7a]" />
                <span>Visibility good • Stable conditions</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right - Stats */}
        <section className="flex h-full flex-col gap-4 order-2 md:order-3 rounded-3xl bg-[#0f0f1a] border border-[#1b1b2a] px-5 py-4">
          <div className="grid grid-cols-2 gap-3">
            <StatPanel label="Humidity" value={humidity != null ? Math.round(humidity) : loading ? '…' : '—'} unit="%" detail="Comfort zone • Slightly humid" icon={Droplets} />
            <StatPanel label="Wind speed" value={windSpeedKmh != null ? windSpeedKmh : loading ? '…' : '—'} unit="km/h" detail="Crosswind minimal • NNE" icon={Wind} />
            <StatPanel label="Cloudiness" value={cloudiness != null ? cloudiness : loading ? '…' : '—'} unit="%" detail="Cloud cover percentage" icon={CloudSun} />
            <StatPanel label="Feels like" value={feelsLike != null ? Math.round(feelsLike) : loading ? '…' : '—'} unit="°C" detail="Cabin comfort optimal" icon={ThermometerSun} />
          </div>
          <div className="mt-1">
            <StatPanel label="Chance of rain" value={chanceOfRain != null ? chanceOfRain : loading ? '…' : '—'} unit="%" detail="Light showers possible in next few hours" icon={Umbrella} />
          </div>
        </section>

      </main>
    </div>
  )
}

export default App