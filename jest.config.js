export const preset = 'ts-jest';
export const testEnviropmen = 'node';
export const testMatch = ['**/*.test.ts'];
export const collectCoverage = true;
export const coverageDirectory = 'coverage';
export const coveragePathIgnorePatterns = [
    '/node_modules/',
    '/dist/',
    '/src/infrastructure/web/server.ts',
    '/src/index.ts',
];
