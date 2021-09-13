import { InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Game } from "./dataStructures";
import { GameHistory } from "./entities/gameHistory.entity";

@EntityRepository(GameHistory)
export class GameRepository extends Repository<GameHistory> {

    async createGameHistory(game) {
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
        if (game.score[0] != 5) {
            gameHistory.playerWin = playertwo;
            gameHistory.playerLoose = playerone;
        } else {
            gameHistory.playerWin = playerone;
            gameHistory.playerLoose = playertwo;
        }
        try {
			await this.save(gameHistory);
			return true;
		} catch (e) {
			throw new InternalServerErrorException();
		}
    }
}