import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { ConnectedUser } from "./entities/connected-user.entity";
import { ConnectedUserI } from "./interfaces/user-connected.interface";

@Injectable()
export class ConnectedUserService {

	constructor (
		@InjectRepository(ConnectedUser)
		private readonly connectedUserRepository: Repository<ConnectedUser>
	) {}

	async create(connectedUser: ConnectedUserI): Promise<ConnectedUserI> {
		return this.connectedUserRepository.save(connectedUser);
	}

	async findByUser(user: User): Promise<ConnectedUserI[]> {
		return this.connectedUserRepository.find({user});
	}

	async deleteBySoketId(socketId: string) {
		return this.connectedUserRepository.delete({socketId});
	}
	async deleteAll() {
		await this.connectedUserRepository
		  .createQueryBuilder()
		  .delete()
		  .execute();
	}
}