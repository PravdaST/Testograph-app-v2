/**
 * Email functions for Testograph
 * Uses Resend API
 */

import type { QuizResult } from '@/lib/data/quiz/types'
import { getSectionLabel, getScoreLevelDisplay } from '@/lib/utils/quiz-scoring'

/**
 * Send purchase notification email - invites user to complete quiz
 * Called after Shopify purchase webhook when user hasn't completed quiz yet
 */
interface PurchaseNotificationParams {
  email: string
  capsulesAdded: number
  totalCapsules: number
  orderNumber?: string
}

export async function sendPurchaseNotificationEmail({
  email,
  capsulesAdded,
  totalCapsules,
  orderNumber,
}: PurchaseNotificationParams): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    console.error('RESEND_API_KEY not configured')
    return false
  }

  const daysAccess = Math.floor(totalCapsules / 2) // 2 capsules per day

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Благодарим за покупката - Testograph</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Благодарим за покупката!</h1>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      Получихме Вашата поръчка${orderNumber ? ` #${orderNumber}` : ''} и добавихме <strong>${capsulesAdded} капсули</strong> към акаунта Ви.
    </p>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
      <p style="margin: 0 0 10px 0; font-weight: bold;">📦 Вашият TestoUP инвентар:</p>
      <p style="margin: 5px 0; font-size: 24px; color: #10B981; font-weight: bold;">${totalCapsules} капсули</p>
      <p style="margin: 5px 0; color: #666;">= ${daysAccess} дни достъп до програмата</p>
    </div>

    <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0; color: #92400E;">⚡ Важно: Завършете теста за достъп</h3>
      <p style="margin: 0; color: #92400E;">
        За да получите достъп до персонализираната си програма, трябва да завършите бързия тест.
        Той отнема само 3-5 минути и ще ни помогне да създадем план специално за Вас.
      </p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://app.testograph.eu/quiz"
         style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 18px 50px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
        Започни Теста Сега
      </a>
    </div>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin: 0 0 15px 0; font-size: 16px;">След теста ще получите:</h3>
      <ul style="margin: 0; padding-left: 20px;">
        <li style="margin: 10px 0;">✅ Персонализирани тренировки</li>
        <li style="margin: 10px 0;">✅ Хранителен план с точни препоръки</li>
        <li style="margin: 10px 0;">✅ Дневен график за TestoUP добавката</li>
        <li style="margin: 10px 0;">✅ AI Coach за мотивация и съвети</li>
        <li style="margin: 10px 0;">✅ Проследяване на прогреса</li>
      </ul>
    </div>

    <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
      Имате въпроси? Свържете се с нас на support@testograph.eu
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>© ${new Date().getFullYear()} Testograph. Всички права запазени.</p>
  </div>
</body>
</html>
`

  const textContent = `
Благодарим за покупката!

Получихме Вашата поръчка${orderNumber ? ` #${orderNumber}` : ''} и добавихме ${capsulesAdded} капсули към акаунта Ви.

📦 Вашият TestoUP инвентар:
${totalCapsules} капсули = ${daysAccess} дни достъп до програмата

⚡ ВАЖНО: Завършете теста за достъп

За да получите достъп до персонализираната си програма, трябва да завършите бързия тест.
Той отнема само 3-5 минути и ще ни помогне да създадем план специално за Вас.

👉 Започнете теста сега: https://app.testograph.eu/quiz

След теста ще получите:
- Персонализирани тренировки
- Хранителен план с точни препоръки
- Дневен график за TestoUP добавката
- AI Coach за мотивация и съвети
- Проследяване на прогреса

