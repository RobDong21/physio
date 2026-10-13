import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ROUTINE, formatSide, sideLabel } from './routine'
import { speak, stopSpeaking } from './speech'

function buildPlaylist(exercises) {
  const steps = []

  for (const ex of exercises) {
    const sides = ex.sides ?? [null]
    const directions = ex.directions ?? [null]

    for (let set = 1; set <= ex.sets; set++) {
      for (const side of sides) {
        for (const direction of directions) {
          for (let rep = 1; rep <= ex.reps; rep++) {
            const duration =
              ex.mode === 'hold' ? ex.holdSeconds : ex.repSeconds

            steps.push({
              exerciseId: ex.id,
              exercise: ex,
              set,
              totalSets: ex.sets,
              rep,
              totalReps: ex.reps,
              side,
              direction,
              duration,
              phase: 'work',
            })
          }
        }
      }

      if (set < ex.sets && ex.restBetweenSets > 0) {
        steps.push({
          exerciseId: ex.id,
          exercise: ex,
          set,
          totalSets: ex.sets,
          rep: null,
          totalReps: ex.reps,
          side: null,
          direction: null,
          duration: ex.restBetweenSets,
          phase: 'rest',
        })
      }
    }
  }

  return steps
}

function cueForStep(step, mirrored) {
  if (step.phase === 'rest') {
    return `Rest. Next set of ${step.exercise.name}.`
  }

  const parts = [step.exercise.name]
  const side = sideLabel(step.side, mirrored)
  const direction = sideLabel(step.direction, mirrored)

  if (side) parts.push(formatSide(side))
  if (direction) parts.push(formatSide(direction))

  if (step.exercise.mode === 'hold') {
    parts.push(`hold ${step.duration}`)
  } else {
    parts.push(`rep ${step.rep}`)
  }

  return parts.join('. ')
}

export function useSession() {
  const playlist = useMemo(() => buildPlaylist(ROUTINE.exercises), [])
  const [screen, setScreen] = useState('home') // home | ready | session | done
  const [index, setIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [running, setRunning] = useState(false)
  const [mirrored, setMirrored] = useState(true)
  const [prepareLeft, setPrepareLeft] = useState(0)
  const announcedRef = useRef('')

  const step = playlist[index] ?? null
  const totalSteps = playlist.length

  const start = useCallback(() => {
    stopSpeaking()
    setIndex(0)
    setScreen('ready')
    setPrepareLeft(3)
    setRunning(true)
    setSecondsLeft(playlist[0]?.duration ?? 0)
    announcedRef.current = ''
  }, [playlist])

  const quit = useCallback(() => {
    stopSpeaking()
    setRunning(false)
    setScreen('home')
    setIndex(0)
    setPrepareLeft(0)
  }, [])

  const togglePause = useCallback(() => {
    setRunning((r) => !r)
  }, [])

  const goTo = useCallback(
    (nextIndex) => {
      if (nextIndex >= playlist.length) {
        stopSpeaking()
        setRunning(false)
        setScreen('done')
        speak('Routine complete. Nice work.')
        return
      }
      if (nextIndex < 0) return

      setIndex(nextIndex)
      setSecondsLeft(playlist[nextIndex].duration)
      setPrepareLeft(3)
      setScreen('ready')
      announcedRef.current = ''
    },
    [playlist],
  )

  const skip = useCallback(() => goTo(index + 1), [goTo, index])
  const back = useCallback(() => goTo(Math.max(0, index - 1)), [goTo, index])

  // Prepare countdown, then enter work
  useEffect(() => {
    if (screen !== 'ready' || !running) return undefined

    if (prepareLeft <= 0) {
      setScreen('session')
      const key = `start-${index}`
      if (announcedRef.current !== key && step) {
        announcedRef.current = key
        speak(cueForStep(step, mirrored))
      }
      return undefined
    }

    const id = window.setTimeout(() => {
      setPrepareLeft((s) => s - 1)
    }, 1000)

    if (prepareLeft === 3 && step) {
      const key = `prep-${index}`
      if (announcedRef.current !== key) {
        announcedRef.current = key
        speak(cueForStep(step, mirrored))
      }
    }

    return () => window.clearTimeout(id)
  }, [screen, running, prepareLeft, index, step, mirrored])

  // Work / rest countdown
  useEffect(() => {
    if (screen !== 'session' || !running || !step) return undefined

    if (secondsLeft <= 0) {
      goTo(index + 1)
      return undefined
    }

    const id = window.setTimeout(() => {
      setSecondsLeft((s) => s - 1)
    }, 1000)

    return () => window.clearTimeout(id)
  }, [screen, running, secondsLeft, step, index, goTo])

  const progress = totalSteps === 0 ? 0 : index / totalSteps
  const exerciseIndex = step
    ? ROUTINE.exercises.findIndex((e) => e.id === step.exerciseId)
    : -1

  return {
    screen,
    step,
    index,
    totalSteps,
    secondsLeft,
    prepareLeft,
    running,
    mirrored,
    setMirrored,
    progress,
    exerciseIndex,
    exerciseCount: ROUTINE.exercises.length,
    start,
    quit,
    togglePause,
    skip,
    back,
  }
}
