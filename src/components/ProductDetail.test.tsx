import { describe } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ProductDetail from "./ProductDetail.tsx";
import { server } from "../mocks/server.ts";
import { http, HttpResponse } from "msw";
import { db } from "../mocks/handlers.ts";

describe("ProductDetail", () => {
  const productIds = [1];
  const products = productIds.map((id) => db.product.create({ id }));

  beforeAll(() => {});

  afterAll(() => {
    productIds.forEach((id) =>
      db.product.delete({ where: { id: { equals: id } } }),
    );

    server.resetHandlers();
  });

  it("should render the product details when a product is found", async () => {
    render(<ProductDetail productId={1} />);

    await waitFor(() => {
      expect(
        screen.getByText(new RegExp(products[0].name)),
      ).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(products[0].price.toString())),
      ).toBeInTheDocument();
    });
  });

  it("should render not found when a product is not found", async () => {
    server.use(
      http.get("/products/:id", ({ params }) => {
        return HttpResponse.text("Not found", { status: 404 });
      }),
    );
    render(<ProductDetail productId={4} />);

    await waitFor(() => {
      expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });
  });

  it("should render error when an error happens", async () => {
    server.use(
      http.get("/products/:id", ({ params }) => {
        return HttpResponse.text("Error", { status: 500 });
      }),
    );

    render(<ProductDetail productId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
