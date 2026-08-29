from sqlalchemy.orm import Session

from app.models.admin import Admin
from app.repositories.admin_repository import buscar_por_email


def autenticar_admin(
    db: Session,
    email: str,
    senha: str,
) -> Admin | None:
    admin = buscar_por_email(db, email)

    if admin is None:
        return None

    if not admin.ativo:
        return None

    if not admin.verificar_senha(senha):
        return None

    return admin