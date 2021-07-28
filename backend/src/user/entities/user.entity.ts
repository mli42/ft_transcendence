import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  profile_picture: string;

  elo: string;

  game_won: number;

  lost_game: number;

  ration: number;

  status: string

  sign_up_date: Date;

  friend: string;

  match_history: string;

}