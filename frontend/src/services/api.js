import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 8000,
});

export const getLivros = (page = 1, limit = 10, search = '') =>
  api.get('/livros', { params: { page, limit, search } });

export const getLivro = (id) => api.get(`/livros/${id}`);

export const criarLivro = (dados) => api.post('/livros', dados);

export const atualizarLivro = (id, dados) => api.put(`/livros/${id}`, dados);

export const deletarLivro = (id) => api.delete(`/livros/${id}`);
