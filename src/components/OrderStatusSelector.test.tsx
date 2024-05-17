import { render, screen, waitFor } from "@testing-library/react";
import { describe } from "vitest";
import { userEvent } from "@testing-library/user-event";
import OrderStatusSelector from "./OrderStatusSelector.tsx";
import { Theme } from "@radix-ui/themes";

describe("OrderStatusSelector", () => {
  it("should render a select box with the correct options", async () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={console.log} />
      </Theme>,
    );

    const user = userEvent.setup();
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    await user.click(select);

    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(3);

    const optionValues = options.map((option) => option.textContent);
    expect(optionValues).toEqual(["New", "Processed", "Fulfilled"]);
  });

  it.each([
    { label: /processed/i, value: "processed" },
    { label: /fulfilled/i, value: "fulfilled" },
  ])("should set the value when selected", async ({ label, value }) => {
    const callback = vi.fn();

    render(
      <Theme>
        <OrderStatusSelector onChange={callback} />
      </Theme>,
    );

    const user = userEvent.setup();
    const select = screen.getByRole("combobox");
    await user.click(select);

    const options = await screen.findAllByRole("option", { name: label });
    expect(options).toHaveLength(1);
    console.log(options[0].textContent);
    await user.click(options[0]);

    // Verify that the callback was called with the correct value
    expect(callback).toHaveBeenCalledWith(value);
  });
});
