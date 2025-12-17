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
    await db.exec(`
        CREATE TABLE IF NOT EXISTS horarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            disponibilidad BOOLEAN,
            horario TEXT,
            diaHorario TEXT
        )
    `);
}