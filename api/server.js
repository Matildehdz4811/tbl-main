const express = require('express');
const cors = require('cors');
const pool = require('./database');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.post('/login', async (req, res) => {
  const { curp, password } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE curp = ? AND password = ?',
      [curp, password]
    );
    if (rows.length > 0) {
      if (rows[0].foto) rows[0].foto = rows[0].foto.toString('base64');
      res.json({ success: true, usuario: rows[0] });
    } else {
      res.status(401).json({ success: false, mensaje: 'CURP o contraseña incorrectos' });
    }
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ success: false, mensaje: 'Error en login' });
  }
});

// ==========================
// 👤 REGISTRO
// ==========================
app.post('/register', async (req, res) => {
  const { nombre, apellidos, usuario, email, password, curp, rol, foto } = req.body;
  try {
    const fotoBuffer = foto ? Buffer.from(foto, 'base64') : null;
    await pool.query(
      'INSERT INTO usuarios (nombre, apellidos, usuario, email, password, curp, rol, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellidos, usuario, email, password, curp, rol, fotoBuffer]
    );
    res.json({ success: true, mensaje: 'Usuario registrado' });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ success: false, mensaje: 'Error al registrar usuario' });
  }
});

// ==========================
// ♻️ TAB1: RECICLAJE
// ==========================
app.post('/reciclaje', async (req, res) => {
  const { residuo_id, cantidad, usuario_id, otro_material, foto } = req.body;
  try {
    const fotoBuffer = foto ? Buffer.from(foto, 'base64') : null;

    await pool.query(
      'INSERT INTO reciclaje (residuo_id, cantidad, usuario_id, otro_material, foto) VALUES (?, ?, ?, ?, ?)',
      [
        residuo_id && residuo_id !== '' ? residuo_id : null,
        cantidad,
        usuario_id,
        otro_material && otro_material !== '' ? otro_material : null,
        fotoBuffer
      ]
    );

    res.json({ success: true, mensaje: 'Reciclaje guardado' });
  } catch (err) {
    console.error('Error al guardar reciclaje:', err);
    res.status(500).json({ success: false, mensaje: 'Error al guardar reciclaje' });
  }
});

// ==========================
// 📚 TAB2: ENLACES
// ==========================
app.get('/enlaces', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM enlaces ORDER BY id DESC');
  res.json(rows);
});

// ==========================
// 👤 TAB5: PERFIL (GET)
// ==========================
app.get('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
  if (rows.length > 0) {
    if (rows[0].foto) rows[0].foto = rows[0].foto.toString('base64');
    res.json(rows[0]);
  } else {
    res.status(404).json({ success: false, mensaje: 'Usuario no encontrado' });
  }
});

// ==========================
// ✏️ TAB5: ACTUALIZAR USUARIO (PUT)
// ==========================
app.put('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellidos, email, telefono, password, foto } = req.body;

  try {
    const fotoBuffer = foto ? Buffer.from(foto, 'base64') : null;
    const [result] = await pool.query(
      'UPDATE usuarios SET nombre = ?, apellidos = ?, email = ?, telefono = ?, password = ?, foto = ? WHERE id = ?',
      [nombre, apellidos, email, telefono, password, fotoBuffer, id]
    );

    if (result.affectedRows > 0) {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
      if (rows[0].foto) rows[0].foto = rows[0].foto.toString('base64');
      res.json({ success: true, mensaje: 'Usuario actualizado correctamente', usuario: rows[0] });
    } else {
      res.status(404).json({ success: false, mensaje: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ success: false, mensaje: 'Error al actualizar usuario' });
  }
});

// ==========================
// 🚨 TAB4: ALERTAS
// ==========================
app.get('/alertas', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM alertas ORDER BY id DESC');
  res.json(rows);
});

// ==========================
// 📊 TAB5: RECICLAJES (HISTORIAL)
// ==========================
app.get('/reciclajes/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT id, residuo_id, cantidad, usuario_id, otro_material, foto, fecha FROM reciclaje WHERE usuario_id = ? ORDER BY fecha DESC',
      [usuario_id]
    );

    const registros = rows.map(r => ({
      ...r,
      foto: r.foto ? r.foto.toString('base64') : null
    }));

    res.json(registros);
  } catch (err) {
    console.error('Error al obtener reciclajes:', err);
    res.status(500).json({ success: false, mensaje: 'Error al obtener reciclajes' });
  }
});

// ==========================
// 📊 TAB5: ESTADÍSTICAS
// ==========================
app.get('/estadisticas/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT
         COALESCE(r.nombre, rec.otro_material) AS material,
         SUM(rec.cantidad) AS total
       FROM reciclaje rec
       LEFT JOIN residuos r ON rec.residuo_id = r.id
       WHERE rec.usuario_id = ?
       GROUP BY material`,
      [usuario_id]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error al obtener estadísticas:', err);
    res.status(500).json({ success: false, mensaje: 'Error al obtener estadísticas' });
  }
});

// ==========================
// 📍 UBICACIÓN GLOBAL
// ==========================
app.get('/ubicacion', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT nombre, lat, lng FROM ubicaciones LIMIT 1');
    if (rows.length > 0) res.json(rows[0]);
    else res.status(404).json({ success: false, mensaje: 'No hay ubicación registrada' });
  } catch (err) {
    console.error('Error al obtener ubicación:', err);
    res.status(500).json({ success: false, mensaje: 'Error al obtener ubicación' });
  }
});

app.put('/ubicacion/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, lat, lng, rol } = req.body;
  if (rol !== 'admin') return res.status(403).json({ success: false, mensaje: 'Solo el admin puede modificar ubicaciones' });

  try {
    const [result] = await pool.query(
      'UPDATE ubicaciones SET nombre = ?, lat = ?, lng = ? WHERE id = ?',
      [nombre, lat, lng, id]
    );
    if (result.affectedRows > 0) res.json({ success: true, mensaje: 'Ubicación actualizada correctamente' });
    else res.status(404).json({ success: false, mensaje: 'Ubicación no encontrada' });
  } catch (err) {
    console.error('Error al actualizar ubicación:', err);
    res.status(500).json({ success: false, mensaje: 'Error al actualizar ubicación' });
  }
});

// ==========================
// 👑 ADMIN: OBTENER TODOS LOS USUARIOS
// ==========================
app.get('/admin/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre, apellidos, usuario, email, telefono, curp, rol, foto FROM usuarios');

    // Convertimos las fotos de buffer a base64 para que Ionic las muestre
    const usuarios = rows.map(u => ({
      ...u,
      foto: u.foto ? u.foto.toString('base64') : null
    }));

    res.json(usuarios);
  } catch (err) {
    console.error('Error al obtener lista de usuarios:', err);
    res.status(500).json({ success: false, mensaje: 'Error al obtener usuarios' });
  }
});

// ==========================
// 🚀 SERVIDOR
// ==========================
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));