import { Hono } from 'hono'
import { init } from './start.services'
import postRoutes from "./services/create-post"
const app = new Hono()
init();
app.get('/', (c) => {
  return c.text('Hello Hono!')
});
app.route('/', postRoutes);

export default app
