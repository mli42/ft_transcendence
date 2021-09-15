import { IsAlphanumeric, IsEmail } from 'class-validator';
import { Channel } from '../../chat/entities/channel.entity';
import { Entity, Column, PrimaryGeneratedColumn, IsNull, ManyToMany, OneToMany, JoinColumn, JoinTable } from 'typeorm';
import { JoinedChannel } from '../../chat/entities/joined-channel.entity';
import { ConnectedUser } from '../../chat/entities/connected-user.entity';
import { Message } from '../../chat/entities/message.entity';
import { GameHistory } from 'src/game/entities/gameHistory.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @IsAlphanumeric()
  @Column({unique: true})
  username: string;

  @IsEmail()
  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column("text", {default: "empty"})
  profile_picture: string;

  @Column('int',  {default: 1000})
  elo: number;

  @Column('int',  {default: 0})
  game_won: number;

  @Column('int',  {default: 0})
  lost_game: number;

  @Column('int', {default: 0})
  numberOfParty: number;

  @Column('int',  {default: 0})
  ratio: number;

  @Column('text', {default: 'Offline'})
  status: UserStatus;

  @Column('date', { default: () => '((CURRENT_DATE))' })
  sign_up_date: Date;

  @Column("simple-array")
  friends: string[];

  @ManyToMany(() => GameHistory, gameHistory => gameHistory.users, {eager: true})
  @JoinTable()
  game_history: GameHistory[];

  @Column("text", {default: ""})
  login42: string;

  @ManyToMany(() => Channel, channel => channel.users)
  channels: Channel[];

  @OneToMany(() => ConnectedUser, connection => connection.user)
  connections: ConnectedUser[];

  @OneToMany(() => JoinedChannel, joinedChannel => joinedChannel.channel)
  joinedChannels: JoinedChannel[];

  @OneToMany(() => Message, message => message.user)
  messages: Message[];

  @Column("boolean", {default: false})
  twoFactorAuth: boolean;

  @Column("boolean", {default: false})
  isBan: boolean;

  @Column("boolean", {default: false})
  isAdmin: boolean;

  @Column("simple-array", {default: []})
  blockedUsers: string[];
}