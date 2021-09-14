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

    @Column('date', { default: () => '((CURRENT_DATE))' })
    date: Date;

    @Column('int',  {default: 0})
    gameDuration: number;

    @Column("text", {default: ""})
    playerWin: string;

    @Column("text", {default: ""})
    playerLoose: string;

    @ManyToMany(() => User)
	@JoinTable()
	users: User[];
}
