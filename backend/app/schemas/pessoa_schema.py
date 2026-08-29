from dataclasses import dataclass


@dataclass
class CriarPessoaSchema:
    nome_completo: str
    telefone: str


@dataclass
class AtualizarPessoaSchema:
    nome_completo: str | None = None
    telefone: str | None = None