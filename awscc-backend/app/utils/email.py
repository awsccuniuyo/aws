import resend
import base64
from uuid import UUID
from datetime import datetime
from app.core.config import settings
from app.utils.qr import generate_qr_bytes

resend.api_key = settings.RESEND_API_KEY


def _format_event_date(dt: datetime) -> str:
    return dt.strftime("%A, %B %d, %Y at %I:%M %p")


def send_registration_confirmation(
    to_email: str,
    full_name: str,
    event_title: str,
    event_date: datetime,
    event_location: str,
    qr_token: UUID,
) -> bool:
    """
    Send immediate registration confirmation (no QR yet).
    QR is sent separately on event day.
    """
    try:
        resend.Emails.send({
            "from": f"AWS Student Builder Group Uniuyo <{settings.FROM_EMAIL}>",
            "to": [to_email],
            "subject": f"You're registered! {event_title}",
            "html": _registration_email_html(
                full_name, event_title, event_date, event_location
            ),
        })
        return True
    except Exception as e:
        print(f"[Email Error] Registration confirmation failed: {e}")
        return False


def send_event_day_email(
    to_email: str,
    full_name: str,
    event_title: str,
    event_date: datetime,
    event_location: str,
    qr_token: UUID,
) -> bool:
    """
    Send on event day with QR code attached.
    Call this from a scheduled job or admin trigger.
    """
    try:
        qr_bytes = generate_qr_bytes(qr_token)
        qr_b64 = base64.b64encode(qr_bytes).decode("utf-8")

        resend.Emails.send({
            "from": f"AWS Student Builder Group Uniuyo <{settings.FROM_EMAIL}>",
            "to": [to_email],
            "subject": f"🎉 It's today! Your entry QR code — {event_title}",
            "html": _event_day_email_html(
                full_name, event_title, event_date, event_location, qr_token
            ),
            "attachments": [
                {
                    "filename": "entry-qr-code.png",
                    "content": qr_b64,
                }
            ],
        })
        return True
    except Exception as e:
        print(f"[Email Error] Event day email failed: {e}")
        return False


# ─── Email Templates ──────────────────────────────────────────────────────────

def _registration_email_html(
    full_name: str,
    event_title: str,
    event_date: datetime,
    event_location: str,
) -> str:
    formatted_date = _format_event_date(event_date)
    return f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background:#F7F7F7;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <div style="background:#101419;padding:32px 40px;text-align:center;">
          <p style="color:#FFAA2B;font-size:13px;font-weight:600;letter-spacing:2px;margin:0 0 8px;">AWS STUDENT BUILDER GROUP</p>
          <h1 style="color:#ffffff;font-size:24px;margin:0;">University of Uyo</h1>
        </div>

        <!-- Body -->
        <div style="padding:40px;">
          <h2 style="color:#101419;font-size:20px;margin:0 0 8px;">You're in, {full_name}! 🎉</h2>
          <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">
            Your registration for <strong>{event_title}</strong> has been confirmed.
            We'll send your QR code entry pass on the morning of the event.
          </p>

          <!-- Event Details -->
          <div style="background:#F7F7F7;border-radius:12px;padding:24px;margin-bottom:24px;">
            <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#FFAA2B;letter-spacing:1px;">EVENT DETAILS</p>
            <p style="margin:0 0 8px;color:#101419;font-size:15px;">📅 {formatted_date}</p>
            <p style="margin:0;color:#101419;font-size:15px;">📍 {event_location}</p>
          </div>

          <p style="color:#555;font-size:14px;line-height:1.6;">
            Follow us for updates:<br>
            🐦 <a href="https://x.com/AWSUniuyo" style="color:#FFAA2B;">@AWSUniuyo</a> on X &nbsp;|&nbsp;
            📸 <a href="https://www.instagram.com/awsccuniuyo/" style="color:#FFAA2B;">@awsccuniuyo</a> on Instagram
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#101419;padding:24px 40px;text-align:center;">
          <p style="color:#666;font-size:12px;margin:0;">
            AWS Student Builder Group Uniuyo · University of Uyo, Uyo, Nigeria<br>
            <span style="color:#444;">This community is independently organized by students.</span>
          </p>
        </div>

      </div>
    </body>
    </html>
    """


def _event_day_email_html(
    full_name: str,
    event_title: str,
    event_date: datetime,
    event_location: str,
    qr_token: UUID,
) -> str:
    formatted_date = _format_event_date(event_date)
    return f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background:#F7F7F7;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <div style="background:#101419;padding:32px 40px;text-align:center;">
          <p style="color:#FFAA2B;font-size:13px;font-weight:600;letter-spacing:2px;margin:0 0 8px;">AWS STUDENT BUILDER GROUP</p>
          <h1 style="color:#ffffff;font-size:24px;margin:0;">Today is the day! 🚀</h1>
        </div>

        <!-- Body -->
        <div style="padding:40px;text-align:center;">
          <h2 style="color:#101419;font-size:20px;margin:0 0 8px;">Hey {full_name}!</h2>
          <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">
            <strong>{event_title}</strong> is happening today. Your QR code entry pass
            is attached to this email. Show it at the entrance to get admitted.
          </p>

          <!-- Event Details -->
          <div style="background:#F7F7F7;border-radius:12px;padding:24px;margin-bottom:24px;text-align:left;">
            <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#FFAA2B;letter-spacing:1px;">TODAY'S EVENT</p>
            <p style="margin:0 0 8px;color:#101419;font-size:15px;">📅 {formatted_date}</p>
            <p style="margin:0;color:#101419;font-size:15px;">📍 {event_location}</p>
          </div>

          <div style="background:#FFAA2B;border-radius:12px;padding:16px 24px;margin-bottom:24px;">
            <p style="margin:0;color:#101419;font-size:14px;font-weight:600;">
              📎 Your QR code is attached as <strong>entry-qr-code.png</strong>
            </p>
          </div>

          <p style="color:#555;font-size:14px;">
            Token: <code style="background:#F7F7F7;padding:4px 8px;border-radius:4px;font-size:12px;">{qr_token}</code>
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#101419;padding:24px 40px;text-align:center;">
          <p style="color:#666;font-size:12px;margin:0;">
            AWS Student Builder Group Uniuyo · University of Uyo, Uyo, Nigeria
          </p>
        </div>

      </div>
    </body>
    </html>
    """
