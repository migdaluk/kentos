import { NextRequest, NextResponse } from 'next/server'

const NOTION_DATABASE_ID = '9550ab7be4da400daf0bdf00da6ded10'
const TEAM_EMAILS = ['lukasz@kentos.ai', 'tomasz@kentos.ai']

function welcomeHtml(email: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>You're on the list — kentos.ai</title>
</head>
<body style="margin:0;padding:0;background:#F5F1EB;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F1EB;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo -->
          <tr>
            <td style="padding:0 0 40px 0;">
              <img src="https://kentos.ai/logo-email.svg" alt="kentos.ai" width="120" height="32" style="display:block;border:0;">
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="height:1px;background:#0A0A0A;margin-bottom:40px;display:block;">&nbsp;</td></tr>

          <!-- Body -->
          <tr>
            <td style="padding:12px 0 32px 0;">
              <p style="font-size:15px;line-height:1.6;color:#3A3531;margin:0 0 20px 0;">
                Hi,
              </p>
              <p style="font-size:15px;line-height:1.6;color:#3A3531;margin:0 0 20px 0;">
                We got your email — <strong style="color:#0A0A0A;">${email}</strong> is on the list.
              </p>
              <p style="font-size:15px;line-height:1.6;color:#3A3531;margin:0 0 20px 0;">
                We're talking to finance and engineering leaders about how AI spend actually works
                inside their orgs — before we build anything. No pitch, no demo. Just a conversation.
              </p>
              <p style="font-size:15px;line-height:1.6;color:#3A3531;margin:0;">
                We'll be in touch personally.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 0 40px 0;">
              <a href="https://calendly.com/tomasz-kentos/30min"
                 style="display:inline-block;background:#0A0A0A;color:#F5F1EB;font-size:13px;font-weight:600;letter-spacing:0.01em;padding:12px 24px;text-decoration:none;">
                Book a call instead →
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="height:1px;background:#C7C2B8;">&nbsp;</td></tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 0 0 0;">
              <p style="font-size:13px;color:#7A746E;margin:0 0 4px 0;">—</p>
              <p style="font-size:13px;font-weight:700;color:#0A0A0A;margin:0 0 2px 0;">Tomasz Rudolf &amp; Łukasz Migda</p>
              <p style="font-size:13px;color:#7A746E;margin:0 0 16px 0;">Co-founders · Kentos.</p>
              <p style="font-size:11px;letter-spacing:0.1em;font-family:'Courier New',Courier,monospace;color:#7A746E;margin:0;text-transform:lowercase;">
                close the open bar._
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

async function addToNotion(email: string, source: string) {
  const token = process.env.NOTION_TOKEN
  if (!token) return

  await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        Email:  { title: [{ text: { content: email } }] },
        Source: { select: { name: source } },
        Status: { select: { name: 'New' } },
      },
    }),
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const email  = typeof body?.email  === 'string' ? body.email.trim().toLowerCase() : ''
  const source = typeof body?.source === 'string' ? body.source : '/'

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Run Resend + Notion in parallel
  const tasks: Promise<unknown>[] = [addToNotion(email, source)]

  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Welcome email → user
    tasks.push(
      resend.emails.send({
        from: 'kentos.ai <contact@kentos.ai>',
        to: email,
        subject: 'You\'re on the list — kentos.ai',
        html: welcomeHtml(email),
      })
    )

    // Notification → team
    tasks.push(
      resend.emails.send({
        from: 'Kentos Waitlist <contact@kentos.ai>',
        to: TEAM_EMAILS,
        subject: `New waitlist signup: ${email}`,
        text: `${email} just signed up via ${source}.`,
      })
    )
  }

  await Promise.all(tasks)

  return NextResponse.json({ ok: true })
}
