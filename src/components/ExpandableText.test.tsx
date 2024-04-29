import {render, screen} from '@testing-library/react';
import {describe} from "vitest";
import ExpandableText from "./ExpandableText.tsx";
import {userEvent} from "@testing-library/user-event";

describe("ExpandableText", () => {
        const longText = "referrentur arcu consul porro eget luctus quaerendum postulant urna prompta erat reque definitionem luptatum novum mus doming usu aenean nec accommodare at sadipscing oratio ancillae tamquam dictumst eripuit posse nascetur delectus suspendisse ante mnesarchum arcu platea cetero nascetur ac saperet sagittis epicurei tempus qualisque purus iriure splendide alia expetenda odio iisque brute inani referrentur alterum animal nihil dissentiunt torquent senectus postulant doctus id malorum interdum dicunt liber justo animal quam postea primis definiebas fringilla fabulas parturient his antiopam his phasellus elit saepe postea harum massa eripuit habitasse tractatos prodesset discere mi primis dapibus himenaeos dolor prompta aptent senserit dui posidonium graeco nobis rhoncus tortor quem ea patrioque turpis delicata postea diam aenean cursus te tempus vidisse vivendo minim vis pri nonumy explicari non pro perpetua torquent invidunt dicant dicta natoque curabitur expetendis dolor imperdiet dolores evertitur dolore facilisi accusata comprehensam dolorum aptent ligula ante dicant nec hac omittantur repudiare possit iusto adversarium atomorum sodales aliquid habitant platea quis donec luptatum ludus option ocurreret lacinia fabulas sodales vocibus menandri fabellas detracto urbanitas mandamus mnesarchum dapibus aeque singulis nunc sonet labores nominavi te pharetra eloquentiam docendi inani metus alienum dicam lacus sollicitudin commodo esse praesent ocurreret conclusionemque varius definiebas sem tristique debet";

    it("should render the all the short text", () => {
        render(<ExpandableText text="Hello, World!" />);
        const text = screen.getByText(/hello, world/i);
        expect(text).toBeInTheDocument();
    });


    it("should truncate too long text", () => {
        render(<ExpandableText text={longText} />);

        const documentText = screen.getByText(/referrentur arcu/i);
        expect(documentText).to.toHaveTextContent("...");
        expect(documentText).not.to.eq(longText);

        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(/show more/i);
    });

    it("should render the full text show more is clicked", async () => {
        render(<ExpandableText text={longText} />);

        const user = userEvent.setup()
        await user.click(screen.getByRole("button"));

        const fullText = screen.getByText(longText);
        expect(fullText).toBeInTheDocument();

        expect(screen.getByRole("button")).toHaveTextContent(/show less/i);
    });

    it("should render collapse the text when show less is clicked", async () => {
        render(<ExpandableText text={longText} />);

        const user = userEvent.setup()
        await user.click(screen.getByRole("button"));
        await user.click(screen.getByRole("button"));

        const documentText = screen.getByText(/referrentur arcu/i);
        expect(documentText).to.toHaveTextContent("...");
        expect(documentText).not.to.eq(longText);

        expect(screen.getByRole("button")).toHaveTextContent(/show more/i);
    });
});