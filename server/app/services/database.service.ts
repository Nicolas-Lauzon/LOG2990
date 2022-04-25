import { injectable } from 'inversify';
import { Collection, FilterQuery, MongoClient, MongoClientOptions, ObjectID, UpdateQuery } from 'mongodb';
import 'reflect-metadata';
import { Drawing } from '../drawing';

const DATABASE_URL = 'mongodb+srv://Admin:admin@cluster0-nqcul.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'database';
const DATABASE_DRAWING = 'drawingCollection';
const TITLE_LENGHT = 50;
const TAG_LENGHT = 8;

@injectable()
export class DatabaseService {
    collectionDrawing: Collection<Drawing>;
    validationDrawing: boolean;
    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    constructor() {
        MongoClient.connect(DATABASE_URL, this.options)
            .then((client: MongoClient) => {
                this.collectionDrawing = client.db(DATABASE_NAME).collection(DATABASE_DRAWING);
            })
            .catch(() => {
                console.error('CONNECTION ERROR. EXITING PROCESS');
                process.exit(1);
            });
    }

    async getAllDrawings(): Promise<Drawing[]> {
        return this.collectionDrawing
            .find({})
            .toArray()
            .then((drawing: Drawing[]) => {
                return drawing;
            });
    }

    async getDrawing(id: string): Promise<Drawing> {
        return this.collectionDrawing
            .findOne({ _id: new ObjectID(id) })
            .then((drawing: Drawing) => {
                return drawing;
            });
    }

    async addDrawing(drawing: Drawing): Promise<string> {
        if (this.validateDrawing(drawing)) {
            return this.collectionDrawing.insertOne(drawing)
            .then(() => {
                return drawing.title + ' added successfully';
            });
        } else {
            throw new Error('Invalid drawing');
        }
    }

    async deleteDrawing(id: string): Promise<string> {
        return this.collectionDrawing
            .findOneAndDelete({ _id: new ObjectID(id) })
            .then(() => {
                return id + ' was deleted successfully';
            });
    }

    async modifyDrawing(drawing: Drawing): Promise<string> {
        const filterQuery: FilterQuery<Drawing> = { title: drawing.title, drawingHtml: drawing.drawingHtml, toolIDs: drawing.toolIDs};
        const updateQuery: UpdateQuery<Drawing> = {
            $set: {tags: drawing.tags }
        };
        return this.collectionDrawing
            .updateOne(filterQuery, updateQuery)
            .then(() => {
                return 'Modified drawing successfully';
            });
    }

    private validateDrawing(drawing: Drawing): boolean {
        for (const tag of drawing.tags) {
            if (!this.validateTag(tag)) {
                this.validationDrawing = false;
            }
        }
        return this.validateTitle(drawing.title) || this.validationDrawing;
    }

    private validateTitle(title: string): boolean {
        return title !== '' && title.length <= TITLE_LENGHT;
    }
    private validateTag(tag: string): boolean {
        return /^[a-zA-Z]+$/.test(tag) && tag.length <= TAG_LENGHT;
    }
}
