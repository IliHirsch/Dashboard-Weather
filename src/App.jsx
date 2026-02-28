import React from 'react'
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
} from 'lucide-react'

const DAILY_FORECAST = [
  { day: 'MON', high: 23, low: 15, icon: CloudSun },
  { day: 'TUE', high: 25, low: 16, icon: Sun },
  { day: 'WED', high: 21, low: 14, icon: CloudRain },
  { day: 'THU', high: 24, low: 17, icon: CloudSun },
  { day: 'FRI', high: 26, low: 18, icon: Sun },
  { day: 'SAT', high: 27, low: 19, icon: CloudSun },
  { day: 'SUN', high: 22, low: 16, icon: CloudRain },
]

const MIN_TEMP = 8
const MAX_TEMP = 32
const CURRENT_TEMP = 22

const CITY = 'Berlin'
const COUNTRY = 'Germany'
const CONDITION = 'Partly cloudy'

const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date)

const today = new Date()

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
      <span className="text-2xl font-semibold text-white">{value}</span>
      {unit && <span className="text-xs text-[#b8a7ff]">{unit}</span>}
    </div>
    {detail && (
      <p className="text-[11px] text-[#8f8fb0] tracking-wide">{detail}</p>
    )}
    <div className="absolute inset-x-3 bottom-1 h-px bg-gradient-to-r from-transparent via-[#00b4fc33] to-transparent" />
  </div>
)

