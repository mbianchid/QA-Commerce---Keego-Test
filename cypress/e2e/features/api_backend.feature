Feature: Validações de API
  Como QA
  Quero validar endpoints GET e POST
  Para garantir status code corretos e regras de negócio

  Background:
    Given que a API está disponível

  @api @get
  Scenario: GET /api/produtos retorna 200 e lista de produtos
    When realizo GET em "/api/produtos"
    Then o status deve ser 200
    And a resposta deve conter uma lista de produtos

  @api @get
  Scenario: GET /api/produtos/1 retorna 200 e produto válido
    When realizo GET em "/api/produtos/1"
    Then o status deve ser 200
    And a resposta deve conter um produto com id "1"

  @api @get @notfound
  Scenario: GET /api/produtos/9999 retorna 404 para produto inexistente
    When realizo GET em "/api/produtos/9999"
    Then o status deve ser 404

  @api @post
  Scenario: POST /api/checkout cria pedido válido (regra: total > 0)
    When realizo POST em "/api/carrinho" com body:
      """
      { "userId": 1, "productId": 1, "quantity": 1 }
      """
    Then o status deve ser um de "200,201"

    When realizo POST em "/api/checkout" com body:
      """
      {
        "userId": 1,
        "firstName": "QA",
        "lastName": "Tester",
        "address": "Rua 1",
        "number": "100",
        "cep": "01001000",
        "email": "qa@example.com",
        "paymentMethod": "pix"
      }
      """
    Then o status deve ser um de "200,201"
    And a resposta deve conter "orderId"
    And a regra de negócio "total > 0" deve ser satisfeita

  @api @post @badrequest
  Scenario: POST /api/checkout com body inválido retorna 400
    When realizo POST em "/api/checkout" com body:
      """
      {}
      """
    Then o status deve ser 400

  @api @cart
  Scenario: Fluxo via API - adicionar item no carrinho e recuperar
    When realizo POST em "/api/carrinho" com body:
      """
      { "userId": 1, "productId": 2, "quantity": 3 }
      """
    Then o status deve ser um de "200,201"
    When realizo GET em "/api/carrinho/1"
    Then o status deve ser 200
    And a resposta deve conter o item "2" com quantidade "3"

  @api @cart @delete
  Scenario: DELETE /api/carrinho limpa o carrinho
    When realizo DELETE em "/api/carrinho/1"
    Then o status deve ser 200
    When realizo GET em "/api/carrinho/1"
    Then o status deve ser 200
    And a resposta do carrinho deve estar vazia

  @api @cart @delete
  Scenario: DELETE /api/carrinho/1 remove o item específico
    When realizo POST em "/api/carrinho" com body:
      """
      { "userId": 1, "productId": 1, "quantity": 1 }
      """
    Then o status deve ser um de "200,201"
    When realizo DELETE em "/api/carrinho/1/1"
    Then o status deve ser 200
    When realizo GET em "/api/carrinho/1"
    Then o status deve ser 200
    And a resposta do carrinho deve estar vazia
