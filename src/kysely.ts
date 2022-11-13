import {Kysely,SqliteAdapter,SqliteIntrospector,SqliteQueryCompiler,DummyDriver,Driver, DatabaseConnection, TransactionSettings, CompiledQuery, QueryResult} from "kysely"
import { dbPromise } from "./db"
import { dispatch } from "./sqlLogging"

interface Database {
    profile: {
        id: string,
        name: string,
        profession: string,
    },
    language_profile: {
        language_id: number,
        profile_id: string,
        proficiency_id: number,
    },
    language: {
        id: number,
        name: string,
    },
    proficiency: {
        id: number,
        description: string,
        emoji: string
    },
    technology: {
        id: number,
        name: string,
    },
    technology_profile: {
        technology_id: number,
        profile_id: string,
        proficiency_id: number,
    },
    technology_site: {
        technology_id: number,
        site_id: string,
    },
    site: {
        id: string,
        description: string,
        repository: string,
        schema: string
    }
}

const replacePlaceholder = (query: string, params: readonly any[]) => {
    let newQuery = query
    for (const param of params) {
        newQuery = newQuery.replace("?", param)
    }
    return newQuery
}

export const builder = new Kysely<Database>({
    dialect: {
      createAdapter() {
        return new SqliteAdapter()
      },
      createDriver() {
        const driver : Driver = {
            init: function (): Promise<void> {
                return Promise.resolve()
            },
            acquireConnection: async function (): Promise<DatabaseConnection> {
                const db = await dbPromise;
                const connection: DatabaseConnection = {
                    executeQuery: function <R>(compiledQuery: CompiledQuery): Promise<QueryResult<R>> {
                        dispatch(replacePlaceholder(compiledQuery.sql, compiledQuery.parameters))
                        const result = db.exec(compiledQuery.sql,compiledQuery.parameters as any).at(0)
                        return new Promise((resolve) => {
                            // dummy timeout to simulate async
                            setTimeout(() => {
                                resolve({
                                    rows: result ? result.values.map(value => {
                                        const row : Record<string,unknown>= {};
                                        result.columns.forEach((c,i) => {
                                            row[c] = value[i]
                                        })
                                        return row
                                    }) : [] as any
                                })
                            }, 100);
                        });
                    },
                    streamQuery: function <R>(compiledQuery: CompiledQuery, chunkSize?: number | undefined): AsyncIterableIterator<QueryResult<R>> {
                        throw new Error("streamQuery not implemented.")
                    }
                }
                return connection
            },
            beginTransaction: function (connection: DatabaseConnection, settings: TransactionSettings): Promise<void> {
                throw new Error("beginTransaction not implemented.")
            },
            commitTransaction: function (connection: DatabaseConnection): Promise<void> {
                throw new Error("commitTransaction not implemented.")
            },
            rollbackTransaction: function (connection: DatabaseConnection): Promise<void> {
                throw new Error("rollbackTransaction not implemented.")
            },
            releaseConnection: function (connection: DatabaseConnection): Promise<void> {
                return Promise.resolve()
            },
            destroy: function (): Promise<void> {
                throw new Error("destroy not implemented.")
            }
        }
        return driver
      },
      createIntrospector(db: Kysely<any>) {
        return new SqliteIntrospector(db)
      },
      createQueryCompiler() {
        return new SqliteQueryCompiler()
      },
    },
  })

