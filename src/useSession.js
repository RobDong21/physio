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
    }
  }

  return steps
}

function cueForStep(step, mirrored) {
  const parts = [step.exercise.name]
  const side = sideLabel(step.side, mirrored)
  const direction = sideLabel(step.direction, mirrored)

  if (side) parts.push(formatSide(side))
  if (direction) parts.push(formatSide(direction))

  if (step.exercise.holdEach) {
    parts.push(`${step.duration} seconds`)
  } else if (step.exercise.mode === 'hold') {
    parts.push(`hold ${step.duration}`)
  } else {
    parts.push(`rep ${step.rep}`)
  }

  return parts.join('. ')
}

function computeExerciseProgress(playlist, index, secondsLeft, step) {
  return ROUTINE.exercises.map((ex) => {
    const indices = []
    for (let i = 0; i < playlist.length; i++) {
      if (playlist[i].exerciseId === ex.id) indices.push(i)
    }
    if (indices.length === 0) return 0

    const first = indices[0]
    const last = indices[indices.length - 1]

    if (index > last) return 1
    if (index < first) return 0

    const done = indices.filter((i) => i < index).length
    const fraction =
      step && step.duration > 0
        ? Math.max(0, Math.min(1, (step.duration - secondsLeft) / step.duration))
        : 0

    return (done + fraction) / indices.length
  })
}

export function useSession() {
  const playlist = useMemo(() => buildPlaylist(ROUTINE.exercises), [])
  const [screen, setScreen] = useState('home') // home | session | done
  const [index, setIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [running, setRunning] = useState(false)
  const [mirrored, setMirrored] = useState(true)
  const announcedRef = useRef('')

  const step = playlist[index] ?? null
  const totalSteps = playlist.length

  const announce = useCallback(
    (nextIndex, nextStep) => {
      const key = `step-${nextIndex}`
      if (announcedRef.current === key || !nextStep) return
      announcedRef.current = key
      speak(cueForStep(nextStep, mirrored))
    },
    [mirrored],
  )

  const start = useCallback(() => {
    stopSpeaking()
    setIndex(0)
    setScreen('session')
    setRunning(true)
    setSecondsLeft(playlist[0]?.duration ?? 0)
    announcedRef.current = ''
    announce(0, playlist[0])
  }, [playlist, announce])

  const quit = useCallback(() => {
    stopSpeaking()
    setRunning(false)
    setScreen('home')
    setIndex(0)
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
      setScreen('session')
      announce(nextIndex, playlist[nextIndex])
    },
    [playlist, announce],
  )

  const skip = useCallback(() => {
    if (!step) return
    const currentId = step.exerciseId
    let next = index + 1
    while (next < playlist.length && playlist[next].exerciseId === currentId) {
      next += 1
    }
    goTo(next)
  }, [goTo, index, step, playlist])

  const back = useCallback(() => goTo(Math.max(0, index - 1)), [goTo, index])

  const goToExercise = useCallback(
    (exerciseIndex) => {
      const ex = ROUTINE.exercises[exerciseIndex]
      if (!ex) return
      const startIndex = playlist.findIndex((s) => s.exerciseId === ex.id)
      if (startIndex < 0) return
      goTo(startIndex)
    },
    [goTo, playlist],
  )

  // Work countdown
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

  const exerciseProgress = useMemo(
    () => computeExerciseProgress(playlist, index, secondsLeft, step),
    [playlist, index, secondsLeft, step],
  )

  const progress =
    exerciseProgress.length === 0
      ? 0
      : exerciseProgress.reduce((sum, p) => sum + p, 0) / exerciseProgress.length

  const exerciseIndex = step
    ? ROUTINE.exercises.findIndex((e) => e.id === step.exerciseId)
    : -1

  return {
    screen,
    step,
    index,
    totalSteps,
    secondsLeft,
    running,
    mirrored,
    setMirrored,
    progress,
    exerciseProgress,
    exerciseIndex,
    exerciseCount: ROUTINE.exercises.length,
    start,
    quit,
    togglePause,
    skip,
    back,
    goToExercise,
  }
}
