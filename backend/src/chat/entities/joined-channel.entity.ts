import { User } from '../../user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Channel } from './channel.entity';

@Entity()
export class JoinedChannel {

	@PrimaryGeneratedColumn("uuid")
	joinId: string;

	@Column("text")
	socketId: string;

	@ManyToOne(() => User, user => user.joinedChannels, {onDelete:'CASCADE'})
	@JoinColumn()
	user: User;

	@ManyToOne(() => Channel, channel => channel.joinedUsers, {onDelete:'CASCADE'})
	@JoinColumn()
	channel: Channel;
}