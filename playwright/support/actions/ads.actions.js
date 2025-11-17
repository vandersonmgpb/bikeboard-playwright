import { expect } from "@playwright/test"

export const bikeActions = page => {
  const gotoHomePage = async () => {
    await page.goto("/")
    await expect(page).toHaveTitle(/BikeBoard/)
  }

  const clickAdvertiseLink = async () => {
    await page.getByRole("link", { name: "Anunciar Grátis" }).click()
    await expect(page).toHaveURL("/cadastrar")
    await expect(
      page.getByRole("heading", { name: "Anunciar Bicicleta" })
    ).toBeVisible()
  }

  const fillAdForm = async bikeData => {
    await page.getByLabel("Título do Anúncio *").fill(bikeData.title)
    await page.getByLabel("Descrição Detalhada *").fill(bikeData.description)
    await page
      .getByRole("combobox")
      .first()
      .click()
    await page.getByRole("option", { name: bikeData.brand }).click()
    await page.getByLabel("Modelo *").fill(bikeData.model)
    await page.getByLabel("Preço (R$) *").fill(bikeData.price.toString())
    await page.getByLabel("Ano de Fabricação *").fill(bikeData.year.toString())
    await page.getByLabel("Seu Nome *").fill(bikeData.sellerName)
    await page.getByLabel("WhatsApp *").fill(bikeData.whatsapp)
  }

  const submitAdForm = async () => {
    await page.getByRole("button", { name: "Publicar Anúncio" }).click()
  }

  const verifyAdCreated = async () => {
    await expect(page).toHaveURL("/sucesso")
    await expect(
      page.getByRole("heading", { name: "Anúncio Enviado com Sucesso!" })
    ).toBeVisible()
    await expect(
      page.getByText(
        "Obrigado por escolher o BikeBoard para anunciar sua bicicleta"
      )
    ).toBeVisible()
    await expect(
      page.getByText("Seu anúncio foi enviado para nossa equipe de moderação")
    ).toBeVisible()
  }

  const alertMessage = async (label, message) => {
    const labelElement = page.getByLabel(label)
    await expect(labelElement).toBeVisible()

    const paragraph = page
      .locator("div")
      .filter({ has: labelElement })
      .locator("p.alert-message")
    await expect(paragraph).toHaveText(message)
  }

  return {
    gotoHomePage,
    clickAdvertiseLink,
    fillAdForm,
    submitAdForm,
    verifyAdCreated,
    alertMessage
  }
}
