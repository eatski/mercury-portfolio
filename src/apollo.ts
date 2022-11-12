import {DocumentNode,print} from "graphql"
import { ApolloClient,HttpLink,InMemoryCache } from "@apollo/client"
const client = new ApolloClient({
    link: new HttpLink({
        uri: "/graphql",
    }),
    cache: new InMemoryCache(),
})
const map = new Map<string,unknown>();

export const useQueryByApolloClient = ({query}: {query:DocumentNode}) => {
    const cache = client.readQuery <{}>({
        query
    })
    if(cache){
        return {
            data: cache,
            error: null
        }
    } else {
        const printed = print(query);
        const error = map.get(printed);
        if(error){
            return {
                error: error
            }
        }
        throw client.query({
            query
        }).catch(e => {
            map.set(printed,e);
        })
    }
}