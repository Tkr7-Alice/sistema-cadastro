import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, Eye, Filter, XCircle } from "lucide-react";
import api from "../lib/api";

type Pessoa = {
  id: number;
  nome_completo: string;
  telefone: string;
  status_aprovacao: "AGUARDANDO" | "APROVADO" | "NAO_APROVADO";
  status_cadastro: string;
  created_at: string;
};

type FiltroStatus = "TODOS" | "AGUARDANDO" | "APROVADO" | "NAO_APROVADO";

const STATUS_LABELS: Record<string, string> = {
  AGUARDANDO: "Aguardando",
  APROVADO: "Aprovado",
  NAO_APROVADO: "Não Aprovado",
};

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatarTelefone(tel: string): string {
  const n = tel.replace(/\D/g, "");
  if (n.length === 11) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
  if (n.length === 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
  return tel;
}

export function AdminListPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [filtro, setFiltro] = useState<FiltroStatus>("TODOS");
  const [acaoCarregando, setAcaoCarregando] = useState<number | null>(null);

  async function carregarPessoas() {
    try {
      setCarregando(true);
      setErro("");
      const resposta = await api.get("/api/pessoas");
      setPessoas(resposta.data);
    } catch {
      setErro("Não foi possível carregar os cadastros.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarPessoas();
  }, []);

  async function handleAprovar(id: number) {
    try {
      setAcaoCarregando(id);
      await api.patch(`/api/pessoas/${id}/aprovar`);
      await carregarPessoas();
    } catch (error: any) {
      const msg = error?.response?.data?.detail || "Erro ao aprovar.";
      alert(msg);
    } finally {
      setAcaoCarregando(null);
    }
  }

  async function handleReprovar(id: number) {
    try {
      setAcaoCarregando(id);
      await api.patch(`/api/pessoas/${id}/nao-aprovar`);
      await carregarPessoas();
    } catch (error: any) {
      const msg = error?.response?.data?.detail || "Erro ao reprovar.";
      alert(msg);
    } finally {
      setAcaoCarregando(null);
    }
  }

  const pessoasFiltradas =
    filtro === "TODOS"
      ? pessoas
      : pessoas.filter((p) => p.status_aprovacao === filtro);

  const contadores = {
    TODOS: pessoas.length,
    AGUARDANDO: pessoas.filter((p) => p.status_aprovacao === "AGUARDANDO").length,
    APROVADO: pessoas.filter((p) => p.status_aprovacao === "APROVADO").length,
    NAO_APROVADO: pessoas.filter((p) => p.status_aprovacao === "NAO_APROVADO").length,
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Cadastros</h1>
        <p>{pessoas.length} registro{pessoas.length !== 1 ? "s" : ""} no total</p>
      </div>

      {erro && <div className="error-message">{erro}</div>}

      <div className="filter-bar">
        <Filter size={16} />
        {(["TODOS", "AGUARDANDO", "APROVADO", "NAO_APROVADO"] as FiltroStatus[]).map(
          (status) => (
            <button
              key={status}
              className={`filter-chip${filtro === status ? " active" : ""}`}
              onClick={() => setFiltro(status)}
            >
              {status === "TODOS" ? "Todos" : STATUS_LABELS[status]}
              <span className="filter-count">{contadores[status]}</span>
            </button>
          ),
        )}
      </div>

      {carregando ? (
        <div className="loading-state">Carregando cadastros...</div>
      ) : pessoasFiltradas.length === 0 ? (
        <div className="empty-state">
          {filtro === "TODOS"
            ? "Nenhum cadastro encontrado."
            : `Nenhum cadastro com status "${STATUS_LABELS[filtro]}".`}
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome completo</th>
                <th>Telefone</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pessoasFiltradas.map((pessoa) => (
                <tr key={pessoa.id}>
                  <td className="td-id">#{pessoa.id}</td>
                  <td className="td-nome">{pessoa.nome_completo}</td>
                  <td className="td-telefone">{formatarTelefone(pessoa.telefone)}</td>
                  <td>
                    <span className={`status-badge status-${pessoa.status_aprovacao.toLowerCase().replace("_", "-")}`}>
                      {pessoa.status_aprovacao === "APROVADO" && <CheckCircle size={14} />}
                      {pessoa.status_aprovacao === "AGUARDANDO" && <Clock size={14} />}
                      {pessoa.status_aprovacao === "NAO_APROVADO" && <XCircle size={14} />}
                      {STATUS_LABELS[pessoa.status_aprovacao]}
                    </span>
                  </td>
                  <td className="td-data">{formatarData(pessoa.created_at)}</td>
                  <td className="td-acoes">
                    <div className="action-buttons">
                      <Link to={`/admin/pessoas/${pessoa.id}`} className="action-btn view" title="Ver detalhes">
                        <Eye size={16} />
                      </Link>
                      {pessoa.status_aprovacao === "AGUARDANDO" && (
                        <>
                          <button
                            className="action-btn approve"
                            title="Aprovar"
                            onClick={() => handleAprovar(pessoa.id)}
                            disabled={acaoCarregando === pessoa.id}
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            className="action-btn reject"
                            title="Reprovar"
                            onClick={() => handleReprovar(pessoa.id)}
                            disabled={acaoCarregando === pessoa.id}
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
