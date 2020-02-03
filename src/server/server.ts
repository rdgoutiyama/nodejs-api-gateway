import * as mongoose from 'mongoose';
import * as restify from 'restify';
import { Client } from '../client/client.model';
import { environment } from '../common/environment';
import { tokenRouter } from '../token/token.router';
import OAuth2Server = require('oauth2-server');
import { ApiProxy, apiProxy } from '../proxy/api.proxy';

const bodyParser = require('body-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const express = require('express');

export class Server {
  application: any;
  server: any;
  oauthServer: OAuth2Server;

  initializeDb() {
    (<any>mongoose).Promise = global.Promise;
    return mongoose.connect(environment.db.url, {});
  }

  initServerConfiguration(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.server = express();
        this.server.use(bodyParser.urlencoded({ extended: true }));

        this.server.use(bodyParser.json());

        this.oauthServer = new OAuth2Server({
          model: <any>Client,
          accessTokenLifetime: 60 * 60,
          allowBearerTokensInQueryString: true
        });

        tokenRouter.applyRoutes(this.server, this.oauthServer);
        this.server.use(logger('dev'));
        this.server.use(helmet());
        this.server.use(cookieParser());

        apiProxy.applyProxy(this.server, this.oauthServer);
        this.application = this.server.listen(environment.server.port, () => {
          resolve(this.application);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  bootstrap(routers: restify.Router[] = []): Promise<Server> {
    return this.initializeDb().then(() =>
      this.initServerConfiguration().then(() => this)
    );
  }

  shutdown() {
    return mongoose.disconnect().then(() => this.application.close());
  }
}
