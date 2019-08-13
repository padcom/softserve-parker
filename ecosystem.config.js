module.exports = {
  apps: [
    {
      name: 'parker-backend',
      cwd: 'backend/dist',
      script: 'app.js',
      max_restarts: 5,
      instances: 1,
      env: {
        NODE_ENV: 'development',
        PORT: 4000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
    {
      name: 'parker-frontend',
      max_restarts: 5,
      script: '/usr/local/bin/serve', //pm2 has it's own 'serve' which doesn't work, make sure to use global
      args: 'frontend/dist -l 5000',
      instances: 1,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
