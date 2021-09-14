import { Injectable, InternalServerErrorException, Res } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { join } from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from "uuid";
import { isUUID } from 'class-validator';
import { Game } from './dataStructures';
import { GameRepository } from './game.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from 'src/user/user.repository';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class GameService {
    constructor(
		@InjectRepository(GameRepository)
        private gameRepository: GameRepository,
        private userRepository: UsersRepository
     ) {}

    getMap(@Res() res, name: string): Observable<object> {
        return of(res.sendFile(join(process.cwd(), '../upload/map/standard/' + name)));
    }

    getSmallMap(@Res() res, name: string): Observable<object> {
        let s: string = "-small";
        let dotIndex: number = name.lastIndexOf(".");
        let smallMap = name.substring(0, dotIndex) + s + name.substring(dotIndex);
        return of(res.sendFile(join(process.cwd(), '../upload/map/small/' + smallMap)));
    }

    getAllMap(): object {
        let fs = require('fs');
        let files = fs.readdirSync('../upload/map/standard/');
        return files;
    }

    getUuid(): string {
        return uuidv4();
    }

    isUuid(uuid: string): boolean {
        return isUUID(uuid);
    }

    async saveGameHistory(game: Game, userOne: User, userTwo: User) {
        let gameHistory = await this.gameRepository.createGameHistory(game, userOne, userTwo);
        console.log(gameHistory, userOne, userTwo);
        userOne.game_history = [];
        userTwo.game_history = [];
        userOne.game_history.push(gameHistory);
        userTwo.game_history.push(gameHistory);
        try {
            await this.userRepository.save(userOne);
            await this.userRepository.save(userTwo);
		} catch (e) {
			throw new InternalServerErrorException();
		}
        console.log(userOne);
        console.log(userTwo);
    }

    async getUser(id: string) : Promise<User> {
        const user: User = await this.userRepository.findOne({userId: id});
		return user;
    }
}
