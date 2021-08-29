
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { JoinedChannel } from './joined-channel.entity';
import { Message } from './message.entity';
import { RoleChannel } from './role-channel.entity';

@Entity()
export class Channel {

	@PrimaryGeneratedColumn("uuid")
	channelId: string;

	@Column()
	channelName: string;

	@CreateDateColumn()
	date: Date;

	@UpdateDateColumn()
	update_at: Date;

	@Column('boolean', {default: false})
	publicChannel: boolean;

	@Column("text", {default: ""})
	password: string;

	@ManyToMany(() => User)
	@JoinTable()
	users: User[];

	@OneToMany(() => JoinedChannel, joinedChannel => joinedChannel.channel)
	joinedUsers: JoinedChannel[];

	@OneToMany(() => Message, message => message.channel)
	messages: Message[];

	@OneToMany(() => RoleChannel, roleChannel => roleChannel.channel)
	roleUserChannel: RoleChannel[];

}