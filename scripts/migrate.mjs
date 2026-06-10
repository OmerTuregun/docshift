import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const sql = readFileSync(join(__dirname, "../lib/db/schema.sql"), "utf-8");
const statements = sql
  .split(";")
  .map((statement) => statement.trim())
  .filter(Boolean);

try {
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

  console.log("✓ Migration complete");
} catch (err) {
  console.error("✗ Migration failed:", err);
  process.exit(1);
} finally {
  await pool.end();
}
