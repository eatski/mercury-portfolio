import initSqlJs from "sql.js";
import sqlWasm from "sql.js/dist/sql-wasm.wasm?url";

export const dbPromise = initSqlJs({ locateFile: () => new URL(sqlWasm, import.meta.url).href }).then(SQL => {
  const db = new SQL.Database();
  // Execute a single SQL string that contains multiple statements
  let sqlstr = "CREATE TABLE hello (a int, b char); \
  INSERT INTO hello VALUES (0, 'hello'); \
  INSERT INTO hello VALUES (1, 'world');";
  db.run(sqlstr); // Run the query without returning anything


  return db
})