import { useState } from "react";

import type { ChangeEvent, FormEvent } from "react";

import { ArrowLeft, CheckCircle, UserPlus } from "lucide-react";

import { Link } from "react-router-dom";

import api from "../lib/api";

import {
  formatarTelefone,
  normalizarTelefone,
} from "../utils/telefone";

import {
  validarFormulario,
} from "../utils/validacaoFormulario";

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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErro("");
    setMensagem("");
    setSucesso(false);

    const erroValidacao = validarFormulario(
      nomeCompleto,
      telefone,
    );

    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    const nome = nomeCompleto.trim().toUpperCase();

    const telefoneNormalizado = normalizarTelefone(
      telefone,
    );

    try {
      setCarregando(true);

      await api.post("/api/pessoas", {
        nome_completo: nome,
        telefone: telefoneNormalizado,
      });

      setSucesso(true);

      setMensagem(
        "🎉 Cadastro realizado com sucesso! Seus dados foram enviados.",
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