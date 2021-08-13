import { Controller } from "@nestjs/common";
import { ChatService } from "./chat.service";


@Controller('api/chat')
export class ChatController {
	constructor (
		private readonly chatService: ChatService,
	) {}
	
}