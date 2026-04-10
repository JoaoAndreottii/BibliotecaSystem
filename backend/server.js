const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/livros', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search}%` : '%';

  const countSql = `SELECT COUNT(*) as total FROM livros WHERE titulo LIKE ? OR autor LIKE ?`;
  const dataSql = `SELECT * FROM livros WHERE titulo LIKE ? OR autor LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?`;

  db.query(countSql, [search, search], (err, countResult) => {
    if (err) return res.status(500).json({ error: 'Erro ao contar livros', details: err.message });

    const total = countResult[0].total;

    db.query(dataSql, [search, search, limit, offset], (err, rows) => {
      if (err) return res.status(500).json({ error: 'Erro ao buscar livros', details: err.message });

      res.json({
        data: rows,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    });
  });
});

app.get('/livros/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM livros WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar livro', details: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'Livro não encontrado' });
    res.json(rows[0]);
  });
});

app.post('/livros', (req, res) => {
  const { titulo, autor, isbn, genero, ano_publicacao, paginas, sinopse } = req.body;

  if (!titulo || titulo.trim() === '') return res.status(400).json({ error: 'O título é obrigatório.' });
  if (!autor || autor.trim() === '') return res.status(400).json({ error: 'O autor é obrigatório.' });
  if (!isbn || isbn.trim() === '') return res.status(400).json({ error: 'O ISBN é obrigatório.' });
  if (!genero || genero.trim() === '') return res.status(400).json({ error: 'O gênero é obrigatório.' });
  if (!ano_publicacao || isNaN(ano_publicacao)) return res.status(400).json({ error: 'O ano de publicação deve ser um número válido.' });

  const sql = `INSERT INTO livros (titulo, autor, isbn, genero, ano_publicacao, paginas, sinopse)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [titulo.trim(), autor.trim(), isbn.trim(), genero.trim(), ano_publicacao, paginas || null, sinopse || null], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'ISBN já cadastrado.' });
      return res.status(500).json({ error: 'Erro ao cadastrar livro', details: err.message });
    }
    res.status(201).json({ message: 'Livro cadastrado com sucesso!', id: result.insertId });
  });
});

app.put('/livros/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, autor, isbn, genero, ano_publicacao, paginas, sinopse } = req.body;

  if (!titulo || titulo.trim() === '') return res.status(400).json({ error: 'O título é obrigatório.' });
  if (!autor || autor.trim() === '') return res.status(400).json({ error: 'O autor é obrigatório.' });
  if (!isbn || isbn.trim() === '') return res.status(400).json({ error: 'O ISBN é obrigatório.' });
  if (!genero || genero.trim() === '') return res.status(400).json({ error: 'O gênero é obrigatório.' });
  if (!ano_publicacao || isNaN(ano_publicacao)) return res.status(400).json({ error: 'O ano de publicação deve ser um número válido.' });

  const sql = `UPDATE livros SET titulo=?, autor=?, isbn=?, genero=?, ano_publicacao=?, paginas=?, sinopse=? WHERE id=?`;

  db.query(sql, [titulo.trim(), autor.trim(), isbn.trim(), genero.trim(), ano_publicacao, paginas || null, sinopse || null, id], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'ISBN já cadastrado.' });
      return res.status(500).json({ error: 'Erro ao atualizar livro', details: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Livro não encontrado.' });
    res.json({ message: 'Livro atualizado com sucesso!' });
  });
});

app.delete('/livros/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM livros WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao remover livro', details: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Livro não encontrado.' });
    res.json({ message: 'Livro removido com sucesso!' });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
