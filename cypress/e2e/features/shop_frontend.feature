Feature: Fluxos principais de loja
  Como usuário da loja
  Quero adicionar produtos ao carrinho e finalizar um checkout simples
  Para concluir uma compra com dados válidos e ver as mensagens adequadas

  Background:
    Given que estou na página inicial

# @frontend @carrinho @cleanCart
# Scenario: Adicionar e validar item no carrinho por ID
#     Given que estou na página inicial
#     When adiciono o produto "Se você acha que nada é impossível" ao carrinho
#     And abro o carrinho
#     Then devo ver no carrinho o item de id 1 com quantidade 1

  @frontend @checkout @cleanCart
  Scenario: Checkout simples com sucesso
    Given adiciono o produto "/Se você acha que nada é impossível/" ao carrinho
    And abro o carrinho
    When vou para o checkout e preencho com dados válidos
    And finalizo a compra
    Then devo ver a mensagem de sucesso do pedido

  # @frontend @validacao
  # Scenario Outline: Mensagens de erro em campos obrigatórios do checkout
  #   Given adiciono o produto "/Se você acha que nada é impossível/" ao carrinho
  #   And vou para o checkout
  #   When tento finalizar o checkout com "<campo>" vazio
  #   Then devo ver a mensagem de erro para "<campo>"

  #   Examples:
  #     | campo   |
  #     | name    |
  #     | email   |
  #     | address |
  #     | city    |
  #     | zip     |

  # @frontend @minha-conta
  # Scenario: Minha conta - Alterar cadastro com sucesso
  #   Given acesso minha conta
  #   When altero meu cadastro com nome "Miguel QA" e email "miguel.qa@exemplo.com"
  #   Then devo ver o aviso de sucesso de atualização
