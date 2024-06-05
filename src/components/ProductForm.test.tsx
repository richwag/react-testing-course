import { describe } from "vitest";
import ProductForm from "./ProductForm.tsx";
import { QueryClient, QueryClientProvider } from "react-query";
import { Theme } from "@radix-ui/themes";
import { LanguageProvider } from "../providers/language/LanguageProvider.tsx";
import { CartProvider } from "../providers/CartProvider.tsx";
import { ProductFormData } from "../validationSchemas/productSchema.ts";
import { render, waitFor, screen } from "@testing-library/react";
import { server } from "../mocks/server.ts";
import { http, HttpResponse } from "msw";
import { Product } from "../entities.ts";
import { userEvent } from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";

const categories = [
  { id: 1, name: "Category 1" },
  { id: 2, name: "Category 2" },
  { id: 3, name: "Category 3" },
];

const product: Product = {
  name: "Product 1",
  price: 100,
  id: 0,
  categoryId: 1,
};

function renderProductForm({
  product,
  onSubmit,
}: {
  product?: Product;
  onSubmit: (product: ProductFormData) => Promise<void>;
}) {
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
            <Toaster />
            <ProductForm product={product} onSubmit={onSubmit} />
          </QueryClientProvider>
        </Theme>
      </LanguageProvider>
    </CartProvider>,
  );
}
describe("ProductForm", () => {
  beforeEach(() => {
    server.use(
      http.get("/categories", async ({}) => {
        return HttpResponse.json(categories);
      }),
    );
  });

  it("should render a form with a product values", async () => {
    const product: Product = {
      name: "Product 1",
      price: 100,
      id: 0,
      categoryId: 1,
    };

    renderProductForm({ product, onSubmit: vi.fn() });

    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText(/name/i);
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveValue(product.name);

      const priceInput = screen.getByPlaceholderText(/price/i);
      expect(priceInput).toBeInTheDocument();
      expect(priceInput).toHaveValue(product.price.toString());

      const categorySelect = screen.getByRole("combobox");

      expect(categorySelect).toBeInTheDocument();
      expect(categorySelect).toHaveTextContent(product.categoryId.toString());
    });
  });

  it("name should have focus when form loads", async () => {
    renderProductForm({ product, onSubmit: vi.fn() });

    await screen.findByRole("form");

    const nameInput = screen.getByPlaceholderText(/name/i);
    expect(nameInput).toHaveFocus();
  });

  it.each([
    {
      scenario: "name is required",
      name: undefined,
      errorMessage: /Name is required/i,
    },
    {
      scenario: "name is too long",
      name: "a".repeat(256),
      errorMessage: /must contain at most 255 character/i,
    },
  ])("should display $scenario", async ({ scenario, name, errorMessage }) => {
    renderProductForm({ product, onSubmit: vi.fn() });

    await screen.findByRole("form");

    const user = userEvent.setup();
    const submitButton = screen.getByRole("button");

    if (name) {
      await user.type(screen.getByPlaceholderText(/name/i), name);
    } else {
      await user.clear(screen.getByPlaceholderText(/name/i));
    }

    await user.click(submitButton);
    const alerts = screen.queryAllByRole("alert");

    expect(alerts[0]).toHaveTextContent(errorMessage);
  });

  it.each([
    {
      scenario: "price is required",
      price: undefined,
      errorMessage: /price is required/i,
    },
    {
      scenario: "price is too high",
      price: "1001",
      errorMessage: /number must be less than or equal/i,
    },
  ])("should display $scenario", async ({ scenario, price, errorMessage }) => {
    renderProductForm({ product, onSubmit: vi.fn() });

    await screen.findByRole("form");

    const user = userEvent.setup();
    const submitButton = screen.getByRole("button");

    if (price) {
      await user.type(screen.getByPlaceholderText(/price/i), price);
    } else {
      await user.clear(screen.getByPlaceholderText(/price/i));
    }

    await user.click(submitButton);
    const alerts = screen.queryAllByRole("alert");

    expect(alerts[0]).toHaveTextContent(errorMessage);
  });

  it("should call submit with form values specified", async () => {
    const onSubmit = vi.fn();

    renderProductForm({ product, onSubmit: onSubmit });

    await screen.findByRole("form");

    const user = userEvent.setup();
    const submitButton = screen.getByRole("button");

    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(product);
    });
  });

  it("should display an error when submit fails", async () => {
    const onSubmit = vi.fn();
    onSubmit.mockRejectedValue(new Error("An unexpected error occurred"));

    renderProductForm({ product, onSubmit: onSubmit });

    await screen.findByRole("form");

    const user = userEvent.setup();
    const submitButton = screen.getByRole("button");

    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/an unexpected error occurred/i),
      ).toBeInTheDocument();
    });
  });
});
