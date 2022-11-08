import { server } from "./server";
import {InMemoryCache} from "@apollo/client"
import {gql} from "@apollo/client"

const cache = new InMemoryCache();

const tryParseQuery = (query: string) => {
  try {
    return gql(query);
  } catch (e) {
    console.log(e)
    return null;
  }
}

export const useQuery = (query: string,set: Set<string>)  => {
    const queryNode = tryParseQuery(query);
    if(!queryNode) {
      return null
    }
    const result = cache.readQuery({
      query: queryNode
    });
    if(!result){
      if(set.has(query)){
        return null
      } else {
        set.add(query)
        throw server.executeOperation({
          query: queryNode
        }).then(res => {
          if(res.data){
            cache.writeQuery({
              query: queryNode,
              data: res.data
            })
          } else {
            console.log(res.errors)
          }
        })
      }
     
    }
    return result;
  }