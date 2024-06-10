import { describe } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../routes.tsx";
import { mockAuthState } from "../utils.ts";

function renderComponent(route: string) {
  const router = createMemoryRouter(routes, { initialEntries: [route] });

  render(<RouterProvider router={router}></RouterProvider>);
  return router;
}

describe("Router", () => {
  it("should render the home page", () => {
    mockAuthState({
      isAuthenticated: false,
      user: undefined,
      isLoading: false,
    });

    renderComponent("/");

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  // it("should render the about page", () => {
  //   router.push("/about");
  //   expect(screen.getByText("About")).toBeInTheDocument();
  // });
  //
  // it("should render the contact page", () => {
  //   router.push("/contact");
  //   expect(screen.getByText("Contact")).toBeInTheDocument();
  // });
  //
  // it("should render the not found page", () => {
  //   router.push("/not-found");
  //   expect(screen.getByText("Not Found")).toBeInTheDocument();
  // });
});
