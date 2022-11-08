import { Suspense, useRef, useState } from 'react'
import React from 'react'
import {app, json, main, textarea} from "./App.css"
import { useQuery } from './useQuery';

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
    <div className={app}>
      <h1>My Profile</h1>
      <div className={main}>
        <textarea className={textarea} value={query} onInput={(e) => setQuery((e.target as HTMLTextAreaElement).value)}>
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
  return  <div className={json}>
      {JSON.stringify(useQuery(query,set))}
    </div>
}

export default App
