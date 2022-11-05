import { Suspense, useState } from 'react'
import {InMemoryCache} from "@apollo/client"
import './App.css'
import { server } from './server'
import {gql} from "@apollo/client"

const cache = new InMemoryCache();

const fetchQuery = (query: string)  => {
  const queryNode = gql(query);
  const result = cache.readQuery({
    query: queryNode
  })
  console.log("readQuery",result)
  if(!result){
    throw server.executeOperation({
      query: queryNode
    }).then(res => {
      console.log("result",res.data);
      cache.writeQuery({
        query: queryNode,
        data: res.data
      })
      return res.data;
    })
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
        <Suspense fallback={null}>
          <Result query={query}/>
        </Suspense>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

const Result: React.FC<{query: string}> = ({query}) => {
  return  <div>
      {JSON.stringify(fetchQuery(query))}
    </div>
}

export default App
