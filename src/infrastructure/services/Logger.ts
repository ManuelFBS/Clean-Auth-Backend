import winston from 'winston';

const { combine, timestamp, printf, colorize } =
    winston.format;

const logFormat = printf(
    ({ level, message, timestamp }) => {
        return `${timestamp} [${level}]: ${message}`;
    },
);

export const logger = winston.createLogger({
    level: 'info',
    format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat,
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
        }),
    ],
});

//~ Para desarrollo, mostramos logs más detallados...
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.simple(),
        }),
    );
}
