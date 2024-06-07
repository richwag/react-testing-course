import { render, screen, waitFor } from "@testing-library/react";
import Label from "./Label.tsx";
import { LanguageProvider } from "../providers/language/LanguageProvider.tsx";

describe("Label", () => {
  it.each([
    { language: "en", label: "Welcome" },
    { language: "es", label: "Bienvenidos" },
  ])(
    "should render a label for language $language",
    async ({ language, label }) => {
      render(
        // @ts-ignore
        <LanguageProvider language={language}>
          <Label labelId={"welcome"} />
        </LanguageProvider>,
      );
      await waitFor(() => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    },
  );

  it("should throw an error for a label that doesn't exist", () => {
    expect(() =>
      render(
        <LanguageProvider language={"en"}>
          <Label labelId={"foo"} />
        </LanguageProvider>,
      ),
    ).toThrowError();
  });
});
