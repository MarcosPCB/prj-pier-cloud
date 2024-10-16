import { Channel, Connection } from "amqplib"

type TConsumerQueues = {
    queue: string,
    tag: string,
    channel: Channel
}

interface TConsumerStatus {
    delivered: number,
    acked: number,
    queues: TConsumerQueues[],
    closeQueues: () => Promise<void>
}

const queues: TConsumerQueues[] = [];

export const consumerStatus: TConsumerStatus = {
    delivered: 0,
    acked: 0,
    queues: queues,
    closeQueues: async () => Promise.race(queues.map(async (q) => {
        await q.channel.close();
        await q.channel.connection.close();
    }))
}