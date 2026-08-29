import re
import secrets
from datetime import datetime, timedelta, timezone

import click
from flask import Flask
from sqlalchemy import select

from app.extensions import db
from app.models.admin import Admin


def registrar_comandos(app: Flask) -> None:

    @app.cli.group()
    def admin():
        """Comandos administrativos do sistema."""

    @admin.command("criar")
    def criar_admin():
        """Cria um administrador com segurança."""

        nome = click.prompt("Nome completo").strip()
        email = click.prompt("E-mail").strip().lower()
        telefone = click.prompt("Telefone").strip()

        if not nome:
            raise click.ClickException(
                "O nome é obrigatório."
            )

        if not re.fullmatch(
            r"^[^@\s]+@[^@\s]+\.[^@\s]+$",
            email,
        ):
            raise click.ClickException(
                "Informe um e-mail válido."
            )

        telefone_numeros = re.sub(
            r"\D",
            "",
            telefone,
        )

        if len(telefone_numeros) not in (10, 11):
            raise click.ClickException(
                "Telefone inválido. Informe DDD + número."
            )

        existente = db.session.scalar(
            select(Admin).where(
                Admin.email == email
            )
        )

        if existente:
            raise click.ClickException(
                "Já existe um Admin com este e-mail."
            )

        senha = click.prompt(
            "Senha",
            hide_input=True,
            confirmation_prompt="Confirmar senha",
        )

        if len(senha) < 8:
            raise click.ClickException(
                "A senha deve possuir pelo menos 8 caracteres."
            )

        admin = Admin(
            nome=nome,
            email=email,
            telefone=telefone_numeros,
            ativo=True,
            email_verificado=False,
            token_verificacao=secrets.token_urlsafe(48),
            token_verificacao_expira_em=(
                datetime.now(timezone.utc)
                + timedelta(hours=24)
            ),
        )

        admin.definir_senha(senha)

        db.session.add(admin)
        db.session.commit()

        click.echo("")
        click.echo("Admin criado com sucesso.")
        click.echo(f"ID: {admin.id}")
        click.echo(f"Nome: {admin.nome}")
        click.echo(f"E-mail: {admin.email}")
        click.echo(f"Telefone: {admin.telefone}")
        click.echo("E-mail verificado: NÃO")
        click.echo("Token de verificação gerado.")