import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import initSqlJs from "sql.js";
import sqlWasm from "sql.js/dist/sql-wasm.wasm?url";


initSqlJs({ locateFile: () => sqlWasm }).then(SQL => {
  const db = new SQL.Database();
  // Execute a single SQL string that contains multiple statements
  let sqlstr = "CREATE TABLE hello (a int, b char); \
  INSERT INTO hello VALUES (0, 'hello'); \
  INSERT INTO hello VALUES (1, 'world');";
  db.run(sqlstr); // Run the query without returning anything

  // Prepare an sql statement
  const stmt = db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");

  // Bind values to the parameters and fetch the results of the query
  const result = stmt.getAsObject({':aval' : 1, ':bval' : 'world'});
  console.log(result); // Will print {a:1, b:'world'}

})

import {Buffer} from "buffer";
global.Buffer = Buffer;
import {ApolloServerBase,gql } from "apollo-server-core";
// The GraphQL schema
const typeDefs = gql`
  type Query {
    hello: String
  }
`;


const query = gql`
  query {
    hello
  }
`

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () => 'world',
  },
};

const server = new ApolloServerBase({
  typeDefs,
  resolvers,
});


server.executeOperation({
  query: query
}).then(res => {
  console.log(res.data);
})



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
