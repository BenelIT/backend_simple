// 1. Importar librerías y configurar express y bodyParser
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');      // <--- importar cors
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());  // <--- usar cors

// 2. Conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) return console.error('Error conectando a MySQL:', err);
    console.log('Conectado a MySQL!');
});

// 3. Rutas para usuarios_textos_insta
// Insertar texto
app.post('/usuarios_textos_insta', (req, res) => {
    const { texto_a, texto_b } = req.body;
    const sql = 'INSERT INTO usuarios_textos_insta (texto_a, texto_b) VALUES (?, ?)';
    db.query(sql, [texto_a, texto_b], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, texto_a, texto_b });
    });
});

// Obtener todos los textos
app.get('/usuarios_textos_insta', (req, res) => {
    db.query('SELECT * FROM usuarios_textos_insta', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// 4. Rutas para agenda
app.post('/agenda', (req, res) => {
    const { usuario_texto_id, fecha, hora } = req.body;
    const sql = 'INSERT INTO agenda (usuario_texto_id, fecha, hora) VALUES (?, ?, ?)';
    db.query(sql, [usuario_texto_id, fecha, hora], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, usuario_texto_id, fecha, hora });
    });
});

app.get('/agenda', (req, res) => {
    db.query('SELECT * FROM agenda', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// 5. Rutas para objetos_extra
app.post('/objetos_extra', (req, res) => {
    const { objeto_a } = req.body;
    const sql = 'INSERT INTO objetos_extra (objeto_a) VALUES (?)';
    db.query(sql, [objeto_a], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, objeto_a });
    });
});

app.get('/objetos_extra', (req, res) => {
    db.query('SELECT * FROM objetos_extra', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// 6. Iniciar el servidor (Paso 9)
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
