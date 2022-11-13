import { PropsWithChildren, Suspense, useEffect, useState } from 'react'
import React from 'react'
import { app, buttons, json, jsonContainer, logDisplay, main, switzh, textarea } from "./App.css"
import { Provider, useQuery as useQueryByUrql } from "urql"
import { client } from "./urql"
import { parse, DocumentNode } from "graphql"
import { useQueryByApolloClient } from './apollo'
import { removeTypename } from './removeTypename'
import { addListener } from './sqlLogging'

function App() {

  const [query, setQuery] = useState(FIRST_QUERY);
  const [rmTypename, setRmTypename] = useState(true);
  const [currentClient, setCurrentClient] = useState<ClientLibrary>("apollo");
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
    <Provider value={client}>
      <div className={app}>
        <h1>My Profile</h1>
        <div className={main}>
          <Controll client={currentClient} setClient={setCurrentClient} setQuery={setQuery} rmTypename={rmTypename} setRmTypename={() => setRmTypename(!rmTypename)} />
          <textarea className={textarea} value={query} onInput={(e) => setQuery((e.target as HTMLTextAreaElement).value)} />
          <ResultContainer>
            {parsed.query ? 
              (currentClient === "apollo" ? <ApolloClientQuery query={parsed.query} rmTypename={rmTypename} /> : <UrqlQuery query={parsed.query} rmTypename={rmTypename}></UrqlQuery>) : <JsonStringify data={parsed.error} />}
          </ResultContainer>
          <SqlDisplay />
        </div>
      </div>
    </Provider>
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
  const [logs,setLogs] = useState<string[]>([]);
  useEffect(() => {
    return addListener((sql) => {
      setLogs((logs) => [...logs,sql]);
    })
  },[setLogs])
  return (
    <section className={logDisplay}>
      <h2>SQL</h2>
      {logs.map((sql) => <div key={sql}>{sql}</div>)}
    </section>
  )
}

type ClientLibrary = "urql" | "apollo";

type ControllProps = {
  setQuery: (query: string) => void;
  rmTypename: boolean;
  setRmTypename: () => void;
  client: ClientLibrary;
  setClient: (client: ClientLibrary) => void;
}

const Controll: React.FC<ControllProps> = ({ setQuery, setRmTypename,rmTypename,client,setClient }) => {
  return <div className={buttons}>
    <button className={switzh} onClick={() => setQuery(FIRST_QUERY)}>About</button>
    <button className={switzh} onClick={() => setQuery(SECOND_QUERY)}>Skill 1</button>
    <button className={switzh} onClick={() => setQuery(THIRD_QUERY)}>Skill 2</button>
    <label>
      Remove '__typename'
      <input type="checkbox" checked={rmTypename} onChange={setRmTypename}></input>
    </label>
    <fieldset>
      <legend>GraphQL Client</legend>
      <label>
        <input type="radio" name="client" value="apollo" checked={client === "apollo"} onClick={() => setClient("apollo")}/>apollo
      </label>
      <label>
        <input type="radio" name="client" value="urql" checked={client === "urql"} onClick={() => setClient("urql")}/>urql
      </label>
    </fieldset>
  </div>
}

const JsonStringify = ({ data }: { data: unknown }) => {
  return <pre className={json}>{JSON.stringify(data, null, 3)}</pre>
}

const ResultContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return <section className={jsonContainer}>
    <h2>Result</h2>
    <Suspense fallback={"loading"}>
      {children}
    </Suspense>
  </section>
}
const ApolloClientQuery: React.FC<{ query: DocumentNode,rmTypename: boolean}> = ({ query,rmTypename }) => {
  const { data, error } = useQueryByApolloClient({
    query,
  });
  if (error) {
    return <JsonStringify data={error} />
  } else {
    return <JsonStringify  data={rmTypename ? removeTypename(data) : data} />
  }
}

const UrqlQuery: React.FC<{ query: DocumentNode,rmTypename: boolean }> = ({ query,rmTypename }) => {
  const [{ data, error }] = useQueryByUrql({
    query,
  });
  if (error) {
    return <JsonStringify data={error} />
  } else {
    return <JsonStringify data={rmTypename ? removeTypename(data) : data} />
  }
}

export default App
