import OAuth2Server = require('oauth2-server');

const httpProxy = require('express-http-proxy');

export class ApiProxy {
  firstProxy = httpProxy('http://localhost:5000');
  oauthServer;

  authenticateRequest = (req, res, next) => {
    const request: any = new OAuth2Server.Request(req);
    const response: any = new OAuth2Server.Response(res);

    return this.oauthServer
      .authenticate(request, response)
      .then(function(token) {
        next();
      })
      .catch(function(err) {
        res.status(err.code || 500).json(err);
      });
  };

  applyProxy = (server, oauthServer) => {
    this.oauthServer = oauthServer;
    server.get('/my-api/*', this.authenticateRequest, (req, res, next) => {
      this.firstProxy(req, res, next);
    });
  };
}

export const apiProxy = new ApiProxy();
