import { expect } from 'chai';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { EmailService } from '../services/email.service';
import Types from '../types';

// tslint:disable:no-any
const HTTP_STATUS_CREATED = 200;
const HTTP_STATUS_NOT_FOUND = 200;

describe('EmailController', () => {
    let database: Stubbed<EmailService>;
    let app: Express.Application;
    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(Types.EmailService).toConstantValue({
            postDrawing: sandbox.stub()
        });
        database = container.get(Types.EmailService);
        app = container.get<Application>(Types.Application).app;
    });

    it('should add a drawing from EmailService on post request', async () => {
        database.postDrawing.resolves();

        return supertest(app)
            .post('/email/')
            .expect(HTTP_STATUS_CREATED)
            .then((response: any) => {
                expect(response.body).to.deep.equal('');
            });
    });

    it('should return an error as a message on postDrawing fail', async () => {
        database.postDrawing.rejects(new Error('service error'));

        return supertest(app)
            .post('/email/')
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.status).to.equal(HTTP_STATUS_NOT_FOUND);
            });
    });

});
