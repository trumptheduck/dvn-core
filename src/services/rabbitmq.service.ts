import {Channel, connect, Connection} from "amqplib";
import { v4 as uuidv4 } from 'uuid';

export class RabbitMQService {
    connection: Connection | null;
    channel: Channel | null;
    constructor(private exchange: string) {
    }

    async init() {
        this.connection = await connect(process.env.RABBITMQ_URI);
        this.channel = await this.connection.createChannel();
        await this.channel.assertExchange(this.exchange, 'topic', {
            durable: true
        })
    }

    async sendTopic(topic: string[], message: any) {
        if (this.channel) {

        }
    }

    async sendMessage(queue: string, message: any) {
        if (this.channel) {
            await this.channel.assertQueue(queue, {
                durable: true
            })
            this.channel.sendToQueue(queue, Buffer.from(message), {
                persistent: true
            })
        }
    }

    async call<T>(procedure: string, ...agrs: any[]): Promise<T> {
        if (this.channel) {
            return new Promise(async (resolve, reject) => {
                const replyTo = await this.channel.assertQueue("", {
                    exclusive: true
                })
                const correlationId = uuidv4();
                this.channel.consume(replyTo.queue, function(msg) {
                    if (msg.properties.correlationId == correlationId) {
                      resolve(JSON.parse(msg.content.toString()));
                    }
                }, {
                    noAck: true
                });
                this.channel.sendToQueue(procedure, Buffer.from(JSON.stringify(agrs)), {
                    replyTo: replyTo.queue,
                    correlationId: correlationId
                })
            })
        }
    }

    async registerRPC(procedure: string, callback: any) {
        if (this.channel) {
            await this.channel.assertQueue(procedure, {
                durable: false
            })
            this.channel.consume(procedure, async (msg) => {
                const args: any[] = JSON.parse(msg.content.toString());
                const result = await callback(...(args as []));
                this.channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(result)), {
                    correlationId: msg.properties.correlationId
                });
                this.channel.ack(msg);
            })
        }
    }
}