import { Admin, Kafka, logLevel, Producer } from "kafkajs"

class KafkaConfig {
  private kafka: Kafka;
  private producer: Producer;
  private admin: Admin;
  private brokers: string;

  constructor() {
    this.brokers = process.env.KAFKA_BROKERS || "localhost:9092";
    this.kafka = new Kafka({
      clientId: "post-producer",
      brokers: [this.brokers],
      logLevel: logLevel.ERROR,
    });
    this.producer = this.kafka.producer();
    this.admin = this.kafka.admin();
  }

  async connect() {
    try {
      console.log("Connecting to Producer");
      await this.producer.connect();
      console.log("Connecting to Admin");
      await this.admin.connect();
      console.log("Connected")
    } catch (err) {
      console.error("Failed to Connect: \n", err);
    }
  }


  async createTopic(topic: string) {
    try {
      console.log("Creating topic: ", topic);
      await this.admin.createTopics({ topics: [{ topic }] });
      console.log("Topic created.")
    } catch (err) {
      console.log("Failed to create topic:", err);
    }
  }

  async sendToTopic(topic: string, message: string) {
    try {
      console.log("Sending message: ", message);
      await this.producer.send({
        topic,
        messages: [{ value: message }]
      });
      console.log("Message sent.")
    } catch (err) {
      console.log("Send to Topic failed: \n", err);
    }
  }

  async disconnect() {
    try {
      console.log("Disconnecting kafka...")
      await this.admin.disconnect();
      await this.producer.disconnect();
      console.log("Disconnected.")
    } catch (err) {
      console.log("Failed to disconnect: \n", err);
    }
  }
}

export default new KafkaConfig();