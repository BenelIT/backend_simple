// 1. Importar librerías y configurar express y bodyParser
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');      
const { Pool } = require('pg');   // <--- usar pg para Postgres
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());  

// 2. Conexión a PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432, // PostgreSQL por defecto
});

pool.connect()
  .then(() => console.log('Conectado a PostgreSQL!'))
  .catch(err => console.error('Error conectando a PostgreSQL:', err));

// 3. Rutas para usuarios_textos_insta
app.post('/usuarios_textos_insta', async (req, res) => {
  const { texto_a, texto_b } = req.body;
  const sql = 'INSERT INTO usuarios_textos_insta (texto_a, texto_b) VALUES ($1, $2) RETURNING id';
  try {
    const result = await pool.query(sql, [texto_a, texto_b]);
    res.send({ id: result.rows[0].id, texto_a, texto_b });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/usuarios_textos_insta', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios_textos_insta');
    res.send(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 4. Rutas para agenda
app.post('/agenda', async (req, res) => {
  const { usuario_texto_id, fecha, hora } = req.body;
  const sql = 'INSERT INTO agenda (usuario_texto_id, fecha, hora) VALUES ($1, $2, $3) RETURNING id';
  try {
    const result = await pool.query(sql, [usuario_texto_id, fecha, hora]);
    res.send({ id: result.rows[0].id, usuario_texto_id, fecha, hora });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/agenda', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM agenda');
    res.send(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 5. Rutas para objetos_extra
app.post('/objetos_extra', async (req, res) => {
  const { objeto_a } = req.body;
  const sql = 'INSERT INTO objetos_extra (objeto_a) VALUES ($1) RETURNING id';
  try {
    const result = await pool.query(sql, [objeto_a]);
    res.send({ id: result.rows[0].id, objeto_a });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/objetos_extra', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM objetos_extra');
    res.send(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 6. Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
