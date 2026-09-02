from flask import Flask, jsonify
from flask_cors import CORS

from app.core.config import settings
from app.extensions import db, migrate, jwt
from app.commands import registrar_comandos


def create_app():
    app = Flask(__name__)

    database_url = settings.database_url

    if database_url and database_url.startswith("postgresql://"):
        database_url = database_url.replace(
            "postgresql://",
            "postgresql+psycopg://",
            1,
        )

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    app.config["JWT_SECRET_KEY"] = settings.jwt_secret
    app.config["JWT_ALGORITHM"] = settings.jwt_algorithm

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    cors_origins = settings.cors_origins

    if isinstance(cors_origins, str):
        cors_origins = [
            origin.strip()
            for origin in cors_origins.split(",")
            if origin.strip()
        ]

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": cors_origins,
                "methods": [
                    "GET",
                    "POST",
                    "PATCH",
                    "DELETE",
                    "OPTIONS",
                ],
                "allow_headers": [
                    "Content-Type",
                    "Authorization",
                ],
            }
        },
        supports_credentials=True,
    )
    from app.routes.pessoas import pessoas_bp
    from app.routes.auth import auth_bp

    app.register_blueprint(pessoas_bp)
    app.register_blueprint(auth_bp)

    registrar_comandos(app)

    @app.get("/")
    def root():
        return {
            "status": "ok",
            "message": "API Sistema Cadastro funcionando",
        }

    @app.get("/health")
    def health_check():
        return {
            "status": "ok",
            "message": "Sistema funcionando",
        }

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "detail": "Recurso não encontrado.",
        }), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            "detail": "Erro interno do servidor.",
        }), 500

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({
            "detail": "Método não permitido.",
        }), 405

    return app