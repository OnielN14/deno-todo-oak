import { oak } from "deps";
import { createTodo, deleteTodo, getTodo, getTodos } from "./routes.ts";

const app = new oak.Application();
const routers = new oak.Router();

routers
  .get("/", (ctx) => {
    ctx.response.body = { message: "Hello from Deno (Oak)" };
  })
  .get("/todos", getTodos)
  .get("/todos/:id", getTodo)
  .post("/todos", createTodo)
  .delete("/todos/:id", deleteTodo);

app.use(routers.routes());
app.use(routers.allowedMethods());

export default app;
