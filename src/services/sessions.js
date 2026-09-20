/**
 * The meditation catalogue rendered by the Home screen (US-03).
 */

export const CATEGORIES = ['All', 'Calm', 'Focus', 'Sleep', 'Breath'];

export const SESSIONS = [
  {
    id: 's1',
    title: 'Morning Stillness',
    category: 'Calm',
    duration: 10,
    narrator: 'Ama Diallo',
    icon: 'weather-sunset-up',
    color: '#F3A953',
    description:
      'A gentle way to meet the day. You settle into the body, notice the weight of the breath and let the mind arrive before the world asks anything of you.',
    benefits: ['Lowers morning anxiety', 'Sets a calm intention', 'Improves focus for the hours ahead'],
  },
  {
    id: 's2',
    title: 'Deep Focus Flow',
    category: 'Focus',
    duration: 15,
    narrator: 'Kwame Osei',
    icon: 'target',
    color: '#6C4FD8',
    description:
      'A concentration practice built around a single anchor. Each time attention wanders you bring it back, training the muscle that sustained work depends on.',
    benefits: ['Sharpens sustained attention', 'Reduces task switching', 'Builds mental stamina'],
  },
  {
    id: 's3',
    title: 'Drifting Into Sleep',
    category: 'Sleep',
    duration: 20,
    narrator: 'Leila Ben Ali',
    icon: 'weather-night',
    color: '#4C6FBF',
    description:
      'A slow body scan designed to be followed lying down. The voice softens as the session goes on, and most people do not hear the end of it.',
    benefits: ['Shortens time to fall asleep', 'Releases physical tension', 'Quiets a racing mind'],
  },
  {
    id: 's4',
    title: 'Box Breathing',
    category: 'Breath',
    duration: 5,
    narrator: 'Ama Diallo',
    icon: 'vector-square',
    color: '#3FB5A5',
    description:
      'Four counts in, four counts held, four counts out, four counts held. A structured pattern you can use anywhere to bring the nervous system back down.',
    benefits: ['Slows the heart rate', 'Usable in under five minutes', 'Effective before stressful moments'],
  },
  {
    id: 's5',
    title: 'Letting Go of Tension',
    category: 'Calm',
    duration: 12,
    narrator: 'Yaw Mensah',
    icon: 'spa',
    color: '#C96FA8',
    description:
      'A progressive relaxation that moves through the body, tightening and releasing each region until the held stress has somewhere to go.',
    benefits: ['Relieves muscular tension', 'Interrupts the stress loop', 'Grounds you in the body'],
  },
  {
    id: 's6',
    title: 'Clarity Before Work',
    category: 'Focus',
    duration: 8,
    narrator: 'Kwame Osei',
    icon: 'lightbulb-on-outline',
    color: '#E0803C',
    description:
      'A short framing practice for the start of a working block. You name what matters today, then let the rest of the noise settle out of the way.',
    benefits: ['Clarifies priorities', 'Reduces overwhelm', 'Creates a deliberate start'],
  },
  {
    id: 's7',
    title: 'Ocean Breath',
    category: 'Breath',
    duration: 7,
    narrator: 'Leila Ben Ali',
    icon: 'waves',
    color: '#3E9BC4',
    description:
      'A rhythmic breathing practice modelled on the sound of waves. The slight constriction at the throat gives the breath something to rest against.',
    benefits: ['Deepens the breath', 'Soothes the nervous system', 'Easy to learn'],
  },
  {
    id: 's8',
    title: 'Night Wind Down',
    category: 'Sleep',
    duration: 18,
    narrator: 'Yaw Mensah',
    icon: 'moon-waning-crescent',
    color: '#5B57A8',
    description:
      'A closing ritual for the end of the day. You review what happened without judging it, then deliberately set it down before turning out the light.',
    benefits: ['Closes mental loops', 'Reduces night rumination', 'Signals the body to rest'],
  },
];

export const getSessionById = (id) => SESSIONS.find((s) => s.id === id) || null;
