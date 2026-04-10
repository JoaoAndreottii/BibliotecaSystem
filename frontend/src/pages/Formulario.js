import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { criarLivro, atualizarLivro, getLivro } from '../services/api';
import './Formulario.css';

const CAMPOS_INICIAIS = {
  titulo: '', autor: '', isbn: '', genero: '',
  ano_publicacao: '', paginas: '', sinopse: '',
};

const GENEROS = ['Romance', 'Naturalismo', 'Novela', 'Contos', 'Romantismo',
                 'Ficção Científica', 'Terror', 'Fantasia', 'Biografia', 'Outro'];

export default function Formulario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(CAMPOS_INICIAIS);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDados, setLoadingDados] = useState(isEditing);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (!isEditing) return;
    getLivro(id)
      .then(res => {
        const l = res.data;
        setForm({
          titulo: l.titulo || '',
          autor: l.autor || '',
          isbn: l.isbn || '',
          genero: l.genero || '',
          ano_publicacao: l.ano_publicacao || '',
          paginas: l.paginas || '',
          sinopse: l.sinopse || '',
        });
      })
      .catch(() => showToast('Erro ao carregar dados do livro.', 'error'))
      .finally(() => setLoadingDados(false));
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const validar = () => {
    const errs = {};
    if (!form.titulo.trim())       errs.titulo = 'Título é obrigatório.';
    if (!form.autor.trim())        errs.autor  = 'Autor é obrigatório.';
    if (!form.isbn.trim())         errs.isbn   = 'ISBN é obrigatório.';
    if (!form.genero)              errs.genero = 'Selecione um gênero.';
    if (!form.ano_publicacao)      errs.ano_publicacao = 'Ano é obrigatório.';
    else if (isNaN(form.ano_publicacao) || form.ano_publicacao < 1000 || form.ano_publicacao > new Date().getFullYear())
      errs.ano_publicacao = `Ano inválido (1000–${new Date().getFullYear()}).`;
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const payload = {
        ...form,
        ano_publicacao: parseInt(form.ano_publicacao),
        paginas: form.paginas ? parseInt(form.paginas) : null,
      };
      if (isEditing) {
        await atualizarLivro(id, payload);
        showToast('Livro atualizado com sucesso!');
      } else {
        await criarLivro(payload);
        showToast('Livro cadastrado com sucesso!');
        setForm(CAMPOS_INICIAIS);
      }
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro ao salvar livro.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loadingDados) return (
    <div className="loading-wrap">
      <div className="spinner" />
      <p>Carregando livro…</p>
    </div>
  );

  return (
    <div className="form-page">
      <div className="form-header">
        <button className="btn btn-ghost back-btn" onClick={() => navigate('/')}>← Voltar</button>
        <div>
          <h2 className="page-title">{isEditing ? 'Editar Livro' : 'Novo Livro'}</h2>
          <p className="page-subtitle">{isEditing ? 'Altere as informações abaixo.' : 'Preencha os dados do novo livro.'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-card" noValidate>
        <div className="form-row">
          <Field label="Título *" error={errors.titulo}>
            <input name="titulo" value={form.titulo} onChange={handleChange}
              placeholder="Ex: Dom Casmurro" className={errors.titulo ? 'has-error' : ''} />
          </Field>
          <Field label="Autor *" error={errors.autor}>
            <input name="autor" value={form.autor} onChange={handleChange}
              placeholder="Ex: Machado de Assis" className={errors.autor ? 'has-error' : ''} />
          </Field>
        </div>

        <div className="form-row">
          <Field label="ISBN *" error={errors.isbn}>
            <input name="isbn" value={form.isbn} onChange={handleChange}
              placeholder="Ex: 978-85-359-0277-0" className={errors.isbn ? 'has-error' : ''} />
          </Field>
          <Field label="Gênero *" error={errors.genero}>
            <select name="genero" value={form.genero} onChange={handleChange}
              className={errors.genero ? 'has-error' : ''}>
              <option value="">Selecione…</option>
              {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
        </div>

        <div className="form-row">
          <Field label="Ano de Publicação *" error={errors.ano_publicacao}>
            <input type="number" name="ano_publicacao" value={form.ano_publicacao} onChange={handleChange}
              placeholder="Ex: 1899" min="1000" max={new Date().getFullYear()}
              className={errors.ano_publicacao ? 'has-error' : ''} />
          </Field>
          <Field label="Número de Páginas" error={errors.paginas}>
            <input type="number" name="paginas" value={form.paginas} onChange={handleChange}
              placeholder="Ex: 256" min="1" />
          </Field>
        </div>

        <Field label="Sinopse" error={errors.sinopse}>
          <textarea name="sinopse" value={form.sinopse} onChange={handleChange}
            placeholder="Breve descrição da obra…" rows={4} />
        </Field>

        <div className="form-footer">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Salvando…' : (isEditing ? '✔ Salvar alterações' : '+ Cadastrar livro')}
          </button>
        </div>
      </form>

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
