import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Drawing } from '../drawing';
import { DatabaseService } from '../services/database.service';
import Types from './../types';
@injectable()
export class DatabaseController {
    router: Router;

    constructor(@inject(Types.DatabaseService) private databaseService: DatabaseService) {
        this.configureRouter();
    }
    private configureRouter(): void {
        this.router = Router();

        this.router.get('/drawings', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getAllDrawings()
                .then((drawings: Drawing[]) => {
                    res.json(drawings);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/drawings/:id', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .getDrawing(req.params.id)
                .then((drawing: Drawing) => {
                    res.json(drawing);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.post('/drawings/', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .addDrawing(req.body)
                .then(() => {
                    res.sendStatus(Httpstatus.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/drawings/:id', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .deleteDrawing(req.params.id)
                .then(() => {
                    res.sendStatus(Httpstatus.OK).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.patch('/drawings/', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService
                .modifyDrawing(req.body)
                .then(() => {
                    res.sendStatus(Httpstatus.OK);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });
    }
}
