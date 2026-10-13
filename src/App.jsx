import { useEffect, useState } from 'react'
import { ROUTINE, formatSide, sideLabel } from './routine'
import { PoseFigure } from './PoseFigure'
import { getVoiceEnabled, setVoiceEnabled, stopSpeaking } from './speech'
import { useSession } from './useSession'
import './App.css'

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
      <div className="app">
        <Atmosphere />
        <main className="panel home">
          <p className="eyebrow">Physio · daily</p>
          <h1>{ROUTINE.title}</h1>
          <p className="lede">{ROUTINE.subtitle}</p>

          <ol className="exercise-list">
            {ROUTINE.exercises.map((ex, i) => (
              <li key={ex.id}>
                <span className="num">{i + 1}</span>
                <div>
                  <strong>{ex.name}</strong>
                  <span>
                    {ex.sets > 1 ? `${ex.sets}× ` : ''}
                    {ex.reps} {ex.mode === 'hold' ? `× ${ex.holdSeconds}s` : 'reps'}
                    {ex.sides ? ' · both sides' : ''}
                    {ex.directions ? ' · 4 directions' : ''}
                  </span>
                </div>
              </li>
            ))}
          </ol>

          <div className="prefs">
            <label className="toggle">
              <input
                type="checkbox"
                checked={session.mirrored}
                onChange={(e) => session.setMirrored(e.target.checked)}
              />
              <span>Mirror mode (face the screen)</span>
            </label>
            <label className="toggle">
              <input type="checkbox" checked={voiceOn} onChange={toggleVoice} />
              <span>Voice cues</span>
            </label>
          </div>

          <button type="button" className="btn primary" onClick={session.start}>
            Play routine
          </button>
        </main>
      </div>
    )
  }

  if (session.screen === 'done') {
    return (
      <div className="app">
        <Atmosphere />
        <main className="panel done">
          <p className="eyebrow">Done</p>
          <h1>Nice work</h1>
          <p className="lede">Routine complete. Keep it gentle tomorrow.</p>
          <button type="button" className="btn primary" onClick={session.start}>
            Run again
          </button>
          <button type="button" className="btn ghost" onClick={session.quit}>
            Back home
          </button>
        </main>
      </div>
    )
  }

  const { step } = session
  if (!step) return null

  const displaySide = sideLabel(step.side, session.mirrored)
  const displayDir = sideLabel(step.direction, session.mirrored)
  const isReady = session.screen === 'ready'
  const isRest = step.phase === 'rest'

  return (
    <div className="app session-app">
      <Atmosphere />
      <header className="session-bar">
        <button type="button" className="btn text" onClick={session.quit}>
          Exit
        </button>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${session.progress * 100}%` }} />
        </div>
        <span className="step-meta">
          {session.exerciseIndex + 1}/{session.exerciseCount}
        </span>
      </header>

      <main className="panel session">
        <p className="eyebrow">
          {isRest ? 'Rest' : isReady ? 'Get ready' : step.exercise.name}
        </p>
        <h1>{isRest ? 'Breathe' : step.exercise.name}</h1>

        {!isRest && (
          <p className="cue">{step.exercise.cue}</p>
        )}

        <div className="session-grid">
          <PoseFigure
            pose={step.exercise.pose}
            direction={step.direction}
            side={step.side}
            mirrored={session.mirrored && step.exercise.mirrorable}
          />

          <div className="timer-block">
            <div className={`timer ${isReady ? 'timer--prep' : ''}`}>
              {isReady ? session.prepareLeft : session.secondsLeft}
            </div>
            <p className="timer-label">
              {isReady
                ? 'starting'
                : isRest
                  ? 'rest'
                  : step.exercise.mode === 'hold'
                    ? 'seconds hold'
                    : 'seconds · this rep'}
            </p>

            <dl className="stats">
              {!isRest && (
                <>
                  <div>
                    <dt>Set</dt>
                    <dd>
                      {step.set}/{step.totalSets}
                    </dd>
                  </div>
                  <div>
                    <dt>{step.exercise.mode === 'hold' ? 'Hold' : 'Rep'}</dt>
                    <dd>
                      {step.rep}/{step.totalReps}
                    </dd>
                  </div>
                </>
              )}
              {displaySide && (
                <div>
                  <dt>Side</dt>
                  <dd>{formatSide(displaySide)}</dd>
                </div>
              )}
              {displayDir && (
                <div>
                  <dt>Direction</dt>
                  <dd>{formatSide(displayDir)}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="controls">
          <button type="button" className="btn ghost" onClick={session.back} disabled={session.index === 0}>
            Back
          </button>
          <button type="button" className="btn primary" onClick={session.togglePause}>
            {session.running ? 'Pause' : 'Resume'}
          </button>
          <button type="button" className="btn ghost" onClick={session.skip}>
            Skip
          </button>
        </div>

        {step.exercise.mirrorable && (
          <label className="toggle mirror-inline">
            <input
              type="checkbox"
              checked={session.mirrored}
              onChange={(e) => session.setMirrored(e.target.checked)}
            />
            <span>Mirror</span>
          </label>
        )}
      </main>
    </div>
  )
}

function Atmosphere() {
  return <div className="atmosphere" aria-hidden="true" />
}
