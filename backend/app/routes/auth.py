from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token

from app.extensions import db
from app.services.admin_service import autenticar_admin


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth",
)


@auth_bp.post("/login")
def login():
    dados = request.get_json(silent=True)

    if not dados:
        return jsonify({
            "detail": "Dados de login são obrigatórios."
        }), 400

    email = dados.get("email")
    senha = dados.get("senha")

    if not isinstance(email, str) or not isinstance(senha, str):
        return jsonify({
            "detail": "Email e senha são obrigatórios."
        }), 400

    email = email.strip()

    if not email or not senha:
        return jsonify({
            "detail": "Email e senha são obrigatórios."
        }), 400

    admin = autenticar_admin(
        db.session,
        email,
        senha,
    )

    if admin is None:
        return jsonify({
            "detail": "Email ou senha inválidos."
        }), 401

    access_token = create_access_token(
        identity=str(admin.id),
    )

    return jsonify({
        "access_token": access_token,
        "token_type": "Bearer",
        "admin": {
            "id": admin.id,
            "nome": admin.nome,
            "email": admin.email,
        },
    }), 200