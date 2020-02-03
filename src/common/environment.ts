export const environment = {
  server: { port: process.env.SERVER_PORT || 4000 },
  db: { url: process.env.DB_URL || 'mongodb://localhost/oauth' },
  security: {
    saltRounds: process.env.SALT_ROUND || 10,
    apiSecret: process.env.API_SECRET || 'meat-api-secret',
    enableHTTPS: process.env.ENABLE_HTTPS || false,
    certificate: process.env.CERT_FILE || './security/keys/cert.pem',
    key: process.env.CERT_KEY || './security/keys/key.pem'
  },
  log: {
    level: process.env.LEVEL || 'debug',
    name: 'meat-api'
  }
};
