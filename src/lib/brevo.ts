
/**
 * Server-side utility for sending emails via Brevo API.
 */
export async function sendEmailOtp(toEmail: string, otp: string) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'ericksurbakti39@gmail.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'TUAI - Your PlantBot Friends';

  if (!apiKey) {
    console.error('Brevo API key missing in environment variables.');
    throw new Error('Email service configuration error.');
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: [{ email: toEmail }],
        subject: `${otp} is your TUAI Access Code`,
        htmlContent: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08);">
              <div style="background-color: #205b5a; padding: 40px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 32px; letter-spacing: 4px; font-weight: 800;">TUAI</h1>
                <p style="color: #ffffff; opacity: 0.8; margin-top: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Intelligent Agriculture</p>
              </div>
              <div style="padding: 50px; text-align: center;">
                <h2 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px; font-weight: 700;">Verification Code</h2>
                <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 40px;">Hello Farmer! Use the code below to securely access your TUAI dashboard. This code is valid for 10 minutes.</p>
                <div style="background-color: #f0f7f7; border: 2px dashed #205b5a; border-radius: 20px; padding: 25px; font-size: 42px; font-weight: 800; letter-spacing: 15px; color: #205b5a; display: inline-block;">
                  ${otp}
                </div>
                <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #eeeeee;">
                  <p style="color: #999999; font-size: 12px; line-height: 1.5;">If you didn't request this code, you can safely ignore this email. Someone might have typed your email address by mistake.</p>
                </div>
              </div>
              <div style="background-color: #fbfbfb; padding: 30px; text-align: center; color: #aaaaaa; font-size: 11px; letter-spacing: 0.5px;">
                Sent with ❤️ from <b>TUAI - Your PlantBot Friends</b><br/>
                © 2024 TUAI Agriculture Intelligence. All Rights Reserved.
              </div>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API Error Detail:', JSON.stringify(errorData, null, 2));
      throw new Error(`Brevo service error: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Failed to send email via Brevo:', err);
    throw err;
  }
}
