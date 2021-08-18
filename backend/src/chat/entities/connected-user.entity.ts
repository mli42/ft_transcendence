import { User } from "../../user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ConnectedUser {

	@PrimaryGeneratedColumn("uuid")
	userConnectId: string;

	@Column()
	socketId: string;

	@ManyToOne(() => User, user => user.connections)
	@JoinColumn()
	user:User;
}