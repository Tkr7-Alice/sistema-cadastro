import re
import unicodedata


NOME_MINIMO = 5
NOME_MAXIMO = 150


def normalizar_nome(nome: str) -> str:
    """
    Remove espaços desnecessários e normaliza o texto.
    """

    if not isinstance(nome, str):
        return ""

    nome = unicodedata.normalize("NFC", nome)
    nome = " ".join(nome.strip().split())

    return nome


def validar_nome(nome: str) -> bool:
    """
    Valida nome completo.
    """

    nome = normalizar_nome(nome)

    if not nome:
        return False

    if len(nome) < NOME_MINIMO:
        return False

    if len(nome) > NOME_MAXIMO:
        return False

    # Permite letras, espaços, hífen e apóstrofo.
    if not re.fullmatch(r"[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)+", nome):
        return False

    # Garante pelo menos nome + sobrenome.
    palavras = nome.split()

    if len(palavras) < 2:
        return False

    return True