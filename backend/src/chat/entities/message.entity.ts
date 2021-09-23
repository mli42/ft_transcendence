import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Channel } from "./channel.entity";

@Entity()
export class Message {
	@PrimaryGeneratedColumn("uuid")
	msgId: string;

	@Column("text")
	text: string;

	@ManyToOne(() => User, user => user.messages, { onDelete: 'CASCADE' })
	@JoinColumn()
	user: User;

	@ManyToOne(() => Channel, channel => channel.messages, {onDelete:'CASCADE'})
	@JoinTable()
	channel: Channel;

	@CreateDateColumn()
	date: Date;

	@UpdateDateColumn()
	update_at: Date;

	@Column('boolean', {default: false})
	isChallenge: boolean;
}