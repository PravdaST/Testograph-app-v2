'use client'

/**
 * Profile Page
 * Shows user profile information and feedback history
 */

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/navigation/TopNav'
import { BottomNav } from '@/components/navigation/BottomNav'
import { FeedbackHistory } from '@/components/profile/FeedbackHistory'
import { User, Mail, Calendar, TrendingUp, ArrowLeft, Camera, Target, Edit2, Check, X, Loader2, Trash2 } from 'lucide-react'
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
  breakdown?: {
    symptoms: number
    nutrition: number
    training: number
    sleep_recovery: number
    context: number
  }
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

const LEVEL_NAMES = {
  low: 'Начинаещ',
  normal: 'Напреднал',
  high: 'Експерт',
}

const LOCATION_NAMES = {
  home: 'Вкъщи',
  gym: 'Фитнес зала',
}

export default function ProfilePage() {
  const router = useRouter()
  const [userProgram, setUserProgram] = useState<UserProgram | null>(null)
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string>()
  const [userName, setUserName] = useState<string>()
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [goalText, setGoalText] = useState('')
  const [isSavingGoal, setIsSavingGoal] = useState(false)
  const [isUploadingPicture, setIsUploadingPicture] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedEmail = localStorage.getItem('quizEmail')

        if (!storedEmail) {
          router.push('/quiz')
          return
        }

        setEmail(storedEmail)

        // Extract username from email
        const namePart = storedEmail.split('@')[0]
        setUserName(namePart)

        // Fetch user's program
        const programResponse = await fetch(
          `/api/user/program?email=${encodeURIComponent(storedEmail)}`
        )

        if (programResponse.ok) {
          const programData = await programResponse.json()
          setUserProgram(programData)
          setGoalText(programData.goal || '')
        }

        // Fetch feedback history
        const feedbackResponse = await fetch(
          `/api/feedback/history?email=${encodeURIComponent(storedEmail)}`
        )

        if (feedbackResponse.ok) {
          const feedbackData = await feedbackResponse.json()
          setFeedbackHistory(feedbackData.submissions || [])
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleNavigation = (section: 'meals' | 'workout' | 'sleep' | 'supplement') => {
    // Navigate back to dashboard with section
    router.push('/app')
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
      // Reset file input
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
      <TopNav programName={programName} userName={userName} />

      <div className="container-mobile py-6 pb-24 space-y-6">
        {/* Back Button */}
        <Link
          href="/app"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад към Dashboard
        </Link>

        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-6 border-2 border-primary/30">
          <div className="flex items-start gap-4">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-primary/20 flex items-center justify-center">
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
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isUploadingPicture ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Delete Button (only show when picture exists) */}
              {userProgram?.profile_picture_url && !isUploadingPicture && (
                <button
                  onClick={handleDeleteProfilePicture}
                  className="absolute -top-1 -right-1 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">Профил</h1>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span>{programName}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Започнато на {startDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Program Progress */}
        {userProgram && daysRemaining !== null && (
          <div className="bg-background rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Прогрес на програмата</h2>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {daysRemaining > 0 ? `Остават ${daysRemaining} дни` : 'Програмата приключи!'}
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {programProgress}%
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${programProgress}%` }}
                  />
                </div>
              </div>

              {daysRemaining <= 0 && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <p className="text-sm font-medium">
                    🎉 Честито! Завършихте 30-дневната програма!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Можете да започнете нов цикъл за да продължите прогреса си
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Goal Section */}
        <div className="bg-background rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Моята цел за 30 дни</h2>
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

        {/* Program Stats */}
        {userProgram && (
          <div className="bg-background rounded-2xl p-6 border border-border">
            <h2 className="text-lg font-bold mb-4">Начален резултат от теста</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">
                  Общ резултат
                </p>
                <p className="text-2xl font-bold text-primary">
                  {userProgram.total_score}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">Ниво</p>
                <p className="text-2xl font-bold">
                  {LEVEL_NAMES[userProgram.level as keyof typeof LEVEL_NAMES] || userProgram.level}
                </p>
              </div>
            </div>

            {/* Workout Location */}
            {userProgram.workout_location && (
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Тренировъчна локация
                </p>
                <div className="p-4 rounded-xl bg-muted/30">
                  <p className="font-semibold">
                    {LOCATION_NAMES[userProgram.workout_location]}
                  </p>
                </div>
              </div>
            )}

            {/* Score Breakdown */}
            {userProgram.breakdown && (
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  Детайлна разбивка на резултата
                </p>
                <div className="space-y-3">
                  {/* Symptoms */}
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Симптоми</span>
                      <span className="text-sm font-semibold text-primary">
                        {userProgram.breakdown.symptoms}/10
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(userProgram.breakdown.symptoms / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Nutrition */}
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Хранене</span>
                      <span className="text-sm font-semibold text-primary">
                        {userProgram.breakdown.nutrition}/10
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(userProgram.breakdown.nutrition / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Training */}
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Тренировки</span>
                      <span className="text-sm font-semibold text-primary">
                        {userProgram.breakdown.training}/10
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(userProgram.breakdown.training / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Sleep & Recovery */}
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Сън и Възстановяване</span>
                      <span className="text-sm font-semibold text-primary">
                        {userProgram.breakdown.sleep_recovery}/10
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(userProgram.breakdown.sleep_recovery / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Context */}
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Контекст</span>
                      <span className="text-sm font-semibold text-primary">
                        {userProgram.breakdown.context}/10
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(userProgram.breakdown.context / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feedback History */}
        <FeedbackHistory submissions={feedbackHistory} />
      </div>

      <BottomNav onNavigate={handleNavigation} />
    </div>
  )
}
