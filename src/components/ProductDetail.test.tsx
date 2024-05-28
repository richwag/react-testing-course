import { describe } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ProductDetail from "./ProductDetail.tsx";
import { server } from "../mocks/server.ts";
import { http, HttpResponse } from "msw";

describe("ProductDetail", () => {
  it("should render the product details when a product is found", async () => {
    server.use(
      http.get("/products/:id", ({ params }) => {
        return HttpResponse.json({ id: 1, name: "Product 1", price: 100 });
      }),
    );

    render(<ProductDetail productId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
      expect(screen.getByText(/100/i)).toBeInTheDocument();
    });
  });

  it("should render not found when a product is not found", async () => {
    server.use(
      http.get("/products/:id", ({ params }) => {
        return HttpResponse.text("Product not found", { status: 404 });
      }),
    );

    render(<ProductDetail productId={1} />);

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
