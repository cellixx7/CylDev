import { defineConfig, devices } from "@playwright/test";

// Testes de jornada no navegador. Rodam com `npm run test:e2e`, nunca no `npm test` nem no `npm run build`.
// O servidor é o `vite preview` sobre um build novo; o Playwright o encerra pelo PID que ele mesmo abriu.
const PORTA = 4319;
const ENDERECO = `http://127.0.0.1:${PORTA}`;

export default defineConfig({
  testDir: "e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: ENDERECO,
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npx vite preview --host 127.0.0.1 --port ${PORTA} --strictPort`,
    url: ENDERECO,
    // Sempre um build novo: reaproveitar um servidor antigo testaria código velho.
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
