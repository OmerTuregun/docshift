import { readFileSync } from "fs";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const schema = readFileSync("lib/db/schema.sql", "utf-8");
const statements = schema
  .split(";")
  .map((statement) => statement.trim())
  .filter(Boolean);

for (const statement of statements) {
  await pool.query(statement);
}

await pool.query(`
  DO $$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'conversion_history'
        AND column_name = 'id'
        AND data_type = 'integer'
    ) THEN
      ALTER TABLE conversion_history ALTER COLUMN id DROP DEFAULT;
      ALTER TABLE conversion_history
        ALTER COLUMN id TYPE TEXT USING id::text;
    END IF;
  END $$;
`);

await pool.end();
console.log("[db] schema applied");
