import {render, screen} from "@testing-library/react";
import {describe} from "vitest";
import SearchBox from "./SearchBox.tsx";
import {userEvent} from "@testing-library/user-event";

describe("SearchBox", () => {
    function renderComponent() {
        const onSearch = vi.fn();
        const user = userEvent.setup();
        render(<SearchBox onChange={onSearch}/>);

        return {onSearch, user, input: screen.getByPlaceholderText("Search...")};
    }
    it("should render a search box", () => {
        renderComponent();
    });

    it("should call the onSearch prop when the user presses enter", async () => {
        const {onSearch, user, input} = renderComponent();

        await user.type(input!, "test{enter}");

        expect(onSearch).toHaveBeenCalledWith("test");
    });

    it("should not call the onSearch prop when the user presses enter and no text is entered", async () => {
        const {onSearch, user, input} = renderComponent();

        await user.type(input!, "enter}");

        expect(onSearch).not.toHaveBeenCalled();
    });
});