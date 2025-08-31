// import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// /** ----------- Requests genéricos usando cy.api (commands.js) ----------- */
// Given('que a API está disponível', () => {
//   cy.api('GET', '/api-docs').then((res) => {
//     expect([200, 301, 302]).to.include(res.status); // swagger pode redirecionar
//   });
// });

// When('realizo GET em {string}', (path) => {
//   cy.api('GET', path).as('resp');
// });

// When('realizo GET em {string} com query {string}', (path, q) => {
//   const qs = Object.fromEntries(new URLSearchParams(q));
//   cy.api('GET', path, null, qs).as('resp');
// });

// When('realizo POST em {string} com body:', (path, body) => {
//   const payload = body ? JSON.parse(body) : {};
//   cy.wrap(payload, { log: false }).as('reqBody');
//   cy.api('POST', path, payload).as('resp');
// });

// When('realizo DELETE em {string}', (path) => {
//   cy.api('DELETE', path).as('resp');
// });

// /** ---------------- Asserções de status ---------------- */
// Then('o status deve ser {int}', (status) => {
//   cy.get('@resp').its('status').should('eq', status);
// });

// Then('o status deve ser um de {string}', (csv) => {
//   const allowed = csv.split(',').map((s) => parseInt(s.trim(), 10));
//   cy.get('@resp').its('status').should((s) => {
//     expect(allowed, 'allowed HTTP statuses').to.include(s);
//   });
// });

// /** ---------------- Depuração opcional ---------------- */
// Then('mostro o body da resposta', () => {
//   cy.get('@resp').then((res) => {
//     cy.log('Status:', String(res.status));
//     cy.log('Body:', JSON.stringify(res.body));
//     // eslint-disable-next-line no-console
//     console.log('API response:', res.status, res.body);
//   });
// });

// /** ---------------- Asserções de domínio ---------------- */
// Then('a resposta deve conter uma lista de produtos', () => {
//   cy.get('@resp').its('body').should((body) => {
//     // /api/produtos retorna { products, totalPages, currentPage }
//     const products = body?.products || body?.data?.products || (Array.isArray(body) ? body : null);
//     expect(products, 'products').to.be.an('array').and.not.empty;
//   });
// });

// Then('a resposta deve conter um produto com id {string}', (id) => {
//   cy.get('@resp').its('body').should((body) => {
//     const p = body?.product || body; // nossa API retorna o objeto direto
//     expect(String(p.id)).to.eq(String(id));
//   });
// });

// Then('a resposta deve conter {string}', (prop) => {
//   cy.get('@resp').its('body').should('have.property', prop);
// });

// // Aceita orderId, orderNumber ou id
// Then('a resposta deve conter "orderId"', () => {
//   cy.get('@resp').its('body').should((body) => {
//     const candidate =
//       body?.orderId ??
//       body?.data?.orderId ??
//       body?.orderNumber ??
//       body?.data?.orderNumber ??
//       body?.order?.id ??
//       body?.data?.order?.id ??
//       body?.id ??
//       body?.data?.id;
//     expect(candidate, 'orderId/orderNumber/id na resposta').to.exist;
//   });
// });

// Then('a regra de negócio {string} deve ser satisfeita', (rule) => {
//   cy.get('@resp').its('body').then((body) => {
//     if (rule === 'total > 0') {
//       // tenta vários nomes
//       const total = body.total ?? body.data?.total ?? body.orderTotal ?? body.amount ?? body.valorTotal;
//       if (typeof total === 'number') {
//         expect(total, 'total calculado').to.be.greaterThan(0);
//         return;
//       }
//       // fallback: soma qty/quantity do request se a resposta não trouxer total
//       cy.get('@reqBody').then((req) => {
//         const items = Array.isArray(req?.items) ? req.items : [];
//         const sum = items.reduce((acc, it) => acc + Number(it.qty ?? it.quantity ?? 0), 0);
//         expect(sum, 'soma de itens no request').to.be.greaterThan(0);
//       });
//     } else {
//       throw new Error(`Regra não mapeada: ${rule}`);
//     }
//   });
// });

// Then('a resposta deve conter o item {string} com quantidade {string}', (id, qty) => {
//   cy.get('@resp').its('body').should((body) => {
//     // /api/carrinho/:userId retorna um ARRAY de itens
//     const arr = Array.isArray(body) ? body : body?.items || [];
//     const item = (arr || []).find((i) => String(i.productId ?? i.id) === String(id));
//     expect(item, 'item no carrinho').to.exist;
//     const q = item.quantity ?? item.qty ?? item.qtd;
//     expect(String(q), 'quantidade do item').to.eq(String(qty));
//   });
// });

// Then('a resposta do carrinho deve estar vazia', () => {
//   cy.get('@resp').its('body').should((body) => {
//     const arr = Array.isArray(body) ? body : body?.items || [];
//     expect(arr, 'itens no carrinho').to.be.an('array').and.have.length(0);
//   });
// });


