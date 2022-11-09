import { server } from "./server";
import {InMemoryCache} from "@apollo/client"
import {gql} from "@apollo/client"

type QueryResult = {
    result: true,
    data: unknown,
} | {
    result: false,
    error: unknown,
}
export class GraphQLClient {
    
    private set = new Map<string,unknown>();
    private apolloCache = new InMemoryCache();
    
    loadQuery(query: string): QueryResult {
        const parsed = tryParseQuery(query);
        if(!parsed.valid) {
            return {
                result: false,
                error: parsed.cause,
            }
        }
        const queryNode = parsed.query;
        const result = this.apolloCache.readQuery({
            query: queryNode
        });
        if(!result){
            const cached = this.set.get(query);
            if(cached){
              return {
                result: false,
                error: cached,
              }
            } else {
              throw server.executeOperation({
                query: queryNode
              }).then(res => {
                if(res.data){
                    this.set.clear()
                  this.apolloCache.writeQuery({
                    query: queryNode,
                    data: res.data
                  })
                } else {
                    this.set.set(query,res.errors)
                }
              }).catch(e => {
                this.set.set(query,e)
              })
            }
        }
        return {
            result: true,
            data: result,
        };
    }
}

type ParseResult = {
    valid: true,
    query: ReturnType<typeof gql>
} | {
    valid: false,
    cause: unknown
}

const tryParseQuery = (query: string):ParseResult => {
  try {
    return {
        valid: true,
        query: gql(query)
    };
  } catch (e) {
    return {
        valid: false,
        cause: e
    };
  }
}