import { Request, Response } from 'express';
import mockClub from '../models/implementations/mockClub';
import mockCancha from '../models/implementations/mockCancha';
import mockTurno from '../models/implementations/mockTurno';
import mockUsuario from '../models/implementations/mockUsuario';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const clubes = await mockClub.getClubs();
        const canchas = await mockCancha.getCanchas();
        const turnos = await mockTurno.getTurnos();
        const usuarios = mockUsuario.getAll();

        res.status(200).json({
            clubes: clubes.length,
            canchas: canchas.length,
            usuarios: usuarios.length,
            reservas: turnos.length 
        });
    } catch (error) {
        console.error('Error stats:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};