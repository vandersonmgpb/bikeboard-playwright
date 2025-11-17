import { test, expect } from "@playwright/test"
import { bikeActions } from "../support/actions/ads.actions"
import { myBike } from "../support/fixtures/bike"

import {
  setupAdCreationMock,
  setupValidationErrorMock,
  setupWhatsAppInvalidFormatMock,
  setupWhatsAppInvalidLengthMock,
  setupDescriptionTooShortMock,
  setupPriceTooLowMock
} from "../support/mocks/ads.mocks"

test.describe("Cadastro de Anúncio", () => {
  let actions

  test.beforeEach(async ({ page }) => {
    actions = bikeActions(page)
    await actions.gotoHomePage()
    await actions.clickAdvertiseLink()
  })

  test("deve cadastrar um anúncio com sucesso", async ({ page }) => {
    await setupAdCreationMock(page, myBike)
    await actions.fillAdForm(myBike)
    await actions.submitAdForm()
    await actions.verifyAdCreated()
  })

  test("deve exibir erros para todos os campos obrigatórios não preenchidos", async ({
    page
  }) => {
    await setupValidationErrorMock(page)
    await actions.submitAdForm()

    const expectedAlerts = [
      "Título deve ter pelo menos 10 caracteres",
      "Descrição deve ter pelo menos 30 caracteres",
      "Marca é obrigatória",
      "Modelo é obrigatório",
      "Preço mínimo é R$ 100",
      "Nome é obrigatório",
      "WhatsApp inválido (formato: 11999999999)"
    ]

    await Promise.all(
      expectedAlerts.map(async msg => {
        await expect(page.locator(`text=${msg}`)).toBeVisible()
      })
    )
  })

  test("deve exibir erro quando o WhatsApp tem formato inválido", async ({
    page
  }) => {
    await setupWhatsAppInvalidFormatMock(page)
    await actions.fillAdForm({ ...myBike, whatsapp: "1111" })
    await actions.submitAdForm()

    await expect(
      page.locator("text=WhatsApp inválido (formato: 11999999999)")
    ).toBeVisible()
  })

  test("deve exibir erro quando o WhatsApp tem menos de 10 dígitos", async ({
    page
  }) => {
    await setupWhatsAppInvalidLengthMock(page)
    await actions.fillAdForm({ ...myBike, whatsapp: "119999999" })
    await actions.submitAdForm()

    await expect(
      page.locator("text=WhatsApp deve ter 10 ou 11 dígitos")
    ).toBeVisible()
  })

  test("deve exibir erro quando a descrição tem menos de 30 caracteres", async ({
    page
  }) => {
    await setupDescriptionTooShortMock(page)
    await actions.fillAdForm({ ...myBike, description: "Bike muito bonita!" })
    await actions.submitAdForm()

    await expect(
      page.locator("text=Descrição deve ter pelo menos 30 caracteres")
    ).toBeVisible()
  })

  test("deve mostrar erro quando o preço é menor que o R$ 100", async ({
    page
  }) => {
    await setupPriceTooLowMock(page)
    await actions.fillAdForm({ ...myBike, price: 99 })
    await actions.submitAdForm()
    await actions.alertMessage("Preço (R$) *", "Preço mínimo é R$ 100")
  })
})
