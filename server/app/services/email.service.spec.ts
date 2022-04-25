// tslint:disable:no-magic-numbers
// tslint:disable:no-console
// tslint:disable-next-line: max-line-length

import { expect } from 'chai';
import { testingContainer } from '../../test/test-utils';
import Types from '../types';
import { EmailService } from './email.service';

const testDrawingSVG = 'hflkhlfdv';
// tslint:disable-next-line: max-line-length
const testDrawingPNG = 'kfhdsklflasdh';
describe('Test of all the methods of EmailService', () => {
    let database: EmailService;
    beforeEach(async () => {
        const [container] = await testingContainer();
        database = container.get<EmailService>(Types.EmailService);
    });

    it('should test email with svg', async () => {
        return database.postDrawing('zakaria.boussoffara@polymtl.ca', testDrawingSVG, 'image.svg').then((value: string) => {
            return expect(value).to.eql('{"message":"An email has been sent!"}');
        });
    });
    it('should test email with png', async () => {
        return database.postDrawing('zakaria.boussoffara@polymtl.ca', testDrawingPNG, 'image.png').then((value: string) => {
            return expect(value).to.eql('{"message":"An email has been sent!"}');
        });
    });
    it('should test email with wrong email', async () => {
        return database.postDrawing('wrong', testDrawingPNG, 'image.png').catch((value: Error) => {
            // tslint:disable-next-line: max-line-length
            return expect(value.message).to.eql('StatusCodeError: 400 - "{\\"error\\":\\"Key \\\\\\"to\\\\\\" of value \\\\\\"wrong\\\\\\"is either an invalid email or not reachable by the server.\\"}"');
        });
    });
});
