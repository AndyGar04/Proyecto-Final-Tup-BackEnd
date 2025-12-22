import { describe, it, expect } from 'vitest';
import { Club } from '../models/club';
import { Cancha } from '../models/cancha';
import { Turno } from '../models/turno'; // Necesario para crear una cancha mock

describe('Club Model', () => {
    // Mock básico de cancha para las pruebas
    const mockTurno = {} as Turno; // Mock simple ya que no evaluamos Turno aquí
    const mockCancha = new Cancha("C1", "Cancha 1", "Futbol", "5", mockTurno);

    it('Debe crear una instancia de Club correctamente', () => {
        const club = new Club("1", "Calle 123", "Club Test", "123456", "test@club.com", 5);

        expect(club).toBeInstanceOf(Club);
        expect(club.getId()).toBe("1");
        expect(club.getDireccion()).toBe("Calle 123");
        expect(club.getNombreClub()).toBe("Club Test");
        expect(club.getTelefono()).toBe("123456");
        expect(club.getGmail()).toBe("test@club.com");
        expect(club.getValoracion()).toBe(5);
        expect(club.getCanchas()).toEqual([]); // Por defecto vacío
    });

    it('Debe modificar la dirección usando setDireccion', () => {
        const club = new Club("1", "Dir 1", "Nom", "Tel", "Mail", 1);
        club.setDireccion("Nueva Direccion 456");
        expect(club.getDireccion()).toBe("Nueva Direccion 456");
    });

    it('Debe añadir una cancha correctamente usando setCancha', () => {
        const club = new Club("1", "Dir", "Nom", "Tel", "Mail", 1);
        
        club.setCanchas([mockCancha]);
        
        expect(club.getCanchas()).toHaveLength(1);
        expect(club.getCanchas()[0]).toBe(mockCancha);
    });

    it('Debe añadir múltiples canchas usando setHorarios (que añade canchas)', () => {
        const club = new Club("1", "Dir", "Nom", "Tel", "Mail", 1);
        const listaCanchas = [
            new Cancha("C2", "Cancha 2", "Tenis", "Single", mockTurno),
            new Cancha("C3", "Cancha 3", "Padel", "Doble", mockTurno)
        ];

        club.setHorarios(listaCanchas);

        expect(club.getCanchas()).toHaveLength(2);
        const cancha = club.getCanchas()[1];
        expect(cancha).toBeDefined();
        expect(cancha!.getId()).toBe("C3");
    });

    it('Debe lanzar error en setHorarios si no recibe un array', () => {
        const club = new Club("1", "Dir", "Nom", "Tel", "Mail", 1);
        
        // Forzamos el tipo any para simular el error de tipo en tiempo de ejecución
        expect(() => club.setHorarios("no es un array" as any)).toThrow("listaCanchas debe ser un arreglo válido");
    });
});