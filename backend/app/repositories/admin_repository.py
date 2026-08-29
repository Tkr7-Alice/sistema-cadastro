from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.admin import Admin


def buscar_por_email(
    db: Session,
    email: str,
) -> Admin | None:
    stmt = select(Admin).where(
        Admin.email == email.strip().lower()
    )

    return db.scalar(stmt)