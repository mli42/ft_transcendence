export enum UserStatus {
	ONLINE = 'Online',
	INGAME = 'In Game',
	OFFLINE = 'Offline',
}

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