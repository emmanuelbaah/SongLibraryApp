import * as bcrypt from 'bcrypt';
import * as Bluebird from 'bluebird';
import * as mongoose from 'mongoose';

// Just to make the types work out nicely since we use Bluebird as the Promise library ;)
declare module 'bcrypt' {
    type Promise<T> = Bluebird<T>;
}

import { ILibraryDocument, IUserDocument, UserModel, LibraryModel, IUser } from '../models';

export class AuthenticationModule {

    // # of rounds needed to encrypt. increase to double security. decrease to halve it.
    private static saltRounds = 10;

    /**
     * getallUsers - Query for all user documents
     *
     * @static
     * @returns {Bluebird<IUserDocument[]>} List of all user documents in the database
     * @memberof AuthenticationModule
     */
    public static getAllUsers(): Bluebird<IUserDocument[]> {
        return UserModel.find()
            .then((results: IUserDocument[]) => results);
    }

    /**
     * registerUser - Attempts to create a new user account with an empty library for new user
     *
     * @static
     * @param {{username: string, password: string, name: string, email: string}} user object with needed user information
     * @returns {Bluebird<IUserDocument>} Promise of saved User document
     * @memberof AuthenticationModule
     */
    public static registerUser(user: {username: string, password: string, name: string, email: string}): Bluebird<IUserDocument> {
        // TODO: ERROR CHECKING!!
        let newUser = new UserModel(user);

        return bcrypt.hash(newUser.password, AuthenticationModule.saltRounds)
            .then(encryptedPassword => {
                newUser.password = encryptedPassword;
            })
            .then(() => newUser.save())
            .catch(error => {
                // Check for any error creating user
                throw error;
            })
            .then((userDoc: IUserDocument) => {
                // set aside new user doc for lib reference update & create new lib doc
                newUser = userDoc;
                const newLib = new LibraryModel();
                return newLib.save();
            })
            .then((libDoc: ILibraryDocument) => {
                // Assuming lib doc is created, link it in User doc & update user doc
                newUser.library = mongoose.Types.ObjectId(libDoc._id);
                return newUser.save();
            });
    }

    /**
     * verifyUser - Verify that user exists with matching username and password.
     * Throws error if no user found or if password is incorrect.
     *
     * @static
     * @param {string} username Username for user to query
     * @param {string} password Entered password to verify
     * @returns {Bluebird<IUserDocument>} User document from database
     * @memberof AuthenticationModule
     */
    public static verifyUser(username: string, password: string): Bluebird<IUserDocument> {
        let userDoc;
        return UserModel.findOne({ username })
                        .then(user => {
                            if (user === null) {
                                throw new Error(`No user found with username ${username}`);
                            }
                            userDoc = user;
                            return user;
                        })
                        .then(user => bcrypt.compare(password, user.password))
                        .then(matches => {
                            if (!matches) {
                                throw new Error(`Invalid password.`);
                            }
                            return userDoc;
                        });
    }
}
