'use client'

/**
 * Profile Page - Bento Grid Layout
 * Modern profile overview with stats and settings
 */

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { TopNav } from '@/components/navigation/TopNav'
import { BottomNav } from '@/components/navigation/BottomNav'
import { FeedbackHistory } from '@/components/profile/FeedbackHistory'
import {
  User, Mail, Calendar, TrendingUp, ArrowLeft, Camera, Target, Edit2,
  Check, X, Loader2, Trash2, Settings, LogOut, Home,
  Dumbbell as DumbbellIcon, AlertTriangle, Utensils, Moon, Pill,
  BarChart3, Award, ChevronRight, Info
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface UserProgram {
  category: 'energy' | 'libido' | 'muscle'
  level: string
  total_score: number
  workout_location?: 'home' | 'gym'
  completed_at?: string
  profile_picture_url?: string
  goal?: string
  program_end_date?: string
  first_name?: string
  breakdown?: {
    symptoms: number
    nutrition: number
    training: number
    sleep_recovery: number
    context: number
  }
}

interface UserStats {
  mealsCompleted: number
  workoutsCompleted: number
  averageSleepHours: number
  testoUpCompliance: number
  daysInProgram: number
  periodDays: number
}

interface FeedbackSubmission {
  id: string
  program_day: number
  submitted_at: string
  feedback_responses: {
    question_id: string
    answer: string
  }[]
}

const CATEGORY_NAMES = {
  energy: 'Енергия и Виталност',
  libido: 'Либидо и Сексуално здраве',
  muscle: 'Мускулна маса и сила',
}

const LOCATION_NAMES = {
  home: 'Вкъщи',
  gym: 'Фитнес зала',
}

export default function ProfilePage() {
  const router = useRouter()
  const [userProgram, setUserProgram] = useState<UserProgram | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [feedbackHistory, setFeedbackHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string>()
  const [userName, setUserName] = useState<string>()
  const [firstName, setFirstName] = useState<string>('')
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameText, setNameText] = useState('')
  const [isSavingName, setIsSavingName] = useState(false)
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [goalText, setGoalText] = useState('')
  const [isSavingGoal, setIsSavingGoal] = useState(false)
  const [isUploadingPicture, setIsUploadingPicture] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTooltip, setActiveTooltip] = useState<'hero' | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedEmail = localStorage.getItem('quizEmail')

        if (!storedEmail) {
          router.push('/quiz')
          return
        }

        setEmail(storedEmail)

        // Fetch user's program
        const programResponse = await fetch(
          `/api/user/program?email=${encodeURIComponent(storedEmail)}`
        )

        if (programResponse.ok) {
          const programData = await programResponse.json()
          setUserProgram(programData)
          setGoalText(programData.goal || '')

          // Set firstName and userName for TopNav
          if (programData.first_name) {
            setFirstName(programData.first_name)
            setNameText(programData.first_name)
            setUserName(programData.first_name)
          } else {
            const namePart = storedEmail.split('@')[0]
            setUserName(namePart)
            setFirstName('')
            setNameText('')
          }
        }

        // Fetch feedback history
        const feedbackResponse = await fetch(
          `/api/feedback/history?email=${encodeURIComponent(storedEmail)}`
        )

        if (feedbackResponse.ok) {
          const feedbackData = await feedbackResponse.json()
          setFeedbackHistory(feedbackData.submissions || [])
        }

        // Fetch user statistics
        const statsResponse = await fetch(
          `/api/user/stats?email=${encodeURIComponent(storedEmail)}`
        )

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setUserStats(statsData)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleSaveName = async () => {
    if (!email || !nameText.trim()) return

    setIsSavingName(true)
    try {
      const response = await fetch('/api/user/update-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, first_name: nameText.trim() })
      })

      if (response.ok) {
        setFirstName(nameText.trim())
        setUserName(nameText.trim())
        setIsEditingName(false)
      }
    } catch (error) {
      console.error('Error saving name:', error)
    } finally {
      setIsSavingName(false)
    }
  }

  const handleSaveGoal = async () => {
    if (!email || !goalText.trim()) return

    setIsSavingGoal(true)
    try {
      const response = await fetch('/api/user/update-goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, goal: goalText.trim() })
      })

      if (response.ok) {
        setUserProgram(prev => prev ? { ...prev, goal: goalText.trim() } : null)
        setIsEditingGoal(false)
      }
    } catch (error) {
      console.error('Error saving goal:', error)
    } finally {
      setIsSavingGoal(false)
    }
  }

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !email) return

    setIsUploadingPicture(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('email', email)

      const response = await fetch('/api/user/upload-profile-picture', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setUserProgram(prev => prev ? { ...prev, profile_picture_url: data.url } : null)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to upload profile picture')
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      alert('Failed to upload profile picture')
    } finally {
      setIsUploadingPicture(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteProfilePicture = async () => {
    if (!email || !userProgram?.profile_picture_url) return

    if (!confirm('Сигурни ли сте, че искате да изтриете профилната снимка?')) {
      return
    }

    setIsUploadingPicture(true)
    try {
      const response = await fetch(`/api/user/upload-profile-picture?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setUserProgram(prev => prev ? { ...prev, profile_picture_url: undefined } : null)
      } else {
        alert('Failed to delete profile picture')
      }
    } catch (error) {
      console.error('Error deleting profile picture:', error)
      alert('Failed to delete profile picture')
    } finally {
      setIsUploadingPicture(false)
    }
  }

  const calculateDaysRemaining = () => {
    if (!userProgram?.program_end_date) return null

    const endDate = new Date(userProgram.program_end_date)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  const calculateProgramProgress = () => {
    if (!userProgram?.completed_at || !userProgram?.program_end_date) return 0

    const startDate = new Date(userProgram.completed_at)
    const endDate = new Date(userProgram.program_end_date)
    const today = new Date()

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysPassed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    return Math.min(Math.round((daysPassed / totalDays) * 100), 100)
  }

  const handleLogout = () => {
    if (confirm('Сигурни ли сте, че искате да излезете от профила?')) {
      localStorage.removeItem('quizEmail')
      router.push('/quiz')
    }
  }

  const handleChangeWorkoutLocation = async () => {
    if (!email || !userProgram) return

    const newLocation = userProgram.workout_location === 'home' ? 'gym' : 'home'

    try {
      const response = await fetch('/api/user/update-workout-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, workout_location: newLocation })
      })

      if (response.ok) {
        setUserProgram(prev => prev ? { ...prev, workout_location: newLocation } : null)
      } else {
        alert('Грешка при промяна на локацията')
      }
    } catch (error) {
      console.error('Error changing workout location:', error)
      alert('Грешка при промяна на локацията')
    }
  }

  const handleDeleteAccount = async () => {
    if (!email) return

    const confirmText = 'Наистина ли искате да изтриете профила си? Това действие е необратимо и ще изтрие всички ваши данни.'

    if (!confirm(confirmText)) return

    const doubleConfirm = prompt('Моля, напишете "ИЗТРИЙ" за потвърждение:')

    if (doubleConfirm !== 'ИЗТРИЙ') {
      alert('Изтриването е отменено')
      return
    }

    try {
      const response = await fetch(`/api/user/delete-account?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        localStorage.removeItem('quizEmail')
        alert('Профилът е изтрит успешно')
        router.push('/quiz')
      } else {
        alert('Грешка при изтриване на профила')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Грешка при изтриване на профила')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  const programName = userProgram ? CATEGORY_NAMES[userProgram.category] : 'Програма'
  const startDate = userProgram?.completed_at
    ? new Date(userProgram.completed_at).toLocaleDateString('bg-BG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '-'

  const daysRemaining = calculateDaysRemaining()
  const programProgress = calculateProgramProgress()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <TopNav programName={programName} userName={userName} profilePictureUrl={userProgram?.profile_picture_url} />

      <div className="container-mobile py-6 pb-24 space-y-6">
        {/* Back Button */}
        <Link
          href="/app"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад към Dashboard
        </Link>

        {/* Hero Section - Profile Picture + Name */}
        <div className="relative bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-6 border-2 border-primary/30">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setActiveTooltip(activeTooltip === 'hero' ? null : 'hero')
            }}
            className="absolute top-4 right-4 p-1 rounded-md hover:bg-muted/50 transition-colors z-10"
          >
            <Info className="w-3 h-3 text-muted-foreground" />
          </button>
          {activeTooltip === 'hero' && typeof window !== 'undefined' && createPortal(
            <>
              <div
                className="fixed inset-0 bg-black/40 z-[99998] animate-fade-in"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveTooltip(null)
                }}
              />
              <div className="fixed left-4 right-4 top-1/2 -translate-y-1/2 p-4 bg-white border-2 border-primary/20 rounded-xl shadow-2xl z-[99999] animate-fade-in">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="text-sm font-bold text-foreground">Профил</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveTooltip(null)
                    }}
                    className="p-1 hover:bg-muted rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Проследи своя прогрес и персонализирай профила си. Виж Quiz резултатите, статистики и историята на обратната връзка.
                </p>
              </div>
            </>,
            document.body
          )}
          <div className="flex items-start gap-4">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center ring-4 ring-primary/10">
                {userProgram?.profile_picture_url ? (
                  <Image
                    src={userProgram.profile_picture_url}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-primary" />
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload/Loading Button */}
              <button
                onClick={handleProfilePictureClick}
                disabled={isUploadingPicture}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-lg"
              >
                {isUploadingPicture ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Delete Button */}
              {userProgram?.profile_picture_url && !isUploadingPicture && (
                <button
                  onClick={handleDeleteProfilePicture}
                  className="absolute -top-1 -right-1 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Name + Email */}
            <div className="flex-1">
              {isEditingName ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={nameText}
                    onChange={(e) => setNameText(e.target.value)}
                    placeholder="Твоето име..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveName}
                      disabled={isSavingName}
                      className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 text-xs"
                    >
                      <Check className="w-3 h-3" />
                      {isSavingName ? 'Запазва...' : 'Запази'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false)
                        setNameText(firstName)
                      }}
                      className="flex items-center gap-1 px-3 py-1 border border-border rounded-lg hover:bg-muted text-xs"
                    >
                      <X className="w-3 h-3" />
                      Отказ
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">
                    {firstName || userName || 'Потребител'}
                  </h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1.5 hover:bg-background/50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{email}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{programName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid - Stats */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {/* Quiz Score (1x1) */}
          <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-5 border-2 border-primary/30 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <Award className="w-6 h-6 text-primary mb-2" />
            <div className="text-4xl font-bold text-primary mb-1">
              {userProgram?.total_score || 0}
            </div>
            <div className="text-xs text-muted-foreground">Quiz Score</div>
          </div>

          {/* Program Progress (1x1) */}
          <div className="bg-background rounded-2xl p-5 border border-border animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <Calendar className="w-6 h-6 text-primary mb-2" />
            <div className="text-4xl font-bold mb-1">{programProgress}%</div>
            <div className="text-xs text-muted-foreground">
              {daysRemaining && daysRemaining > 0 ? `${daysRemaining} дни остават` : 'Прогрес'}
            </div>
          </div>
        </div>

        {/* Stats Grid (4 tiles) */}
        {userStats && (
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-1 bg-background rounded-xl p-4 border border-border hover:border-primary/50 transition-all animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <Utensils className="w-4 h-4 text-primary mb-2" />
              <div className="text-xl font-bold">{userStats.mealsCompleted}</div>
              <div className="text-xs text-muted-foreground">хранения</div>
            </div>

            <div className="col-span-1 bg-background rounded-xl p-4 border border-border hover:border-primary/50 transition-all animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              <DumbbellIcon className="w-4 h-4 text-primary mb-2" />
              <div className="text-xl font-bold">{userStats.workoutsCompleted}</div>
              <div className="text-xs text-muted-foreground">тренировки</div>
            </div>

            <div className="col-span-1 bg-background rounded-xl p-4 border border-border hover:border-primary/50 transition-all animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
              <Moon className="w-4 h-4 text-primary mb-2" />
              <div className="text-xl font-bold">{userStats.averageSleepHours}ч</div>
              <div className="text-xs text-muted-foreground">сън</div>
            </div>

            <div className="col-span-1 bg-background rounded-xl p-4 border border-border hover:border-primary/50 transition-all animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
              <Pill className="w-4 h-4 text-primary mb-2" />
              <div className="text-xl font-bold">{userStats.testoUpCompliance}%</div>
              <div className="text-xs text-muted-foreground">TestoUp</div>
            </div>
          </div>
        )}

        {/* Goal Section */}
        <div className="bg-background rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="font-bold">Моята цел за 30 дни</h2>
            </div>
            {!isEditingGoal && (
              <button
                onClick={() => setIsEditingGoal(true)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {isEditingGoal ? (
            <div className="space-y-3">
              <textarea
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                placeholder="Напр. Искам да се чувствам по-енергичен и да свал 5 кг..."
                className="w-full p-3 rounded-lg border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveGoal}
                  disabled={isSavingGoal}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  {isSavingGoal ? 'Запазва се...' : 'Запази'}
                </button>
                <button
                  onClick={() => {
                    setIsEditingGoal(false)
                    setGoalText(userProgram?.goal || '')
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                  Отказ
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-muted/30">
              {userProgram?.goal ? (
                <p className="text-sm">{userProgram.goal}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Още не сте задали цел. Кликнете бутона за редактиране, за да добавите.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Settings & Actions */}
        <div className="bg-background rounded-2xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Настройки</h2>
          </div>

          <div className="space-y-2">
            {/* Workout Location */}
            {userProgram?.workout_location && (
              <button
                onClick={handleChangeWorkoutLocation}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  {userProgram.workout_location === 'home' ? (
                    <Home className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  ) : (
                    <DumbbellIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                  <div className="text-left">
                    <p className="text-sm font-medium">Тренировъчна локация</p>
                    <p className="text-xs text-muted-foreground">
                      Текуща: {LOCATION_NAMES[userProgram.workout_location]}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="text-left">
                  <p className="text-sm font-medium">Излез от профила</p>
                  <p className="text-xs text-muted-foreground">
                    Ще можете да влезете отново с имейла си
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Delete Account */}
            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-destructive/10 hover:bg-destructive/20 transition-colors border border-destructive/30 group"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <div className="text-left">
                  <p className="text-sm font-medium text-destructive">Изтрий профила</p>
                  <p className="text-xs text-muted-foreground">
                    Необратимо изтриване на всички данни
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-destructive" />
            </button>
          </div>
        </div>

        {/* Feedback History */}
        <FeedbackHistory submissions={feedbackHistory} />
      </div>

      <BottomNav onNavigate={() => router.push('/app')} />
    </div>
  )
}
