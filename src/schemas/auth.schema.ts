import { z } from 'zod';

export const registerSchema = z.object({
    nombre: z.string({
        message: 'El nombre es requerido'
    }).min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
      .max(50, { message: 'El nombre no puede exceder 50 caracteres' }),
    
    email: z.email({ message: 'Formato de email inválido' })
      .min(5, { message: 'El email es demasiado corto' })
      .max(100, { message: 'El email es demasiado largo' }),
    
    password: z.string({
        message: 'La contraseña es requerida'
    }).min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
      .max(100, { message: 'La contraseña es demasiado larga' })
});


export const loginSchema = z.object({
    email: z.email({ message: 'Formato de email inválido' }),
    
    password: z.string({
        message: 'La contraseña es requerida'
    }).min(1, { message: 'La contraseña no puede estar vacía' })
});