import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const apiBase = () =>
  Cypress.env("apiBase") || Cypress.config("baseUrl") || "http://localhost:3000";

const resolveUrl = (path) => {
  let p = path;

  if (/^https?:\/\//i.test(p)) return p;

  const map = [
    [/^\/carrinho(\/|$)/i, "/api/carrinho$1"],
    [/^\/checkout(\/|$)/i, "/api/checkout$1"],
    [/^\/produtos(\/|$)/i, "/api/produtos$1"],
    [/^\/products(\/|$)/i, "/api/products$1"],
  ];
  for (const [re, rep] of map) p = p.replace(re, rep);

  if (!p.startsWith("/")) p = "/" + p;

  return `${apiBase()}${p}`;
};

Given("que a API está disponível", () => {
  cy.request({
    method: "GET",
    url: resolveUrl("/api-docs"),
    failOnStatusCode: false,
    followRedirect: false,
  })
    .its("status")
    .should((s) => expect([200, 301, 302, 404]).to.include(s));
});

When("realizo GET em {string}", (path) => {
  cy.request({
    method: "GET",
    url: resolveUrl(path),
    failOnStatusCode: false,
  }).as("resp");
});

When("realizo GET em {string} com query {string}", (path, q) => {
  const qs = Object.fromEntries(new URLSearchParams(q));
  cy.request({
    method: "GET",
    url: resolveUrl(path),
    qs,
    failOnStatusCode: false,
  }).as("resp");
});

When("realizo POST em {string} com body:", (path, docString) => {
  const body = docString ? JSON.parse(docString) : {};
  cy.request({
    method: "POST",
    url: resolveUrl(path),
    body,
    failOnStatusCode: false,
    headers: { "Content-Type": "application/json" },
  }).as("resp");
});

When("realizo DELETE em {string}", (path) => {
  cy.request({
    method: "DELETE",
    url: resolveUrl(path),
    failOnStatusCode: false,
  }).as("resp");
});

Then("o status deve ser {int}", (code) => {
  cy.get("@resp").its("status").should("eq", code);
});

Then('a resposta deve conter "orderId"', () => {
  cy.get("@resp")
    .its("body")
    .should((body) => {
      const candidate =
        body?.orderId ?? body?.data?.orderId ?? body?.order?.id ?? body?.id;
      expect(candidate, "orderId na resposta").to.exist;
    });
});

Then('o status deve ser um de {string}', (csv) => {
  const allowed = csv.split(',').map((s) => parseInt(s.trim(), 10));
  cy.get('@resp').its('status').should((s) => {
    expect(allowed, 'allowed HTTP statuses').to.include(s);
  });
});

Then('a resposta deve conter o item {string} com quantidade {string}', (id, qty) => {
  cy.get('@resp').its('body').should((body) => {
    const arr = Array.isArray(body) ? body : body?.items || [];
    const item = (arr || []).find((i) => String(i.productId ?? i.id) === String(id));
    expect(item, 'item no carrinho').to.exist;
    const q = item.quantity ?? item.qty ?? item.qtd;
    expect(String(q), 'quantidade do item').to.eq(String(qty));
  });
});

Then("a resposta deve conter uma lista de produtos", () => {
  cy.get("@resp")
    .its("body")
    .should((body) => {
      const list = Array.isArray(body) ? body : body?.data || body?.products || body?.produtos;
      expect(list, "lista de produtos").to.be.an("array").and.not.be.empty;
      expect(list[0]).to.have.any.keys("id", "name", "price");
    });
});

Then('a resposta deve conter um produto com id {string}', (id) => {
  cy.get("@resp")
    .its("body")
    .should((body) => {
      const list = Array.isArray(body) ? body : body?.data || body?.products || body?.produtos;
      const found = (list || []).find((p) => String(p.id) === String(id));
      expect(found, `produto id=${id}`).to.exist;
    });
});

Then('a regra de negócio "total > 0" deve ser satisfeita', () => {
  cy.get("@resp")
    .its("body")
    .then((body) => {
      const total = body?.total ?? body?.data?.total;
      expect(total, "total calculado").to.be.greaterThan(0);
    });
});

Then('a resposta deve conter o item "{string}" com quantidade "{string}"', (id, qty) => {
  cy.get("@resp")
    .its("body")
    .should((body) => {
      const items = body?.items || body?.data?.items || body || [];
      const item = (items || []).find((i) => String(i.id) === String(id));
      expect(item, "item no carrinho").to.exist;
      expect(String(item.qty)).to.eq(String(qty));
    });
});

Then("a resposta do carrinho deve estar vazia", () => {
  cy.get("@resp")
    .its("body")
    .should((body) => {
      const items = body?.items || body?.data?.items || (Array.isArray(body) ? body : []);
      expect(items, "itens no carrinho").to.be.an("array");
      expect(items.length, "quantidade de itens").to.eq(0);
    });
});
