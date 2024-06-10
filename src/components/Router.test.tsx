import { describe } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../routes.tsx";
import { mockAuthState } from "../utils.ts";
import { server } from "../mocks/server.ts";
import { http, HttpResponse } from "msw";
import { db } from "../mocks/handlers.ts";

function renderComponent(route: string) {
  const router = createMemoryRouter(routes, { initialEntries: [route] });

  render(<RouterProvider router={router}></RouterProvider>);
}

describe("Router", () => {
  const productIds = [1];
  const products = productIds.map((id) => db.product.create({ id }));

  it("should render the home page", () => {
    mockAuthState({
      isAuthenticated: false,
      user: {
        name: "Test User",
      },
      isLoading: false,
    });

    renderComponent("/");

    expect(
      screen.getByRole("heading", { name: /Home Page/i }),
    ).toBeInTheDocument();
  });

  it("should render the product page", async () => {
    server.use(
      http.get("/products/:id", async ({ params }) => {
        return HttpResponse.json(products[0]);
      }),
    );

    mockAuthState({
      isAuthenticated: true,
      user: {
        name: "Test User",
      },
      isLoading: false,
    });

    renderComponent("/products/1");

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: new RegExp(products[0].name, "i"),
        }),
      ).toBeInTheDocument();
    });
  });
});
