import re


DDDS_VALIDOS = {
    11, 12, 13, 14, 15, 16, 17, 18, 19,
    21, 22, 24, 27, 28,
    31, 32, 33, 34, 35, 37, 38,
    41, 42, 43, 44, 45, 46,
    47, 48, 49,
    51, 53, 54, 55,
    61, 62, 63, 64, 65, 66, 67,
    68, 69,
    71, 73, 74, 75, 77, 79,
    81, 82, 83, 84, 85, 86, 87, 88, 89,
    91, 92, 93, 94, 95, 96, 97, 98, 99,
}


def normalizar_telefone(telefone: str) -> str:
    if not isinstance(telefone, str):
        return ""

    return re.sub(r"\D", "", telefone)


def validar_telefone(telefone: str) -> bool:
    if not isinstance(telefone, str):
        return False

    telefone = telefone.strip()

    # Rejeita letras e caracteres estranhos.
    # Permite apenas números e caracteres de formatação.
    if not re.fullmatch(r"[\d\s().+-]+", telefone):
        return False

    telefone = normalizar_telefone(telefone)

    if len(telefone) not in (10, 11):
        return False

    ddd = int(telefone[:2])

    if ddd not in DDDS_VALIDOS:
        return False

    numero = telefone[2:]

    # Celular
    if len(numero) == 9:
        if not numero.startswith("9"):
            return False

        if len(set(numero)) == 1:
            return False

        return True

    # Telefone fixo
    if len(numero) == 8:
        if numero[0] not in "2345":
            return False

        if len(set(numero)) == 1:
            return False

        return True

    return False


def formatar_telefone(telefone: str) -> str:
    telefone = normalizar_telefone(telefone)

    if len(telefone) == 11:
        return f"({telefone[:2]}) {telefone[2:7]}-{telefone[7:]}"

    if len(telefone) == 10:
        return f"({telefone[:2]}) {telefone[2:6]}-{telefone[6:]}"

    return telefone