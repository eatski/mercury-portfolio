import { Suspense, useState } from 'react'
import React from 'react'
import {app, buttons, json, jsonContainer, main, switzh, textarea} from "./App.css"
import {Provider,useQuery} from "urql"
import {client} from "./urql"
import {parse,DocumentNode} from "graphql"

function App() {

  const [query, setQuery] = useState(FIRST_QUERY);

  return (
    <Provider value={client}>
    <div className={app}>
      <h1>My Profile</h1>
      <div className={main}>
        <Buttons onClick={setQuery} />
        <textarea className={textarea} value={query} onInput={(e) => setQuery((e.target as HTMLTextAreaElement).value)} />
        <ResultContainer query={query}/>
      </div>
    </div>
    </Provider>
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

type ParseResult = {
  query: null,
  error: unknown
} | {
  query: DocumentNode
}
const ResultContainer: React.FC<{query: string}> = ({query}) => {
  const parsed : ParseResult= (() => {
    try {
      return {
        query:parse(query)
      }
    } catch (error) {
      return {
        query: null,
        error
      }
    }
  })();

  return <div className={jsonContainer}>
    { parsed.query ? 
      <Suspense fallback={"loading"}>
        <Result query={parsed.query}/>
      </Suspense> : <pre className={json}>{JSON.stringify(parsed.error, null, 3)}</pre>
    }
  </div>
}

const Result: React.FC<{query: DocumentNode}> = ({query}) => {
  const [{data,error}] = useQuery({
    query,
  });
  if(error){
    return  <pre className={json}>{JSON.stringify(error, null, 3)}</pre>
  } else {
    return <pre className={json}>{JSON.stringify(data, null, 3)}</pre>
  }
}

export default App
