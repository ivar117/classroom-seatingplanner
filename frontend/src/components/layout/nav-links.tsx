export interface NavLink {
    label:        string;
    authRequired: boolean;
    href:         string;
}

const NavLinks = [
    {
        label: "Seatingplans",
        authRequired: true,
        href: "/seatingplans"
    }
] as Array<NavLink>;

export const NonUserLinks = [
    {
        label: "Signup",
        authRequired: false,
        href: "/signup"
    },
    {
        label: "Login",
        authRequired: false,
        href: "/login"
    }
] as Array<NavLink>;

export default NavLinks
