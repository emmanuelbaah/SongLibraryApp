import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const librarySchema = new Schema({
    entries: [{
        addedOn: {
            default: new Date(Date.now()),
            required: true,
            type: Schema.Types.Date,
        },
        song: {
            required: true,
            type: Schema.Types.ObjectId,
        },
    }]
}, { skipVersioning: true });

export interface ILibrary {
    entries: [{
        addedOn: Date,
        song: any,
    }];
}

export interface ILibraryDocument extends mongoose.Document, ILibrary { }

export const LibraryModel = mongoose.model<ILibraryDocument>('Library', librarySchema);
