import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/tests/singleton.ts'],
    extensionsToTreatAsEsm: ['.ts'],
};

export default config;
