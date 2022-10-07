import { oak, sqlite, zod } from "deps";
import db from "./db.ts";
import Todo from "../types/Todo.ts";

const getTodos = <R extends string>(ctx: oak.RouterContext<R>) => {
  ctx.response.body = db.queryEntries<Todo>("SELECT * FROM todos");
};

const getTodo = <R extends string>(ctx: oak.RouterContext<R>) => {
  if (!ctx.params?.id) {
    ctx.response.status = oak.Status.NotFound;
    ctx.response.body = { message: "Not Found" };
    return;
  }

  const query = db.prepareQuery<sqlite.Row, Todo, { id: string }>(
    `SELECT * FROM todos WHERE id=:id`,
  );

  const result = query.firstEntry({ id: ctx.params.id });
  query.finalize();

  if (!result) {
    ctx.response.status = oak.Status.NotFound;
    ctx.response.body = { message: "Not Found" };
    return;
  }

  ctx.response.body = result;
};

const createTodoPayloadSchema = zod.object({
  title: zod.string(),
  description: zod.string(),
});

const createTodo = async <R extends string>(ctx: oak.RouterContext<R>) => {
  const validationResult = createTodoPayloadSchema.safeParse(
    await ctx.request.body({ type: "json" }).value,
  );
  if (!validationResult.success) {
    ctx.response.status = oak.Status.BadRequest;
    ctx.response.body = validationResult.error.format();
    return;
  }

  const query = db.prepareQuery<
    sqlite.Row,
    Todo,
    { title: string; description: string }
  >("INSERT INTO todos (title, description) VALUES(:title, :description) RETURNING *");
  const result = query.firstEntry(validationResult.data)!;
  query.finalize();

  ctx.response.body = { message: "Success", data: result };
};

const deleteTodo = <R extends string>(ctx: oak.RouterContext<R>) => {
  if (!ctx.params?.id) {
    ctx.response.status = oak.Status.NotFound;
    ctx.response.body = { message: "Not Found" };
    return;
  }

  const query = db.prepareQuery<sqlite.Row, Todo, { id: string }>(
    "DELETE FROM todos WHERE id=:id RETURNING *",
  );
  const result = query.firstEntry({ id: ctx.params.id });

  ctx.response.body = { message: "Delete", data: result };
};

export { createTodo, deleteTodo, getTodo, getTodos };
