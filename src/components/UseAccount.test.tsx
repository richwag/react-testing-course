import { render, screen } from "@testing-library/react";
import UserAccount from "./UserAccount.tsx";
import {User} from "../entities.ts";


describe('UserAccount', () => {
    it('should render edit button when user is an admin', () => {
        const user:User = { name: "World", id: 1, isAdmin: true};
        render(<UserAccount user={user} />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(/edit/i);
    });

    it('should not render edit button when user is not an admin', async () => {
        const user:User = { name: "World", id: 1, isAdmin: false};
        render(<UserAccount user={user} />);
        const button = screen.queryAllByRole('button');
        expect(button.length).toBe(0);
    });

    it('should render the user name', () => {
        const user:User = { name: "World", id: 1, isAdmin: true};
        render(<UserAccount user={user} />);
        const userName = screen.getByText(/world/i);
        expect(userName).toBeInTheDocument();
    });
});