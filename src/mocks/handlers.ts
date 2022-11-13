import { rest } from "msw";

import { server } from "../server";
export const handlers = [
	rest.post("/graphql", async (req, res, ctx) => {
		const requestJson = await req.json();
		const result = await server.executeOperation(requestJson);
		return res(ctx.status(200), ctx.json(result));
	}),
];