Имате въпроси? Свържете се с нас на support@testograph.eu
`

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Testograph <noreply@shop.testograph.eu>',
        to: email,
        subject: '🎉 Благодарим за покупката - Завършете теста за достъп',
        reply_to: 'support@testograph.eu',
        html: htmlContent,
        text: textContent,
        headers: {
          'List-Unsubscribe': '<mailto:support@testograph.eu?subject=Unsubscribe>',
          'X-Entity-Ref-ID': `purchase-notification-${Date.now()}`,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Failed to send purchase notification email:', error)
      return false
    }

    console.log('Purchase notification email sent successfully to:', email)
    return true
  } catch (error) {
    console.error('Error sending purchase notification email:', error)
    return false
  }
}

interface WelcomeEmailParams {
  email: string
  password: string
  userName?: string
  category: string
  result: QuizResult
  hasExistingCapsules?: boolean
}

export async function sendWelcomeEmail({
  email,
  password,
  userName,
  category,
  result,
  hasExistingCapsules = false,
}: WelcomeEmailParams): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    console.error('RESEND_API_KEY not configured')
    return false
  }

  const categoryNames: Record<string, string> = {
    energy: 'Енергия и Виталност',
    libido: 'Либидо и Сексуално здраве',
    muscle: 'Мускулна маса и сила',
  }

  const programName = categoryNames[category] || 'Testograph'
  const greeting = userName ? `${userName}, ` : ''

  // Format quiz results
  const levelDisplay = getScoreLevelDisplay(result.total_score)
  const levelText = {
    low: 'Ниско ниво - Нужда от подобрение',
    normal: 'Средно ниво - Добро състояние',
    high: 'Високо ниво - Отлично състояние',
  }[result.determined_level]

  const resultsHTML = `
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid ${levelDisplay.color};">
      <h3 style="margin: 0 0 15px 0; font-size: 18px; color: ${levelDisplay.color};">📊 Вашите резултати от теста</h3>

      <div style="margin-bottom: 15px;">
        <p style="margin: 5px 0;"><strong>Категория:</strong> ${programName}</p>
        <p style="margin: 5px 0;"><strong>Обща оценка:</strong> ${result.total_score}/100</p>
        <p style="margin: 5px 0; color: ${levelDisplay.color}; font-weight: bold;"><strong>Ниво:</strong> ${levelText}</p>
      </div>

      <div style="background: #f9f9f9; padding: 15px; border-radius: 6px;">
        <p style="margin: 0 0 10px 0; font-weight: bold;">Детайлна разбивка:</p>
        <ul style="margin: 0; padding-left: 20px; list-style: none;">
          <li style="margin: 5px 0;">• ${getSectionLabel('symptoms')}: ${result.breakdown.symptoms}/10</li>
          <li style="margin: 5px 0;">• ${getSectionLabel('nutrition')}: ${result.breakdown.nutrition}/10</li>
          <li style="margin: 5px 0;">• ${getSectionLabel('training')}: ${result.breakdown.training}/10</li>
          <li style="margin: 5px 0;">• ${getSectionLabel('sleep_recovery')}: ${result.breakdown.sleep_recovery}/10</li>
          <li style="margin: 5px 0;">• ${getSectionLabel('context')}: ${result.breakdown.context}/10</li>
        </ul>
      </div>
    </div>
  `

  const resultsText = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 ВАШИТЕ РЕЗУЛТАТИ ОТ ТЕСТА
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Категория: ${programName}
Обща оценка: ${result.total_score}/100
Ниво: ${levelText}

Детайлна разбивка:
• ${getSectionLabel('symptoms')}: ${result.breakdown.symptoms}/10
• ${getSectionLabel('nutrition')}: ${result.breakdown.nutrition}/10
• ${getSectionLabel('training')}: ${result.breakdown.training}/10
• ${getSectionLabel('sleep_recovery')}: ${result.breakdown.sleep_recovery}/10
• ${getSectionLabel('context')}: ${result.breakdown.context}/10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `

  // Conditional CTA based on existing capsules
  const ctaButton = hasExistingCapsules
    ? {
        text: 'Влез в Акаунта',
        url: 'https://app.testograph.eu/login',
        color: '#667eea',
      }
    : {
        text: 'Виж Офертата',
        url: 'https://shop.testograph.eu',
        color: '#10B981',
      }

  const nextStepsMessage = hasExistingCapsules
    ? '🎉 <strong>Отлично!</strong> Вече имате достъп до програмата! Влезте в акаунта си и започнете веднага.'
    : '💡 <strong>Следващи стъпки:</strong> За да получите пълен достъп и TestoUP добавката, посетете магазина и използвайте вашата отстъпка.'

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Добре дошли в Testograph</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Добре дошли в Testograph</h1>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      ${greeting}благодарим за завършването на теста!
    </p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      Вашият акаунт е създаден и имате достъп до персонализираната програма <strong>${programName}</strong>.
    </p>

    ${resultsHTML}

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
      <p style="margin: 0 0 10px 0; font-weight: bold;">Вашите данни за вход:</p>
      <p style="margin: 5px 0;"><strong>Имейл:</strong> ${email}</p>
      <p style="margin: 5px 0;"><strong>Парола:</strong> ${password}</p>
    </div>

    <p style="font-size: 14px; color: #666; margin: 20px 0;">
      ⚠️ Моля запазете тази информация на сигурно място. Препоръчваме да промените паролата си след първото влизане.
    </p>

    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin: 0 0 15px 0; font-size: 18px;">Вашата 30-дневна програма включва:</h3>
      <ul style="margin: 0; padding-left: 20px;">
        <li style="margin: 10px 0;">Персонализирани тренировки според теста</li>
        <li style="margin: 10px 0;">Хранителен план с точни препоръки</li>
        <li style="margin: 10px 0;">Дневен график за оптимални резултати</li>
        <li style="margin: 10px 0;">Проследяване на прогреса</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${ctaButton.url}"
         style="display: inline-block; background: ${ctaButton.color}; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
        ${ctaButton.text}
      </a>
    </div>

    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #856404;">
        ${nextStepsMessage}
      </p>
    </div>

    <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
      Ако имате въпроси, свържете се с нас на support@testograph.eu
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>© ${new Date().getFullYear()} Testograph. Всички права запазени.</p>
  </div>
</body>
</html>
`

  const textContent = `
Добре дошли в Testograph

${greeting}благодарим за завършването на теста!

Вашият акаунт е създаден и имате достъп до персонализираната програма ${programName}.

${resultsText}

Вашите данни за вход:
Имейл: ${email}
Парола: ${password}

⚠️ Моля запазете тази информация на сигурно място.

Вашата 30-дневна програма включва:
- Персонализирани тренировки според теста
- Хранителен план с точни препоръки
- Дневен график за оптимални резултати
- Проследяване на прогреса

${ctaButton.text}: ${ctaButton.url}

${hasExistingCapsules
  ? '🎉 Отлично! Вече имате достъп до програмата! Влезте в акаунта си и започнете веднага.'
  : '💡 Следващи стъпки: За да получите пълен достъп и TestoUP добавката, посетете магазина и използвайте вашата отстъпка.'
}

Ако имате въпроси, свържете се с нас на support@testograph.eu
`

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Testograph <noreply@shop.testograph.eu>',
        to: email,
        subject: 'Добре дошли в Testograph - Вашите данни за вход',
        reply_to: 'support@testograph.eu',
        html: htmlContent,
        text: textContent,
        headers: {
          'List-Unsubscribe': '<mailto:support@testograph.eu?subject=Unsubscribe>',
          'X-Entity-Ref-ID': `quiz-completion-${Date.now()}`,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Failed to send email:', error)
      return false
    }

    console.log('Welcome email sent successfully to:', email)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}
