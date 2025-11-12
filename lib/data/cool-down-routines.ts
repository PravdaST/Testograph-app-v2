/**
 * Standard cool-down and stretching routines
 * 5-10 minutes of static stretching for recovery
 */

export interface CoolDownExercise {
  name_bg: string
  name_en: string
  duration_seconds: number
  description_bg: string
  targetMuscles: string
}

export const GENERAL_COOLDOWN: CoolDownExercise[] = [
  {
    name_bg: 'Child\'s Pose',
    name_en: 'Child\'s Pose',
    duration_seconds: 60,
    description_bg: 'Разпускане на гърба и раменете',
    targetMuscles: 'Гръб, рамене',
  },
  {
    name_bg: 'Quad Stretch',
    name_en: 'Quad Stretch',
    duration_seconds: 30,
    description_bg: 'Стоя, хвани глезена и притегли към седалището. 30 сек всеки крак',
    targetMuscles: 'Квадрицепс',
  },
  {
    name_bg: 'Hamstring Stretch',
    name_en: 'Hamstring Stretch',
    duration_seconds: 30,
    description_bg: 'Седнал, протегни краката и се наведи напред',
    targetMuscles: 'Задна част на бедрата',
  },
  {
    name_bg: 'Hip Flexor Stretch',
    name_en: 'Hip Flexor Stretch',
    duration_seconds: 30,
    description_bg: 'Коленичи на едно коляно, придърпай таза напред. 30 сек всяка страна',
    targetMuscles: 'Тазобедрени флексори',
  },
  {
    name_bg: 'Shoulder Stretch',
    name_en: 'Shoulder Stretch',
    duration_seconds: 30,
    description_bg: 'Дръпни рамото през гърдите. 30 сек всяка страна',
    targetMuscles: 'Рамене',
  },
  {
    name_bg: 'Triceps Stretch',
    name_en: 'Triceps Stretch',
    duration_seconds: 30,
    description_bg: 'Вдигни лакътя над главата и дръпни назад. 30 сек всяка ръка',
    targetMuscles: 'Трицепс',
  },
  {
    name_bg: 'Chest Stretch',
    name_en: 'Chest Stretch',
    duration_seconds: 30,
    description_bg: 'Обопри ръката на стена, завърти тялото встрани. 30 сек всяка страна',
    targetMuscles: 'Гърди',
  },
  {
    name_bg: 'Cat-Cow Stretch',
    name_en: 'Cat-Cow Stretch',
    duration_seconds: 40,
    description_bg: 'Плавни движения за гръбначния стълб',
    targetMuscles: 'Гръбначен стълб',
  },
  {
    name_bg: 'Spinal Twist',
    name_en: 'Spinal Twist',
    duration_seconds: 30,
    description_bg: 'Легнал, завърти коленете встрани. 30 сек всяка страна',
    targetMuscles: 'Гръб, кръст',
  },
  {
    name_bg: 'Deep Breathing',
    name_en: 'Deep Breathing',
    duration_seconds: 60,
    description_bg: '5 дълбоки вдишвания и издишвания за възстановяване',
    targetMuscles: 'Диафрагма, цялостно релаксиране',
  },
]

export const UPPER_BODY_COOLDOWN: CoolDownExercise[] = [
  {
    name_bg: 'Doorway Chest Stretch',
    name_en: 'Doorway Chest Stretch',
    duration_seconds: 45,
    description_bg: 'Обопри двете ръце на касата и се наведи напред',
    targetMuscles: 'Гърди, предни делтоиди',
  },
  {
    name_bg: 'Overhead Triceps Stretch',
    name_en: 'Overhead Triceps Stretch',
    duration_seconds: 30,
    description_bg: 'Вдигни лакътя над главата. 30 сек всяка ръка',
    targetMuscles: 'Трицепс',
  },
  {
    name_bg: 'Cross-Body Shoulder Stretch',
    name_en: 'Cross-Body Shoulder Stretch',
    duration_seconds: 30,
    description_bg: 'Дръпни рамото през гърдите. 30 сек всяка страна',
    targetMuscles: 'Задни делтоиди',
  },
  {
    name_bg: 'Wrist Flexor Stretch',
    name_en: 'Wrist Flexor Stretch',
    duration_seconds: 30,
    description_bg: 'Протегни ръката, притисни пръстите назад',
    targetMuscles: 'Предмишници',
  },
  {
    name_bg: 'Upper Back Stretch',
    name_en: 'Upper Back Stretch',
    duration_seconds: 40,
    description_bg: 'Прегърни се, заобикали горната част на гърба',
    targetMuscles: 'Горна част на гърба',
  },
  {
    name_bg: 'Neck Stretch',
    name_en: 'Neck Stretch',
    duration_seconds: 30,
    description_bg: 'Наклони главата встрани. 30 сек всяка страна',
    targetMuscles: 'Врат, трапец',
  },
  ...GENERAL_COOLDOWN.slice(-2), // Spinal Twist + Deep Breathing
]

export const LOWER_BODY_COOLDOWN: CoolDownExercise[] = [
  {
    name_bg: 'Standing Quad Stretch',
    name_en: 'Standing Quad Stretch',
    duration_seconds: 40,
    description_bg: 'Хвани глезена, дръпни към седалището. 40 сек всеки крак',
    targetMuscles: 'Квадрицепс',
  },
  {
    name_bg: 'Seated Hamstring Stretch',
    name_en: 'Seated Hamstring Stretch',
    duration_seconds: 60,
    description_bg: 'Седнал, протегни краката и се наведи напред',
    targetMuscles: 'Задна част на бедрата',
  },
  {
    name_bg: 'Pigeon Pose',
    name_en: 'Pigeon Pose',
    duration_seconds: 60,
    description_bg: 'Дълбоко разтягане на тазобедрената става. 60 сек всяка страна',
    targetMuscles: 'Седалищни мускули, тазобедрена става',
  },
  {
    name_bg: 'Butterfly Stretch',
    name_en: 'Butterfly Stretch',
    duration_seconds: 60,
    description_bg: 'Седнал, събери ходилата, притисни коленете надолу',
    targetMuscles: 'Вътрешна част на бедрата',
  },
  {
    name_bg: 'Calf Stretch',
    name_en: 'Calf Stretch',
    duration_seconds: 30,
    description_bg: 'Притисни петата към пода. 30 сек всеки крак',
    targetMuscles: 'Прасци',
  },
  {
    name_bg: 'Figure 4 Stretch',
    name_en: 'Figure 4 Stretch',
    duration_seconds: 45,
    description_bg: 'Легнал, постави глезена върху коляното. 45 сек всяка страна',
    targetMuscles: 'Седалищни мускули, IT band',
  },
  ...GENERAL_COOLDOWN.slice(-2), // Spinal Twist + Deep Breathing
]

export function getCoolDownForMuscleGroup(primaryMuscle: string): CoolDownExercise[] {
  const muscle = primaryMuscle.toLowerCase()

  if (muscle.includes('chest') || muscle.includes('shoulder') || muscle.includes('arm') || muscle.includes('back')) {
    return UPPER_BODY_COOLDOWN
  } else if (muscle.includes('leg') || muscle.includes('glute') || muscle.includes('quad') || muscle.includes('hamstring')) {
    return LOWER_BODY_COOLDOWN
  }

  return GENERAL_COOLDOWN
}
