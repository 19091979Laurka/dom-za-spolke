import { defineConfig, devices } from '@playwright/test';
export default defineConfig({ testDir:'./tests', testMatch:'**/*.e2e.ts', timeout:30000, workers:2, use:{baseURL:process.env.TEST_BASE_URL || 'http://localhost:47321', ...devices['Desktop Chrome'], trace:'retain-on-failure'}, reporter:[['list'],['json',{outputFile:'test-results/e2e.json'}]] });
