
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { JoinedChannel } from './joined-channel.entity';
import { Message } from './message.entity';

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
	
	// @Column()
	// adminChannel: string;

	// @Column('boolean', {default: false})
	// private: boolean;

	@ManyToMany(() => User)
	@JoinTable()
	users: User[];

	@OneToMany(() => JoinedChannel, joinedChannel => joinedChannel.channel)
	joinedUsers: JoinedChannel[];

	@OneToMany(() => Message, message => message.channel)
	messages: Message[];

}