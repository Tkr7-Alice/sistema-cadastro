import { validarTelefone } from "./telefone";

export function validarNome(nome: string): string | null {
  const valor = nome.trim();

  if (!valor) {
    return "Informe seu nome completo.";
  }

  if (valor.length < 3) {
    return "O nome deve possuir pelo menos 3 caracteres.";
  }

  if (valor.length > 150) {
    return "O nome deve possuir no máximo 150 caracteres.";
  }

  // Permite letras, acentos, espaços, hífen e apóstrofo.
  // Exige pelo menos nome e sobrenome.
  if (!/^[A-Za-zÀ-ÿ]+(?:[ '-][A-Za-zÀ-ÿ]+)+$/.test(valor)) {
    return "Informe nome e sobrenome utilizando apenas letras.";
  }

  return null;
}

export function validarFormulario(
  nome: string,
  telefone: string,
): string | null {
  const erroNome = validarNome(nome);

  if (erroNome) {
    return erroNome;
  }

  if (!validarTelefone(telefone)) {
    const numeros = telefone.replace(/\D/g, "");

    if (numeros.length < 10) {
      return "Informe um telefone completo com DDD.";
    }

    return "Informe um telefone brasileiro válido com DDD.";
  }

  return null;
}