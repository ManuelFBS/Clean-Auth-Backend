import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res
            .status(401)
            .json({ error: 'No token provided...!' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res
            .status(401)
            .json({ error: 'Token error...!' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res
            .status(401)
            .json({ error: 'Token malformatted...!' });
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        (err, decoded) => {
            if (err) {
                return res
                    .status(401)
                    .json({ error: 'Token invalid...!' });
            }

            (req as any).userId = (decoded as any).id;

            return next();
        },
    );
}
