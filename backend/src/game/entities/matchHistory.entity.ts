import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class MatchHistory {

    @PrimaryGeneratedColumn("uuid")
    gameId: string;

    @Column()
    score: string;

    @Column()
    playerOne: string;

    @Column()
    playerOneElo: number;

    @Column()
    playerTwo: string;

    @Column()
    playerTwoElo: number;

    @Column('date', { default: () => '((CURRENT_DATE))' })
    date: Date;

    @Column('time', {name: 'elapsed_time'})
    gameDuration: Date;

    @Column()
    playerWin: string;

    @Column()
    playerLoose: string;
}
