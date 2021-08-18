import { User } from "../../user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ConnectedUser {

	@PrimaryGeneratedColumn("uuid")
	userConnectId: string;

	@Column()
	socketId: string;

	@OneToOne(() => User)
	@JoinColumn()
	user:User;
}