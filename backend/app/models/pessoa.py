from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import DateTime, Enum as SQLEnum, String
from sqlalchemy.orm import Mapped, mapped_column

from app.extensions import db


class StatusAprovacao(str, Enum):
    AGUARDANDO = "AGUARDANDO"
    APROVADO = "APROVADO"
    NAO_APROVADO = "NAO_APROVADO"


class StatusCadastro(str, Enum):
    ABERTO = "ABERTO"
    FECHADO = "FECHADO"


class Pessoa(db.Model):
    __tablename__ = "pessoas"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    nome_completo: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    telefone: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        index=True,
    )

    status_aprovacao: Mapped[StatusAprovacao] = mapped_column(
        SQLEnum(StatusAprovacao),
        nullable=False,
        default=StatusAprovacao.AGUARDANDO,
        index=True,
    )

    status_cadastro: Mapped[StatusCadastro] = mapped_column(
        SQLEnum(StatusCadastro),
        nullable=False,
        default=StatusCadastro.ABERTO,
        index=True,
    )

    data_entrevista: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )