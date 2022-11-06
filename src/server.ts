import {ApolloServerBase,gql } from "apollo-server-core";
import { dbPromise } from "./db";
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
        const db = await dbPromise;
          // Prepare an sql statement
        const stmt = db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");

        // Bind values to the parameters and fetch the results of the query
        const result = stmt.getAsObject({':aval' : 1, ':bval' : 'world'});
        return result.b
    },
    profile: async () => {
        const db = await dbPromise;
        const stmt = db.prepare("SELECT * FROM profile WHERE id=:id");
        const result = stmt.getAsObject({':id' : 0});
        return result
    }
  },
  Profile: {
    skill: async (parent: any) => {
        const db = await dbPromise;
        console.log("profile", parent)
        const stmt = db.prepare("SELECT * FROM language_profile WHERE profile_id=:id");
        const result = stmt.getAsObject({':id' : parent.id});
        stmt.free();
        console.log("language_id", result)
        return {
          languages: [{
            language: {
              id: result.language_id
            }
          }]
        }
    },
  },
  Language: {
    name: async (parent: any) => {
        const db = await dbPromise;
        console.log(parent);
        const stmt = db.prepare("SELECT * FROM language WHERE id=:id");
        const result = stmt.getAsObject({':id' : parent.id});
        return result.name
    }
  }
};

export const server = new ApolloServerBase({
  typeDefs,
  resolvers,
});
