import { describe, it, expect } from 'vitest';
import { Horario } from '../models/horario';

describe('Horario Model', () => {
    it('Debería crear una instancia de Horario correctamente', () => {
        const fecha = new Date("2025-11-28");
        const horario = new Horario("1", true, "10:00", fecha);

        expect(horario).toBeInstanceOf(Horario);
        expect(horario.getId()).toBe("1");
        expect(horario.getDisponibilidad()).toBe(true);
        expect(horario.getHorario()).toBe("10:00");
        expect(horario.getDiaHorario()).toBe(fecha);
    });

    it('Debería modificar el ID correctamente usando setId', () => {
        const horario = new Horario("1", true, "10:00", new Date());
        horario.setId("2");
        expect(horario.getId()).toBe("2");
    });

    it('Debería modificar la disponibilidad usando setDisponibilidad', () => {
        const horario = new Horario("1", true, "10:00", new Date());
        horario.setDisponibilidad(false);
        expect(horario.getDisponibilidad()).toBe(false);
    });

    it('Debería modificar la hora usando setHorario', () => {
        const horario = new Horario("1", true, "10:00", new Date());
        horario.setHorario("15:30");
        expect(horario.getHorario()).toBe("15:30");
    });

    it('Debería modificar la fecha usando setDiaHorario', () => {
        const fechaInicial = new Date("2025-01-01");
        const fechaNueva = new Date("2025-12-31");
        const horario = new Horario("1", true, "10:00", fechaInicial);
        
        horario.setDiaHorario(fechaNueva);
        expect(horario.getDiaHorario()).toBe(fechaNueva);
    });
});