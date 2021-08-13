import { EntityRepository, Repository } from "typeorm";
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/channel.dto'

@EntityRepository(Channel)
export class ChannelRepository extends Repository<Channel> {

}