import { Injectable, Res } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { join } from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from "uuid";
import { isUUID } from 'class-validator';
import { Game } from './dataStructures';
import { GameRepository } from './game.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GameService {
    constructor(
		@InjectRepository(GameRepository)
        private gameRepository: GameRepository,
     ) {}

    getMap(@Res() res, name: string): Observable<object> {
        return of(res.sendFile(join(process.cwd(), '../upload/map/standard/' + name)));
    }

    getSmallMap(@Res() res, name: string): Observable<object> {
        let s: string = "-small";
        let dotIndex: number = name.lastIndexOf(".");
        let smallMap = name.substring(0, dotIndex) + s + name.substring(dotIndex);
        return of(res.sendFile(join(process.cwd(), '../upload/map/small/' + smallMap)));
    }

    getAllMap(): object {
        let fs = require('fs');
        let files = fs.readdirSync('../upload/map/standard/');
        return files;
    }

    getUuid(): string {
        return uuidv4();
    }

    isUuid(uuid: string): boolean {
        return isUUID(uuid);
    }

    saveGameHistory(game) {
        this.gameRepository.createGameHistory(game);
    }
}
