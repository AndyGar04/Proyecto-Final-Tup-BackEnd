import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SQLiteCancha } from '../../models/repository/sqliteCancha';
import { Cancha } from '../../models/cancha';
import { Turno } from '../../models/turno';
import { openDb } from '../../database/database';

describe('SQLiteCancha - Integración con Base de Datos', () => {
    let sqliteCancha: SQLiteCancha;
    let turnoTest1: Turno;
    let turnoTest2: Turno;
    let clubIdTest: number;

    beforeEach(async () => {
        sqliteCancha = new SQLiteCancha();
        const db = await openDb();
        
        // Limpiar las tablas relacionadas antes de cada test
        await db.execute('DELETE FROM canchas');
        await db.execute('DELETE FROM turnos');
        await db.execute('DELETE FROM clubs');
        
        // Insertar clubs de prueba
        const clubResult = await db.execute({
            sql: 'INSERT INTO clubs (nombreClub, direccion, telefono, gmail, valoracion) VALUES (?, ?, ?, ?, ?)',
            args: ['Club Deportivo 1', 'Av. Siempre Viva 123', '1234567890', 'club1@test.com', 5]
        });
        clubIdTest = Number(clubResult.lastInsertRowid ?? 1);
        
        // Insertar turnos de prueba
        const turno1Result = await db.execute({
            sql: 'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
            args: ['Turno Mañana', 1500]
        });
        
        const turno2Result = await db.execute({
            sql: 'INSERT INTO turnos (descripcionTurno, costo) VALUES (?, ?)',
            args: ['Turno Tarde', 2000]
        });
        
        const turno1Id = Number(turno1Result.lastInsertRowid ?? 1);
        const turno2Id = Number(turno2Result.lastInsertRowid ?? 2);
        
        turnoTest1 = new Turno(turno1Id.toString(), 'Turno Mañana', 1500);
        turnoTest2 = new Turno(turno2Id.toString(), 'Turno Tarde', 2000);
        
        // Insertar canchas de prueba
        await db.execute({
            sql: 'INSERT INTO canchas (nombreCancha, deporte, tamanio, turnoId, clubId) VALUES (?, ?, ?, ?, ?)',
            args: ['Cancha 1', 'Fútbol', '11vs11', turno1Id, clubIdTest]
        });
        await db.execute({
            sql: 'INSERT INTO canchas (nombreCancha, deporte, tamanio, turnoId, clubId) VALUES (?, ?, ?, ?, ?)',
            args: ['Cancha 2', 'Fútbol', '7vs7', turno2Id, clubIdTest]
        });
    });

    afterEach(async () => {
        const db = await openDb();
        await db.execute('DELETE FROM canchas');
        await db.execute('DELETE FROM turnos');
        await db.execute('DELETE FROM clubs');
    });

    describe('getCanchas', () => {
        it('Debería retornar todas las canchas', async () => {
            const canchas = await sqliteCancha.getCanchas();

            expect(canchas).toBeInstanceOf(Array);
            expect(canchas.length).toBe(2);
            expect(canchas[0]).toBeInstanceOf(Cancha);
        });

        it('Debería encontrar una cancha existente por ID', async () => {
            const canchas = await sqliteCancha.getCanchas();
            const primeraCanchaId = canchas[0]!.getId();

            const cancha = await sqliteCancha.getCancha(primeraCanchaId);

            expect(cancha).toBeDefined();
            expect(cancha.getId()).toBe(primeraCanchaId);
            expect(cancha.getNombreCancha()).toBe('Cancha 1');
        });

        it('Debería lanzar error si la cancha no existe', async () => {
            await expect(sqliteCancha.getCancha('99999')).rejects.toThrow('No existe dicha cancha');
        });

        it('Debería retornar la cancha con su turno completo', async () => {
            const canchas = await sqliteCancha.getCanchas();
            const canchaId = canchas[0]!.getId();

            const cancha = await sqliteCancha.getCancha(canchaId);

            expect(cancha.getTurno()).toBeInstanceOf(Turno);
            expect(cancha.getTurno().getId()).toBeDefined();
            expect(cancha.getTurno().getDescripcionTurno()).toBe('Turno Mañana');
        });

        it('Debería retornar propiedades correctas de la cancha', async () => {
            const canchas = await sqliteCancha.getCanchas();
            const cancha1 = canchas.find(c => c.getNombreCancha() === 'Cancha 1');

            expect(cancha1?.getNombreCancha()).toBe('Cancha 1');
            expect(cancha1?.getDeporte()).toBe('Fútbol');
            expect(cancha1?.getTamanio()).toBe('11vs11');
        });
    });

    describe('addCancha', () => {
        it('Debería crear una nueva cancha', async () => {
            const nuevaCancha = new Cancha('', 'Cancha 3', 'Basket', '5vs5', turnoTest1);

            const canchaCreada = await sqliteCancha.addCancha(nuevaCancha, clubIdTest.toString());

            expect(canchaCreada.getId()).toBeDefined();
            expect(canchaCreada.getId()).not.toBe('');
            expect(canchaCreada.getNombreCancha()).toBe('Cancha 3');
            expect(canchaCreada.getDeporte()).toBe('Basket');
            expect(canchaCreada.getTamanio()).toBe('5vs5');
        });

        it('Debería asignar un ID válido a la cancha creada', async () => {
            const nuevaCancha = new Cancha('', 'Cancha Nueva', 'Tenis', 'Individual', turnoTest2);

            const canchaCreada = await sqliteCancha.addCancha(nuevaCancha, clubIdTest.toString());
            const idAsignado = parseInt(canchaCreada.getId());

            expect(idAsignado).toBeGreaterThan(0);
            expect(isNaN(idAsignado)).toBe(false);
        });

        it('Debería poder recuperar la cancha después de crearla', async () => {
            const nuevaCancha = new Cancha('', 'Cancha Recuperable', 'Volley', '6vs6', turnoTest1);

            const canchaCreada = await sqliteCancha.addCancha(nuevaCancha, clubIdTest.toString());
            const canchaRecuperada = await sqliteCancha.getCancha(canchaCreada.getId());

            expect(canchaRecuperada.getNombreCancha()).toBe('Cancha Recuperable');
            expect(canchaRecuperada.getDeporte()).toBe('Volley');
            expect(canchaRecuperada.getTamanio()).toBe('6vs6');
        });

        it('Debería asociar correctamente el turno a la cancha creada', async () => {
            const nuevaCancha = new Cancha('', 'Cancha Turno Test', 'Fútbol', '7vs7', turnoTest2);

            const canchaCreada = await sqliteCancha.addCancha(nuevaCancha, clubIdTest.toString());
            const canchaRecuperada = await sqliteCancha.getCancha(canchaCreada.getId());

            expect(canchaRecuperada.getTurno().getId()).toBe(turnoTest2.getId());
            expect(canchaRecuperada.getTurno().getDescripcionTurno()).toBe('Turno Tarde');
        });
    });

    describe('addCanchaAClub', () => {
        it('Debería agregar una cancha a un club específico', async () => {
            const nuevaCancha = new Cancha('', 'Cancha Club Test', 'Paddle', 'Dobles', turnoTest1);

            const canchaCreada = await sqliteCancha.addCanchaAClub(nuevaCancha, clubIdTest.toString());

            expect(canchaCreada.getId()).toBeDefined();
            expect(canchaCreada.getNombreCancha()).toBe('Cancha Club Test');

            const db = await openDb();
            const result = await db.execute({
                sql: 'SELECT clubId FROM canchas WHERE id = ?',
                args: [canchaCreada.getId()]
            });
            const row = result.rows[0] as any;
            expect(row.clubId).toBe(clubIdTest);
        });

        it('Debería funcionar igual que addCancha', async () => {
            const cancha1 = new Cancha('', 'Test 1', 'Fútbol', '5vs5', turnoTest1);
            const cancha2 = new Cancha('', 'Test 2', 'Fútbol', '5vs5', turnoTest1);

            const resultado1 = await sqliteCancha.addCancha(cancha1, clubIdTest.toString());
            const resultado2 = await sqliteCancha.addCanchaAClub(cancha2, clubIdTest.toString());

            expect(resultado1.getId()).toBeDefined();
            expect(resultado2.getId()).toBeDefined();
            expect(resultado1.getNombreCancha()).toBe('Test 1');
            expect(resultado2.getNombreCancha()).toBe('Test 2');
        });
    });

    describe('deleteCancha', () => {
        it('Debería eliminar una cancha existente', async () => {
            const canchas = await sqliteCancha.getCanchas();
            const canchaId = canchas[0]!.getId();
            const cantidadInicial = canchas.length;

            await sqliteCancha.deleteCancha(canchaId);

            const canchasActualizadas = await sqliteCancha.getCanchas();
            expect(canchasActualizadas.length).toBe(cantidadInicial - 1);
        });

        it('No debería encontrar la cancha después de eliminarla', async () => {
            const canchas = await sqliteCancha.getCanchas();
            const canchaId = canchas[0]!.getId();

            await sqliteCancha.deleteCancha(canchaId);

            await expect(sqliteCancha.getCancha(canchaId)).rejects.toThrow('No existe dicha cancha');
        });

        it('No debería lanzar error al eliminar una cancha inexistente', async () => {
            await expect(sqliteCancha.deleteCancha('99999')).resolves.not.toThrow();
        });

        it('Debería eliminar solo la cancha especificada', async () => {
            const canchas = await sqliteCancha.getCanchas();
            const cancha1Id = canchas[0]!.getId();
            const cancha2Id = canchas[1]!.getId();

            await sqliteCancha.deleteCancha(cancha1Id);

            const cancha2Existe = await sqliteCancha.getCancha(cancha2Id);
            expect(cancha2Existe).toBeDefined();
            expect(cancha2Existe.getId()).toBe(cancha2Id);
        });
    });

    describe('editCancha', () => {
        it('Debería actualizar todos los campos de una cancha', async () => {
            const canchas = await sqliteCancha.getCanchas();
            const canchaId = canchas[0]!.getId();

            const canchaEditada = await sqliteCancha.editCancha(
                canchaId,
                'Cancha Editada',
                'Hockey',
                '10vs10',
                turnoTest2
            );

            expect(canchaEditada.getNombreCancha()).toBe('Cancha Editada');
            expect(canchaEditada.getDeporte()).toBe('Hockey');
            expect(canchaEditada.getTamanio()).toBe('10vs10');
            expect(canchaEditada.getTurno().getId()).toBe(turnoTest2.getId());
        });

        it('Debería actualizar solo el nombre de la cancha', async () => {
            const canchas = await sqliteCancha.getCanchas();
            const canchaOriginal = canchas[0]!;
            const canchaId = canchaOriginal.getId();

            const canchaEditada = await sqliteCancha.editCancha(
                canchaId,
                'Nuevo Nombre',
                canchaOriginal.getDeporte(),
                canchaOriginal.getTamanio(),
                canchaOriginal.getTurno()
            );

            expect(canchaEditada.getNombreCancha()).toBe('Nuevo Nombre');
            expect(canchaEditada.getDeporte()).toBe(canchaOriginal.getDeporte());
            expect(canchaEditada.getTamanio()).toBe(canchaOriginal.getTamanio());
        });

        it('Debería persistir los cambios después de editar', async () => {
            const canchas = await sqliteCancha.getCanchas();
            const canchaId = canchas[0]!.getId();

            await sqliteCancha.editCancha(
                canchaId,
                'Persistencia Test',
                'Rugby',
                '15vs15',
                turnoTest1
            );

            const canchaRecuperada = await sqliteCancha.getCancha(canchaId);

            expect(canchaRecuperada.getNombreCancha()).toBe('Persistencia Test');
            expect(canchaRecuperada.getDeporte()).toBe('Rugby');
            expect(canchaRecuperada.getTamanio()).toBe('15vs15');
        });

        it('Debería aceptar turno como string (turnoId)', async () => {
            const canchas = await sqliteCancha.getCanchas();
            const canchaId = canchas[0]!.getId();

            const canchaEditada = await sqliteCancha.editCancha(
                canchaId,
                'Cancha String Turno',
                'Fútbol',
                '7vs7',
                turnoTest2.getId()
            );

            expect(canchaEditada.getTurno().getId()).toBe(turnoTest2.getId());
        });

        it('Debería aceptar turno como objeto Turno', async () => {
            const canchas = await sqliteCancha.getCanchas();
            const canchaId = canchas[0]!.getId();

            const canchaEditada = await sqliteCancha.editCancha(
                canchaId,
                'Cancha Objeto Turno',
                'Fútbol',
                '11vs11',
                turnoTest1
            );

            expect(canchaEditada.getTurno().getId()).toBe(turnoTest1.getId());
        });

        it('Debería mantener el ID de la cancha después de editar', async () => {
            const canchas = await sqliteCancha.getCanchas();
            const canchaId = canchas[0]!.getId();

            const canchaEditada = await sqliteCancha.editCancha(
                canchaId,
                'ID Test',
                'Fútbol',
                '5vs5',
                turnoTest1
            );

            expect(canchaEditada.getId()).toBe(canchaId);
        });
    });

    describe('size', () => {
        it('Debería retornar el número correcto de canchas', async () => {
            const cantidad = await sqliteCancha.size();

            expect(cantidad).toBe(2);
        });

        it('Debería retornar 0 cuando no hay canchas', async () => {
            const db = await openDb();
            await db.execute('DELETE FROM canchas');

            const cantidad = await sqliteCancha.size();

            expect(cantidad).toBe(0);
        });

        it('Debería actualizar el tamaño al agregar canchas', async () => {
            const cantidadInicial = await sqliteCancha.size();

            const nuevaCancha = new Cancha('', 'Nueva', 'Fútbol', '5vs5', turnoTest1);
            await sqliteCancha.addCancha(nuevaCancha, clubIdTest.toString());

            const cantidadFinal = await sqliteCancha.size();

            expect(cantidadFinal).toBe(cantidadInicial + 1);
        });

        it('Debería actualizar el tamaño al eliminar canchas', async () => {
            const cantidadInicial = await sqliteCancha.size();
            const canchas = await sqliteCancha.getCanchas();

            await sqliteCancha.deleteCancha(canchas[0]!.getId());

            const cantidadFinal = await sqliteCancha.size();

            expect(cantidadFinal).toBe(cantidadInicial - 1);
        });
    });

    describe('Integridad de datos', () => {
        it('Debería mantener los IDs únicos e incrementales', async () => {
            const cancha1 = new Cancha('', 'Cancha A', 'Fútbol', '5vs5', turnoTest1);
            const cancha2 = new Cancha('', 'Cancha B', 'Fútbol', '7vs7', turnoTest1);

            const creada1 = await sqliteCancha.addCancha(cancha1, clubIdTest.toString());
            const creada2 = await sqliteCancha.addCancha(cancha2, clubIdTest.toString());

            const id1 = parseInt(creada1.getId());
            const id2 = parseInt(creada2.getId());

            expect(id2).toBeGreaterThan(id1);
        });

        it('Debería persistir los datos entre consultas', async () => {
            const nuevaCancha = new Cancha('', 'Persistencia', 'Fútbol', '7vs7', turnoTest1);
            const canchaCreada = await sqliteCancha.addCancha(nuevaCancha, clubIdTest.toString());

            const nuevoRepositorio = new SQLiteCancha();
            const canchaRecuperada = await nuevoRepositorio.getCancha(canchaCreada.getId());

            expect(canchaRecuperada).toBeDefined();
            expect(canchaRecuperada.getNombreCancha()).toBe('Persistencia');
            expect(canchaRecuperada.getDeporte()).toBe('Fútbol');
        });

        it('Debería mantener la relación con el turno después de múltiples operaciones', async () => {
            const nuevaCancha = new Cancha('', 'Relación Test', 'Fútbol', '5vs5', turnoTest1);
            const canchaCreada = await sqliteCancha.addCancha(nuevaCancha, clubIdTest.toString());

            await sqliteCancha.editCancha(
                canchaCreada.getId(),
                'Relación Editada',
                'Basket',
                '5vs5',
                turnoTest2
            );

            const canchaFinal = await sqliteCancha.getCancha(canchaCreada.getId());

            expect(canchaFinal.getTurno().getId()).toBe(turnoTest2.getId());
            expect(canchaFinal.getTurno().getDescripcionTurno()).toBe('Turno Tarde');
        });

        it('Debería mantener la relación con el club después de crear la cancha', async () => {
            const nuevaCancha = new Cancha('', 'Club Test', 'Fútbol', '5vs5', turnoTest1);
            const canchaCreada = await sqliteCancha.addCancha(nuevaCancha, clubIdTest.toString());

            const db = await openDb();
            const result = await db.execute({
                sql: 'SELECT clubId FROM canchas WHERE id = ?',
                args: [canchaCreada.getId()]
            });
            const row = result.rows[0] as any;

            expect(row.clubId).toBe(clubIdTest);
        });
    });
});
