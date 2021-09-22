
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { JoinedChannel } from './joined-channel.entity';
import { RoleUser } from './role-user.entity'
import { Message } from './message.entity';

@Entity()
export class Channel {

	@PrimaryGeneratedColumn("uuid")
	channelId: string;

	@Column("text", {default: ""})
	channelName: string;

	@CreateDateColumn()
	date: Date;

	@UpdateDateColumn()
	update_at: Date;

	@Column('boolean', {default: false})
	publicChannel: boolean;

	@Column("text", {default: ""})
	password: string;

	@ManyToMany(() => User, {onDelete:'CASCADE'})
	@JoinTable()
	users: User[];

	@OneToMany(() => JoinedChannel, joinedChannel => joinedChannel.channel, { cascade: true })
	joinedUsers: JoinedChannel[];

	@OneToMany(() => RoleUser, roleUser => roleUser.channel, { cascade: true })
	roleUser: RoleUser[];

	@Column("simple-array", {default: []})
	adminUsers: string[];

	@OneToMany(() => Message, message => message.channel, { cascade: true })
	messages: Message[];

	@Column("text", {default: ""})
	owner: string;

	@Column("simple-array", {default: []})
	authPrivateChannelUsers: string[];

	@Column('boolean', {default: false})
	directMessage: boolean;
}