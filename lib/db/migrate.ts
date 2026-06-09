import { readFileSync } from "fs";
import { join } from "path";
import { pool } from "./pool";

export async function runMigrations() {
  const schemaPath = join(process.cwd(), "lib/db/schema.sql");
  const schema = readFileSync(schemaPath, "utf-8");

  const statements = schema
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await pool.query(statement);
  }
}
