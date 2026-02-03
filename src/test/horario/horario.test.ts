import { describe, it, expect } from 'vitest'
import { Horario } from '../../models/horario'

describe('Horario Model', () => {
  it('Debería crear una instancia de Horario correctamente', () => {
    const fecha = new Date('2025-11-28')
    const horario = new Horario('1', true, '10:00', fecha, 'turno-1')

    expect(horario).toBeInstanceOf(Horario)
    expect(horario.getId()).toBe('1')
    expect(horario.getDisponibilidad()).toBe(true)
    expect(horario.getHorario()).toBe('10:00')
    expect(horario.getDiaHorario()).toBe(fecha)
    expect(horario.getIdTurno()).toBe('turno-1')
  })

  it('Debería modificar el ID correctamente usando setId', () => {
    const horario = new Horario('1', true, '10:00', new Date(), 'turno-1')
    horario.setId('2')
    expect(horario.getId()).toBe('2')
  })

  it('Debería modificar la disponibilidad usando setDisponibilidad', () => {
    const horario = new Horario('1', true, '10:00', new Date(), 'turno-1')
    horario.setDisponibilidad(false)
    expect(horario.getDisponibilidad()).toBe(false)
  })

  it('Debería modificar la hora usando setHorario', () => {
    const horario = new Horario('1', true, '10:00', new Date(), 'turno-1')
    horario.setHorario('15:30')
    expect(horario.getHorario()).toBe('15:30')
  })

  it('Debería modificar la fecha usando setDiaHorario', () => {
    const fechaInicial = new Date('2025-01-01')
    const fechaNueva = new Date('2025-12-31')
    const horario = new Horario('1', true, '10:00', fechaInicial, 'turno-1')
    
    horario.setDiaHorario(fechaNueva)
    expect(horario.getDiaHorario()).toBe(fechaNueva)
  })

  it('Debería modificar el idTurno usando setIdTurno', () => {
    const horario = new Horario('1', true, '10:00', new Date(), 'turno-1')
    horario.setIdTurno('turno-2')
    expect(horario.getIdTurno()).toBe('turno-2')
  })
})
