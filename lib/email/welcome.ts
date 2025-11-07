/**
 * Send welcome email with login credentials after quiz completion
 * Uses Resend API
 */

interface WelcomeEmailParams {
  email: string
  password: string
  userName?: string
  category: string
}

export async function sendWelcomeEmail({
  email,
  password,
  userName,
  category,
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
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'}/login"
         style="display: inline-block; background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
        Влез в Акаунта
      </a>
    </div>

    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #856404;">
        💡 <strong>Следващи стъпки:</strong> За да получите пълен достъп и TestoUP добавката, посетете магазина и използвайте вашата отстъпка.
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

Вашите данни за вход:
Имейл: ${email}
Парола: ${password}

⚠️ Моля запазете тази информация на сигурно място.

Вашата 30-дневна програма включва:
- Персонализирани тренировки според теста
- Хранителен план с точни препоръки
- Дневен график за оптимални резултати
- Проследяване на прогреса

Влезте в акаунта си тук: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010'}/login

💡 Следващи стъпки: За да получите пълен достъп и TestoUP добавката, посетете магазина и използвайте вашата отстъпка.

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
