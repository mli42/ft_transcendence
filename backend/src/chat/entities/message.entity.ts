import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Channel } from "./channel.entity";

@Entity()
export class Message {
	@PrimaryGeneratedColumn("uuid")
	msgId: string;

	@Column()
	text: string;

	@ManyToMany(() => User, user => user.messages)
	@JoinColumn()
	user: User;

	@ManyToMany(() => Channel, channel => channel.messages)
	@JoinTable()
	channel: Channel;

	@CreateDateColumn()
	date: Date;

	@UpdateDateColumn()
	update_at: Date;
}