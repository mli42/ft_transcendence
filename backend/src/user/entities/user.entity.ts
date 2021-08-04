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

  @Column("text", {default: "empty"})
  profile_picture: string;

  @Column('int',  {default: 0})
  elo: number;

  @Column('int',  {default: 0})
  game_won: number;

  @Column('int',  {default: 0})
  lost_game: number;

  @Column('int',  {default: -1})
  ration: number;

  // @Column()
  // status: string

  @Column('date', { default: () => '((CURRENT_DATE))' })
  sign_up_date: Date;

  @Column("simple-array")
  friends: string[];

  // @Column()
  // match_history: string;

  @Column('boolean', {default: false})
  auth: boolean;

  @Column('boolean', {default: false})
  user42: boolean;

}