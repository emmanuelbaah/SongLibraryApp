import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    created: {
        default: new Date(Date.now()),
        required: true,
        type: Schema.Types.Date,
    },
    email: {
        required: true,
        type: Schema.Types.String,
        unique: true,
    },
    library: {
        type: Schema.Types.ObjectId,
    },
    name: {
        required: true,
        type: Schema.Types.String,
    },
    password: {
        required: true,
        type: Schema.Types.String,
    },
    username: {
        required: true,
        type: Schema.Types.String,
        unique: true,
    },
}, { skipVersioning: true });

export interface IUser {
    name: string;
    email: string;
    username: string;
    password: string;
    created: Date;
    // TODO: Decide on type for library
    library: any;
}

export interface IUserDocument extends mongoose.Document, IUser { }

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);
