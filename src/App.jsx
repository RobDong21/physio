import { useEffect, useState } from 'react'
import { ROUTINE, formatSide, sideLabel } from './routine'
import { getVoiceEnabled, setVoiceEnabled, stopSpeaking } from './speech'
import { useSession } from './useSession'

export default function App() {
  const session = useSession()
  const [voiceOn, setVoiceOn] = useState(getVoiceEnabled)

  useEffect(() => {
    return () => stopSpeaking()
  }, [])

  function toggleVoice() {
    const next = !voiceOn
    setVoiceOn(next)
    setVoiceEnabled(next)
    if (!next) stopSpeaking()
  }

  if (session.screen === 'home') {
    return (
      <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-6 pb-10">
        <Atmosphere />
        <main className="animate-rise relative z-[1] w-full max-w-[720px] rounded-[var(--radius-panel)] border border-line bg-panel p-[clamp(24px,5vw,40px)] shadow-panel backdrop-blur-md">
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-teal uppercase">
            Physio · daily
          </p>
          <h1 className="font-display mb-2.5 text-[clamp(2rem,6vw,3rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-teal-deep">
            {ROUTINE.title}
          </h1>
          <p className="lede mb-7 max-w-[36ch] text-[1.05rem] text-muted">{ROUTINE.subtitle}</p>

          <ol className="mb-7 grid list-none gap-2.5 p-0">
            {ROUTINE.exercises.map((ex, i) => (
              <li
                key={ex.id}
                className="grid grid-cols-[36px_1fr] items-start gap-3 border-t border-line py-3 last:border-b"
              >
                <span className="grid size-9 place-items-center rounded-full bg-teal-deep text-[0.9rem] font-semibold text-mint-soft">
                  {i + 1}
                </span>
                <div>
                  <strong className="block text-[1.05rem]">{ex.name}</strong>
                  <span className="text-[0.92rem] text-muted">
                    {formatExerciseMeta(ex)}
                    {ex.holdEachDisplay ? ` · hold ${ex.holdEachDisplay}s each` : ''}
                    {ex.sides ? ' · both sides' : ''}
                    {ex.directions ? ' · 4 directions' : ''}
                  </span>
                </div>
              </li>
            ))}
          </ol>

          <div className="mb-6 grid gap-2.5">
            <Toggle
              checked={session.mirrored}
              onChange={(e) => session.setMirrored(e.target.checked)}
              label="Mirror mode (face the screen)"
            />
            <Toggle checked={voiceOn} onChange={toggleVoice} label="Voice cues" />
          </div>

          <Button variant="primary" onClick={session.start}>
            Play routine
          </Button>
        </main>
      </div>
    )
  }

  if (session.screen === 'done') {
    return (
      <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-6 pb-10">
        <Atmosphere />
        <main className="animate-rise relative z-[1] w-full max-w-[720px] rounded-[var(--radius-panel)] border border-line bg-panel p-[clamp(24px,5vw,40px)] shadow-panel backdrop-blur-md">
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-teal uppercase">Done</p>
          <h1 className="font-display mb-2.5 text-[clamp(2rem,6vw,3rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-teal-deep">
            Nice work
          </h1>
          <p className="mb-7 max-w-[36ch] text-[1.05rem] text-muted">
            Routine complete. Keep it gentle tomorrow.
          </p>
          <Button variant="primary" className="mb-2.5" onClick={session.start}>
            Run again
          </Button>
          <Button variant="ghost" className="w-full" onClick={session.quit}>
            Back home
          </Button>
        </main>
      </div>
    )
  }

  const { step } = session
  if (!step) return null

  const displaySide = sideLabel(step.side, session.mirrored)
  const displayDir = sideLabel(step.direction, session.mirrored)

  return (
    <div className="relative grid min-h-screen place-items-stretch content-start overflow-hidden px-4 py-6 pb-10">
      <Atmosphere />
      <header className="relative z-[1] mx-auto mb-4 grid w-full max-w-[920px] grid-cols-[auto_1fr_auto] items-center gap-3">
        <Button variant="text" onClick={session.quit}>
          Exit
        </Button>
        <div
          className="grid min-w-0 gap-1.5"
          style={{ gridTemplateColumns: `repeat(${session.exerciseCount}, minmax(0, 1fr))` }}
          role="navigation"
          aria-label="Exercises"
        >
          {ROUTINE.exercises.map((ex, i) => {
            const fill = (session.exerciseProgress[i] ?? 0) * 100
            const active = i === session.exerciseIndex
            return (
              <button
                key={ex.id}
                type="button"
                title={ex.name}
                aria-label={`Go to ${ex.name}`}
                aria-current={active ? 'step' : undefined}
                onClick={() => session.goToExercise(i)}
                className="group grid cursor-pointer gap-1.5 border-0 bg-transparent p-0 text-inherit"
              >
                <span
                  className={`block h-2 overflow-hidden rounded-full bg-teal-deep/12 transition-shadow ${
                    active
                      ? 'shadow-[0_0_0_1px_rgb(26_107_92_/_0.35)]'
                      : 'group-hover:shadow-[0_0_0_1px_rgb(26_107_92_/_0.22)]'
                  }`}
                >
                  <span
                    className="block h-full rounded-full bg-linear-to-r from-mint to-teal transition-[width] duration-[350ms] ease-linear"
                    style={{ width: `${fill}%` }}
                  />
                </span>
                <span
                  className={`truncate text-center text-[0.65rem] leading-tight font-semibold transition-colors ${
                    active ? 'text-teal-deep' : 'text-teal-deep/40 group-hover:text-teal-deep/70'
                  }`}
                >
                  {ex.name}
                </span>
              </button>
            )
          })}
        </div>
        <span className="min-w-[3ch] text-right font-semibold tabular-nums text-teal-deep">
          {session.exerciseIndex + 1}/{session.exerciseCount}
        </span>
      </header>

      <main className="animate-rise relative z-[1] mx-auto w-full max-w-[920px] rounded-[var(--radius-panel)] border border-line bg-panel p-[clamp(24px,5vw,40px)] shadow-panel backdrop-blur-md">
        <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-teal uppercase">
          {step.exercise.name}
        </p>
        <h1 className="font-display mb-2.5 text-[clamp(2rem,6vw,3rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-teal-deep">
          {step.exercise.name}
        </h1>
        <p className="mb-7 max-w-[36ch] text-[1.05rem] text-muted">{step.exercise.cue}</p>

        <div className="mb-6 grid grid-cols-1 items-start gap-5 md:grid-cols-[1.1fr_1fr]">
          <FormGuide exercise={step.exercise} />

          <div className="text-center">
            <div className="font-display animate-pulse-soft text-[clamp(5rem,16vw,7.5rem)] leading-none font-semibold tabular-nums text-teal-deep">
              {session.secondsLeft}
            </div>
            <p className="mb-[18px] text-[0.78rem] font-semibold tracking-[0.1em] text-muted uppercase">
              {step.exercise.holdEach
                ? 'seconds · this set'
                : step.exercise.mode === 'hold'
                  ? 'seconds hold'
                  : 'seconds · this rep'}
            </p>

            {step.exercise.holdEach ? (
              <HoldGuide
                display={step.exercise.holdEachDisplay}
                label={step.exercise.holdEachLabel}
                hint={step.exercise.holdEachHint}
              />
            ) : null}

            <dl className={`m-0 grid grid-cols-2 gap-2.5 ${step.exercise.holdEach ? 'mt-3' : ''}`}>
              <Stat label="Set" value={`${step.set}/${step.totalSets}`} />
              {step.totalReps > 1 && (
                <Stat
                  label={step.exercise.mode === 'hold' ? 'Hold' : 'Rep'}
                  value={`${step.rep}/${step.totalReps}`}
                />
              )}
              {displaySide && <Stat label="Side" value={formatSide(displaySide)} />}
              {displayDir && <Stat label="Direction" value={formatSide(displayDir)} />}
            </dl>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1.4fr_1fr] gap-2.5">
          <Button variant="ghost" onClick={session.back} disabled={session.index === 0}>
            Back
          </Button>
          <Button variant="primary" onClick={session.togglePause}>
            {session.running ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="ghost" onClick={session.skip}>
            Skip
          </Button>
        </div>

        {step.exercise.mirrorable && (
          <Toggle
            className="mt-4 justify-center"
            checked={session.mirrored}
            onChange={(e) => session.setMirrored(e.target.checked)}
            label="Mirror"
          />
        )}
      </main>
    </div>
  )
}

