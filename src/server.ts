import {ApolloServerBase,gql } from "apollo-server-core";
import { Resolvers } from "./codegen/resolvers";
import { dbClient } from "./db";
import schema from "./schema.graphql?raw"

// The GraphQL schema
const typeDefs = gql(schema);

const neverUsedValue = () => null as never

// A map of functions which return data for the schema.
const resolvers: Resolvers = {
  Query: {
    hello: async () => {
        const result = await dbClient.findOne("SELECT * FROM hello WHERE a =:a", { ":a": 1 });
        return result.b;
    },
    profile: async () => {
        return dbClient.findOne("SELECT * FROM profile WHERE id=:id", {':id' : 0})
    }
  },
  Profile: {
    skill: async (parent: any) => {
        const result = await dbClient.findMany("SELECT * FROM language_profile WHERE profile_id=:id", {':id' : parent.id})
        return {
          languages: result.map(item => ({
            language: {
              id: item.language_id,
              name: neverUsedValue()
            },
            proficiency: {
              id: item.proficiency_id,
              description: neverUsedValue(),
              emoji: neverUsedValue()
            }
          })),
          libraries: [],
        }
    },
  },
  Language: {
    name: async (parent: any) => {
        const result = await dbClient.findOne("SELECT * FROM language WHERE id=:id", {':id' : parent.id})
        return result.name
    }
  }
};

export const server = new ApolloServerBase({
  typeDefs,
  resolvers,
});
