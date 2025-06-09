import rateLimit from 'express-rate-limit';
import { logger } from '../../infrastructure/services/Logger';

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //> 15 minutos...
    max: 5, //> límite de 5 peticiones por ventana...
    handler: (req, res) => {
        logger.warn(
            `Rate limit exceeded for IP: ${req.ip}`,
        );
        res.status(429).json({
            error: {
                message:
                    'Too many requests, please try again later',
                code: 'RATE_LIMIT_EXCEEDED',
                status: 429,
            },
        });
    },
});
