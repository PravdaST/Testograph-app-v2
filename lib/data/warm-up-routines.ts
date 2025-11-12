/**
 * Standard warm-up routines for different workout types
 * 5-10 minutes of dynamic stretching and mobility work
 */

export interface WarmUpExercise {
  name_bg: string
  name_en: string
  duration_seconds: number
  reps?: number
  description_bg: string
}

export const GENERAL_WARMUP: WarmUpExercise[] = [
  {
    name_bg: 'Jumping Jacks',
    name_en: 'Jumping Jacks',
    duration_seconds: 60,
    description_bg: 'Цялостно активиране на тялото и повишаване на сърдечната честота',
  },
  {
    name_bg: 'Arm Circles',
    name_en: 'Arm Circles',
    duration_seconds: 30,
    reps: 10,
    description_bg: 'Назад и напред, подготовка на раменете',
  },
  {
    name_bg: 'Leg Swings',
    name_en: 'Leg Swings',
    duration_seconds: 30,
    reps: 10,
    description_bg: 'Напред-назад и встрани, мобилност на тазобедрената става',
  },
  {
    name_bg: 'Hip Circles',
    name_en: 'Hip Circles',
    duration_seconds: 30,
    reps: 10,
    description_bg: 'Кръгови движения с таза',
  },
  {
    name_bg: 'Bodyweight Squats',
    name_en: 'Bodyweight Squats',
    reps: 15,
    duration_seconds: 30,
    description_bg: 'Активиране на долната част на тялото',
  },
  {
    name_bg: 'Push-up to Downward Dog',
    name_en: 'Push-up to Downward Dog',
    reps: 8,
    duration_seconds: 40,
    description_bg: 'Мобилност на гръбначния стълб и раменете',
  },
  {
    name_bg: 'Cat-Cow Stretch',
    name_en: 'Cat-Cow Stretch',
    duration_seconds: 40,
    reps: 10,
    description_bg: 'Загряване на гръбначния стълб',
  },
  {
    name_bg: 'Walking Lunges',
    name_en: 'Walking Lunges',
    reps: 10,
    duration_seconds: 40,
    description_bg: 'Динамично разтягане на бедрата и активиране на краката',
  },
]

export const UPPER_BODY_WARMUP: WarmUpExercise[] = [
  ...GENERAL_WARMUP.slice(0, 2), // Jumping Jacks + Arm Circles
  {
    name_bg: 'Shoulder Dislocations',
    name_en: 'Shoulder Dislocations',
    reps: 10,
    duration_seconds: 40,
    description_bg: 'С въже или стик, подобрява мобилността на раменете',
  },
  {
    name_bg: 'Band Pull-Aparts',
    name_en: 'Band Pull-Aparts',
    reps: 15,
    duration_seconds: 30,
    description_bg: 'Активиране на горната част на гърба',
  },
  {
    name_bg: 'Wall Slides',
    name_en: 'Wall Slides',
    reps: 12,
    duration_seconds: 40,
    description_bg: 'Подобрява постурата и активира раменете',
  },
]

export const LOWER_BODY_WARMUP: WarmUpExercise[] = [
  ...GENERAL_WARMUP.slice(0, 1), // Jumping Jacks
  ...GENERAL_WARMUP.slice(2, 5), // Leg Swings + Hip Circles + Bodyweight Squats
  {
    name_bg: 'Glute Bridges',
    name_en: 'Glute Bridges',
    reps: 15,
    duration_seconds: 40,
    description_bg: 'Активиране на седалищните мускули',
  },
  {
    name_bg: 'Lateral Leg Raises',
    name_en: 'Lateral Leg Raises',
    reps: 12,
    duration_seconds: 30,
    description_bg: 'Активиране на отвличащите мускули',
  },
]

export function getWarmUpForMuscleGroup(primaryMuscle: string): WarmUpExercise[] {
  const muscle = primaryMuscle.toLowerCase()

  if (muscle.includes('chest') || muscle.includes('shoulder') || muscle.includes('arm') || muscle.includes('back')) {
    return UPPER_BODY_WARMUP
  } else if (muscle.includes('leg') || muscle.includes('glute') || muscle.includes('quad') || muscle.includes('hamstring')) {
    return LOWER_BODY_WARMUP
  }

  return GENERAL_WARMUP
}
