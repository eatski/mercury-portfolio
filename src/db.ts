import initSqlJs from "sql.js";
import sqlWasm from "sql.js/dist/sql-wasm.wasm?url";

const initSql = `
CREATE TABLE site (id char, description char, repository char);
INSERT INTO site VALUES ('mercury', 'a browser-complete GraphQL demo', '');
CREATE TABLE profile (id char, name char);
INSERT INTO profile VALUES ('eatski', 'eatski');
CREATE TABLE language_profile (language_id int, profile_id char , proficiency_id int);
INSERT INTO language_profile VALUES (0, 'eatski', 0);
INSERT INTO language_profile VALUES (1, 'eatski', 0);
INSERT INTO language_profile VALUES (2, 'eatski', 0);
INSERT INTO language_profile VALUES (3, 'eatski', 0);
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
CREATE TABLE technology (id int, name char);
INSERT INTO technology VALUES (0, 'GraphQL');
INSERT INTO technology VALUES (1, 'React');
INSERT INTO technology VALUES (2, 'Next.js');
INSERT INTO technology VALUES (3, 'Web Assembly');
INSERT INTO technology VALUES (4, 'Relational Database');
INSERT INTO technology VALUES (5, 'Firebase');
INSERT INTO technology VALUES (6, 'Docker');
INSERT INTO technology VALUES (7, 'Amazon Web Services');
CREATE TABLE technology_profile (technology_id int, profile_id char, proficiency_id int);
INSERT INTO technology_profile VALUES (0, 'eatski', 0);
INSERT INTO technology_profile VALUES (1, 'eatski', 0);
INSERT INTO technology_profile VALUES (2, 'eatski', 0);
INSERT INTO technology_profile VALUES (3, 'eatski', 0);
INSERT INTO technology_profile VALUES (4, 'eatski', 0);
CREATE TABLE technology_site (technology_id int, site_id char);
INSERT INTO technology_site VALUES (0, 'mercury');
INSERT INTO technology_site VALUES (1, 'mercury');
INSERT INTO technology_site VALUES (3, 'mercury');
INSERT INTO technology_site VALUES (4, 'mercury');
`

export const dbPromise = initSqlJs({ locateFile: () => new URL(sqlWasm, import.meta.url).href }).then(SQL => {
  const db = new SQL.Database();
  db.run(initSql); // Run the query without returning anything
  return db
})