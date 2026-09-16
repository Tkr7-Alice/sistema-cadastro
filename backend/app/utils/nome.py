import unicodedata


def normalizar_nome(nome: str) -> str:
    """
    Normaliza o nome para comparação e controle de duplicidade.

    Remove acentos, normaliza espaços e converte para maiúsculas.
    """
    nome = " ".join(nome.strip().split()).upper()

    nome = unicodedata.normalize("NFD", nome)

    nome = "".join(
        caractere
        for caractere in nome
        if unicodedata.category(caractere) != "Mn"
    )

    return nome