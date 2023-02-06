module.exports = {
    apps: [
      {
        name: 'unioil',
        script: 'npx',
        interpreter: 'none',
        args: 'serve build -s -p 3000',
        env_production: {
          NODE_ENV: 'production',
        },
      },
    ],
  
    deploy: {
      production: {
        user: 'SSH_USERNAME',
        host: 'SSH_HOSTMACHINE',
        ref: 'origin/master',
        repo: 'GIT_REPOSITORY',
        path: 'DESTINATION_PATH',
        'pre-deploy-local': '',
        'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
        'pre-setup': '',
      },
    },
  };
  