import { useState } from "react";

import type { FormEvent } from "react";

import {
  ArrowLeft,
  Search,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../lib/api";

import {
  formatarTelefone,
  normalizarTelefone,
} from "../utils/telefone";

import {
  validarFormulario,
} from "../utils/validacaoFormulario";

type ResultadoConsulta = {
  nome_completo: string;
  status_aprovacao:
    | "AGUARDANDO"
    | "APROVADO"
    | "NAO_APROVADO";
};

export function ConsultaPage() {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [telefone, setTelefone] = useState("");

  const [resultado, setResultado] =
    useState<ResultadoConsulta | null>(null);

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErro("");
    setResultado(null);

    const erroValidacao = validarFormulario(
      nomeCompleto,
      telefone,
    );

    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    try {
      setCarregando(true);

      const resposta = await api.get(
        "/api/pessoas/consulta",
        {
          params: {
            nome_completo: nomeCompleto.trim(),
            telefone: normalizarTelefone(telefone),
          },
        },
      );

      setResultado(resposta.data);
    } catch (error: any) {
      const detalhe =
        error?.response?.data?.detail ||
        "Não foi possível consultar o cadastro.";

      setErro(detalhe);
    } finally {
      setCarregando(false);
    }
  }

  function renderStatus() {
    if (!resultado) {
      return null;
    }

    if (
      resultado.status_aprovacao === "APROVADO"
    ) {
      return (
        <div className="result-card approved">
          <CheckCircle size={32} />

          <div>
            <strong>
              Cadastro aprovado
            </strong>

            <p>
              Seu cadastro foi aprovado com sucesso.
            </p>
          </div>
        </div>
      );
    }

    if (
      resultado.status_aprovacao === "NAO_APROVADO"
    ) {
      return (
        <div className="result-card rejected">
          <XCircle size={32} />

          <div>
            <strong>
              Cadastro não aprovado
            </strong>

            <p>
              Seu cadastro não foi aprovado.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="result-card pending">
        <Clock size={32} />

        <div>
          <strong>
            Cadastro aguardando análise
          </strong>

          <p>
            Seu cadastro está aguardando análise.
          </p>
        </div>
      </div>
    );
  }

  const formularioValido =
    validarFormulario(nomeCompleto, telefone) === null &&
    !carregando;

  return (
    <main className="page-container">
      <section className="form-card">
        <Link
          to="/"
          className="back-link"
        >
          <ArrowLeft size={18} />
          Voltar
        </Link>

        <div className="form-icon">
          <Search size={28} />
        </div>

        <h1>Consultar cadastro</h1>

        <p>
          Informe seu nome completo e telefone para consultar
          o status do seu cadastro.
        </p>

        {erro && (
          <div className="error-message">
            {erro}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
        >
          <label htmlFor="nome">
            Nome completo
          </label>

          <input
            id="nome"
            type="text"
            value={nomeCompleto}
            onChange={(event) => {
              setNomeCompleto(
                event.target.value.toUpperCase(),
              );

              setErro("");
              setResultado(null);
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
            onChange={(event) => {
              setTelefone(
                formatarTelefone(
                  event.target.value,
                ),
              );

              setErro("");
              setResultado(null);
            }}
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
            <Search size={20} />

            {carregando
              ? "Consultando..."
              : "Consultar"}
          </button>
        </form>

        {renderStatus()}
      </section>
    </main>
  );
}