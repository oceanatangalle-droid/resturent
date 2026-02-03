/**
 * Send email via Gmail API (OAuth2).
 * Requires in .env:
 *   GOOGLE_CLIENT_ID
 *   GOOGLE_CLIENT_SECRET
 *   GOOGLE_REFRESH_TOKEN  (get once via OAuth2 flow - see README)
 */

import { google } from 'googleapis'

function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Gmail: set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN in .env'
    )
  }
  const oauth2 = new google.auth.OAuth2(clientId, clientSecret, 'urn:ietf:wg:oauth:2.0:oob')
  oauth2.setCredentials({ refresh_token: refreshToken })
  return oauth2
}

/**
 * Send an email using Gmail API.
 * @param to - recipient email
 * @param subject - subject line
 * @param html - HTML body (or use text for plain)
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const auth = getOAuth2Client()
  const gmail = google.gmail({ version: 'v1', auth })
  const message = [
    'Content-Type: text/html; charset="UTF-8"',
    'MIME-Version: 1.0',
    `To: ${to}`,
    `Subject: ${subject}`,
    '',
    html,
  ].join('\r\n')
  const raw = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw },
  })
}
