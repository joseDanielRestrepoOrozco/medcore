import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Go to the starting url before each test.
  await page.goto('http://localhost:5173/');
});

test('has title', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(
    page.getByRole('heading', { name: 'Bienvenido a MedCore' })
  ).toBeVisible();
});

test('log-in', async ({ page }) => {
  await page.getByLabel('Iniciar sesión').click();
  await page.getByRole('textbox', { name: 'Correo' }).click();
  await page
    .getByRole('textbox', { name: 'Correo' })
    .fill('jose.resoro4789@gmail.com');
  await page
    .getByRole('textbox', { name: 'Contraseña Mostrar contraseña' })
    .click();
  await page
    .getByRole('textbox', { name: 'Contraseña Mostrar contraseña' })
    .fill('123456');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.getByRole('complementary').waitFor();
  expect(page.getByRole('complementary')).toBeVisible();
});
