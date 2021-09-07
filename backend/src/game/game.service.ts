import { Injectable, Res } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { join } from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from "uuid";
import { isUUID } from 'class-validator';

@Injectable()
export class GameService {

    getMap(@Res() res, name: string): Observable<object> {
        return of(res.sendFile(join(process.cwd(), '../upload/map/' + name)));
    }

    getSmallMap(@Res() res, name: string): Observable<object> {
        let s: string = "_small";
        let dotIndex: number = name.lastIndexOf(".");
        let smallMap = name.substring(0, dotIndex) + s + name.substring(dotIndex);
        return of(res.sendFile(join(process.cwd(), '../upload/map/' + smallMap)));
    }

    getAllMap(): object {
        let fs = require('fs');
        let files = fs.readdirSync('../upload/map/');

        // Remove extension
        // let i = 0;
        // while (files[i] !== undefined) {
        //     files[i] = files[i].split('.').slice(0, -1).join('.');
        //     i++;
        // }
        return files;
    }

    getUuid(): string {
        return uuidv4();
    }

    isUuid(uuid: string): boolean {
        return isUUID(uuid);
    }
}
