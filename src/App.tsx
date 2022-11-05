import { Suspense, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import {InMemoryCache} from "@apollo/client"
import './App.css'
import { server } from './server'
import {gql} from "@apollo/client"
import React from 'react'

const cache = new InMemoryCache();

const tryParseQuery = (query: string) => {
  try {
    return gql(query);
  } catch (e) {
    return null;
  }
}

const useQuery = (query: string)  => {
  //HACk
  const ref = useRef(new Set<string>());
  const queryNode = tryParseQuery(query);
  if(!queryNode) {
    return null
  }
  const result = cache.readQuery({
    query: queryNode
  });
  console.log("readQuery",result)
  if(!result){
    if(ref.current.has(query)){
      return null
    } else {
      ref.current.add(query)
      throw server.executeOperation({
        query: queryNode
      }).then(res => {
        console.log("result",res.data);
        if(res.data){
          res.data && cache.writeQuery({
            query: queryNode,
            data: res.data
          })
        }
      })
    }
   
  }
  return result;
}

function App() {

  const [query, setQuery] = useState(`query { hello, __typename }`);

  return (
    <div className="App">
      <h1>My Profile</h1>
      <div className="card">
        <textarea value={query} onInput={(e) => setQuery((e.target as HTMLTextAreaElement).value)}>
        </textarea>
        <MemorizedResult query={query}/>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

const MemorizedResult: React.FC<{query: string}> = ({query}) => {
  return <Suspense fallback={null}>
    <Result query={query}/>
  </Suspense>
}

const Result: React.FC<{query: string}> = ({query}) => {
  

  return  <div>
      {JSON.stringify(useQuery(query))}
    </div>
}

export default App
