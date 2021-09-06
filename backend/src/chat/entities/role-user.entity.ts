import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Channel } from './channel.entity';

@Entity()
export class RoleUser {
	
	@PrimaryGeneratedColumn("uuid")
	roleUserId: string;

	@Column()
	userId: string;

    @Column("boolean", {default: false})
    block: boolean;
    
	@Column()
	ban: Date;

	@Column()
    mute: Date;

	@ManyToOne(() => Channel, channel => channel.joinedUsers)
	@JoinColumn()
	channel: Channel;
}