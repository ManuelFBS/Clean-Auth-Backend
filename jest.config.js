export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const roots = ['<rootDir>/test'];
export const testMatch = ['**/*.test.ts'];
export const moduleFileExtensions = ['ts', 'js', 'json'];
export const transform = {
    '^.+\\.ts$': 'ts-jest',
};
export const collectCoverageFrom = [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/infrastructure/web/server.ts',
];
