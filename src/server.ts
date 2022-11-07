import {ApolloServerBase,gql } from "apollo-server-core";
import { Resolvers } from "./codegen/resolvers";
import { builder } from "./kysely";
import { Loader } from "./loader";
import schema from "./schema.graphql?raw"

// The GraphQL schema
const typeDefs = gql(schema);

const neverUsedValue = () => null as never

// A map of functions which return data for the schema.
const resolvers: Resolvers<Context> = {
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
        console.log("slill",result);
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
    name: async (parent,_,{languageLoader}) => {
        const name = await languageLoader.load(parseInt(parent.id));
        return name
    },
  }
};

type Context = {
  languageLoader: Loader<number,Record<number,string>>
}

export const server = new ApolloServerBase<Context>({
  typeDefs,
  resolvers,
  context: () => {
    return {
      languageLoader: new Loader<number,Record<number,string>>(async (keys) => {
        const result = await builder.selectFrom("language").select("id").select("name").where("id", "in",keys).execute();
        return Object.fromEntries(result.map(item => [item.id, item.name]))
      })
    }
  }
});
