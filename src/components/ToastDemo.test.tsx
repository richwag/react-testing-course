import {render, screen, waitFor} from "@testing-library/react";
import {describe} from "vitest";
import ToastDemo from "./ToastDemo.tsx";
import {userEvent} from "@testing-library/user-event";
import {Toaster} from "react-hot-toast";

describe("ToastDemo", () => {
    it("should render a toast", async () => {
        render(<><ToastDemo /><Toaster/></>);
        const user = userEvent.setup();
        const button = screen.getByRole("button", {name: "Show Toast"});

        await user.click(button);

        await waitFor(() => {
            expect(screen.getByText("Success")).toBeInTheDocument();
        });
    });
});