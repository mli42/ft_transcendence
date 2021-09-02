import { Injectable, Res } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class GameService {

    getMap(@Res() res, name: string): Observable<object> {
        return of(res.sendFile(join(process.cwd(), '../upload/map/' + name)));
    }

    getAllMap(): string[] {
        let files = fs.readdirSync('../upload/map/');

        // Remove extension
        // let i = 0;
        // while (files[i] !== undefined) {
        //     files[i] = files[i].split('.').slice(0, -1).join('.');
        //     i++;
        // }
        return files;
    }
}
