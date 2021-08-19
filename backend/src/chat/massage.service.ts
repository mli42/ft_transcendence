import { Message } from "./entities/message.entity";
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ChannelI } from './interfaces/channel.interface'
import { MessageI } from "./interfaces/message.interface";

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>
    ) {}

    async create(message: MessageI): Promise<MessageI> {
        return this.messageRepository.save(this.messageRepository.create(message));
    }

    async findMessagesForChannel(channel: ChannelI): Promise<MessageI[]> {
        const query = this.messageRepository
        .createQueryBuilder('message')
        .leftJoin('message.channel', 'channel')
        .where('channel.channelId = :channelId', {channelId: channel.channelId})
        .leftJoinAndSelect('message.user', 'user')
        .orderBy('message.date', 'DESC');
        const messagesFound: MessageI[] = await query.getMany();
        console.log(messagesFound)
		return messagesFound;
    }

}
