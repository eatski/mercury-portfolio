import { Suspense, useState } from 'react'
import React from 'react'
import {app, buttons, json, main, switzh, textarea} from "./App.css"
import { GraphQLClient } from './client';

const client = new GraphQLClient()

function App() {

  const [query, setQuery] = useState(FIRST_QUERY);

  return (
    <div className={app}>
      <h1>My Profile</h1>
      <div className={main}>
        <Buttons onClick={setQuery} />
        <textarea className={textarea} value={query} onInput={(e) => setQuery((e.target as HTMLTextAreaElement).value)} />
        <MemorizedResult query={query}/>
      </div>
      <p className="read-the-docs">
        Write query to fetch my profile!!
      </p>
    </div>
  )
}


const FIRST_QUERY = `#graphql
query { 
  hello, 
  profile { 
    name
  } 
}
`

const SECOND_QUERY = `#graphql
query { 
  profile { 
    skill {
        languages {
          language {
            name
          }
          proficiency {
            emoji
          }
        }
    }
  } 
}
`

const THIRD_QUERY = `#graphql
query {

}
`


const Buttons: React.FC<{onClick: (query: string) => void}> = ({onClick}) => {
  return <div className={buttons}>
    <button className={switzh} onClick={() => onClick(FIRST_QUERY)}>Button 1</button>
    <button className={switzh} onClick={() => onClick(SECOND_QUERY)}>Button 2</button>
    <button className={switzh} onClick={() => onClick(THIRD_QUERY)}>Button 3</button>
  </div>
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
