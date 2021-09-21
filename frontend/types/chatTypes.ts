export enum UserStatus {
	ONLINE = 'Online',
	INGAME = 'In Game',
	OFFLINE = 'Offline',
};

export interface IUser {
    userId: string,
    username: string,
    status: UserStatus,
};

export class User implements IUser{
    userId = '';
    username = '';
    status =  UserStatus.OFFLINE;
};

export interface IChannel {

	channelId: string,
	channelName: string,
	users: User[],
	joinedUsers: IJoinedChannel[],
	messages: IMessage[],
	date: Date,
	update_at: Date,
	publicChannel: boolean,
	password: string,
	adminUsers: string[],
	owner: string,
	authPrivateChannelUsers: string[],
	directMessage: boolean,
};

export class Channel implements IChannel {

	channelId = '';
	channelName = '';
	users = [];
	joinedUsers = [];
	messages = [];
	date = new Date();
	update_at = new Date();
	publicChannel = false;
	password = '';
	adminUsers = [];
	owner = '';
	authPrivateChannelUsers = [];
	directMessage = false;
};

export interface IJoinedChannel {
	joinId: string;
	socketId: string;
	user: User;
	channel: Channel;
};

export class JoinedChannel implements IJoinedChannel {
	joinId = '';
	socketId = '';
	user =  new User;
	channel = new Channel;
};

export class newChannel {
  name: string = '';
  public: boolean = true;
  password: string = '';
  members: User[] = [];
  admin: User[] = [];
};

export interface IMessage {
	msgId: string;
	text: string;
	user: User;
	channel: Channel;
	date: Date;
	update_at: Date;
};

export class Message implements IMessage {
	msgId = '';
	text = '';
	user = new User;
	channel = new Channel;
	date = new Date;
	update_at = new Date;
};
