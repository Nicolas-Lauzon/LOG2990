import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { EmailService } from '../services/email.service';
import Types from '../types';

@injectable()
export class EmailController {
    router: Router;
    constructor(@inject(Types.EmailService) private emailService: EmailService) {
        this.configureRouter();
    }
    private configureRouter(): void {
        this.router = Router();

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            this.emailService.postDrawing(req.body.email, req.body.directoryImage, req.body.nameExtension)
           .then((resultat) => {
           res.json(resultat);
        })
        .catch((error: Error) => {
            res.json(error.message);
        });
        });
    }
}
