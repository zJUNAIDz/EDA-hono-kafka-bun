import kafkaConfig from "./config/kafka.config";

export const init = async () => {
  try {
    await kafkaConfig.connect();
    await kafkaConfig.createTopic("post");
  } catch (err) {
    console.error("Error connecting services: \n", err);
    process.exit(0);
  }
}
