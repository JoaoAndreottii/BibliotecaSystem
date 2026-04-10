import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLivro, deletarLivro } from '../services/api';
import './Detalhes.css';

export default function Detalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [livro, setLivro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    getLivro(id)
      .then(res => setLivro(res.data))
      .catch(() => showToast('Erro ao carregar livro.', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    try {
      await deletarLivro(id);
      showToast('Livro excluído!');
      setTimeout(() => navigate('/'), 1200);
    } catch {
      showToast('Erro ao excluir livro.', 'error');
    }
  };

  if (loading) return (
    <div className="loading-wrap">
      <div className="spinner" />
      <p>Carregando livro…</p>
    </div>
  );

  if (!livro) return (
    <div className="empty">
      <div className="empty-icon">❓</div>
      <h3>Livro não encontrado</h3>
      <button className="btn btn-ghost" onClick={() => navigate('/')}>← Voltar ao acervo</button>
    </div>
  );

  return (
    <div className="detalhes-page">
      <button className="btn btn-ghost back-btn" onClick={() => navigate('/')}>← Voltar</button>

      <div className="detalhes-card">
        <div className="detalhes-hero">
          <div className="detalhes-cover">
            {livro.titulo[0]}
          </div>
          <div className="detalhes-head">
            <h1 className="detalhes-titulo">{livro.titulo}</h1>
            <p className="detalhes-autor">por {livro.autor}</p>
            <div className="detalhes-badges">
              <span className="badge-det">{livro.genero}</span>
              <span className="badge-det">{livro.ano_publicacao}</span>
              {livro.paginas && <span className="badge-det">{livro.paginas} páginas</span>}
            </div>
          </div>
        </div>

        <div className="detalhes-body">
          <div className="info-grid">
            <InfoBox label="Título" value={livro.titulo} />
            <InfoBox label="Autor" value={livro.autor} />
            <InfoBox label="ISBN" value={livro.isbn} mono />
            <InfoBox label="Gênero" value={livro.genero} />
            <InfoBox label="Ano de Publicação" value={livro.ano_publicacao} />
            <InfoBox label="Páginas" value={livro.paginas || '—'} />
          </div>

          {livro.sinopse && (
            <div className="sinopse-block">
              <h4 className="sinopse-title">Sinopse</h4>
              <p className="sinopse-text">{livro.sinopse}</p>
            </div>
          )}

          <div className="detalhes-meta">
            <span>Cadastrado em: {new Date(livro.criado_em).toLocaleDateString('pt-BR', {
              day: '2-digit', month: 'long', year: 'numeric'
            })}</span>
          </div>
        </div>

        <div className="detalhes-actions">
          <button className="btn btn-ghost" onClick={() => navigate(`/editar/${livro.id}`)}>
            ✏️ Editar livro
          </button>
          <button className="btn btn-danger" onClick={() => setConfirmDelete(true)}>
            🗑 Excluir livro
          </button>
        </div>
      </div>

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Confirmar exclusão</h3>
            <p>Deseja realmente excluir <strong>"{livro.titulo}"</strong>?<br />Esta ação não pode ser desfeita.</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(false)}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDelete}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

function InfoBox({ label, value, mono }) {
  return (
    <div className="info-box">
      <span className="info-label">{label}</span>
      <span className={`info-value ${mono ? 'mono' : ''}`}>{value}</span>
    </div>
  );
}
