import {Kysely,SqliteAdapter,SqliteIntrospector,SqliteQueryCompiler,DummyDriver,Driver, DatabaseConnection, TransactionSettings, CompiledQuery, QueryResult} from "kysely"
import { dbPromise } from "./db"

interface Database {
    profile: {
        id: number,
        name: string,
    },
    language_profile: {
        language_id: number,
        profile_id: number,
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
                        console.log(compiledQuery.sql,compiledQuery.parameters);
                        const [result] = db.exec(compiledQuery.sql,compiledQuery.parameters as any)
                        return new Promise((resolve) => {
                            // dummy timeout to simulate async
                            setTimeout(() => {
                                resolve({
                                    rows: result.values.map(value => {
                                        const row : Record<string,unknown>= {};
                                        result.columns.forEach((c,i) => {
                                            row[c] = value[i]
                                        })
                                        return row
                                    }) as any
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

