import { InternalServerErrorException } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { Game } from "./dataStructures";
import { GameHistory } from "./entities/gameHistory.entity";

@EntityRepository(GameHistory)
export class GameRepository extends Repository<GameHistory> {

    async createGameHistory(game, userOne: User, userTwo: User) {
        const gameHistory: GameHistory = this.create();

        const it = game.players.keys();
        let playerone = it.next().value;
        let playertwo = it.next().value;
        let date = new Date();
        gameHistory.playerOne = playerone;
        gameHistory.playerTwo = playertwo;
        gameHistory.date = game.startDate;
        gameHistory.score = [];
        gameHistory.score.push(game.score[0]);
        gameHistory.score.push(game.score[1]);
        gameHistory.gameDuration = date.getTime() - game.startDate.getTime();
        // gameHistory.users = [];
        // gameHistory.users.push(userOne);
        // gameHistory.users.push(userTwo);
        if (game.score[0] != 5) {
            gameHistory.playerWin = playertwo;
            gameHistory.playerLoose = playerone;
        } else {
            gameHistory.playerWin = playerone;
            gameHistory.playerLoose = playertwo;
        }
        try {
			await this.save(gameHistory);
			return gameHistory;
		} catch (e) {
			throw new InternalServerErrorException();
		}
    }
}