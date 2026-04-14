const express = require('express');
const router = express.Router();
const pool = require('../database'); // Subimos un nivel para encontrar db.js

// Login
router.post('/login', async (req, res) => {
    const { curp, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE curp = ? AND password = ?', [curp, password]);
        if (rows.length > 0) {
            if (rows[0].foto) rows[0].foto = rows[0].foto.toString('base64');
            res.json({ success: true, usuario: rows[0] });
        } else {
            res.status(401).json({ success: false, mensaje: 'CURP o contraseña incorrectos' });
        }
    } catch (err) {
        res.status(500).json({ success: false, mensaje: 'Error en login' });
    }
});

module.exports = router;