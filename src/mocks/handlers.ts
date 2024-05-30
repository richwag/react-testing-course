import { factory, primaryKey } from "@mswjs/data";
import { faker } from "@faker-js/faker";

// Create a database using mswjs/data for products
export const db = factory({
  product: {
    // ...with these properties and value getters.
    id: primaryKey(Number),
    name: faker.commerce.productName,
    price: faker.commerce.price,
  },
});

export const handlers = [...db.product.toHandlers("rest")];