function formatExerciseMeta(ex) {
  const setsPrefix = ex.sets > 1 ? `${ex.sets}× ` : ''
  if (ex.mode === 'hold') {
    if (ex.reps === 1) return `${setsPrefix}${ex.holdSeconds}s`
    return `${setsPrefix}${ex.reps} × ${ex.holdSeconds}s`
  }
  return `${setsPrefix}${ex.reps} reps`
}

function Atmosphere() {
  return <div className="atmosphere" aria-hidden="true" />
}

function FormGuide({ exercise }) {
  return (
    <div className="rounded-3xl border border-line bg-white/55 p-5 text-left">
      <p className="m-0 text-[0.72rem] font-semibold tracking-[0.14em] text-teal uppercase">
        How to do it
      </p>
      <ol className="mt-3 mb-0 list-none space-y-3 p-0">
        {exercise.setup.map((step, i) => (
          <li key={step} className="grid grid-cols-[28px_1fr] gap-2.5">
            <span className="grid size-7 place-items-center rounded-full bg-teal-deep text-[0.8rem] font-semibold text-mint-soft">
              {i + 1}
            </span>
            <span className="pt-0.5 text-[0.98rem] leading-snug text-ink">{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-5 rounded-2xl border border-line bg-panel px-3.5 py-3">
        <p className="m-0 text-[0.7rem] font-semibold tracking-[0.1em] text-teal uppercase">Feel</p>
        <p className="mt-1 mb-0 text-[0.95rem] leading-snug text-ink">{exercise.feel}</p>
      </div>

      <div className="mt-2.5 rounded-2xl border border-sand/60 bg-sand/25 px-3.5 py-3">
        <p className="m-0 text-[0.7rem] font-semibold tracking-[0.1em] text-teal-deep uppercase">
          Avoid
        </p>
        <p className="mt-1 mb-0 text-[0.95rem] leading-snug text-ink">{exercise.avoid}</p>
      </div>
    </div>
  )
}

function HoldGuide({ display, label, hint }) {
  return (
    <div className="rounded-[20px] border border-teal/25 bg-teal-deep/8 px-4 py-4 text-left">
      <p className="m-0 text-[0.72rem] font-semibold tracking-[0.14em] text-teal uppercase">
        Reminder
      </p>
      <div className="mt-1 flex items-end gap-2">
        <span className="font-display text-[clamp(2.4rem,7vw,3rem)] leading-none font-semibold tabular-nums text-teal-deep">
          {display}
        </span>
        <span className="mb-1 text-[0.95rem] font-semibold text-muted">sec {label}</span>
      </div>
      <p className="mt-2 mb-0 text-[0.92rem] text-muted">{hint}</p>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-line bg-white/55 px-3 py-2.5">
      <dt className="m-0 text-xs tracking-[0.08em] text-muted uppercase">{label}</dt>
      <dd className="mt-0.5 text-[1.25rem] font-bold text-teal-deep">{value}</dd>
    </div>
  )
}

function Toggle({ checked, onChange, label, className = '' }) {
  return (
    <label className={`flex cursor-pointer items-center gap-2.5 text-muted select-none ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-[18px] accent-teal"
      />
      <span>{label}</span>
    </label>
  )
}

function Button({ variant = 'primary', className = '', children, ...props }) {
  const base =
    'cursor-pointer rounded-full border-0 px-[22px] py-3.5 transition-[transform,background,opacity] duration-150 ease-in-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40'

  const variants = {
    primary:
      'w-full bg-teal-deep text-[1.05rem] font-semibold text-foam hover:enabled:bg-teal-hover',
    ghost: 'border border-solid border-line bg-transparent text-teal-deep',
    text: 'bg-transparent px-2.5 py-2 text-teal-deep',
  }

  return (
    <button type="button" className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