function App() {
  const range = MAX_TEMP - MIN_TEMP
  const clamped = Math.min(Math.max(CURRENT_TEMP - MIN_TEMP, 0), range)
  const progress = range === 0 ? 0 : clamped / range

  return (
    <div className="flex min-h-screen w-screen bg-[#080810] text-white overflow-hidden">
      <main className="flex-1 max-w-6xl mx-auto grid grid-cols-3 gap-6 p-6">
        {/* Left column - Next 7 days */}
        <section className="flex h-full flex-col gap-4 rounded-3xl bg-[#0f0f1a] border border-[#1b1b2a] px-5 py-4">
          <header className="flex items-center justify-between mb-1">
            <div className="flex flex-col">
              <span className="text-[11px] tracking-[0.24em] uppercase text-[#8f8fb0]">
                Next 7 days
              </span>
              <span className="mt-1 h-[1px] w-16 bg-gradient-to-r from-[#00b4fc] via-[#9b5de5] to-transparent" />
            </div>
            <Gauge className="h-4 w-4 text-[#00b4fc]" />
          </header>

          <div className="flex flex-col gap-2 font-mono">
            {DAILY_FORECAST.map((day) => {
              const Icon = day.icon
              return (
                <div
                  key={day.day}
                  className="group relative flex items-center justify-between rounded-2xl px-3 py-2 bg-[#090913] border border-transparent hover:border-[#9b5de5] hover:bg-[#131327] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 text-xs tracking-[0.22em] text-[#8f8fb0]">
                      {day.day}
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-[#00b4fc] to-[#9b5de5]">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-3 text-xs">
                    <span className="text-[#f5f3ff]">
                      {day.high}
                      <span className="text-[10px] text-[#b8a7ff]">°C</span>
                    </span>
                    <span className="text-[#6f6f93]">
                      {day.low}
                      <span className="text-[10px] text-[#6f6f93]">°C</span>
                    </span>
                  </div>

                  <div className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-[#00b4fc44] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )
            })}
          </div>
        </section>

        {/* Center column - Temperature gauge */}
        <section className="relative flex flex-col items-center justify-center rounded-3xl bg-[#0f0f1a] border border-[#1b1b2a] px-6 py-6 shadow-[0_0_80px_rgba(0,180,252,0.32)] overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#00b4fc33] blur-3xl" />
            <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-[#9b5de533] blur-3xl" />
          </div>

          <header className="relative z-10 flex w-full items-center justify-between mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] tracking-[0.24em] uppercase text-[#8f8fb0]">
                Cabin climate
              </span>
              <div className="flex items-center gap-2 text-xs text-[#b8a7ff]">
                <MapPin className="h-3 w-3 text-[#00b4fc]" />
                <span>
                  {CITY}, {COUNTRY}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end text-[11px] text-[#8f8fb0]">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3 text-[#9b5de5]" />
                <span>{formatDate(today)}</span>
              </span>
              <span className="mt-1 h-[1px] w-16 bg-gradient-to-l from-[#00b4fc] via-[#9b5de5] to-transparent" />
            </div>
          </header>

          <div className="relative z-10 flex flex-col items-center justify-center mt-2">
            <div className="relative">
              <svg
                viewBox="0 0 200 200"
                className="h-56 w-56 drop-shadow-[0_0_45px_rgba(0,180,252,0.65)]"
              >
                <defs>
                  <linearGradient
                    id="tempGradient"
                    x1="0%"
                    y1="100%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#00b4fc" />
                    <stop offset="100%" stopColor="#9b5de5" />
                  </linearGradient>
                </defs>

                {/* Track arc from bottom-left to bottom-right */}
                <path
                  d="M 43.43 156.57 A 80 80 0 1 1 156.57 156.57"
                  fill="transparent"
                  stroke="#181827"
                  strokeWidth="14"
                  strokeLinecap="round"
                  pathLength="100"
                  strokeDasharray="100 0"
                />

                {/* Active arc showing current temperature */}
                <path
                  d="M 43.43 156.57 A 80 80 0 1 1 156.57 156.57"
                  fill="transparent"
                  stroke="url(#tempGradient)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  pathLength="100"
                  strokeDasharray={`${progress * 100} 100`}
                />
              </svg>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-[#080810] border border-[#2a2a3d] shadow-[0_0_35px_rgba(155,93,229,0.4)]">
                  <div className="flex items-center gap-2">
                    <ThermometerSun className="h-5 w-5 text-[#00b4fc]" />
                    <span className="text-[11px] tracking-[0.22em] uppercase text-[#8f8fb0]">
                      Temp
                    </span>
                  </div>
                  <div className="mt-2 flex items-end">
                    <span className="text-4xl font-semibold text-white">
                      {CURRENT_TEMP}
                    </span>
                    <span className="ml-1 text-sm text-[#b8a7ff]">°C</span>
                  </div>
                  <span className="mt-1 text-[10px] text-[#6f6f93]">
                    Min {MIN_TEMP}° / Max {MAX_TEMP}°
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-1">
              <span className="text-xs tracking-[0.24em] uppercase text-[#8f8fb0]">
                {CONDITION}
              </span>
              <div className="flex items-center gap-2 text-sm text-[#b8a7ff]">
                <SunMedium className="h-4 w-4 text-[#ffdd7a]" />
                <span>Visibility good • Stable conditions</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right column - Instrument cluster */}
        <section className="flex h-full flex-col gap-4 rounded-3xl bg-[#0f0f1a] border border-[#1b1b2a] px-5 py-4">
          <div className="grid grid-cols-2 gap-3">
            <StatPanel
              label="Humidity"
              value="65"
              unit="%"
              detail="Comfort zone • Slightly humid"
              icon={Droplets}
            />
            <StatPanel
              label="Wind speed"
              value="14"
              unit="km/h"
              detail="Crosswind minimal • NNE"
              icon={Wind}
            />
            <StatPanel
              label="UV index"
              value="5"
              unit="/ 11"
              detail="Moderate • Protection recommended"
              icon={Sun}
            />
            <StatPanel
              label="Feels like"
              value="21"
              unit="°C"
              detail="Cabin comfort optimal"
              icon={ThermometerSun}
            />
          </div>

          <div className="mt-1 grid grid-cols-1">
            <StatPanel
              label="Chance of rain"
              value="20"
              unit="%"
              detail="Light showers possible in next 3 hrs"
              icon={Umbrella}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
