from sqlalchemy.orm import Session

from app.models.pessoa import Pessoa, StatusAprovacao
from app.repositories.pessoa_repository import (
    buscar_por_id,
    buscar_por_nome_e_telefone,
    listar_pessoas,
)
from app.utils.telefone import (
    normalizar_telefone,
    validar_telefone,
)


NOME_MINIMO = 3
NOME_MAXIMO = 150


def validar_nome(nome: str) -> str:
    """
    Sanitiza e valida o nome da pessoa.
    """

    if not isinstance(nome, str):
        raise ValueError("Nome completo inválido.")

    nome = " ".join(nome.strip().split())

    if not nome:
        raise ValueError("Nome completo é obrigatório.")

    if len(nome) < NOME_MINIMO:
        raise ValueError(
            "Nome completo deve possuir pelo menos 3 caracteres."
        )

    if len(nome) > NOME_MAXIMO:
        raise ValueError(
            "Nome completo deve possuir no máximo 150 caracteres."
        )

    # Impede caracteres de controle.
    if any(ord(caractere) < 32 for caractere in nome):
        raise ValueError("Nome completo contém caracteres inválidos.")

    return nome


def criar_pessoa(
    db: Session,
    nome_completo: str,
    telefone: str,
) -> Pessoa:

    nome_completo = validar_nome(nome_completo)

    if not isinstance(telefone, str):
        raise ValueError("Telefone inválido.")

    telefone = telefone.strip()

    # Primeiro valida a entrada original.
    if not validar_telefone(telefone):
        raise ValueError(
            "Telefone inválido. Informe um telefone brasileiro com DDD."
        )

    # Somente depois normaliza.
    telefone = normalizar_telefone(telefone)

    pessoa_existente = buscar_por_nome_e_telefone(
        db,
        nome_completo,
        telefone,
    )

    if pessoa_existente is not None:
        raise ValueError(
            "Já existe um cadastro com este nome e telefone."
        )

    pessoa = Pessoa(
        nome_completo=nome_completo,
        telefone=telefone,
    )

    try:
        db.add(pessoa)
        db.commit()
        db.refresh(pessoa)
    except Exception:
        db.rollback()
        raise

    return pessoa


def consultar_pessoa(
    db: Session,
    nome_completo: str,
    telefone: str,
) -> Pessoa | None:

    nome_completo = validar_nome(nome_completo)

    if not isinstance(telefone, str):
        raise ValueError("Telefone inválido.")

    telefone = telefone.strip()

    if not validar_telefone(telefone):
        raise ValueError(
            "Telefone inválido. Informe um telefone brasileiro com DDD."
        )

    telefone = normalizar_telefone(telefone)

    return buscar_por_nome_e_telefone(
        db,
        nome_completo,
        telefone,
    )


def listar_todas_pessoas(
    db: Session,
) -> list[Pessoa]:

    return listar_pessoas(db)

def aprovar_pessoa(
    db: Session,
    pessoa_id: int,
) -> Pessoa:

    pessoa = buscar_por_id(db, pessoa_id)

    if pessoa is None:
        raise ValueError("Pessoa não encontrada.")

    # Somente cadastros aguardando análise podem ser aprovados.
    if pessoa.status_aprovacao != StatusAprovacao.AGUARDANDO:
        raise ValueError(
            "Esta pessoa já foi analisada."
        )

    # ============================================================
    # REVALIDAÇÃO DE SEGURANÇA
    # ============================================================
    # Nunca confiamos somente na validação feita no cadastro.
    # Os dados podem ter sido alterados posteriormente através
    # da API, banco de dados ou outra operação administrativa.

    nome_validado = validar_nome(pessoa.nome_completo)

    if not isinstance(pessoa.telefone, str):
        raise ValueError(
            "Não é possível aprovar este cadastro: "
            "telefone inválido."
        )

    telefone = pessoa.telefone.strip()

    if not validar_telefone(telefone):
        raise ValueError(
            "Não é possível aprovar este cadastro: "
            "telefone brasileiro inválido."
        )

    telefone = normalizar_telefone(telefone)

    # Garante que o telefone armazenado esteja normalizado.
    pessoa.nome_completo = nome_validado
    pessoa.telefone = telefone

    pessoa.status_aprovacao = StatusAprovacao.APROVADO

    try:
        db.commit()
        db.refresh(pessoa)
    except Exception:
        db.rollback()
        raise

    return pessoa

def nao_aprovar_pessoa(
    db: Session,
    pessoa_id: int,
) -> Pessoa:

    pessoa = buscar_por_id(db, pessoa_id)

    if pessoa is None:
        raise ValueError("Pessoa não encontrada.")

    if pessoa.status_aprovacao != StatusAprovacao.AGUARDANDO:
        raise ValueError(
            "Esta pessoa já foi analisada."
        )

    pessoa.status_aprovacao = StatusAprovacao.NAO_APROVADO

    try:
        db.commit()
        db.refresh(pessoa)
    except Exception:
        db.rollback()
        raise

    return pessoa


def atualizar_pessoa(
    db: Session,
    pessoa_id: int,
    nome_completo: str | None = None,
    telefone: str | None = None,
) -> Pessoa:

    pessoa = buscar_por_id(db, pessoa_id)

    if pessoa is None:
        raise ValueError("Pessoa não encontrada.")

    novo_nome = pessoa.nome_completo
    novo_telefone = pessoa.telefone

    if nome_completo is not None:
        novo_nome = validar_nome(nome_completo)

    if telefone is not None:

        if not isinstance(telefone, str):
            raise ValueError("Telefone inválido.")

        telefone = telefone.strip()

        if not validar_telefone(telefone):
            raise ValueError(
                "Telefone inválido. Informe um telefone brasileiro com DDD."
            )

        novo_telefone = normalizar_telefone(telefone)

    # Verifica duplicidade com os dados finais.
    pessoa_existente = buscar_por_nome_e_telefone(
        db,
        novo_nome,
        novo_telefone,
    )

    if (
        pessoa_existente is not None
        and pessoa_existente.id != pessoa.id
    ):
        raise ValueError(
            "Já existe outro cadastro com este nome e telefone."
        )

    pessoa.nome_completo = novo_nome
    pessoa.telefone = novo_telefone

    try:
        db.commit()
        db.refresh(pessoa)
    except Exception:
        db.rollback()
        raise

    return pessoa


def excluir_pessoa(
    db: Session,
    pessoa_id: int,
) -> None:

    pessoa = buscar_por_id(db, pessoa_id)

    if pessoa is None:
        raise ValueError("Pessoa não encontrada.")

    try:
        db.delete(pessoa)
        db.commit()
    except Exception:
        db.rollback()
        raise


def buscar_pessoa_por_id(
    db: Session,
    pessoa_id: int,
) -> Pessoa | None:

    return buscar_por_id(db, pessoa_id)