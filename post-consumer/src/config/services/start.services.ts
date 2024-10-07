import { connectToDB } from "../db.config";
import kafkaConfig from "../kafka.config";
import { postConsumer } from "./post.consumer";

export const init = async () => {
  const { log: print } = console;
  try {
    print("Connecting to Mongodb..");
    await connectToDB("mongodb://127.0.0.1:27017/kafka-post");
    print("Connected to mongodb");
    print("Connecting to kafka services...");
    await kafkaConfig.connect();
    print("Connected to kafka services");
    print("Initializing post consumer...");
    await postConsumer();
  } catch (err) {
    print("Failed to initalize services \n", err);
    process.exit(0);
  }
}