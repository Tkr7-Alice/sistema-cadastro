"""adiciona nome normalizado pessoa

Revision ID: 680281cc383b
Revises: 5bb4db446d3e
Create Date: 2026-09-16 11:18:01.889523

"""

import unicodedata

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "680281cc383b"
down_revision = "5bb4db446d3e"
branch_labels = None
depends_on = None


def _normalizar_nome(nome: str) -> str:
    """Normaliza o nome para comparação e controle de duplicidade."""
    nome = " ".join(nome.strip().split()).upper()

    nome = unicodedata.normalize("NFD", nome)

    nome = "".join(
        caractere
        for caractere in nome
        if unicodedata.category(caractere) != "Mn"
    )

    return nome


def upgrade():
    # 1. Cria a coluna temporariamente permitindo NULL.
    op.add_column(
        "pessoas",
        sa.Column(
            "nome_normalizado",
            sa.String(length=150),
            nullable=True,
        ),
    )

    bind = op.get_bind()

    # 2. Busca os registros existentes.
    registros = bind.execute(
        sa.text(
            """
            SELECT id, nome_completo
            FROM pessoas
            ORDER BY id
            """
        )
    ).mappings().all()

    nomes_normalizados = {}

    # 3. Preenche a nova coluna.
    for registro in registros:
        nome_normalizado = _normalizar_nome(registro["nome_completo"])

        # Detecta duplicidade antes de criar o índice UNIQUE.
        if nome_normalizado in nomes_normalizados:
            primeiro_id = nomes_normalizados[nome_normalizado]

            raise RuntimeError(
                "Não foi possível concluir a migration: "
                f"os cadastros {primeiro_id} e {registro['id']} "
                f"possuem o mesmo nome normalizado "
                f"('{nome_normalizado}'). "
                "Resolva a duplicidade antes de executar a migration."
            )

        nomes_normalizados[nome_normalizado] = registro["id"]

        bind.execute(
            sa.text(
                """
                UPDATE pessoas
                SET nome_normalizado = :nome_normalizado
                WHERE id = :id
                """
            ),
            {
                "nome_normalizado": nome_normalizado,
                "id": registro["id"],
            },
        )

    # 4. Agora que todos os registros foram preenchidos,
    # torna a coluna obrigatória.
    op.alter_column(
        "pessoas",
        "nome_normalizado",
        existing_type=sa.String(length=150),
        nullable=False,
    )

    # 5. Cria índice UNIQUE para impedir duplicidades no banco.
    op.create_index(
        "ix_pessoas_nome_normalizado",
        "pessoas",
        ["nome_normalizado"],
        unique=True,
    )


def downgrade():
    # Remove o índice UNIQUE e depois a coluna.
    op.drop_index(
        "ix_pessoas_nome_normalizado",
        table_name="pessoas",
    )

    op.drop_column(
        "pessoas",
        "nome_normalizado",
    )