import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import postgres from 'postgres'

describe('Database Integration - PostgreSQL Schema & Tables', () => {
  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/cultivate'
  let sql: postgres.Sql

  beforeAll(() => {
    sql = postgres(connectionString, { max: 1 })
  })

  afterAll(async () => {
    if (sql) await sql.end()
  })

  it('should successfully connect to PostgreSQL cultivate database', async () => {
    const result = await sql`SELECT 1 as connected;`
    expect(result[0].connected).toBe(1)
  })

  it('should have users, topics, and transactions tables present in the database', async () => {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `
    const tableNames = tables.map((t) => t.table_name)
    expect(tableNames).toContain('users')
    expect(tableNames).toContain('topics')
    expect(tableNames).toContain('transactions')
  })

  it('should verify users table schema has all required columns', async () => {
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `
    const colNames = columns.map((c) => c.column_name)
    expect(colNames).toContain('id')
    expect(colNames).toContain('email')
    expect(colNames).toContain('password_hash')
    expect(colNames).toContain('display_name')
    expect(colNames).toContain('created_at')
  })
})
