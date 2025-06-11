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
export const testTimeout = 30000; // 30 seconds timeout
export const forceExit = true; // Force Jest to exit after all tests complete
export const detectOpenHandles = true; // Help detect open handles
