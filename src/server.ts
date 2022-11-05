import {ApolloServerBase,gql } from "apollo-server-core";
import { dbPromise } from "./db";
// The GraphQL schema
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: async () => {
        const db = await dbPromise;
          // Prepare an sql statement
        const stmt = db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");

        // Bind values to the parameters and fetch the results of the query
        const result = stmt.getAsObject({':aval' : 1, ':bval' : 'world'});
        return result.b
    },
  },
};

export const server = new ApolloServerBase({
  typeDefs,
  resolvers,
});
