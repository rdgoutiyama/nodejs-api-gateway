import OAuth2Server = require('oauth2-server');

class TokenRouter {
  applyRoutes(application, oauthServer: OAuth2Server) {
    application.all('/oauth/token', function obtainToken(req, res) {
      const request: any = new OAuth2Server.Request(req);
      const response: any = new OAuth2Server.Response(res);

      return oauthServer
        .token(request, response)
        .then(function(token) {
          res.json(token);
        })
        .catch(function(err) {
          res.status(err.code || 500).json(err);
        });
    });
  }
}

export const tokenRouter = new TokenRouter();
