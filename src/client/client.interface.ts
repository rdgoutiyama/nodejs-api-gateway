// @ts-ignore
import * as mongoose from 'mongoose';

export interface IClient extends mongoose.Document {
  id: String;
  clientId: String;
  clientSecret: String;
  grants: [String];
  redirectUris: [String];
}

export interface IClientModel extends mongoose.Model<IClient> {
  getClient(clientId, clientSecret, callback): Promise<any>;
  getAccessToken(token, callback): Promise<any>;
  getClient(clientId, clientSecret, callback): any;
  saveToken(token, client, user, callback): Promise<any>;
  getUser(username, password, callback): Promise<any>;
  getUserFromClient(client, callback): Promise<any>;
  getRefreshToken(refreshToken, callback): Promise<any>;
  revokeToken(token, callback): Promise<any>;
}
