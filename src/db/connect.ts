import { Pool } from "pg";

export const DB: Pool = new Pool({
  user: "yeeraf",
  password: "secret",
  host: "localhost",
  port: 5432,
  database: "kontrol",
});
