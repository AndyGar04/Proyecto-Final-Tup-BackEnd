import { Turno } from '../../models/turno'
import { Horario } from '../../models/horario'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Modelo Turno', () => {
  let horarioMock: Horario
  let fecha: Date

  beforeEach(() => {
    fecha = new Date('2024-01-01')
    horarioMock = new Horario('h1', true, '08:00', fecha, 'turno-1')
  })

  it('Debe crear un Turno correctamente', () => {
    const turno = new Turno('1', 'Turno mañana', 2000, [])

    expect(turno.getId()).toBe('1')
    expect(turno.getDescripcionTurno()).toBe('Turno mañana')
    expect(turno.getCosto()).toBe(2000)
    expect(turno.getHorarios()).toEqual([])
  })

  it('Debe obtener y modificar la descripción del turno', () => {
    const turno = new Turno('1', 'Turno mañana', 2000)
    
    turno.setDescripcionTurno('Turno tarde')
    expect(turno.getDescripcionTurno()).toBe('Turno tarde')
  })

  it('Debe obtener y modificar el costo', () => {
    const turno = new Turno('1', 'Turno mañana', 2000)

    turno.setCosto(3500)
    expect(turno.getCosto()).toBe(3500)
  })

  it('Debe obtener y modificar el ID', () => {
    const turno = new Turno('1', 'Turno mañana', 2000)

    turno.setId('2')
    expect(turno.getId()).toBe('2')
  })

  it('Debe añadir un horario correctamente', () => {
    const turno = new Turno('1', 'Turno mañana', 2000)

    turno.anadirHorario(horarioMock)

    expect(turno.getHorarios().length).toBe(1)
    expect(turno.getHorarios()[0]).toBe(horarioMock)
  })

  it('Debe setear múltiples horarios con setHorarios', () => {
    const turno = new Turno('1', 'Turno mañana', 2000)

    const listaHorarios = [
      new Horario('h2', false, '10:00', fecha, 'turno-1'),
      new Horario('h3', true, '12:00', fecha, 'turno-1')
    ]

    turno.setHorarios(listaHorarios)

    expect(turno.getHorarios().length).toBe(2)
    expect(turno.getHorarios()).toEqual(listaHorarios)
  })

  it('Debe arrojar error si setHorarios recibe algo que no es un array', () => {
    const turno = new Turno('1', 'Turno mañana', 2000)

    expect(() => turno.setHorarios(null as any)).toThrow(
      'listaHorarios debe ser un arreglo válido de Horario'
    )
  })
})
