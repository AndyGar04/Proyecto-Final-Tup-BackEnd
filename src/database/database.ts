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
        CREATE TABLE IF NOT EXISTS clubs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            direccion TEXT,
            nombreClub TEXT,
            telefono TEXT,
            gmail TEXT,
            valoracion INTEGER
        );

        CREATE TABLE IF NOT EXISTS turnos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descripcionTurno TEXT,
            costo REAL
        );

        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            nombre TEXT NOT NULL,
            rol TEXT DEFAULT 'user'
        );

        CREATE TABLE IF NOT EXISTS canchas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombreCancha TEXT,
            deporte TEXT,
            tamanio TEXT,
            turnoId INTEGER,
            clubId INTEGER,
            FOREIGN KEY (turnoId) REFERENCES turnos(id),
            FOREIGN KEY (clubId) REFERENCES clubs(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS horarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            disponibilidad BOOLEAN,
            horario TEXT,
            diaHorario TEXT,
            turnoId INTEGER,
            FOREIGN KEY (turnoId) REFERENCES turnos(id) ON DELETE CASCADE
        );
    `);
}