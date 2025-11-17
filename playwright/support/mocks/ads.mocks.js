const ENABLE_MOCKS = true

export const setupAdCreationMock = async (page, bikeData) => {
  if (!ENABLE_MOCKS) return

  await page.route("**/anuncios", async route => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          sucesso: true,
          mensagem: "Anúncio criado com sucesso!",
          anuncio: {
            id: 1,
            titulo: bikeData.title,
            descricao: bikeData.description,
            marca: bikeData.brand,
            modelo: bikeData.model,
            preco: bikeData.price,
            anoFabricacao: bikeData.year,
            nomeVendedor: bikeData.sellerName,
            whatsapp: bikeData.whatsapp,
            status: "em analise",
            criadoEm: new Date().toISOString(),
            atualizadoEm: new Date().toISOString()
          }
        })
      })
    } else {
      await route.continue()
    }
  })
}

export const setupValidationErrorMock = async page => {
  if (!ENABLE_MOCKS) return

  await page.route("**/anuncios", async route => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          sucesso: false,
          erro: "Dados inválidos",
          detalhes: {
            titulo: "Título deve ter pelo menos 10 caracteres",
            descricao: "Descrição deve ter pelo menos 30 caracteres",
            marca: "Marca é obrigatória",
            modelo: "Modelo é obrigatório",
            preco: "Preço mínimo é R$ 100",
            nomeVendedor: "Nome é obrigatório",
            whatsapp: "WhatsApp inválido (formato: 11999999999)"
          }
        })
      })
    } else {
      await route.continue()
    }
  })
}

export const setupWhatsAppInvalidFormatMock = async page => {
  if (!ENABLE_MOCKS) return

  await page.route("**/anuncios", async route => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          sucesso: false,
          erro: "WhatsApp inválido (formato: 11999999999)"
        })
      })
    } else {
      await route.continue()
    }
  })
}

export const setupWhatsAppInvalidLengthMock = async page => {
  if (!ENABLE_MOCKS) return

  await page.route("**/anuncios", async route => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          sucesso: false,
          erro: "WhatsApp deve ter 10 ou 11 dígitos"
        })
      })
    } else {
      await route.continue()
    }
  })
}

export const setupDescriptionTooShortMock = async page => {
  if (!ENABLE_MOCKS) return

  await page.route("**/anuncios", async route => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          sucesso: false,
          erro: "Descrição deve ter pelo menos 30 caracteres"
        })
      })
    } else {
      await route.continue()
    }
  })
}

export const setupPriceTooLowMock = async page => {
  if (!ENABLE_MOCKS) return

  await page.route("**/anuncios", async route => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          sucesso: false,
          erro: "Preço mínimo é R$ 100"
        })
      })
    } else {
      await route.continue()
    }
  })
}
