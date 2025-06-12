import 'reflect-metadata'; //* Necesario para 'inversify'...
import { logger } from '../src/infrastructure/services/Logger';

//~ Configurar logger para tests...
logger.silent = true;

//~ Limpiar mocks después de cada test...
afterEach(() => {
    jest.clearAllMocks();
});
