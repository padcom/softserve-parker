module.exports = {
  apps : [
      {
        name: "parker-backend",
        script: "./app/main.ts",
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        },
        env_qa: {
            "PORT": 3000,
            "NODE_ENV": "production",
        }
      }
  ]
}
