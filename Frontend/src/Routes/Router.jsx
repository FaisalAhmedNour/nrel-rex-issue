//  Faisal (C) 9 July 2025

import { createMemoryRouter } from "react-router-dom";
import Main from "../Layouts/Main/Main";
import Issuance from "../pages/Issuance";

export const router = createMemoryRouter([
    {
        path: "/",
        element:<Main />,
        children: [
            {
                path: "/",
                element: <Issuance />
            },
        ]
    }
]);