import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, Pencil, Save, Trash2, XCircle } from "lucide-react";
import api from "../lib/api";

type PessoaDetalhe = {
  id: number;
  nome_completo: string;
  telefone: string;
  status_aprovacao: "AGUARDANDO" | "APROVADO" | "NAO_APROVADO";
  status_cadastro: string;
  data_entrevista: string | null;
  created_at: string;
  updated_at: string;
};

const STATUS_LABELS: Record<string, string> = {
  AGUARDANDO: "Aguardando análise",
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

export function AdminDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pessoa, setPessoa] = useState<PessoaDetalhe | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Edit state
  const [editando, setEditando] = useState(false);
  const [nomeEdit, setNomeEdit] = useState("");
  const [telefoneEdit, setTelefoneEdit] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Action state
  const [acaoCarregando, setAcaoCarregando] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  async function carregarPessoa() {
    try {
      setCarregando(true);
      setErro("");
      const resposta = await api.get(`/api/pessoas/${id}`);
      setPessoa(resposta.data);
      setNomeEdit(resposta.data.nome_completo);
      setTelefoneEdit(resposta.data.telefone);
    } catch (error: any) {
      const msg = error?.response?.data?.detail || "Cadastro não encontrado.";
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarPessoa();
  }, [id]);

  async function handleSalvar(event: FormEvent) {
    event.preventDefault();
    setSucesso("");
    setErro("");

    if (!nomeEdit.trim() || !telefoneEdit.trim()) {
      setErro("Nome e telefone são obrigatórios.");
      return;
    }

    try {
      setSalvando(true);
      const resposta = await api.patch(`/api/pessoas/${id}`, {
        nome_completo: nomeEdit.trim(),
        telefone: telefoneEdit.trim(),
      });
      setPessoa(resposta.data);
      setEditando(false);
      setSucesso("Cadastro atualizado com sucesso.");
    } catch (error: any) {
      const msg = error?.response?.data?.detail || "Erro ao atualizar.";
      setErro(msg);
    } finally {
      setSalvando(false);
    }
  }

  async function handleAprovar() {
    try {
      setAcaoCarregando(true);
      setErro("");
      setSucesso("");
      await api.patch(`/api/pessoas/${id}/aprovar`);
      setSucesso("Cadastro aprovado com sucesso.");
      await carregarPessoa();
    } catch (error: any) {
      const msg = error?.response?.data?.detail || "Erro ao aprovar.";
      setErro(msg);
    } finally {
      setAcaoCarregando(false);
    }
  }

  async function handleReprovar() {
    try {
      setAcaoCarregando(true);
      setErro("");
      setSucesso("");
      await api.patch(`/api/pessoas/${id}/nao-aprovar`);
      setSucesso("Cadastro reprovado.");
      await carregarPessoa();
    } catch (error: any) {
      const msg = error?.response?.data?.detail || "Erro ao reprovar.";
      setErro(msg);
    } finally {
      setAcaoCarregando(false);
    }
  }

  async function handleExcluir() {
    try {
      setAcaoCarregando(true);
      setErro("");
      await api.delete(`/api/pessoas/${id}`);
      navigate("/admin", { replace: true });
    } catch (error: any) {
      const msg = error?.response?.data?.detail || "Erro ao excluir.";
      setErro(msg);
      setConfirmandoExclusao(false);
    } finally {
      setAcaoCarregando(false);
    }
  }

  if (carregando) {
    return (
      <div className="admin-page">
        <div className="loading-state">Carregando...</div>
      </div>
    );
  }

  if (!pessoa) {
    return (
      <div className="admin-page">
        <Link to="/admin" className="back-link">
          <ArrowLeft size={18} /> Voltar
        </Link>
        <div className="error-message">{erro || "Cadastro não encontrado."}</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Link to="/admin" className="back-link">
        <ArrowLeft size={18} /> Voltar para lista
      </Link>

      {sucesso && <div className="success-message">{sucesso}</div>}
      {erro && <div className="error-message">{erro}</div>}

      <div className="detail-card">
        <div className="detail-header">
          <div>
            <h1>Cadastro #{pessoa.id}</h1>
            <span
              className={`status-badge status-${pessoa.status_aprovacao.toLowerCase().replace("_", "-")}`}
            >
              {pessoa.status_aprovacao === "APROVADO" && <CheckCircle size={14} />}
              {pessoa.status_aprovacao === "AGUARDANDO" && <Clock size={14} />}
              {pessoa.status_aprovacao === "NAO_APROVADO" && <XCircle size={14} />}
              {STATUS_LABELS[pessoa.status_aprovacao]}
            </span>
          </div>

          {!editando && (
            <button className="icon-button" onClick={() => setEditando(true)} title="Editar">
              <Pencil size={18} />
            </button>
          )}
        </div>

        {editando ? (
          <form onSubmit={handleSalvar} className="detail-form">
            <label htmlFor="nome-edit">Nome completo</label>
            <input
              id="nome-edit"
              type="text"
              value={nomeEdit}
              onChange={(e) => setNomeEdit(e.target.value)}
              disabled={salvando}
            />

            <label htmlFor="telefone-edit">Telefone</label>
            <input
              id="telefone-edit"
              type="tel"
              value={telefoneEdit}
              onChange={(e) => setTelefoneEdit(e.target.value)}
              disabled={salvando}
            />

            <div className="detail-form-actions">
              <button type="submit" className="primary-button" disabled={salvando}>
                <Save size={18} />
                {salvando ? "Salvando..." : "Salvar"}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setEditando(false);
                  setNomeEdit(pessoa.nome_completo);
                  setTelefoneEdit(pessoa.telefone);
                  setErro("");
                }}
                disabled={salvando}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="detail-fields">
            <div className="detail-field">
              <span className="detail-label">Nome completo</span>
              <span className="detail-value">{pessoa.nome_completo}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Telefone</span>
              <span className="detail-value">{pessoa.telefone}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Status do cadastro</span>
              <span className="detail-value">{pessoa.status_cadastro}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Data de cadastro</span>
              <span className="detail-value">{formatarData(pessoa.created_at)}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Última atualização</span>
              <span className="detail-value">{formatarData(pessoa.updated_at)}</span>
            </div>
            {pessoa.data_entrevista && (
              <div className="detail-field">
                <span className="detail-label">Data de entrevista</span>
                <span className="detail-value">{formatarData(pessoa.data_entrevista)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="detail-actions">
        {pessoa.status_aprovacao === "AGUARDANDO" && (
          <>
            <button
              className="primary-button approve-btn"
              onClick={handleAprovar}
              disabled={acaoCarregando}
            >
              <CheckCircle size={18} />
              Aprovar cadastro
            </button>
            <button
              className="secondary-button reject-btn"
              onClick={handleReprovar}
              disabled={acaoCarregando}
            >
              <XCircle size={18} />
              Reprovar cadastro
            </button>
          </>
        )}

        {!confirmandoExclusao ? (
          <button
            className="danger-button"
            onClick={() => setConfirmandoExclusao(true)}
            disabled={acaoCarregando}
          >
            <Trash2 size={18} />
            Excluir
          </button>
        ) : (
          <div className="confirm-delete">
            <span>Tem certeza?</span>
            <button
              className="danger-button"
              onClick={handleExcluir}
              disabled={acaoCarregando}
            >
              Sim, excluir
            </button>
            <button
              className="secondary-button"
              onClick={() => setConfirmandoExclusao(false)}
              disabled={acaoCarregando}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
