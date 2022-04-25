import * as fs from 'fs';
import { injectable } from 'inversify';
import 'reflect-metadata';
import * as rp from 'request-promise';
import { API_MAIL } from '../../constant';

@injectable()
export class EmailService {
    async postDrawing(email: string, imageBase: string, nameExtension: string): Promise<string> {
        if (!nameExtension.includes('.svg')) {
            const direct = Buffer.from(imageBase, 'base64');
            fs.writeFileSync('./uploads/' + nameExtension, direct);
        } else {
            fs.writeFileSync('./uploads/' + nameExtension, imageBase);
        }
        const options = {
            method: 'POST',
            url: 'https://log2990.step.polymtl.ca/email?address_validation=true&quick_return=false&dry_run=false',
            headers: {
                'Content-Type': 'application/json',
                'x-team-key': API_MAIL,
            },
            formData: {
                to: email,
                payload: fs.createReadStream('./uploads/' + nameExtension),
            },
        };
        return await rp(options).then((response) => {
            fs.unlinkSync('./uploads/' + nameExtension);
            return response;
        }).catch((error) => {
            fs.unlinkSync('./uploads/' + nameExtension);
            throw new Error(error);
        });
    }
}
