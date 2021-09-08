import { Injectable, Res } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class GameService {

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
}
