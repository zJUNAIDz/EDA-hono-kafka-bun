import { Admin, Consumer, Kafka, logLevel, Producer } from "kafkajs"

class KafkaConfig {
  private kafka: Kafka;
  private consumer: Consumer;
  private brokers: string;

  constructor() {
    this.brokers = process.env.KAFKA_BROKERS || "localhost:9092";
    this.kafka = new Kafka({
      clientId: "post-producer",
      brokers: [this.brokers],
      logLevel: logLevel.ERROR,
    });
    this.consumer = this.kafka.consumer({
      groupId: "post-consumer"
    });
  }

  async connect() {
    try {
      console.log("Connecting to Consumer");
      await this.consumer.connect();
      console.log("Connected")
    } catch (err) {
      console.error("Failed to Connect to Consumer: \n", err);
    }
  }

  async subscribeToTopic(topic: string) {
    try {
      await this.consumer.subscribe({ topic, fromBeginning: true });
    } catch (err) {
      console.error(`Failed to subscribe to topic: ${topic} \n`, err);
    }
  }

  async consume(callback: (message: any) => void) {
    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log("Message recieved:");
          console.table({ topic, partition, message: message.value?.toString() });
          callback(message.value?.toString());
        },
      });
    } catch (err) {
      console.log("Failed to consume \n", err);
    }
  }

  async disconnect() {
    try {
      console.log("Disconnecting  consumer...")
      await this.consumer.disconnect();
      console.log("Disconnected.")
    } catch (err) {
      console.log("Failed to disconnect consumer: \n", err);
    }
  }
}

export default new KafkaConfig();