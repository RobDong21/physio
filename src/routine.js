/** Morning cervical radiculopathy routine — hybrid timers matching the video. */

export const ROUTINE = {
  title: 'Morning Neck Routine',
  subtitle: '5 exercises · under 10 minutes · no equipment',
  exercises: [
    {
      id: 'chin-tucks',
      name: 'Chin Tucks',
      cue: 'Eyes level. Slide chin straight back — double chin. Small, pain-free.',
      setup: [
        'Sit or stand tall, eyes looking straight ahead.',
        'Slide your chin straight back (think “double chin”), not down.',
        'Hold briefly, then release to neutral — repeat gently.',
      ],
      feel: 'A light stretch at the back of the neck; ears stacking over shoulders.',
      avoid: 'Don’t nod or tip the head down. Keep the motion small and pain-free.',
      sets: 2,
      reps: 1,
      mode: 'hold',
      holdSeconds: 20,
      holdEach: 2,
      holdEachDisplay: '2',
      holdEachLabel: 'each tuck',
      holdEachHint: 'Hold gently, then release — at your own pace until the set ends.',
      mirrorable: false,
    },
    {
      id: 'cervical-extension',
      name: 'Cervical Extension',
      cue: 'Chin tuck first, then gently look up. Smooth and pain-free.',
      setup: [
        'Start with a gentle chin tuck.',
        'From that tucked position, look up a little — stop before strain.',
        'Return to neutral, then tuck again for the next look-up.',
      ],
      feel: 'Mild stretch on the front of the neck; movement stays smooth.',
      avoid: 'Don’t crank the head back. Always tuck first; stay pain-free.',
      sets: 2,
      reps: 1,
      mode: 'hold',
      holdSeconds: 20,
      holdEach: 3,
      holdEachDisplay: '2–3',
      holdEachLabel: 'each look-up',
      holdEachHint: 'Hold gently, then release — at your own pace until the set ends.',
      mirrorable: false,
    },
    {
      id: 'lateral-flexion',
      name: 'Lateral Flexion',
      cue: 'Chin tuck, then ear toward shoulder. Soft stretch — no forcing.',
      setup: [
        'Chin tuck lightly, then tip one ear toward that shoulder.',
        'Keep the nose facing forward — don’t rotate the head.',
        'Hold the soft stretch, then switch sides as cued.',
      ],
      feel: 'Gentle lengthening on the opposite side of the neck.',
      avoid: 'Don’t force the ear to the shoulder or shrug the shoulder up.',
      sets: 2,
      reps: 3,
      mode: 'hold',
      holdSeconds: 10,
      sides: ['right', 'left'],
      mirrorable: true,
    },
    {
      id: 'isometrics',
      name: 'Isometric Holds',
      cue: 'Chin tuck. Press into your hand — neck stays still. Firm, not strained.',
      setup: [
        'Chin tuck. Place your hand where the cue says (front, back, or side).',
        'Press your head gently into your hand — head and neck don’t move.',
        'Match pressure with your hand; release, then press again at your pace.',
      ],
      feel: 'Neck muscles working without the head shifting.',
      avoid: 'Don’t let the head push past your hand. Firm, not strained.',
      sets: 1,
      reps: 1,
      mode: 'hold',
      holdSeconds: 16,
      holdEach: 2,
      holdEachDisplay: '2',
      holdEachLabel: 'each press',
      holdEachHint: 'Press, hold, release — at your own pace until the direction ends.',
      directions: ['front', 'back', 'right', 'left'],
      mirrorable: true,
    },
    {
      id: 'median-nerve-glide',
      name: 'Median Nerve Glide',
      cue: 'Affected arm: elbow bent → open out, wrist back → turn head away. Glide, don’t stretch.',
      setup: [
        'Affected arm: start with elbow bent by your side.',
        'Open the arm out, wrist gently back, then turn your head away.',
        'Return smoothly — this is a glide, not a hard stretch.',
      ],
      feel: 'A light “zing” or pull that eases when you reverse — never sharp pain.',
      avoid: 'Don’t push into pain or hold a strong stretch. Keep it gentle and rhythmic.',
      sets: 1,
      reps: 1,
      mode: 'hold',
      holdSeconds: 32,
      holdEach: 4,
      holdEachDisplay: '~4',
      holdEachLabel: 'per glide',
      holdEachHint: 'Glide out and back smoothly — your pace, no forcing.',
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
