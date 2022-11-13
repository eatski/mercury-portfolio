import { PropsWithChildren, Suspense, useEffect, useState } from 'react'
import React from 'react'
import { app, buttons, controlls, json, jsonContainer, logDisplay, main, switzh, textarea } from "./App.css"
import { Provider as UrqlProvider, useQuery as useQueryByUrql } from "urql"
import { createClient as createUrql } from "./urql"
import { parse, DocumentNode } from "graphql"
import { useQueryByApolloClient,Context as ApolloContext, createClientWithFailureCache } from './apollo'
import { addListener } from './sqlLogging'

function App() {

  const [query, setQuery] = useState(FIRST_QUERY);
  const [currentClientType, setCurrentClientType] = useState<ClientLibrary>("apollo");
  const [[urqlClient,apolloClient], setClient] = useState(() => [createUrql(),createClientWithFailureCache()]);
  const parsed = (() => {
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
    <UrqlProvider value={urqlClient}>
      <ApolloContext.Provider value={apolloClient} >
        <div className={app}>
          <h1>My Profile</h1>
          <Controll client={currentClientType} setClient={setCurrentClientType} setQuery={setQuery} clearCache={() => {
            setClient([createUrql(),createClientWithFailureCache()])
          }}/>
          <div className={main}>
            <textarea className={textarea} value={query} onInput={(e) => setQuery((e.target as HTMLTextAreaElement).value)} />
            <ResultContainer>
              {parsed.query ? 
                (currentClientType === "apollo" ? <ApolloClientQuery query={parsed.query}/> : <UrqlQuery query={parsed.query}></UrqlQuery>) : <JsonStringify data={parsed.error} />}
            </ResultContainer>
            <SqlDisplay />
          </div>
        </div>
      </ApolloContext.Provider>
    </UrqlProvider>
  )
}


const FIRST_QUERY = `#graphql
query { 
  site {
    description
    repositoryURL
    technologyStacks {
      name
    }
  }
}
`

const SECOND_QUERY = `#graphql
query { 
  profile { 
    id
    skill {
      id
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
  profile { 
    id
    skill {
      id
      technologies {
        technology {
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

const SqlDisplay: React.FC = () => {
  type Item = {
    id: number,
    sql: string,
  }
  const [logs,setLogs] = useState<Item[]>([]);
  const ref = React.useRef<number>(0);
  useEffect(() => {
    return addListener((sql) => {
      setLogs((logs) => [...logs,{id: ref.current++, sql}]);
    })
  },[setLogs])
  return (
    <section className={logDisplay}>
      <h2>SQL</h2>
      {logs.map(({id,sql}) => <div key={id}>{sql}</div>)}
      {logs.length ? <button onClick={() => setLogs([])}>clear</button> : null}
    </section>
  )
}

type ClientLibrary = "urql" | "apollo";

type ControllProps = {
  setQuery: (query: string) => void;
  client: ClientLibrary;
  setClient: (client: ClientLibrary) => void;
  clearCache: () => void;
}

const Controll: React.FC<ControllProps> = ({ setQuery,client,setClient,clearCache }) => {
  return <div className={controlls}>
    <fieldset>
      <legend>Query presets</legend>
      <div className={buttons}>
        <button className={switzh} onClick={() => setQuery(FIRST_QUERY)}>Landing</button>
        <button className={switzh} onClick={() => setQuery(SECOND_QUERY)}>Profile 1</button>
        <button className={switzh} onClick={() => setQuery(THIRD_QUERY)}>Profile 2</button>
      </div>
    </fieldset>
    <fieldset>
      <legend>GraphQL Client</legend>
      <label>
        <input type="radio" name="client" value="apollo" checked={client === "apollo"} onChange={() => setClient("apollo")}/>apollo
      </label>
      <label>
        <input type="radio" name="client" value="urql" checked={client === "urql"} onChange={() => setClient("urql")}/>urql
      </label>
    </fieldset>
    <fieldset>
      <legend>Other Controlls</legend>
      <button onClick={clearCache}>clear client cache</button>
    </fieldset>
  </div>
}

const normalizeJson = (json: any): unknown=> {
  if(json instanceof Array){
    return json.map(normalizeJson);
  } else if(json instanceof Object) {
    const result: Record<string | number,Object> = {};
    const keys = Object.keys(json);
    keys.sort();
    keys.forEach((key) => {
      //@ts-ignore
      result[key] = normalizeJson(json[key]);
    })
    return result
  } else {
    return json
  }
  
}

const JsonStringify = ({ data }: { data: unknown }) => {
  return <pre className={json}>{JSON.stringify(normalizeJson(data), null, 3)}</pre>
}

const ResultContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return <section className={jsonContainer}>
    <h2>Result</h2>
    <Suspense fallback={"loading"}>
      {children}
    </Suspense>
  </section>
}
const ApolloClientQuery: React.FC<{ query: DocumentNode}> = ({ query }) => {
  const { data, error } = useQueryByApolloClient({
    query,
  });
  if (error) {
    return <JsonStringify data={error} />
  } else {
    return <JsonStringify  data={data} />
  }
}

const UrqlQuery: React.FC<{ query: DocumentNode}> = ({ query }) => {
  const [{ data, error }] = useQueryByUrql({
    query,
  });
  if (error) {
    return <JsonStringify data={error} />
  } else {
    return <JsonStringify data={data} />
  }
}

export default App
