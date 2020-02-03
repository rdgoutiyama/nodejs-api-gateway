import * as mongoose from 'mongoose';

export interface User extends mongoose.Document {
  username: String;
  password: String;
}

export const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

export const User = mongoose.model<User>('User', userSchema);
