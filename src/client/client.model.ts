// @ts-ignore
import * as mongoose from 'mongoose';
import { Token } from '../token/token.model';
import { User } from '../user/user.model';
import { IClientModel, IClient} from "./clinet.interface";

export const clientSchema = new mongoose.Schema({
  id: String,
  clientId: String,
  clientSecret: String,
  grants: [String],
  redirectUris: [String]
});

clientSchema.statics.getClient = function(
  clientId,
  clientSecret,
  callback
): Promise<any> {
  return Client.findOne({
    clientId,
    clientSecret
  }).then(client => {
    if (!client) {
      console.error('Client not found');
    }

    console.log('====================================');
    console.log(client);
    console.log('====================================');
    return client;
  });
};

clientSchema.statics.getAccessToken = function(token, callback) {
  Token.findOne({
    accessToken: token
  })
    .lean()
    .exec(
      function(callback, err, token) {
        if (!token) {
          console.error('Token not found');
        }

        callback(err, token);
      }.bind(null, callback)
    );
};

clientSchema.statics.getClient = function(clientId, clientSecret, callback) {
  this.findOne({
    clientId: clientId,
    clientSecret: clientSecret
  })
    .lean()
    .exec(
      function(callback, err, client) {
        if (!client) {
          console.error('Client not found');
        }

        callback(err, client);
      }.bind(null, callback)
    );
};

clientSchema.statics.saveToken = function(token, client, user, callback) {
  token.client = client;

  token.user = user;

  const tokenInstance = new Token(token);

  tokenInstance.save(
    function(callback, err, token) {
      if (!token) {
        console.error('Token not saved');
      } else {
        token = token.toObject();
        delete token._id;
        delete token.__v;
      }

      callback(err, token);
    }.bind(null, callback)
  );
};

/*
 * Method used only by password grant type.
 */

clientSchema.statics.getUser = function(username, password, callback) {
  User.findOne({
    username: username,
    password: password
  })
    .lean()
    .exec(
      function(callback, err, user) {
        if (!user) {
          console.error('User not found');
        }

        callback(err, user);
      }.bind(null, callback)
    );
};

/*
 * Method used only by client_credentials grant type.
 */

clientSchema.statics.getUserFromClient = function(client, callback) {
  this.findOne({
    clientId: client.clientId,
    clientSecret: client.clientSecret,
    grants: 'client_credentials'
  })
    .lean()
    .exec(
      function(callback, err, client) {
        if (!client) {
          console.error('Client not found');
        }

        callback(err, {
          username: ''
        });
      }.bind(null, callback)
    );
};

/*
 * Methods used only by refresh_token grant type.
 */

clientSchema.statics.getRefreshToken = function(refreshToken, callback) {
  Token.findOne({
    refreshToken: refreshToken
  })
    .lean()
    .exec(
      function(callback, err, token) {
        if (!token) {
          console.error('Token not found');
        }

        callback(err, token);
      }.bind(null, callback)
    );
};

clientSchema.statics.revokeToken = function(token, callback) {
  Token.deleteOne({
    refreshToken: token.refreshToken
  }).exec(
    function(callback, err, results) {
      var deleteSuccess = results && results.deletedCount === 1;

      if (!deleteSuccess) {
        console.error('Token not deleted');
      }

      callback(err, deleteSuccess);
    }.bind(null, callback)
  );
};

export const Client = mongoose.model<IClient, IClientModel>(
  'Client',
  clientSchema
);
