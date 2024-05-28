import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/categories", () =>
    HttpResponse.json({
      categories: [
        { id: 1, name: "Shirts" },
        { id: 2, name: "Pants" },
        { id: 3, name: "Shoes" },
      ],
    }),
  ),
];
