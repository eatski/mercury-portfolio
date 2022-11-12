import { Suspense, useState } from 'react'
import React from 'react'
import {app, buttons, json, jsonContainer, main, switzh, textarea} from "./App.css"
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
        <ResultContainer query={query}/>
      </div>
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

const ResultContainer: React.FC<{query: string}> = ({query}) => {
  return <div className={jsonContainer}>
    <Suspense fallback={"loading"}>
      <Result query={query}/>
    </Suspense>
  </div>
}

const Result: React.FC<{query: string}> = ({query}) => {
  const result = client.loadQuery(query);
  if(result.result){
    return  <pre className={json}>{JSON.stringify(result.data, null, 3)}</pre>
  } else {
    return <pre className={json}>{JSON.stringify(result.error, null, 3)}</pre>
  }
}

export default App
