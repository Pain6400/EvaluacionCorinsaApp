import * as SQLite from 'expo-sqlite';

// Abre la base de datos de forma asíncrona
const openDB = async () => {
  const db = await SQLite.openDatabaseAsync('Corinsa.db');
  return db;
};

export const initDB = async () => {
    const db = await openDB();
    
    try {
      // Ejecuta las sentencias SQL de forma separada con execAsync
      await db.execAsync(`CREATE TABLE IF NOT EXISTS Solicitudes (
        id INTEGER PRIMARY KEY NOT NULL,
        usuarioId TEXT,
        fechaCreacion TEXT,
        fechaRespuesta TEXT,
        aprobada INTEGER,
        zonaId INTEGER,
        tipoSolicitudId INTEGER,
        observaciones TEXT
      );`);
  
      await db.execAsync(`CREATE TABLE IF NOT EXISTS PendingOperations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        data TEXT
      );`);
      
      console.log('Base de datos inicializada correctamente.');
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  };

export const insertSolicitud = async (solicitud) => {
  const db = await openDB();
  const { id, usuarioId, fechaCreacion, fechaRespuesta, aprobada, zonaId, tipoSolicitudId, observaciones } = solicitud;
  
  return new Promise((resolve, reject) => {
    db.runAsync(
      `INSERT OR REPLACE INTO Solicitudes (id, usuarioId, fechaCreacion, fechaRespuesta, aprobada, zonaId, tipoSolicitudId, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [id, usuarioId, fechaCreacion, fechaRespuesta, aprobada ? 1 : 0, zonaId, tipoSolicitudId, observaciones]
    ).then((result) => {
      resolve(result);
    }).catch((err) => {
      reject(err);
    });
  });
};

export const getSolicitudes = async () => {
  const db = await openDB();
  
  return await db.getAllAsync(`SELECT * FROM Solicitudes;`)
};

export const addPendingOperation = async (type, data) => {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    db.runAsync(
      `INSERT INTO PendingOperations (type, data) VALUES (?, ?);`,
      [type, JSON.stringify(data)]
    ).then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

export const getPendingOperations = async () => {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    db.getAllAsync(`SELECT * FROM PendingOperations ORDER BY id ASC;`)
      .then(({ rows: { _array } }) => resolve(_array))
      .catch((err) => reject(err));
  });
};

export const removePendingOperation = async (id) => {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    db.runAsync(`DELETE FROM PendingOperations WHERE id = ?;`, [id])
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

export const removeSolicitudes = async () => {
  const db = await openDB();

  return await db.runAsync(`DELETE FROM Solicitudes`);
};

