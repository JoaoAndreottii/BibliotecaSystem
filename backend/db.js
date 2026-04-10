const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',       
  password: 'mamj3838',       
  database: 'biblioteca_db',
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao MySQL:', err.message);
    process.exit(1);
  }
  console.log('✅ Conectado ao MySQL com sucesso!');
});

module.exports = connection;
