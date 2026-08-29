import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ArrowLeft, CheckCircle, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../lib/api";

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

function normalizarTelefone(valor: string): string {
  return valor.replace(/\D/g, "").slice(0, 11);
}

function formatarTelefone(valor: string): string {
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

function validarTelefone(telefone: string): boolean {
  const numeros = normalizarTelefone(telefone);

  if (numeros.length !== 10 && numeros.length !== 11) {
    return false;
  }

  const ddd = Number(numeros.slice(0, 2));

  if (!DDDS_VALIDOS.has(ddd)) {
    return false;
  }

  const numero = numeros.slice(2);

  if (numero.length === 9) {
    if (!numero.startsWith("9")) {
      return false;
    }
  } else if (numero.length === 8) {
    if (!"2345".includes(numero[0])) {
      return false;
    }
  } else {
    return false;
  }

  if (new Set(numero).size === 1) {
    return false;
  }

  return true;
}

function validarNome(nome: string): string | null {
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
  if (!/^[A-Za-zÀ-ÿ]+(?:[ '-][A-Za-zÀ-ÿ]+)+$/.test(valor)) {
    return "Informe nome e sobrenome utilizando apenas letras.";
  }

  return null;
}

export function CadastroPage() {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [telefone, setTelefone] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  function limparErro() {
    if (erro) {
      setErro("");
    }
  }

  function handleTelefoneChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setTelefone(formatarTelefone(event.target.value));
    limparErro();
  }

  function validarFormulario(): string | null {
    const erroNome = validarNome(nomeCompleto);

    if (erroNome) {
      return erroNome;
    }

    if (!validarTelefone(telefone)) {
      const quantidade = normalizarTelefone(telefone).length;

      if (quantidade < 10) {
        return "Informe um telefone completo com DDD.";
      }

      return "Informe um telefone brasileiro válido com DDD.";
    }

    return null;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErro("");
    setMensagem("");
    setSucesso(false);

    const erroValidacao = validarFormulario();

    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    const nome = nomeCompleto.trim();
    const telefoneNormalizado = normalizarTelefone(telefone);

    try {
      setCarregando(true);

      const resposta = await api.post("/api/pessoas", {
        nome_completo: nome,
        telefone: telefoneNormalizado,
      });

      setSucesso(true);

      setMensagem(
        `Cadastro realizado com sucesso. Número do cadastro: ${resposta.data.id}.`,
      );

      setNomeCompleto("");
      setTelefone("");
    } catch (error: any) {
      const detalhe =
        error?.response?.data?.detail ||
        "Não foi possível realizar o cadastro. Tente novamente.";

      setErro(detalhe);
    } finally {
      setCarregando(false);
    }
  }

  const nomeValido = validarNome(nomeCompleto) === null;
  const telefoneValido = validarTelefone(telefone);

  const formularioValido =
    nomeValido &&
    telefoneValido &&
    !carregando;

  return (
    <main className="page-container">
      <section className="form-card">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} />
          Voltar
        </Link>

        <div className="form-icon">
          {sucesso ? (
            <CheckCircle size={28} />
          ) : (
            <UserPlus size={28} />
          )}
        </div>

        <h1>Realizar cadastro</h1>

        <p>
          Informe seu nome completo e telefone para realizar
          seu cadastro.
        </p>

        {sucesso && (
          <div className="success-message">
            {mensagem}
          </div>
        )}

        {erro && (
          <div className="error-message">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="nome">
            Nome completo
          </label>

          <input
            id="nome"
            type="text"
            value={nomeCompleto}
            onChange={(event) => {
              setNomeCompleto(event.target.value);
              limparErro();
            }}
            placeholder="Digite seu nome completo"
            autoComplete="name"
            maxLength={150}
            disabled={carregando}
            required
          />

          <label htmlFor="telefone">
            Telefone
          </label>

          <input
            id="telefone"
            type="tel"
            value={telefone}
            onChange={handleTelefoneChange}
            placeholder="(00) 00000-0000"
            autoComplete="tel"
            inputMode="numeric"
            maxLength={15}
            disabled={carregando}
            required
          />

          <button
            type="submit"
            className="primary-button"
            disabled={!formularioValido}
          >
            <UserPlus size={20} />

            {carregando
              ? "Enviando..."
              : "Cadastrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
