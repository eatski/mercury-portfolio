import initSqlJs from "sql.js";
import sqlWasm from "sql.js/dist/sql-wasm.wasm?url";

const initSql = `
CREATE TABLE hello (a int, b char);
INSERT INTO hello VALUES (0, 'hello');
INSERT INTO hello VALUES (1, 'world');
CREATE TABLE profile (id int, name char);
INSERT INTO profile VALUES (0, 'eatski');
CREATE TABLE language_profile (language_id int, profile_id int , proficiency_id int);
INSERT INTO language_profile VALUES (0, 0, 0);
INSERT INTO language_profile VALUES (1, 0, 0);
CREATE TABLE language (id int, name char);
INSERT INTO language VALUES (0, 'TypeScript');
INSERT INTO language VALUES (1, 'Rust');
INSERT INTO language VALUES (2, 'Java');
INSERT INTO language VALUES (3, 'Kotlin');
INSERT INTO language VALUES (4, 'Elm');
CREATE TABLE proficiency (id int, description char, emoji char);
INSERT INTO proficiency VALUES (0, 'beginner', '👶');
INSERT INTO proficiency VALUES (1, 'fun', '💓');
INSERT INTO proficiency VALUES (2, 'expert', '🤓');
`

export const dbPromise = initSqlJs({ locateFile: () => new URL(sqlWasm, import.meta.url).href }).then(SQL => {
  const db = new SQL.Database();
  db.run(initSql); // Run the query without returning anything
  return db
})