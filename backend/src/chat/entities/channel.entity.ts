
import { Entity, Column, PrimaryGeneratedColumn, IsNull, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Channel {

	@PrimaryGeneratedColumn("uuid")
	channelId: string;

	@Column()
	name: string;

	// @Column()
	// adminChannel: string;

	@Column('boolean', {default: false})
	private: boolean;

	@ManyToMany(() => User)
	@JoinTable()
	user: User[];

}