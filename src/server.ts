import {ApolloServerBase,gql } from "apollo-server-core";
import { Resolvers,Proficiency, Technology } from "./codegen/resolvers";
import { builder } from "./kysely";
import { Loader } from "./loader";
import schema from "./schema.graphql?raw"

// The GraphQL schema
const typeDefs = gql(schema);

const neverUsedValue = () => null as never

// A map of functions which return data for the schema.
const resolvers: Resolvers<Context> = {
  Query: {
    site: async (_,args) => {
      const [site] = await builder.selectFrom("site").select("id").select("description").select("repository").where("id","=",args.id).execute();
      return {
        id: site.id,
        description: site.description,
        repositoryURL: site.repository,
        technologyStacks: neverUsedValue()
      }
    },
    profile: async (_,args) => {
      const [result] = await builder.selectFrom("profile").select("id").select("name").where("id","=",args.id).execute();
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
          .where("profile_id","=",parent.id)
          .execute();
        return {
          id: parent.id,
          languages: result.map(item => ({
            id: `${item.language_id}`,
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
          technologies: neverUsedValue(),
        }
    },
  },
  Language: {
    name: async (parent,_,{languageLoader}) => {
        const name = await languageLoader.load(parseInt(parent.id));
        return name
    },
  },
  Site: {
    technologyStacks: async () => {
      const result = await builder.selectFrom("technology_site").select("technology_id").select("technology_id").execute();
      return result.map(item => ({
        id: item.technology_id.toString(),
        name: neverUsedValue()
      }))
    }
  },
  Skill: {
    technologies: async (parent) => {
      const result = await builder
        .selectFrom("technology_profile")
        .select("technology_id")
        .select("proficiency_id")
        .where("profile_id","=",parent.id)
        .execute();
      return result.map(item => ({
        id: `${item.technology_id}`,
        technology: {
          id: item.technology_id.toString(),
          name: neverUsedValue()
        },
        proficiency: {
          id: item.proficiency_id.toString(),
          description: neverUsedValue(),
          emoji: neverUsedValue()
        }
      }))
    },
  },
  Proficiency: {
    description: async (parent,_,{proficiencyLoader}) => {
        const {description} = await proficiencyLoader.load(parseInt(parent.id));
        return description
    },
    emoji: async (parent,_,{proficiencyLoader}) => {
        const {emoji} = await proficiencyLoader.load(parseInt(parent.id));
        return emoji
    }
  },
  Technology: {
    name: async (parent,_,{technologyLoader}) => {
        const {name} = await technologyLoader.load(parseInt(parent.id));
        return name
    }
  }
};

type Context = {
  languageLoader: Loader<number,Record<number,string>>,
  proficiencyLoader: Loader<number,Record<number,Omit<Proficiency,"id">>>,
  technologyLoader: Loader<number,Record<number,Omit<Technology,"id">>>,
}

export const server = new ApolloServerBase<Context>({
  typeDefs,
  resolvers,
  context: () => {
    return {
      languageLoader: new Loader<number,Record<number,string>>(async (keys) => {
        const result = await builder.selectFrom("language").select("id").select("name").where("id", "in",Array.from(keys)).execute();
        return Object.fromEntries(result.map(item => [item.id, item.name]))
      }),
      proficiencyLoader: new Loader<number,Record<number,Omit<Proficiency,"id">>>(async (keys) => {
        const result = await builder.selectFrom("proficiency").select("id").select("description").select("emoji").where("id", "in",Array.from(keys)).execute();
        return Object.fromEntries(result.map(item => [item.id, item]))
      }),
      technologyLoader: new Loader<number,Record<number,Omit<Technology,"id">>>(async (keys) => {
        const result = await builder.selectFrom("technology").select("id").select("name").where("id", "in",Array.from(keys)).execute();
        return Object.fromEntries(result.map(item => [item.id, item]))
      })
    }
  }
});
