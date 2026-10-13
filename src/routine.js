/** Morning cervical radiculopathy routine — hybrid timers matching the video. */

export const ROUTINE = {
  title: 'Morning Neck Routine',
  subtitle: '5 exercises · under 10 minutes · no equipment',
  exercises: [
    {
      id: 'chin-tucks',
      name: 'Chin Tucks',
      cue: 'Eyes level. Slide chin straight back — double chin. Small, pain-free.',
      pose: 'chinTuck',
      sets: 2,
      reps: 10,
      mode: 'rep',
      repSeconds: 2,
      restBetweenSets: 8,
      mirrorable: false,
    },
    {
      id: 'cervical-extension',
      name: 'Cervical Extension',
      cue: 'Chin tuck first, then gently look up. Hold 2–3s. Smooth and pain-free.',
      pose: 'extension',
      sets: 1,
      reps: 10,
      mode: 'rep',
      repSeconds: 3,
      restBetweenSets: 0,
      mirrorable: false,
    },
    {
      id: 'lateral-flexion',
      name: 'Lateral Flexion',
      cue: 'Chin tuck, then ear toward shoulder. Soft stretch — no forcing.',
      pose: 'lateralFlexion',
      sets: 2,
      reps: 3,
      mode: 'hold',
      holdSeconds: 10,
      sides: ['right', 'left'],
      restBetweenSets: 6,
      mirrorable: true,
    },
    {
      id: 'isometrics',
      name: 'Isometric Holds',
      cue: 'Chin tuck. Press into your hand — neck stays still. Firm, not strained.',
      pose: 'isometric',
      sets: 1,
      reps: 5,
      mode: 'hold',
      holdSeconds: 2,
      directions: ['front', 'back', 'right', 'left'],
      restBetweenSets: 0,
      mirrorable: true,
    },
    {
      id: 'median-nerve-glide',
      name: 'Median Nerve Glide',
      cue: 'Affected arm: elbow bent → open out, wrist back → turn head away. Glide, don’t stretch.',
      pose: 'nerveGlide',
      sets: 1,
      reps: 8,
      mode: 'rep',
      repSeconds: 4,
      restBetweenSets: 0,
      mirrorable: true,
      affectedSideLabel: true,
    },
  ],
}

export function sideLabel(side, mirrored) {
  if (!side) return null
  if (!mirrored) return side
  if (side === 'left') return 'right'
  if (side === 'right') return 'left'
  return side
}

export function formatSide(side) {
  if (!side) return ''
  return side.charAt(0).toUpperCase() + side.slice(1)
}
