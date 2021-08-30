import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Channel } from './channel.entity';

@Entity()
export class RoleChannel {

	@PrimaryGeneratedColumn("uuid")
	roleId: string;

	@Column('boolean', {default: false})
	authPrivateChannel: boolean;

	@Column("boolean", {default: false})
	isBan: boolean;
  
	@Column("boolean", {default: false})
	isAdmin: boolean;

	@ManyToOne(() => User, user => user.joinedChannels)
	@JoinColumn()
	user: User;

	@ManyToOne(() => Channel, channel => channel.joinedUsers)
	@JoinColumn()
	channel: Channel;
}