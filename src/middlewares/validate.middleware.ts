import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    ok: false,
                    message: 'Errores de validación',
                    errors: error.issues.map((err: z.ZodIssue) => ({
                        campo: err.path.join('.'),
                        mensaje: err.message
                    }))
                });
                return;
            }
            next(error);
        }
    };
};