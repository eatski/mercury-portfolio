import initSqlJs from "sql.js";
import sqlWasm from "sql.js/dist/sql-wasm.wasm?url";
import schemaUrl from "./schema.graphql?url";

const initSql = `
CREATE TABLE site (id char, description char, repository char,schema char);
INSERT INTO site VALUES ('mercury', 'a browser-complete GraphQL portfolio', 'https://github.com/eatski/mercury-portfolio', '${new URL(import.meta.url,schemaUrl).href}');
CREATE TABLE profile (id char, name char, profession char);
INSERT INTO profile VALUES ('eatski', 'Itsuki Haga', 'Front-end Engineer');
CREATE TABLE proficiency (id int, description char, emoji char);
INSERT INTO proficiency VALUES (0, 'beginner', '👶');
INSERT INTO proficiency VALUES (1, 'fun', '💓');
INSERT INTO proficiency VALUES (2, 'learned', '👍');
INSERT INTO proficiency VALUES (3, 'expert', '🤓');
CREATE TABLE technology (id int, name char);
INSERT INTO technology VALUES (0, 'TypeScript');
INSERT INTO technology VALUES (1, 'Rust');
INSERT INTO technology VALUES (2, 'Java');
INSERT INTO technology VALUES (3, 'Kotlin');
INSERT INTO technology VALUES (4, 'GraphQL');
INSERT INTO technology VALUES (5, 'React');
INSERT INTO technology VALUES (6, 'Vue');
INSERT INTO technology VALUES (7, 'Next.js');
INSERT INTO technology VALUES (8, 'Web Assembly');
INSERT INTO technology VALUES (9, 'Relational Database');
INSERT INTO technology VALUES (10, 'Firebase');
INSERT INTO technology VALUES (11, 'Amazon Web Services');
CREATE TABLE technology_profile (technology_id int, profile_id char, proficiency_id int);
INSERT INTO technology_profile VALUES (0, 'eatski', 3);
INSERT INTO technology_profile VALUES (1, 'eatski', 1);
INSERT INTO technology_profile VALUES (2, 'eatski', 2);
INSERT INTO technology_profile VALUES (3, 'eatski', 2);
INSERT INTO technology_profile VALUES (4, 'eatski', 2);
INSERT INTO technology_profile VALUES (5, 'eatski', 3);
INSERT INTO technology_profile VALUES (6, 'eatski', 2);
INSERT INTO technology_profile VALUES (7, 'eatski', 3);
INSERT INTO technology_profile VALUES (8, 'eatski', 0);
INSERT INTO technology_profile VALUES (9, 'eatski', 2);
INSERT INTO technology_profile VALUES (10, 'eatski', 1);
INSERT INTO technology_profile VALUES (11, 'eatski', 0);
CREATE TABLE technology_site (technology_id int, site_id char);
INSERT INTO technology_site VALUES (0, 'mercury');
INSERT INTO technology_site VALUES (4, 'mercury');
INSERT INTO technology_site VALUES (5, 'mercury');
INSERT INTO technology_site VALUES (8, 'mercury');
INSERT INTO technology_site VALUES (9, 'mercury');
`

export const dbPromise = initSqlJs({ locateFile: () => new URL(sqlWasm, import.meta.url).href }).then(SQL => {
  const db = new SQL.Database();
  db.run(initSql); // Run the query without returning anything
  return db
})