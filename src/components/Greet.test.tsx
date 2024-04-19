
import Greet from "./Greet";
import { render, screen } from "@testing-library/react";
describe("Greet", () => {
  it("should render a name when passed", () => {
    render(<Greet name="World" />);

    const heading = screen.getByRole("heading");
    expect(heading).toHaveTextContent(/world/i);
  });
});