
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Channel {

	@PrimaryGeneratedColumn("uuid")
	channelId: string;

	@Column()
	channelName: string;

	// @Column()
	// adminChannel: string;

	// @Column('boolean', {default: false})
	// private: boolean;

	@ManyToMany(() => User)
	@JoinTable()
	users: User[];

}