import { http, HttpResponse } from "msw";
import { factory, primaryKey } from "@mswjs/data";
import { faker } from "@faker-js/faker";

// Create a database using mswjs/data for products
export const db = factory({
  // Create a "user" model,
  product: {
    // ...with these properties and value getters.
    id: primaryKey(Number),
    name: faker.commerce.productName,
    price: faker.commerce.price,
  },
});

export const handlers = [
  http.get("/categories", () =>
    HttpResponse.json({
      categories: [
        { id: 1, name: "Shirts" },
        { id: 2, name: "Pants" },
        { id: 3, name: "Shoes" },
      ],
    }),
  ),
  ...db.product.toHandlers("rest"),
];
