import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import kafkaConfig from "../config/kafka.config";
const app = new Hono();

app.post('create-post',

  zValidator("json", z.object({
    title: z.string().min(1),
    content: z.string().min(1),
  }))
  , async (c) => {
    const { title, content } = c.req.valid("json");
    try {
      await kafkaConfig.sendToTopic('post', JSON.stringify({ title, content }));
      return c.json({ message: "post created" }, 200)
    } catch (err) {
      console.error("Failed to send to data topic: \n", err);
      return c.json({ error: "Failed to send message to kafka stream" }, 500);
    }
  }
);

export default app;