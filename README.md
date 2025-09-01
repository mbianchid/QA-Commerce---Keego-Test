# Descrição

Projeto de automação de testes para uma plataforma e-commerce fictícia, criado como parte do desafio técnico da Keegoo. A aplicação usa Cypress para realizar testes end-to-end, interagindo com os fluxos principais da loja online.

## QA-Commerce

### Loja virtual Geek para simulação de testes 

## Clonando e executando em sua máquina

### Pré-requisito:

-Node.js - Você encontra em: https://nodejs.org/en/
-Visual Studio Code ( ou editor de sua prefrência) - você encontra em: https://code.visualstudio.com/download
-Git: você encontra em: https://git-scm.com/downloads
-Cypress - Documentação para instalação: https://docs.cypress.io/app/get-started/install-cypress

Via terminal, rode os seguintes comandos:
```  
git clone https://github.com/fabioaraujoqa/qa-commerce.git
```
```
cd qa-commerce
```

#### Para instalar as dependencias:
```
npm install 
```

#### Para subir o servidor e o banco:
```
npm start
```

No console vai aparecer os endereços do site e do banco. 
O site você acessaem: http://localhost:3000/

A documentação funciona em: http://localhost:3000/api-docs/

## Funcionalidades

Testes completos de fluxo de compra: busca de produtos, adicionar ao carrinho e checkout.
Validação visual e funcional dos elementos da interface.

### Executando os testes

#### Para abrir o Cypress Interface (modo visual):

npx cypress open

#### Para rodar os testes em modo headless (ideal para CI/CD):

npx cypress run

```plaintext
Estrutura do projeto
├── cypress/
│   ├── e2e/                # Cenários e testes completos da aplicação
│   ├── fixtures/           # Dados de teste
│   ├── integration/        # Testes end-to-end
│   ├── support/            # Comandos e configurações customizados
│   ├── pageObjects/        # Objetos de página e interações centralizadas
├── src/                    # Código da aplicação (se houver)
├── tests/                  # Testes adicionais (unitários ou e2e)
├── package.json
├── cypress.config.js
└── README.md
```

#### Contato

Autor: mbianchid
GitHub: mbianchid

E-mail: mbianchid.12@gmail.com