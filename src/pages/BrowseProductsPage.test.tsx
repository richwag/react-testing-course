import { describe } from "vitest";
import BrowseProductsPage from "./BrowseProductsPage.tsx";
import { render, screen, waitFor } from "@testing-library/react";
import { Theme } from "@radix-ui/themes";
import { server } from "../mocks/server.ts";
import { http, HttpResponse } from "msw";
import { CartProvider } from "../providers/CartProvider.tsx";
import { LanguageProvider } from "../providers/language/LanguageProvider.tsx";
import delay from "delay";
import { userEvent } from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";

function renderComponent() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  render(
    <CartProvider>
      <LanguageProvider language="en">
        <Theme>
          <QueryClientProvider client={queryClient}>
            <BrowseProductsPage />
          </QueryClientProvider>
        </Theme>
      </LanguageProvider>
    </CartProvider>,
  );
}

describe("BrowseProductsPage", () => {
  const categories = [
    { id: 1, name: "Category 1" },
    { id: 2, name: "Category 2" },
    { id: 3, name: "Category 3" },
  ];
  const products = [
    { id: 1, name: "Product 1", price: 100, categoryId: 1 },
    { id: 2, name: "Product 2", price: 200, categoryId: 2 },
  ];

  beforeEach(() => {
    server.resetHandlers();
  });

  it("should render all products", async () => {
    server.use(
      http.get("/products", async () => {
        console.log("products", products);
        return HttpResponse.json(products);
      }),
    );
    server.use(
      http.get("/categories", async () => {
        return HttpResponse.json([]);
      }),
    );

    renderComponent();

    await waitFor(async () => {
      products.forEach((product) => {
        expect(screen.getByText(new RegExp(product.name))).toBeInTheDocument();
      });
    });
  });

  it("should render all categories", async () => {
    server.use(
      http.get("/products", async ({}) => {
        return HttpResponse.json(products);
      }),
    );
    server.use(
      http.get("/categories", async ({}) => {
        return HttpResponse.json(categories);
      }),
    );
    renderComponent();
    const user = userEvent.setup();
    const categorySelect = await screen.findByRole("combobox");
    user.click(categorySelect);

    await waitFor(async () => {
      const categoryOptions = screen.getAllByRole("option");
      expect(categoryOptions).toHaveLength(categories.length + 1); // +1 for the "All" option
    });
  });

  it("should render product skeletons while loading", async () => {
    server.use(
      http.get("/products", async ({}) => {
        await delay(700);
        return HttpResponse.json([]);
      }),
    );
    server.use(
      http.get("/categories", async ({}) => {
        return HttpResponse.json([]);
      }),
    );

    renderComponent();

    const rows = await screen.findAllByRole("row");
    expect(rows).toHaveLength(6); // 5 skeletons + 1 header
  });

  it("should render category skeleton while loading", async () => {
    server.use(
      http.get("/products", async ({}) => {
        return HttpResponse.json(products);
      }),
    );
    server.use(
      http.get("/categories", async ({}) => {
        await delay(900);
        return HttpResponse.json(categories);
      }),
    );

    renderComponent();

    // Make sure the category skeletons are rendered
    const categorySelect = screen.queryByRole("combobox");
    expect(categorySelect).not.toBeInTheDocument();
  });

  it("should select products by category", async () => {
    server.use(
      http.get("/products", async ({}) => {
        return HttpResponse.json(products);
      }),
    );
    server.use(
      http.get("/categories", async ({}) => {
        return HttpResponse.json(categories);
      }),
    );

    renderComponent();
    const user = userEvent.setup();
    const categorySelect = await screen.findByRole("combobox");
    await user.click(categorySelect);

    // select the first category
    const categoryOptions = await screen.findAllByRole("option");
    await user.click(categoryOptions[1]);

    await waitFor(async () => {
      products.forEach((product) => {
        if (product.categoryId === 1) {
          expect(
            screen.getByText(new RegExp(product.name)),
          ).toBeInTheDocument();
        } else {
          expect(
            screen.queryByText(new RegExp(product.name)),
          ).not.toBeInTheDocument();
        }
      });
    });
  });

  it("should display a category error when getting categories fails", async () => {
    server.use(
      http.get("/products", async ({ params }) => {
        return HttpResponse.json(products);
      }),
    );
    server.use(
      http.get("/categories", async ({ params }) => {
        return HttpResponse.error();
      }),
    );

    renderComponent();

    await waitFor(async () => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it("should display a products error when getting products fails", async () => {
    server.use(
      http.get("/products", async ({ params }) => {
        return HttpResponse.error();
      }),
    );
    server.use(
      http.get("/categories", async ({ params }) => {
        return HttpResponse.json(categories);
      }),
    );

    renderComponent();

    await waitFor(async () => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });
});
