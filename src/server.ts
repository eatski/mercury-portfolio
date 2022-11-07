import {ApolloServerBase,gql } from "apollo-server-core";
import { Resolvers } from "./codegen/resolvers";
import { builder } from "./kysely";
import schema from "./schema.graphql?raw"

// The GraphQL schema
const typeDefs = gql(schema);

const neverUsedValue = () => null as never

// A map of functions which return data for the schema.
const resolvers: Resolvers = {
  Query: {
    hello: async () => {
        const [result] = await builder.selectFrom("hello").select("b").execute();
        return result.b;
    },
    profile: async () => {
      const [result] = await builder.selectFrom("profile").select("id").select("name").execute();
      return {
        id: result.id.toString(),
        name: result.name,
        skill: neverUsedValue(),
      }
    }
  },
  Profile: {
    skill: async (parent) => {
        const result = await builder
          .selectFrom("language_profile")
          .select("language_id")
          .select("proficiency_id")
          .where("profile_id","=",parseInt(parent.id))
          .execute();
        return {
          languages: result.map(item => ({
            language: {
              id: item.language_id.toString(),
              name: neverUsedValue()
            },
            proficiency: {
              id: item.proficiency_id.toString(),
              description: neverUsedValue(),
              emoji: neverUsedValue()
            }
          })),
          libraries: [],
        }
    },
  },
  Language: {
    name: async (parent) => {
        const [result] = await builder.selectFrom("language").select("name").where("id", "=", parseInt(parent.id)).execute();
        return result.name
    },
  }
};

export const server = new ApolloServerBase({
  typeDefs,
  resolvers,
});
