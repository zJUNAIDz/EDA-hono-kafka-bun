import postModel from "../../models/post";
import kafkaConfig from "../kafka.config";

export const postConsumer = async () => {
  const messages: any[] = [];
  let processing = false;
  try {

    //* 1. Subscribe to "post" topic
    console.log("subscribing to topic: post")
    await kafkaConfig.subscribeToTopic("post");
    console.log("Subscribed");
    console.log("initiating topic consume...")
    await kafkaConfig.consume(async (message) => {
      console.log("Message Received.", message);

      //* parsing message to valid js object ad pushing it to messages array
      messages.push(parseMessage(message));
      console.log("Message pushed to messages.");

      //* real thing begins here..
      if (messages.length > 100) {
        //* Bulk insert into db
        processMessages();
      }
      //* processing regardless of messages length 
      setInterval(() => {
        processMessages();
      }, 5000);
    })


  } catch (err) {
    console.log("Error: \n", err);
  }
  function parseMessage(message: any) {
    try {
      const parsedMessage = typeof message === "string" ? JSON.parse(message) : message;
      return parsedMessage;
    } catch (err) {
      console.error("Failed to parse message: \n", err)
    }
  }

  async function processMessages() {
    if (messages.length > 0 && !processing) {
      processing = true;
      const batchToProcess = [...messages];
      messages.length = 0;

      try {
        console.log("Inserting in bulk...");
        await postModel.insertMany(batchToProcess, { ordered: false })
        console.log("Bulk inserting completed.")
      } catch (err) {
        console.log("Failed to push to db: \n", err);
        //* fallback mechanism on failure
        messages.push(...batchToProcess);
      } finally {
        processing = false;
      }
    }
  }
}
