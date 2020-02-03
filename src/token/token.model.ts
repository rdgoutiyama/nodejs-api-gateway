import * as mongoose from 'mongoose';
import { Client } from '../client/client.model';
import { User } from '../user/user.model';

export interface Token extends mongoose.Document {
  accessToken: String;
  accessTokenExpiresAt: Date;
  refreshToken: String;
  refreshTokenExpiresAt: Date;
  client: mongoose.Types.ObjectId | Client;
  user: mongoose.Types.ObjectId | User;
}

export const tokenSchema = new mongoose.Schema({
  accessToken: {
    type: String,
    required: true
  },
  accessTokenExpiresAt: {
    type: Date,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  refreshTokenExpiresAt: {
    type: Date,
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

tokenSchema.index({ refreshTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });

export const Token = mongoose.model<Token>('Token', tokenSchema);
