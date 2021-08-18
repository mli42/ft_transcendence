import { User } from '../../user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Channel } from './channel.entity';

@Entity()
export class JoinedChannel {
	
	@PrimaryGeneratedColumn("uuid")
	joinId: string;

	@Column()
	socketId: string;

	@ManyToMany(() => User, user => user.joinedChannels)
	@JoinColumn()
	users: User;

	@ManyToOne(() => Channel, channel => channel.joinedUsers)
	@JoinColumn()
	channel: Channel;
}