//  Faisal (C) 25 April 2025

import { createMemoryRouter } from "react-router-dom";
import Main from "../Layouts/Main/Main";
import Root from "../Root/Root";

export const router = createMemoryRouter([
    {
        path: "/",
        element: <Main />,
        children: [
            {
                path: "/",
                element: <Root />
            },
        ]
    }
]);