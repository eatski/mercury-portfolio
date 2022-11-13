import { createClient as createClientInner } from "urql";

export const createClient = () =>
	createClientInner({
		url: "/graphql",
		suspense: true,
	});
