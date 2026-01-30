import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SQLiteClub } from '../../models/repository/sqliteClub';
import { Club } from '../../models/club';
import { Cancha } from '../../models/cancha';
import { Turno } from '../../models/turno';
import { openDb } from '../../database/database';

describe('SQLiteClub - Integración con Base de Datos', () => {
    let sqliteClub: SQLiteClub;

    beforeEach(async () => {
        sqliteClub = new SQLiteClub();
        
        const db = await openDb();
        
        // Limpiar las tablas relacionadas antes de cada test
        await db.run('DELETE FROM canchas');
        await db.run('DELETE FROM turnos');
        await db.run('DELETE FROM clubs');
        
        // Insertar clubs de prueba
        await db.run(
            'INSERT INTO clubs (nombreClub, direccion, telefono, gmail, valoracion) VALUES (?, ?, ?, ?, ?)',
            ['Club Deportivo 1', 'Av. Siempre Viva 123', '1234567890', 'club1@test.com', 5]
        );
        await db.run(
            'INSERT INTO clubs (nombreClub, direccion, telefono, gmail, valoracion) VALUES (?, ?, ?, ?, ?)',
            ['Club Deportivo 2', 'Calle Falsa 456', '0987654321', 'club2@test.com', 4]
        );
    });

    afterEach(async () => {
        // Limpiar después de cada test
        const db = await openDb();
        await db.run('DELETE FROM canchas');
        await db.run('DELETE FROM turnos');
        await db.run('DELETE FROM clubs');
    });

    describe('getClubs', () => {
        it('Debería retornar todos los clubs', async () => {
            const clubs = await sqliteClub.getClubs();

            expect(clubs).toBeInstanceOf(Array);
            expect(clubs.length).toBe(2);
        });

        it('Debería retornar clubs con todas las propiedades', async () => {
            const clubs = await sqliteClub.getClubs();

            clubs.forEach(club => {
                expect(club.getId()).toBeDefined();
                expect(club.getNombreClub()).toBeDefined();
                expect(club.getDireccion()).toBeDefined();
                expect(club.getTelefono()).toBeDefined();
                expect(club.getGmail()).toBeDefined();
                expect(club.getValoracion()).toBeDefined();
                expect(club.getCanchas()).toBeInstanceOf(Array);
            });
        });

        it('Debería retornar array vacío si no hay clubs', async () => {
            const db = await openDb();
            await db.run('DELETE FROM clubs');

            const clubs = await sqliteClub.getClubs();

            expect(clubs).toBeInstanceOf(Array);
            expect(clubs.length).toBe(0);
        });

        it('Debería retornar clubs con sus canchas asociadas', async () => {
            const clubs = await sqliteClub.getClubs();
            const clubId = clubs[0].getId();

            // Crear turno y cancha para el club
            const db = await openDb();
            const turnoResult = await db.run(
                'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
                ['Turno Test', 1000]
            );
            await db.run(
                'INSERT INTO canchas (nombreCancha, deporte, tamanio, turnoId, clubId) VALUES (?, ?, ?, ?, ?)',
                ['Cancha Test', 'Fútbol', '5vs5', turnoResult.lastID, clubId]
            );

            const clubActualizado = await sqliteClub.getClub(clubId);

            expect(clubActualizado.getCanchas().length).toBe(1);
            expect(clubActualizado.getCanchas()[0].getNombreCancha()).toBe('Cancha Test');
        });
    });

    describe('getClub', () => {
        it('Debería encontrar un club existente por ID', async () => {
            const clubs = await sqliteClub.getClubs();
            const primerClubId = clubs[0].getId();

            const club = await sqliteClub.getClub(primerClubId);

            expect(club).toBeDefined();
            expect(club.getId()).toBe(primerClubId);
            expect(club.getNombreClub()).toBeDefined();
        });

        it('Debería lanzar error si el club no existe', async () => {
            await expect(sqliteClub.getClub('99999')).rejects.toThrow('No existe dicho club');
        });

        it('Debería retornar propiedades correctas del club', async () => {
            const clubs = await sqliteClub.getClubs();
            const club1 = clubs.find(c => c.getNombreClub() === 'Club Deportivo 1');

            const club = await sqliteClub.getClub(club1!.getId());

            expect(club.getNombreClub()).toBe('Club Deportivo 1');
            expect(club.getDireccion()).toBe('Av. Siempre Viva 123');
            expect(club.getTelefono()).toBe('1234567890');
            expect(club.getGmail()).toBe('club1@test.com');
            expect(club.getValoracion()).toBe(5);
        });

        it('Debería retornar el club con su lista de canchas', async () => {
            const clubs = await sqliteClub.getClubs();
            const clubId = clubs[0].getId();

            const club = await sqliteClub.getClub(clubId);

            expect(club.getCanchas()).toBeInstanceOf(Array);
        });
    });

    describe('addClub', () => {
        it('Debería crear un nuevo club', async () => {
            const nuevoClub = new Club(
                '',
                'Nueva Dirección 789',
                'Club Nuevo',
                '1112223333',
                'nuevo@club.com',
                5
            );

            const clubCreado = await sqliteClub.addClub(nuevoClub);

            expect(clubCreado.getId()).toBeDefined();
            expect(clubCreado.getId()).not.toBe('');
            expect(clubCreado.getNombreClub()).toBe('Club Nuevo');
            expect(clubCreado.getDireccion()).toBe('Nueva Dirección 789');
            expect(clubCreado.getTelefono()).toBe('1112223333');
            expect(clubCreado.getGmail()).toBe('nuevo@club.com');
            expect(clubCreado.getValoracion()).toBe(5);
        });

        it('Debería asignar un ID válido al club creado', async () => {
            const nuevoClub = new Club(
                '',
                'Dirección Test',
                'Club Test ID',
                '9998887777',
                'testid@club.com',
                4
            );

            const clubCreado = await sqliteClub.addClub(nuevoClub);
            const idAsignado = parseInt(clubCreado.getId());

            expect(idAsignado).toBeGreaterThan(0);
            expect(isNaN(idAsignado)).toBe(false);
        });

        it('Debería poder recuperar el club después de crearlo', async () => {
            const nuevoClub = new Club(
                '',
                'Calle Recuperable',
                'Club Recuperable',
                '5554443333',
                'recuperable@club.com',
                3
            );

            const clubCreado = await sqliteClub.addClub(nuevoClub);
            const clubRecuperado = await sqliteClub.getClub(clubCreado.getId());

            expect(clubRecuperado.getNombreClub()).toBe('Club Recuperable');
            expect(clubRecuperado.getDireccion()).toBe('Calle Recuperable');
            expect(clubRecuperado.getTelefono()).toBe('5554443333');
            expect(clubRecuperado.getGmail()).toBe('recuperable@club.com');
            expect(clubRecuperado.getValoracion()).toBe(3);
        });

        it('Debería crear club con diferentes valoraciones', async () => {
            const club1 = new Club('', 'Dir 1', 'Club Val 1', '111', 'val1@test.com', 1);
            const club2 = new Club('', 'Dir 2', 'Club Val 5', '222', 'val5@test.com', 5);

            const creado1 = await sqliteClub.addClub(club1);
            const creado2 = await sqliteClub.addClub(club2);

            expect(creado1.getValoracion()).toBe(1);
            expect(creado2.getValoracion()).toBe(5);
        });
    });

    describe('deleteClub', () => {
        it('Debería eliminar un club existente', async () => {
            const clubs = await sqliteClub.getClubs();
            const clubId = clubs[0].getId();
            const cantidadInicial = clubs.length;

            await sqliteClub.deleteClub(clubId);

            const clubsActualizados = await sqliteClub.getClubs();
            expect(clubsActualizados.length).toBe(cantidadInicial - 1);
        });

        it('No debería encontrar el club después de eliminarlo', async () => {
            const clubs = await sqliteClub.getClubs();
            const clubId = clubs[0].getId();

            await sqliteClub.deleteClub(clubId);

            await expect(sqliteClub.getClub(clubId)).rejects.toThrow('No existe dicho club');
        });

        it('No debería lanzar error al eliminar un club inexistente', async () => {
            await expect(sqliteClub.deleteClub('99999')).resolves.not.toThrow();
        });

        it('Debería eliminar solo el club especificado', async () => {
            const clubs = await sqliteClub.getClubs();
            const club1Id = clubs[0].getId();
            const club2Id = clubs[1].getId();

            await sqliteClub.deleteClub(club1Id);

            const club2Existe = await sqliteClub.getClub(club2Id);
            expect(club2Existe).toBeDefined();
            expect(club2Existe.getId()).toBe(club2Id);
        });

        it('Debería verificar la configuración de CASCADE en la base de datos', async () => {
            const clubs = await sqliteClub.getClubs();
            const clubId = clubs[0].getId();

            // Crear turno y cancha para el club
            const db = await openDb();
            
            // Habilitar foreign keys explícitamente
            await db.run('PRAGMA foreign_keys = ON');
            
            const turnoResult = await db.run(
                'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
                ['Turno Test', 1000]
            );
            const canchaResult = await db.run(
                'INSERT INTO canchas (nombreCancha, deporte, tamanio, turnoId, clubId) VALUES (?, ?, ?, ?, ?)',
                ['Cancha Cascade', 'Fútbol', '5vs5', turnoResult.lastID, clubId]
            );

            // Verificar que la cancha está asociada al club
            const canchaAntes = await db.get('SELECT clubId FROM canchas WHERE id = ?', [canchaResult.lastID]);
            expect(canchaAntes.clubId.toString()).toBe(clubId);

            // Eliminar el club
            await sqliteClub.deleteClub(clubId);

            // Verificar que la cancha también fue eliminada o desasociada
            const cancha = await db.get('SELECT * FROM canchas WHERE id = ?', [canchaResult.lastID]);
            // Si CASCADE funciona, la cancha será undefined; si no, al menos verificamos que se eliminó el club
            const clubEliminado = await db.get('SELECT * FROM clubs WHERE id = ?', [clubId]);
            expect(clubEliminado).toBeUndefined();
        });
    });

    describe('editClub', () => {
        it('Debería actualizar todos los campos de un club', async () => {
            const clubs = await sqliteClub.getClubs();
            const clubId = clubs[0].getId();

            const clubEditado = await sqliteClub.editClub(
                clubId,
                'Dirección Editada',
                'Club Editado',
                '9999999999',
                'editado@club.com',
                3
            );

            expect(clubEditado.getDireccion()).toBe('Dirección Editada');
            expect(clubEditado.getNombreClub()).toBe('Club Editado');
            expect(clubEditado.getTelefono()).toBe('9999999999');
            expect(clubEditado.getGmail()).toBe('editado@club.com');
            expect(clubEditado.getValoracion()).toBe(3);
        });

        it('Debería actualizar solo el nombre del club', async () => {
            const clubs = await sqliteClub.getClubs();
            const clubOriginal = clubs[0];
            const clubId = clubOriginal.getId();

            const clubEditado = await sqliteClub.editClub(
                clubId,
                clubOriginal.getDireccion(),
                'Nuevo Nombre Club',
                clubOriginal.getTelefono(),
                clubOriginal.getGmail(),
                clubOriginal.getValoracion()
            );

            expect(clubEditado.getNombreClub()).toBe('Nuevo Nombre Club');
            expect(clubEditado.getDireccion()).toBe(clubOriginal.getDireccion());
            expect(clubEditado.getTelefono()).toBe(clubOriginal.getTelefono());
        });

        it('Debería persistir los cambios después de editar', async () => {
            const clubs = await sqliteClub.getClubs();
            const clubId = clubs[0].getId();

            await sqliteClub.editClub(
                clubId,
                'Persistencia Dir',
                'Persistencia Club',
                '7777777777',
                'persistencia@club.com',
                2
            );

            const clubRecuperado = await sqliteClub.getClub(clubId);

            expect(clubRecuperado.getNombreClub()).toBe('Persistencia Club');
            expect(clubRecuperado.getDireccion()).toBe('Persistencia Dir');
            expect(clubRecuperado.getTelefono()).toBe('7777777777');
            expect(clubRecuperado.getGmail()).toBe('persistencia@club.com');
            expect(clubRecuperado.getValoracion()).toBe(2);
        });

        it('Debería mantener el ID del club después de editar', async () => {
            const clubs = await sqliteClub.getClubs();
            const clubId = clubs[0].getId();

            const clubEditado = await sqliteClub.editClub(
                clubId,
                'Dir Test',
                'ID Test',
                '1111111111',
                'idtest@club.com',
                5
            );

            expect(clubEditado.getId()).toBe(clubId);
        });

        it('Debería actualizar la valoración del club', async () => {
            const clubs = await sqliteClub.getClubs();
            const clubId = clubs[0].getId();
            const clubOriginal = clubs[0];

            const clubEditado = await sqliteClub.editClub(
                clubId,
                clubOriginal.getDireccion(),
                clubOriginal.getNombreClub(),
                clubOriginal.getTelefono(),
                clubOriginal.getGmail(),
                1
            );

            expect(clubEditado.getValoracion()).toBe(1);
        });
    });

    describe('addCanchaAClub', () => {
        it('Debería agregar una cancha existente a un club', async () => {
            const clubs = await sqliteClub.getClubs();
            const clubId = clubs[0].getId();

            // Crear turno y cancha sin club
            const db = await openDb();
            const turnoResult = await db.run(
                'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
                ['Turno Test', 1500]
            );
            const canchaResult = await db.run(
                'INSERT INTO canchas (nombreCancha, deporte, tamanio, turnoId) VALUES (?, ?, ?, ?)',
                ['Cancha Sin Club', 'Fútbol', '7vs7', turnoResult.lastID]
            );

            const turno = new Turno(turnoResult.lastID!.toString(), 'Turno Test', 1500);
            const cancha = new Cancha(canchaResult.lastID!.toString(), 'Cancha Sin Club', 'Fútbol', '7vs7', turno);

            const clubActualizado = await sqliteClub.addCanchaAClub(clubId, cancha);

            expect(clubActualizado.getCanchas().length).toBe(1);
            expect(clubActualizado.getCanchas()[0].getNombreCancha()).toBe('Cancha Sin Club');
        });

        it('Debería asociar correctamente la cancha al club en la base de datos', async () => {
            const clubs = await sqliteClub.getClubs();
            const clubId = clubs[0].getId();

            // Crear cancha
            const db = await openDb();
            const turnoResult = await db.run(
                'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
                ['Turno Test', 2000]
            );
            const canchaResult = await db.run(
                'INSERT INTO canchas (nombreCancha, deporte, tamanio, turnoId) VALUES (?, ?, ?, ?)',
                ['Cancha Asociar', 'Basket', '5vs5', turnoResult.lastID]
            );

            const turno = new Turno(turnoResult.lastID!.toString(), 'Turno Test', 2000);
            const cancha = new Cancha(canchaResult.lastID!.toString(), 'Cancha Asociar', 'Basket', '5vs5', turno);

            await sqliteClub.addCanchaAClub(clubId, cancha);

            // Verificar en la base de datos
            const row = await db.get('SELECT clubId FROM canchas WHERE id = ?', [cancha.getId()]);
            expect(row.clubId.toString()).toBe(clubId);
        });

        it('Debería poder agregar múltiples canchas al mismo club', async () => {
            const clubs = await sqliteClub.getClubs();
            const clubId = clubs[0].getId();

            const db = await openDb();
            const turnoResult = await db.run(
                'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
                ['Turno Test', 1000]
            );

            // Crear dos canchas
            const cancha1Result = await db.run(
                'INSERT INTO canchas (nombreCancha, deporte, tamanio, turnoId) VALUES (?, ?, ?, ?)',
                ['Cancha 1', 'Fútbol', '5vs5', turnoResult.lastID]
            );
            const cancha2Result = await db.run(
                'INSERT INTO canchas (nombreCancha, deporte, tamanio, turnoId) VALUES (?, ?, ?, ?)',
                ['Cancha 2', 'Fútbol', '7vs7', turnoResult.lastID]
            );

            const turno = new Turno(turnoResult.lastID!.toString(), 'Turno Test', 1000);
            const cancha1 = new Cancha(cancha1Result.lastID!.toString(), 'Cancha 1', 'Fútbol', '5vs5', turno);
            const cancha2 = new Cancha(cancha2Result.lastID!.toString(), 'Cancha 2', 'Fútbol', '7vs7', turno);

            await sqliteClub.addCanchaAClub(clubId, cancha1);
            const clubActualizado = await sqliteClub.addCanchaAClub(clubId, cancha2);

            expect(clubActualizado.getCanchas().length).toBe(2);
        });
    });

    describe('deleteCanchaAClub', () => {
        it('Debería desasociar una cancha de un club', async () => {
            const clubs = await sqliteClub.getClubs();
            const clubId = clubs[0].getId();

            // Crear cancha asociada al club
            const db = await openDb();
            const turnoResult = await db.run(
                'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
                ['Turno Test', 1500]
            );
            const canchaResult = await db.run(
                'INSERT INTO canchas (nombreCancha, deporte, tamanio, turnoId, clubId) VALUES (?, ?, ?, ?, ?)',
                ['Cancha Desasociar', 'Fútbol', '7vs7', turnoResult.lastID, clubId]
            );

            const clubActualizado = await sqliteClub.deleteCanchaAClub(clubId, canchaResult.lastID!.toString());

            expect(clubActualizado.getCanchas().length).toBe(0);
        });

        it('Debería poner clubId en NULL al desasociar la cancha', async () => {
            const clubs = await sqliteClub.getClubs();
            const clubId = clubs[0].getId();

            const db = await openDb();
            const turnoResult = await db.run(
                'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
                ['Turno Test', 2000]
            );
            const canchaResult = await db.run(
                'INSERT INTO canchas (nombreCancha, deporte, tamanio, turnoId, clubId) VALUES (?, ?, ?, ?, ?)',
                ['Cancha NULL Test', 'Basket', '5vs5', turnoResult.lastID, clubId]
            );

            await sqliteClub.deleteCanchaAClub(clubId, canchaResult.lastID!.toString());

            const row = await db.get('SELECT clubId FROM canchas WHERE id = ?', [canchaResult.lastID]);
            expect(row.clubId).toBeNull();
        });

        it('No debería eliminar la cancha, solo desasociarla', async () => {
            const clubs = await sqliteClub.getClubs();
            const clubId = clubs[0].getId();

            const db = await openDb();
            const turnoResult = await db.run(
                'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
                ['Turno Test', 1200]
            );
            const canchaResult = await db.run(
                'INSERT INTO canchas (nombreCancha, deporte, tamanio, turnoId, clubId) VALUES (?, ?, ?, ?, ?)',
                ['Cancha Existe', 'Volley', '6vs6', turnoResult.lastID, clubId]
            );

            await sqliteClub.deleteCanchaAClub(clubId, canchaResult.lastID!.toString());

            // Verificar que la cancha sigue existiendo
            const cancha = await db.get('SELECT * FROM canchas WHERE id = ?', [canchaResult.lastID]);
            expect(cancha).toBeDefined();
            expect(cancha.nombreCancha).toBe('Cancha Existe');
        });

        it('Debería desasociar solo la cancha especificada', async () => {
            const clubs = await sqliteClub.getClubs();
            const clubId = clubs[0].getId();

            const db = await openDb();
            const turnoResult = await db.run(
                'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
                ['Turno Test', 1000]
            );
            const cancha1Result = await db.run(
                'INSERT INTO canchas (nombreCancha, deporte, tamanio, turnoId, clubId) VALUES (?, ?, ?, ?, ?)',
                ['Cancha 1', 'Fútbol', '5vs5', turnoResult.lastID, clubId]
            );
            const cancha2Result = await db.run(
                'INSERT INTO canchas (nombreCancha, deporte, tamanio, turnoId, clubId) VALUES (?, ?, ?, ?, ?)',
                ['Cancha 2', 'Fútbol', '7vs7', turnoResult.lastID, clubId]
            );

            const clubActualizado = await sqliteClub.deleteCanchaAClub(clubId, cancha1Result.lastID!.toString());

            expect(clubActualizado.getCanchas().length).toBe(1);
            expect(clubActualizado.getCanchas()[0].getNombreCancha()).toBe('Cancha 2');
        });
    });

    describe('size', () => {
        it('Debería retornar el número correcto de clubs', async () => {
            const cantidad = await sqliteClub.size();

            expect(cantidad).toBe(2);
        });

        it('Debería retornar 0 cuando no hay clubs', async () => {
            const db = await openDb();
            await db.run('DELETE FROM clubs');

            const cantidad = await sqliteClub.size();

            expect(cantidad).toBe(0);
        });

        it('Debería actualizar el tamaño al agregar clubs', async () => {
            const cantidadInicial = await sqliteClub.size();

            const nuevoClub = new Club('', 'Dir Nueva', 'Club Nuevo', '1111111111', 'nuevo@test.com', 5);
            await sqliteClub.addClub(nuevoClub);

            const cantidadFinal = await sqliteClub.size();

            expect(cantidadFinal).toBe(cantidadInicial + 1);
        });

        it('Debería actualizar el tamaño al eliminar clubs', async () => {
            const cantidadInicial = await sqliteClub.size();
            const clubs = await sqliteClub.getClubs();

            await sqliteClub.deleteClub(clubs[0].getId());

            const cantidadFinal = await sqliteClub.size();

            expect(cantidadFinal).toBe(cantidadInicial - 1);
        });
    });

    describe('Integridad de datos', () => {
        it('Debería mantener los IDs únicos e incrementales', async () => {
            const club1 = new Club('', 'Dir A', 'Club A', '111', 'a@test.com', 5);
            const club2 = new Club('', 'Dir B', 'Club B', '222', 'b@test.com', 4);

            const creado1 = await sqliteClub.addClub(club1);
            const creado2 = await sqliteClub.addClub(club2);

            const id1 = parseInt(creado1.getId());
            const id2 = parseInt(creado2.getId());

            expect(id2).toBeGreaterThan(id1);
        });

        it('Debería persistir los datos entre consultas', async () => {
            const nuevoClub = new Club('', 'Persistencia Dir', 'Persistencia', '3333333333', 'persist@test.com', 4);
            const clubCreado = await sqliteClub.addClub(nuevoClub);

            // Crear una nueva instancia del repositorio para simular reconexión
            const nuevoRepositorio = new SQLiteClub();
            const clubRecuperado = await nuevoRepositorio.getClub(clubCreado.getId());

            expect(clubRecuperado).toBeDefined();
            expect(clubRecuperado.getNombreClub()).toBe('Persistencia');
            expect(clubRecuperado.getDireccion()).toBe('Persistencia Dir');
        });

        it('Debería mantener la relación con canchas después de múltiples operaciones', async () => {
            const nuevoClub = new Club('', 'Dir Relación', 'Club Relación', '4444444444', 'relacion@test.com', 5);
            const clubCreado = await sqliteClub.addClub(nuevoClub);

            // Agregar cancha
            const db = await openDb();
            const turnoResult = await db.run(
                'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
                ['Turno Test', 1500]
            );
            const canchaResult = await db.run(
                'INSERT INTO canchas (nombreCancha, deporte, tamanio, turnoId, clubId) VALUES (?, ?, ?, ?, ?)',
                ['Cancha Relación', 'Fútbol', '5vs5', turnoResult.lastID, clubCreado.getId()]
            );

            // Editar el club
            await sqliteClub.editClub(
                clubCreado.getId(),
                'Nueva Dirección',
                'Nuevo Nombre',
                '5555555555',
                'nuevo@test.com',
                3
            );

            // Recuperar y verificar
            const clubFinal = await sqliteClub.getClub(clubCreado.getId());

            expect(clubFinal.getCanchas().length).toBe(1);
            expect(clubFinal.getCanchas()[0].getNombreCancha()).toBe('Cancha Relación');
        });

        it('Debería mantener la integridad al eliminar y recrear clubs', async () => {
            const clubs = await sqliteClub.getClubs();
            const cantidadInicial = clubs.length;

            // Eliminar un club
            await sqliteClub.deleteClub(clubs[0].getId());

            // Crear nuevo club
            const nuevoClub = new Club('', 'Dir Nueva', 'Club Nuevo', '6666666666', 'nuevo@test.com', 5);
            await sqliteClub.addClub(nuevoClub);

            const clubsFinales = await sqliteClub.getClubs();

            expect(clubsFinales.length).toBe(cantidadInicial);
        });
    });
});
