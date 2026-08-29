from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.services.pessoa_service import (
    consultar_pessoa,
    criar_pessoa,
    listar_todas_pessoas,
    aprovar_pessoa,
    nao_aprovar_pessoa,
    buscar_pessoa_por_id,
    atualizar_pessoa,
    excluir_pessoa,
)


pessoas_bp = Blueprint(
    "pessoas",
    __name__,
    url_prefix="/api/pessoas",
)


# ============================================================
# CADASTRO PÚBLICO
# ============================================================

@pessoas_bp.post("")
def cadastrar_pessoa():
    dados = request.get_json(silent=True)

    if not dados:
        return jsonify({
            "detail": "Dados da pessoa são obrigatórios."
        }), 400

    nome_completo = dados.get("nome_completo")
    telefone = dados.get("telefone")

    if not nome_completo or not telefone:
        return jsonify({
            "detail": "Nome completo e telefone são obrigatórios."
        }), 400

    try:
        pessoa = criar_pessoa(
            db.session,
            nome_completo,
            telefone,
        )
    except ValueError as exc:
        return jsonify({
            "detail": str(exc)
        }), 409

    return jsonify({
        "id": pessoa.id,
        "nome_completo": pessoa.nome_completo,
        "telefone": pessoa.telefone,
        "status_aprovacao": pessoa.status_aprovacao.value,
        "status_cadastro": pessoa.status_cadastro.value,
        "created_at": pessoa.created_at.isoformat(),
    }), 201


# ============================================================
# CONSULTA PÚBLICA
# ============================================================

@pessoas_bp.get("/consulta")
def consultar_status():
    nome_completo = request.args.get("nome_completo")
    telefone = request.args.get("telefone")

    if not nome_completo or not telefone:
        return jsonify({
            "detail": "Nome completo e telefone são obrigatórios."
        }), 400

    pessoa = consultar_pessoa(
        db.session,
        nome_completo,
        telefone,
    )

    if pessoa is None:
        return jsonify({
            "detail": "Cadastro não encontrado."
        }), 404

    return jsonify({
        "nome_completo": pessoa.nome_completo,
        "status_aprovacao": pessoa.status_aprovacao.value,
    }), 200


# ============================================================
# ÁREA ADMINISTRATIVA
# ============================================================

@pessoas_bp.get("")
@jwt_required()
def listar_pessoas():
    pessoas = listar_todas_pessoas(db.session)

    return jsonify([
        {
            "id": pessoa.id,
            "nome_completo": pessoa.nome_completo,
            "telefone": pessoa.telefone,
            "status_aprovacao": pessoa.status_aprovacao.value,
            "status_cadastro": pessoa.status_cadastro.value,
            "created_at": pessoa.created_at.isoformat(),
        }
        for pessoa in pessoas
    ]), 200


@pessoas_bp.get("/<int:pessoa_id>")
@jwt_required()
def consultar_pessoa_por_id(pessoa_id: int):
    pessoa = buscar_pessoa_por_id(
        db.session,
        pessoa_id,
    )

    if pessoa is None:
        return jsonify({
            "detail": "Pessoa não encontrada."
        }), 404

    return jsonify({
        "id": pessoa.id,
        "nome_completo": pessoa.nome_completo,
        "telefone": pessoa.telefone,
        "status_aprovacao": pessoa.status_aprovacao.value,
        "status_cadastro": pessoa.status_cadastro.value,
        "data_entrevista": (
            pessoa.data_entrevista.isoformat()
            if pessoa.data_entrevista
            else None
        ),
        "created_at": pessoa.created_at.isoformat(),
        "updated_at": pessoa.updated_at.isoformat(),
    }), 200


@pessoas_bp.patch("/<int:pessoa_id>/aprovar")
@jwt_required()
def aprovar(pessoa_id: int):
    try:
        pessoa = aprovar_pessoa(
            db.session,
            pessoa_id,
        )
    except ValueError as exc:
        mensagem = str(exc)

        if mensagem == "Pessoa não encontrada.":
            return jsonify({
                "detail": mensagem
            }), 404

        return jsonify({
            "detail": mensagem
        }), 409

    return jsonify({
        "id": pessoa.id,
        "nome_completo": pessoa.nome_completo,
        "telefone": pessoa.telefone,
        "status_aprovacao": pessoa.status_aprovacao.value,
        "status_cadastro": pessoa.status_cadastro.value,
    }), 200


@pessoas_bp.patch("/<int:pessoa_id>/nao-aprovar")
@jwt_required()
def nao_aprovar(pessoa_id: int):
    try:
        pessoa = nao_aprovar_pessoa(
            db.session,
            pessoa_id,
        )
    except ValueError as exc:
        mensagem = str(exc)

        if mensagem == "Pessoa não encontrada.":
            return jsonify({
                "detail": mensagem
            }), 404

        return jsonify({
            "detail": mensagem
        }), 409

    return jsonify({
        "id": pessoa.id,
        "nome_completo": pessoa.nome_completo,
        "telefone": pessoa.telefone,
        "status_aprovacao": pessoa.status_aprovacao.value,
        "status_cadastro": pessoa.status_cadastro.value,
    }), 200


@pessoas_bp.patch("/<int:pessoa_id>")
@jwt_required()
def atualizar(pessoa_id: int):
    dados = request.get_json(silent=True)

    if not dados:
        return jsonify({
            "detail": "Informe os dados para atualização."
        }), 400

    nome_completo = dados.get("nome_completo")
    telefone = dados.get("telefone")

    if nome_completo is None and telefone is None:
        return jsonify({
            "detail": "Informe nome_completo ou telefone."
        }), 400

    try:
        pessoa = atualizar_pessoa(
            db.session,
            pessoa_id,
            nome_completo,
            telefone,
        )
    except ValueError as exc:
        mensagem = str(exc)

        if mensagem == "Pessoa não encontrada.":
            return jsonify({
                "detail": mensagem
            }), 404

        return jsonify({
            "detail": mensagem
        }), 409

    return jsonify({
        "id": pessoa.id,
        "nome_completo": pessoa.nome_completo,
        "telefone": pessoa.telefone,
        "status_aprovacao": pessoa.status_aprovacao.value,
        "status_cadastro": pessoa.status_cadastro.value,
        "data_entrevista": (
            pessoa.data_entrevista.isoformat()
            if pessoa.data_entrevista
            else None
        ),
        "created_at": pessoa.created_at.isoformat(),
        "updated_at": pessoa.updated_at.isoformat(),
    }), 200


@pessoas_bp.delete("/<int:pessoa_id>")
@jwt_required()
def excluir_pessoa_por_id(pessoa_id: int):
    try:
        excluir_pessoa(
            db.session,
            pessoa_id,
        )
    except ValueError as exc:
        return jsonify({
            "detail": str(exc)
        }), 404

    return jsonify({
        "message": "Pessoa excluída com sucesso."
    }), 200