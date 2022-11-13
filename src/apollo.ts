import {DocumentNode,print} from "graphql"
import { ApolloClient,HttpLink,InMemoryCache} from "@apollo/client"
import { createContext, useContext } from "react";

type ApolloClientWithFailureCache = [ApolloClient<unknown> ,Map<string,unknown>]

export const createClientWithFailureCache = ():ApolloClientWithFailureCache => {
    const client = new ApolloClient({
        link: new HttpLink({
            uri: "/graphql",
        }),
        cache: new InMemoryCache(),
    })
    const map = new Map<string,unknown>();   
    return [client,map]
}

export const Context = createContext(createClientWithFailureCache());

export const useQueryByApolloClient = ({query}: {query:DocumentNode}) => {
    const [client,map] = useContext(Context);
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