import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Channel } from './channel.entity';

@Entity()
export class RoleUser {

	@PrimaryGeneratedColumn("uuid")
	roleUserId: string;

	@Column("text")
	userId: string;

	@Column({nullable: true, type: 'timestamptz'})
	ban: Date;

	@Column({nullable: true, type: 'timestamptz'})
    mute: Date;

	@ManyToOne(() => Channel, channel => channel.joinedUsers, {onDelete:'CASCADE'})
	@JoinColumn()
	channel: Channel;
}