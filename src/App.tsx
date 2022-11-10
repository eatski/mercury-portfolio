import { Suspense, useState } from 'react'
import React from 'react'
import {app, json, main, textarea} from "./App.css"
import { GraphQLClient } from './client';

const FIRST_QUERY = `#graphql
query { 
  __typename, 
  hello, 
  profile { 
    name
    skill {
        languages {
          language {
            name
          }
          proficiency {
            description
            emoji
          }
        }
    }
  } 
}
`

const client = new GraphQLClient()

function App() {

  const [query, setQuery] = useState(FIRST_QUERY);

  return (
    <div className={app}>
      <h1>My Profile</h1>
      <div className={main}>
        <textarea className={textarea} value={query} onInput={(e) => setQuery((e.target as HTMLTextAreaElement).value)} />
        <MemorizedResult query={query}/>
      </div>
      <p className="read-the-docs">
        Write query to fetch my profile!!
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
  const result = client.loadQuery(query);
  if(result.result){
    return  <pre className={json}>{JSON.stringify(result.data, null, "\t")}</pre>
  } else {
    return <pre className={json}>{JSON.stringify(result.error, null, "\t")}</pre>
  }
}

export default App
