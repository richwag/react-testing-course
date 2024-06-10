import { render, screen } from "@testing-library/react";
import AuthStatus from "./AuthStatus.tsx";
import { mockAuthState } from "../utils.ts";

describe("AuthStatus", () => {
  it("should render the user name when authenticated", () => {
    mockAuthState({
      isAuthenticated: true,
      user: {
        name: "Test User",
      },
      isLoading: false,
    });

    render(<AuthStatus />);

    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("should render the login button when not authenticated", () => {
    mockAuthState({
      isAuthenticated: false,
      user: undefined,
      isLoading: false,
    });

    render(<AuthStatus />);

    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("should render the loading spinner when loading", () => {
    mockAuthState({
      isAuthenticated: false,
      user: undefined,
      isLoading: true,
    });

    render(<AuthStatus />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
