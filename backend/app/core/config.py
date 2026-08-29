import os
import sys

from dotenv import load_dotenv


load_dotenv()


class Settings:
    database_url = os.getenv("DATABASE_URL")
    jwt_secret = os.getenv("JWT_SECRET")
    jwt_algorithm = os.getenv("JWT_ALGORITHM", "HS256")
    cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173")

    def validar(self) -> None:
        erros = []

        if not self.database_url:
            erros.append("DATABASE_URL não configurada.")

        if not self.jwt_secret:
            erros.append("JWT_SECRET não configurada.")

        if erros:
            for erro in erros:
                print(f"ERRO: {erro}", file=sys.stderr)
            sys.exit(1)


settings = Settings()
settings.validar()