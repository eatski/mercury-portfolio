import { Suspense, useRef, useState } from 'react'
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
    console.log(e)
    return null;
  }
}

const useQuery = (query: string,set: Set<string>)  => {
  const queryNode = tryParseQuery(query);
  if(!queryNode) {
    return null
  }
  const result = cache.readQuery({
    query: queryNode
  });
  console.log("readQuery",result)
  if(!result){
    if(set.has(query)){
      return null
    } else {
      set.add(query)
      throw server.executeOperation({
        query: queryNode
      }).then(res => {
        console.log("result",res.data);
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

const FIRST_QUERY = `#graphql
query { 
  __typename, 
  hello, 
  profile { 
    name
    skill {
        languages {
          language {
            id
            name
          }
        }
    }
  } 
}
`

function App() {

  const [query, setQuery] = useState(FIRST_QUERY);

  return (
    <div className="App">
      <h1>My Profile</h1>
      <div className="card">
        <textarea className='textarea' value={query} onInput={(e) => setQuery((e.target as HTMLTextAreaElement).value)}>
        </textarea>
        <MemorizedResult query={query}/>
      </div>
      <p className="read-the-docs">
        Write query to fetch my profile!!
      </p>
    </div>
  )
}

const MemorizedResult: React.FC<{query: string}> = ({query}) => {
  const ref = useRef(new Set<string>());
  return <Suspense fallback={null}>
    <Result query={query} set={ref.current}/>
  </Suspense>
}

const Result: React.FC<{query: string,set: Set<string>}> = ({query,set}) => {
  

  return  <div>
      {JSON.stringify(useQuery(query,set))}
    </div>
}

export default App
