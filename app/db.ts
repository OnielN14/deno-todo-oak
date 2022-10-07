import { sqlite } from "deps";
const todoDb = new sqlite.DB("todo.db");

todoDb.execute(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT
  )
`);

export default todoDb;
