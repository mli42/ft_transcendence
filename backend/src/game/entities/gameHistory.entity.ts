import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class GameHistory {

    @PrimaryGeneratedColumn("uuid")
    gameId: string;

    @Column("simple-array")
    score: string[];

    @Column("text", {default: ""})
    playerOne: string;

    @Column("text", {default: ""})
    playerTwo: string;

    @Column('text', {default: ""})
    date: string;

    @Column('int',  {default: 0})
    gameDuration: number;

    @Column("text", {default: ""})
    playerWin: string;

    @Column("text", {default: ""})
    playerLoose: string;

    @ManyToMany(() => User, user => user.game_history, {onDelete:'CASCADE'})
	users: User[];
}
