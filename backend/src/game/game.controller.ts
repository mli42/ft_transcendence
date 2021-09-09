import { Controller, Get, Param, Res, UseGuards, Header, Query, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam, ApiOkResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { Observable, of } from "rxjs";
import { GameService } from './game.service';
import { playingGames, gamesMap, playingUsers } from "./game.gateway";
import { Game } from "./dataStructures";

@ApiTags('game')
@Controller('api/game')
export class GameController {
  constructor(
    private gameService: GameService
  ) {}

  /**
   * MAPS ROUTES
   */
  @ApiOperation({summary: 'Get All Map'})
  @ApiOkResponse({description: 'returns a list of all available maps'})
  /*******/
  @UseGuards(AuthGuard('jwt'))
  @Get('/mapList')
  getAllMap(@Res() res): any {
    return res.set({ 'Cache-Control': ['public', 'max-age=604800', 'immutable']}).json(this.gameService.getAllMap());
  }

  @ApiOperation({summary: 'Get One Map'})
  @ApiOkResponse({description: 'retrieve the map by sending its name as a parameter'})
  @ApiParam({name: 'nameMap', required: true, description: 'name of the map'})
  /*******/
  @Get('/map/:nameMap')
  getMap(@Res() res, @Param('nameMap') nameMap): Observable<object> {
    return this.gameService.getMap(res, nameMap);
  }

  @ApiOperation({summary: 'Get Small Map'})
	@ApiOkResponse({description: 'retrieve the map by sending its name as a parameter'})
	@ApiParam({name: 'nameMap', required: true, description: 'name of the map'})
  /*******/
	@UseGuards(AuthGuard('jwt'))
	@Get('/smallMap/:nameMap')
	getSmallMap(@Res() res, @Param('nameMap') nameMap): Observable<object> {
    return this.gameService.getSmallMap(res, nameMap);
  }

  /**
   * GAMES ROUTES
   */
  @ApiOperation({summary: 'Get All Playing Games'})
  @ApiOkResponse({description: 'returns a list of all playing maps'})
  /*******/
  @UseGuards(AuthGuard('jwt'))
  @Get('/playingGames')
  getPlayingGames(): string[] {
    return (playingGames);
  }

  @ApiOperation({summary: 'Get the whole playing game class'})
  @ApiOkResponse({description: 'returns a data of a game by id'})
  @ApiParam({name: 'gameId', required: true, description: 'id of the playing game'})
  /*******/
  @UseGuards(AuthGuard('jwt'))
  @Get('/playingGames/:gameId')
  getGameClass(@Param('gameId') id): any {
    const game: Game | undefined = gamesMap.get(id);

    if (game === undefined) {
      throw new NotFoundException('No game found');
    }
    return ({
      gameId: game.id,
      creatorId: game.creatorId,
      opponent: game.opponentId,
      score: game.score,
      startDate: game.startDate,
    });
  }

  @ApiOperation({summary: 'Get UUID'})
  @ApiOkResponse({description: 'returns UUID for the game ID'})
  /*******/
  @UseGuards(AuthGuard('jwt'))
  @Get('/uuid')
  getUuid(): string {
    return this.gameService.getUuid();
  }

  @ApiOperation({summary: 'Verifying a UUID'})
  @ApiOkResponse({description: 'returns true or false'})
  @ApiParam({name: 'uuid', required: true, description: 'uuid to check'})
  /*******/
  @UseGuards(AuthGuard('jwt'))
  @Get('/isUuid/:uuid')
  isUuid(@Param('uuid') uuid: string): boolean {
    return this.gameService.isUuid(uuid);
  }
}
