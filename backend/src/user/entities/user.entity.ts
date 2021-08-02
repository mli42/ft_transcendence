import { Entity, Column, PrimaryGeneratedColumn, IsNull } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @Column({unique: true})
  username: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column()
  profile_picture: string;

  // @Column()
  // elo: string;

  // @Column()
  // game_won: number;

  // @Column()
  // lost_game: number;

  // @Column()
  // ration: number;

  // @Column()
  // status: string

  // @Column()
  // sign_up_date: Date;

  // @Column()
  // friend: string;

  // @Column()
  // match_history: string;

  // @Column()
  auth: boolean;

}