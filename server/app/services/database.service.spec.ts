// tslint:disable:no-magic-numbers
// tslint:disable:no-console

import { expect } from 'chai';
import { Collection, MongoClient, MongoClientOptions } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { testingContainer } from '../../test/test-utils';
import { Drawing } from '../drawing';
import Types from '../types';
import { DatabaseService } from './database.service';

let mongoClient: MongoClient;
let collectionDrawing: Collection<Drawing>;
let testDrawing: Drawing;
let falseDrawing: Drawing;
const mongoServer = new MongoMemoryServer();
const DATABASE_NAME = 'database';
const DATABASE_DRAWING = 'drawingCollection';
let ID_TEST_DRAWING: string;
const options: MongoClientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

testDrawing = {
    title: 'title',
    drawingHtml: 'drawing',
    tags: ['tag'],
    toolIDs: [1, 2],
};
falseDrawing = {
    title: '',
    drawingHtml: 'drawing',
    tags: ['tagjfngksfdngkndfgknsfdngsd'],
    toolIDs: [1, 2],
};

before(async () => {
    const mongoUri = await mongoServer.getUri();
    await MongoClient.connect(mongoUri, options).then((client: MongoClient) => {
        mongoClient = client;
        collectionDrawing = client.db(DATABASE_NAME).collection(DATABASE_DRAWING);
    });
});

after(async () => {
    await mongoClient.close();
    await mongoServer.stop();
});

describe('Test of all the methods of Database', () => {
    let database: DatabaseService;
    beforeEach(async () => {
        const [container] = await testingContainer();
        database = container.get<DatabaseService>(Types.DatabaseService);
        database.collectionDrawing = collectionDrawing;
    });

    after(async () => {
        await mongoClient.close();
        await mongoServer.stop();
    });

    it('should test addDrawing', async () => {
        return database.addDrawing(testDrawing).then((value: string) => {
            return expect(value).to.eql(testDrawing.title + ' added successfully');
        });
    });

    it('should test the catch of addDrawing', async () => {
        return database.addDrawing(falseDrawing).catch((value: Error) => {
            return expect(value.message).to.eql('Invalid drawing');
        });
    });

    it('should test getAllDrawings', async () => {
        return database.getAllDrawings().then((value: Drawing[]) => {
            ID_TEST_DRAWING = JSON.stringify(value[0]).substr(8, 24);
            return expect(value[0]).to.eql(testDrawing);
        });
    });

    it('should test modifyDrawing', async () => {
        testDrawing = {
            title: 'title',
            drawingHtml: 'drawing',
            tags: ['newTag'],
            toolIDs: [1, 2],
        };
        return database.modifyDrawing(testDrawing).then((value: string) => {
            return expect(value).to.eql('Modified drawing successfully');
        });
    });

    it('should test getDrawing', async () => {
        return database.getDrawing(ID_TEST_DRAWING).then((value: Drawing) => {
            testDrawing = value;
            return expect(value).to.eql(testDrawing);
        });
    });

    it('should test deleteDrawing', async () => {
        return database.deleteDrawing(ID_TEST_DRAWING).then((value: string) => {
            return expect(value).to.eql(ID_TEST_DRAWING + ' was deleted successfully');
        });
    });

});
