import { useState } from "react";
import type { FormEvent } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LogIn } from "lucide-react";
import api from "../lib/api";
import { isAuthenticated, saveAuth } from "../lib/auth";

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    if (!email.trim() || !senha) {
      setErro("Preencha email e senha.");
      return;
    }

    try {
      setCarregando(true);

      const resposta = await api.post("/api/auth/login", {
        email: email.trim().toLowerCase(),
        senha,
      });

      saveAuth(
        resposta.data.access_token,
        resposta.data.admin,
      );

      navigate("/admin", { replace: true });
    } catch (error: any) {
      const detalhe =
        error?.response?.data?.detail ||
        "Não foi possível realizar o login.";

      setErro(detalhe);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="page-container">
      <section className="form-card">
        <div className="form-icon">
          <Lock size={28} />
        </div>

        <h1>Acesso administrativo</h1>

        <p>
          Informe suas credenciais para acessar o painel.
        </p>

        {erro && (
          <div className="error-message">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">E-mail</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErro("");
            }}
            placeholder="admin@exemplo.com"
            autoComplete="email"
            disabled={carregando}
            required
          />

          <label htmlFor="senha">Senha</label>

          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setErro("");
            }}
            placeholder="Sua senha"
            autoComplete="current-password"
            disabled={carregando}
            required
          />

          <button
            type="submit"
            className="primary-button"
            disabled={
              carregando ||
              !email.trim() ||
              !senha
            }
          >
            <LogIn size={20} />

            {carregando
              ? "Entrando..."
              : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}