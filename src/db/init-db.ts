import postgres from 'postgres'

async function init() {
  const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/cultivate'

  // Extract base connection string pointing to 'postgres' system database
  const parsed = new URL(dbUrl)
  const dbName = parsed.pathname.replace('/', '') || 'cultivate'
  parsed.pathname = '/postgres'
  const rootUrl = parsed.toString()

  console.log(`Connecting to PostgreSQL server at ${parsed.host}...`)

  try {
    // 1. Connect to default 'postgres' database
    const sqlAdmin = postgres(rootUrl, { max: 1 })
    const dbs = await sqlAdmin`SELECT datname FROM pg_database WHERE datname = ${dbName};`

    if (dbs.length === 0) {
      console.log(`Database "${dbName}" does not exist. Creating database...`)
      await sqlAdmin`CREATE DATABASE cultivate;`
      console.log(`Database "${dbName}" created successfully.`)
    } else {
      console.log(`Database "${dbName}" already exists.`)
    }
    await sqlAdmin.end()

    // 2. Connect to target database and initialize tables
    const sql = postgres(dbUrl, { max: 1 })
    console.log(`Initializing tables in "${dbName}" database...`)

    // Create ENUMs
    await sql`
      DO $$ BEGIN
        CREATE TYPE transaction_type AS ENUM ('income', 'expense');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `

    await sql`
      DO $$ BEGIN
        CREATE TYPE recurrence AS ENUM ('once', 'weekly', 'biweekly', 'monthly', 'yearly');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id text PRIMARY KEY,
        email varchar(320) NOT NULL UNIQUE,
        password_hash text NOT NULL,
        display_name varchar(120),
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL
      );
    `

    // Create topics table
    await sql`
      CREATE TABLE IF NOT EXISTS topics (
        id text PRIMARY KEY,
        user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name varchar(100) NOT NULL,
        description text,
        color varchar(20) DEFAULT '#3b82f6' NOT NULL,
        is_default boolean DEFAULT false NOT NULL,
        is_active_in_forecast boolean DEFAULT true NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL
      );
    `

    // Create transactions table
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        topic_id text NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
        user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type transaction_type NOT NULL,
        amount numeric(12, 2) NOT NULL,
        description varchar(255) NOT NULL,
        category varchar(100) NOT NULL,
        date date NOT NULL,
        recurrence recurrence DEFAULT 'once' NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL
      );
    `

    console.log('✅ All PostgreSQL tables initialized successfully!')
    await sql.end()
    process.exit(0)
  } catch (err) {
    console.error('❌ Database initialization failed:', err)
    process.exit(1)
  }
}

init()
