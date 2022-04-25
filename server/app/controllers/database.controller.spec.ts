import { expect } from 'chai';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { Drawing } from '../drawing';
import { DatabaseService } from '../services/database.service';
import Types from '../types';

// tslint:disable:no-any
const HTTP_STATUS_CREATED = 201;
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_NOT_FOUND = 404;

describe('DateController', () => {
    let database: Stubbed<DatabaseService>;
    let app: Express.Application;
    const expectedDrawing: Drawing = {
        title: 'title',
        drawingHtml: 'drawing',
        tags: ['newTag'],
        toolIDs: [1, 2],
    } as Drawing;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(Types.DatabaseService).toConstantValue({
            addDrawing: sandbox.stub(),
            modifyDrawing: sandbox.stub(),
            deleteDrawing: sandbox.stub(),
            getAllDrawings: sandbox.stub(),
            getDrawing: sandbox.stub(),
        });
        database = container.get(Types.DatabaseService);
        app = container.get<Application>(Types.Application).app;
    });

    it('should add a drawing from databaseService on post request', async () => {
        database.addDrawing.resolves();

        return supertest(app)
            .post('/database/drawings')
            .send(expectedDrawing)
            .expect(HTTP_STATUS_CREATED)
            .then((response: any) => {
                expect(response.body).to.deep.equal({});
            });
    });

    it('should return an error as a message on addDrawing fail', async () => {
        database.addDrawing.rejects(new Error('service error'));

        return supertest(app)
            .post('/database/drawings')
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.error.text).to.equal('service error');
            });
    });

    it('should return drawings from databaseService on get request', async () => {
        database.getAllDrawings.resolves(expectedDrawing);

        return supertest(app)
            .get('/database/drawings')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(expectedDrawing);
            });
    });

    it('should return an error as a message on getAllDrawings fail', async () => {
        database.getAllDrawings.rejects(new Error('service error'));

        return supertest(app)
            .get('/database/drawings')
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.error.text).to.equal('service error');
            });
    });

    it('should return one drawing from databaseService on get request', async () => {
        database.getDrawing.resolves(expectedDrawing);

        return supertest(app)
            .get('/database/drawings/:id')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal(expectedDrawing);
            });
    });

    it('should return an error as a message on getDrawing fail', async () => {
        database.getDrawing.rejects(new Error('service error'));

        return supertest(app)
            .get('/database/drawings/:id')
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.error.text).to.equal('service error');
            });
    });

    it('should modify one drawing from databaseService on patch request', async () => {
        database.modifyDrawing.resolves(expectedDrawing);

        return supertest(app)
            .patch('/database/drawings/')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal({});
            });
    });

    it('should return an error as a message on modifyDrawing fail', async () => {
        database.modifyDrawing.rejects(new Error('service error'));

        return supertest(app)
            .patch('/database/drawings/')
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.error.text).to.equal('service error');
            });
    });

    it('should delete drawing from databaseService on delete request', async () => {
        database.deleteDrawing.resolves(expectedDrawing);

        return supertest(app)
            .delete('/database/drawings/:id')
            .expect(HTTP_STATUS_OK)
            .then((response: any) => {
                expect(response.body).to.deep.equal({});
            });
    });

    it('should return an error as a message on modifyDrawing fail', async () => {
        database.deleteDrawing.rejects(new Error('service error'));

        return supertest(app)
            .delete('/database/drawings/:id')
            .expect(HTTP_STATUS_NOT_FOUND)
            .then((response: any) => {
                expect(response.error.text).to.equal('service error');
            });
    });
});
