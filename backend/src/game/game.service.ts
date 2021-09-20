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
import { GameHistory } from './entities/gameHistory.entity';

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

    async getPowIcon(@Res() res, icoName: string): Promise<Observable<object>> {
      return of(res.sendFile(join(process.cwd(), '../upload/powIcons/' + icoName)));
    }

    getUuid(): string {
        return uuidv4();
    }

    isUuid(uuid: string): boolean {
        return isUUID(uuid);
    }

    playerOneWin(userOne: User, userTwo: User) {
        let EloRating = require('elo-rating');

        userOne.game_won = userOne.game_won + 1;
        userTwo.lost_game = userTwo.lost_game + 1;

        let totalWinPlayerOne = userOne.game_won - userOne.lost_game;
        let totalWinPlayerTwo = userTwo.game_won - userTwo.lost_game;
        if (totalWinPlayerOne <= 0)
            totalWinPlayerOne = 1;
        if (totalWinPlayerTwo <= 0)
            totalWinPlayerTwo = 1;

        let elo = EloRating.calculate(userOne.elo, userTwo.elo);
        userOne.elo = elo.playerRating;
        userTwo.elo = elo.opponentRating;
    }

    playerTwoWIn(userOne: User, userTwo: User) {
        let EloRating = require('elo-rating');

        userOne.lost_game = userOne.lost_game + 1;
        userTwo.game_won = userTwo.game_won + 1;

        let totalWinPlayerOne = userOne.game_won - userOne.lost_game;
        let totalWinPlayerTwo = userTwo.game_won - userTwo.lost_game;
        if (totalWinPlayerOne <= 0)
            totalWinPlayerOne = 1;
        if (totalWinPlayerTwo <= 0)
            totalWinPlayerTwo = 1;

        let elo = EloRating.calculate(userTwo.elo, userOne.elo);
        userOne.elo = elo.opponentRating;
        userTwo.elo = elo.playerRating;
    }

    addStatsToPlayer(userOne: User, userTwo: User, gameHistory: GameHistory) {
        userOne.numberOfParty += 1;
        userTwo.numberOfParty += 1;

        if (userOne.userId === gameHistory.playerWin && userTwo.userId === gameHistory.playerLoose) {
            this.playerOneWin(userOne, userTwo);
        } else {
            this.playerTwoWIn(userOne, userTwo);
        }
        userOne.ratio = Math.floor((userOne.game_won * 100) / userOne.numberOfParty);
        userTwo.ratio = Math.floor((userTwo.game_won * 100) / userTwo.numberOfParty);
    }

    async saveGameHistory(game: Game, userOne: User, userTwo: User) {
        let gameHistory = await this.gameRepository.createGameHistory(game, userOne, userTwo);

        if (!userOne.game_history)
            userOne.game_history = [];
        if (!userTwo.game_history)
            userTwo.game_history = [];
        userOne.game_history.push(gameHistory);
        userTwo.game_history.push(gameHistory);

        this.addStatsToPlayer(userOne, userTwo, gameHistory);
        try {
            await this.userRepository.save(userOne);
            await this.userRepository.save(userTwo);
		} catch (e) {
			throw new InternalServerErrorException();
        }
    }

    async getUser(id: string) : Promise<User> {
        const user: User = await this.userRepository.findOne({userId: id});
		return user;
    }

    async getAllGame(): Promise<GameHistory[]> {
        const query = await this.gameRepository.createQueryBuilder().getMany();
        return query;
    }
}
