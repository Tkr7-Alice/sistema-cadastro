const DDDS_VALIDOS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

export function normalizarTelefone(valor: string): string {
  return valor.replace(/\D/g, "").slice(0, 11);
}

export function formatarTelefone(valor: string): string {
  const numeros = normalizarTelefone(valor);

  if (numeros.length === 0) {
    return "";
  }

  if (numeros.length <= 2) {
    return `(${numeros}`;
  }

  if (numeros.length <= 6) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  }

  if (numeros.length <= 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  }

  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

export function validarTelefone(valor: string): boolean {
  const numeros = normalizarTelefone(valor);

  // Telefone brasileiro deve possuir 10 ou 11 dígitos.
  if (numeros.length !== 10 && numeros.length !== 11) {
    return false;
  }

  const ddd = Number(numeros.slice(0, 2));

  // Verifica se o DDD é válido.
  if (!DDDS_VALIDOS.has(ddd)) {
    return false;
  }

  const numero = numeros.slice(2);

  // Celular: 9 dígitos e começa com 9.
  if (numero.length === 9) {
    if (!numero.startsWith("9")) {
      return false;
    }
  }

  // Telefone fixo: 8 dígitos e começa entre 2 e 5.
  else if (numero.length === 8) {
    if (!"2345".includes(numero[0])) {
      return false;
    }
  }

  else {
    return false;
  }

  // Impede números totalmente repetidos.
  // Exemplos: 999999999, 22222222.
  if (new Set(numero).size === 1) {
    return false;
  }

  return true;
}