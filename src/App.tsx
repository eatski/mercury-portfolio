import { PropsWithChildren, Suspense, useState } from 'react'
import React from 'react'
import {app, buttons, json, jsonContainer, main, switzh, textarea} from "./App.css"
import {Provider,useQuery as useQueryByUrql} from "urql"
import {client} from "./urql"
import {parse,DocumentNode} from "graphql"
import { useQueryByApolloClient } from './apollo'

function App() {

  const [query, setQuery] = useState(FIRST_QUERY);

  type ParseResult = {
    query: null,
    error: unknown
  } | {
    query: DocumentNode
  }

  const parsed: ParseResult = (() => {
    try {
      return {
        query: parse(query)
      }
    } catch (error) {
      return {
        query: null,
        error
      }
    }
  })();

  return (
    <Provider value={client}>
    <div className={app}>
      <h1>My Profile</h1>
      <div className={main}>
        <Buttons onClick={setQuery} />
        <textarea className={textarea} value={query} onInput={(e) => setQuery((e.target as HTMLTextAreaElement).value)} />
        <ResultContainer label='Apollo Client'>
          {parsed.query ? <ApolloClientQuery query={parsed.query}/> : <JsonStringify data={parsed.error} />}
        </ResultContainer>
        <ResultContainer label='Urql'>
          {parsed.query ? <UrqlQuery query={parsed.query}/> : <JsonStringify data={parsed.error} />}
        </ResultContainer>
      </div>
    </div>
    </Provider>
  )
}


const FIRST_QUERY = `#graphql
query { 
  hello, 
  profile { 
    id
    name
  } 
}
`

const SECOND_QUERY = `#graphql
query { 
  profile { 
    id
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

const JsonStringify = ({data}: {data: unknown}) => {
  return <pre className={json}>{JSON.stringify(data, null, 3)}</pre>
}

const ResultContainer: React.FC<PropsWithChildren<{label: string}>> = ({children,label}) => {
  return <section className={jsonContainer}>
    <h2>{label}</h2>
    <Suspense fallback={"loading"}>
        {children}
     </Suspense>
  </section>
}
const ApolloClientQuery: React.FC<{query: DocumentNode}> = ({query}) => {
  const {data,error} = useQueryByApolloClient({
    query,
  });
  if(error){
    return  <JsonStringify data={error}/>
  } else {
    return <JsonStringify data={data}/>
  }
}

const UrqlQuery: React.FC<{query: DocumentNode}> = ({query}) => {
  const [{data,error}] = useQueryByUrql({
    query,
  });
  if(error){
    return  <JsonStringify data={error}/>
  } else {
    return <JsonStringify data={data}/>
  }
}

export default App
