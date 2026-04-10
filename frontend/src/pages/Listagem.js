import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLivros, deletarLivro } from '../services/api';
import './Listagem.css';

const GENERO_CORES = {
  'Romance':    '#8e44ad',
  'Naturalismo':'#2980b9',
  'Novela':     '#16a085',
  'Contos':     '#d35400',
  'Romantismo': '#c0392b',
};

function Badge({ genero }) {
  const cor = GENERO_CORES[genero] || '#555';
  return (
    <span className="badge" style={{ background: cor + '33', color: cor, borderColor: cor + '55' }}>
      {genero}
    </span>
  );
}

export default function Listagem() {
  const navigate = useNavigate();
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const buscar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLivros(page, 10, search);
      setLivros(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch (err) {
      showToast('Erro ao carregar livros.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { buscar(); }, [buscar]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    try {
      await deletarLivro(id);
      showToast('Livro removido com sucesso!');
      buscar();
    } catch {
      showToast('Erro ao remover livro.', 'error');
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div>
      <h2 className="page-title">Acervo</h2>
      <p className="page-subtitle">{total} {total === 1 ? 'livro cadastrado' : 'livros cadastrados'}</p>

      <div className="listagem-controls">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Pesquisar por título ou autor…"
            value={search}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/novo')}>
          + Novo Livro
        </button>
      </div>

      {loading ? (
        <div className="loading-wrap">
          <div className="spinner" />
          <p>Carregando acervo…</p>
        </div>
      ) : livros.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <h3>Nenhum livro encontrado</h3>
          <p>Tente outro termo ou adicione um novo livro.</p>
        </div>
      ) : (
        <div className="livros-grid">
          {livros.map((livro) => (
            <div key={livro.id} className="livro-card">
              <div className="livro-card-top">
                <div className="livro-cover">
                  {livro.titulo[0]}
                </div>
                <div className="livro-info">
                  <h3 className="livro-titulo">{livro.titulo}</h3>
                  <p className="livro-autor">{livro.autor}</p>
                  <div className="livro-meta">
                    <Badge genero={livro.genero} />
                    <span className="livro-ano">{livro.ano_publicacao}</span>
                  </div>
                </div>
              </div>
              {livro.sinopse && (
                <p className="livro-sinopse">{livro.sinopse}</p>
              )}
              <div className="livro-actions">
                <button className="btn btn-ghost" onClick={() => navigate(`/livro/${livro.id}`)}>
                  👁 Ver
                </button>
                <button className="btn btn-ghost" onClick={() => navigate(`/editar/${livro.id}`)}>
                  ✏️ Editar
                </button>
                <button className="btn btn-danger" onClick={() => setConfirmDelete(livro)}>
                  🗑 Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button className="btn btn-ghost" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
            ← Anterior
          </button>
          <span className="page-info">Página {page} de {totalPages}</span>
          <button className="btn btn-ghost" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
            Próxima →
          </button>
        </div>
      )}

      {/* Modal de confirmação */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Confirmar exclusão</h3>
            <p>Deseja realmente excluir <strong>"{confirmDelete.titulo}"</strong>?<br />Esta ação não pode ser desfeita.</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete.id)}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
