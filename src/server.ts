import {ApolloServerBase,gql } from "apollo-server-core";
import { dbClient } from "./db";
// The GraphQL schema
const typeDefs = gql`
  type Proficiency {
    id: ID!
    description: String!
    emoji: String!
  }
  type Language {
    id: ID!,
    name: String!
  }
  type Library {
    id: ID!,
    name: String!
  }
  type Skill {
    id: ID!,
    languages: [AcquiredLanguage!]!,
    libraries: [AcquiredLibrary!]!
  }
  type AcquiredLanguage {
    language: Language!,
    proficiency: Proficiency!
  }
  type AcquiredLibrary {
    library: Library!,
    proficiency: Proficiency!
  }
  type Profile {
    id: ID!,
    name: String!,
    skill: Skill!
  }
  type Query {
    hello: String!,
    profile: Profile!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: async () => {
        const result = await dbClient.findOne("SELECT * FROM hello WHERE a =:a", { ":a": 1 });
        return result.b
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
            }
          }))
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
