import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export async function openDb() {
    return open({
        filename: './database.sqlite', // Aquí se guardarán tus datos
        driver: sqlite3.Database
    });
}

// Función para inicializar las tablas
export async function initDb() {
    const db = await openDb();

    //Creamos en caso de no existir las tablas necesarias
    await db.exec(`
        CREATE TABLE IF NOT EXISTS turnos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descripcionTurno TEXT,
            costo REAL
        )
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS horarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            disponibilidad BOOLEAN,
            horario TEXT,
            diaHorario TEXT,
            turnoId INTEGER, -- ESTA ES LA COLUMNA QUE FALTA
            FOREIGN KEY (turnoId) REFERENCES turnos(id) ON DELETE CASCADE
        )
    `);
}