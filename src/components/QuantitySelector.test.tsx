import { describe } from "vitest";
import { render, screen } from "@testing-library/react";
import QuantitySelector from "./QuantitySelector.tsx";
import { CartProvider } from "../providers/CartProvider.tsx";
import { Product } from "../entities.ts";
import { userEvent } from "@testing-library/user-event";

describe("QuantitySelector", () => {
  it("should render the add to cart button", () => {
    const product: Product = {
      name: "Product 1",
      price: 100,
      id: 0,
      categoryId: 1,
    };

    // Your test here
    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>,
    );

    expect(
      screen.getByRole("button", {
        name: /add to cart/i,
      }),
    ).toBeInTheDocument();
  });

  it("should add to cart when button is clicked", async () => {
    const product: Product = {
      name: "Product 1",
      price: 100,
      id: 0,
      categoryId: 1,
    };

    // Your test here
    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>,
    );

    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(screen.getByRole("status")).toHaveTextContent("1");
  });

  it("should increase cart when + button is clicked", async () => {
    const product: Product = {
      name: "Product 1",
      price: 100,
      id: 0,
      categoryId: 1,
    };

    // Your test here
    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>,
    );

    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /add to cart/i }));
    await user.click(screen.getByRole("button", { name: /\+/i }));

    expect(screen.getByRole("status")).toHaveTextContent("2");
  });

  it("should decrease cart when - button is clicked", async () => {
    const product: Product = {
      name: "Product 1",
      price: 100,
      id: 0,
      categoryId: 1,
    };

    // Your test here
    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>,
    );

    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /add to cart/i }));
    await user.click(screen.getByRole("button", { name: /\+/i }));
    await user.click(screen.getByRole("button", { name: /\-/i }));
    expect(screen.getByRole("status")).toHaveTextContent("1");
  });
});
