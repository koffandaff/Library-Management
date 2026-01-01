require('dotenv').config();

const config = {
  // Server
  server: {
    port: parseInt(process.env.PORT) || 3000,
    env: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || '/api'
  },
  
  // Database
  database: {
    uri: process.env.MONGODB_URI,
    name: process.env.DB_NAME || 'smartlibrary',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  
  // JWT
  jwt: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    accessExpiresIn: '15m',
    refreshExpiresIn: '7d'
  },
  
  // Security
  security: {
    adminKey: process.env.ADMIN_KEY,
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001'
  },
  
  // Features
  features: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production'
  }
};

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.warn(`⚠️  Warning: Required environment variable ${envVar} is not set`);
    if (config.features.isProduction) {
      throw new Error(`Required environment variable ${envVar} is missing`);
    }
  }
});

module.exports = config;