import { Before } from "@badeball/cypress-cucumber-preprocessor";

const apiBase = () =>
  Cypress.env("apiBase") || Cypress.config("baseUrl") || "http://localhost:3000";

Before({ tags: "@cleanCart" }, () => {
  cy.request({
    method: "DELETE",
    url: `${apiBase()}/api/carrinho`,
    failOnStatusCode: false,
  })
  .its('status')
  .should((s) => expect([200,204,404]).to.include(s));
});
