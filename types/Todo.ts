import { sqlite } from "deps";

interface Todo extends sqlite.RowObject {
  id: number;
  title: string;
  description: string;
}

export default Todo;
