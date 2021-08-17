import { User } from '../../user/entities/user.entity'

export interface ConnectedUserI {
	userConnectId?: string;
	socketId: string;
	user: User;
}