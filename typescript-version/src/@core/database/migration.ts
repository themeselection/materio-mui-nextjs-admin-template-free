import { sql } from '@vercel/postgres'

export const createUsersTableIfNotExists = async () => {
  try {
    await sql`CREATE TABLE IF NOT EXISTS "users" (email VARCHAR(250) PRIMARY KEY, name VARCHAR(250), budget INT, salary INT, duration INT, banks VARCHAR(250), provinces VARCHAR(250), creditType VARCHAR(250), compatibleCredits VARCHAR(65534), created_at timestamp DEFAULT now() NOT NULL);`
    console.log('Successfully initialized the messages table')

    return
  } catch (error) {
    throw new Error(`Error while creating table: ${error}`)
  }
}
