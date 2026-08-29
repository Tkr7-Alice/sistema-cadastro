from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.pessoa import Pessoa

def buscar_por_id(
    db: Session,
    pessoa_id: int,
) -> Pessoa | None:
    
    return db.get(Pessoa, pessoa_id)

def buscar_por_nome_e_telefone(
    db: Session,
    nome_completo: str,
    telefone: str,
) -> Pessoa | None:

    stmt = (
        select(Pessoa)
        .where(
            Pessoa.nome_completo == nome_completo,
            Pessoa.telefone == telefone,
        )
    )

    return db.scalar(stmt)

def listar_pessoas(
    db: Session,
) -> list[Pessoa]:

    stmt = (
        select(Pessoa)
        .order_by(Pessoa.created_at.desc())
    )

    return list(db.scalars(stmt).all())

def excluir_pessoa(
    db: Session,
    pessoa: Pessoa,
) -> None:
    db.delete(pessoa)
    db.commit()