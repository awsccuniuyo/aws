import qrcode
import qrcode.image.svg
from io import BytesIO
import base64
from uuid import UUID
from app.core.config import settings


def generate_qr_base64(qr_token: UUID) -> str:
    """Generate a QR code image as a base64 string for email embedding."""
    check_in_url = f"{settings.FRONTEND_URL}/checkin/{qr_token}"

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(check_in_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#101419", back_color="white")

    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    return base64.b64encode(buffer.read()).decode("utf-8")


def generate_qr_bytes(qr_token: UUID) -> bytes:
    """Generate a QR code image as raw bytes (for attachments)."""
    check_in_url = f"{settings.FRONTEND_URL}/checkin/{qr_token}"

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(check_in_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#101419", back_color="white")

    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    return buffer.read()
