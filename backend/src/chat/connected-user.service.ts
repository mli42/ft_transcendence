import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { createQueryBuilder, getRepository, Repository } from "typeorm";
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

	async findAll(): Promise<ConnectedUserI[]> {
		const connections = await this.connectedUserRepository.find({ relations: ["user"] });
		return connections;
	}

	async findUser(user: User): Promise<ConnectedUserI> {
		return this.connectedUserRepository.findOne({user});
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

	async userStatus() {
		const query = await this.connectedUserRepository.find({ relations: ["user"] });
		let userConnected = [];
		for (const field of query) {
			userConnected.push(field.user.userId);
		}
		return userConnected;
	}
}