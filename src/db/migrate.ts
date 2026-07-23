import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import path from 'path'

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/cultivate'
  console.log('Running Drizzle database migrations...')

  const sql = postgres(connectionString, { max: 1 })
  const db = drizzle(sql)

  try {
    const migrationsFolder = path.join(process.cwd(), 'drizzle')
    await migrate(db, { migrationsFolder })
    console.log('✅ Drizzle migrations executed successfully!')
    await sql.end()
    process.exit(0)
  } catch (err) {
    console.error('❌ Drizzle migration failed:', err)
    await sql.end()
    process.exit(1)
  }
}

runMigrations()
