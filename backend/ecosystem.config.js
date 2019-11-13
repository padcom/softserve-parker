module.exports = {
  apps : [
      {
        name: "parker",
        script: "./app/main.ts",
        env: {
            "PORT": 3000,
            "NODE_ENV": "development",
            "SMTP_PORT"=2525,
            "SMTP_HOST"="smtp.mailtrap.io",
            "SMTP_USER"="e7a1a548c2b5fa",
            "SMTP_PASSWORD"="375ad49c0a886c",
            "email"="ssparkertesting@gmail.com",
            "CONFIRM_URL_BASE"="http://127.0.0.1:8080"
        },
        env_qa: {
            "PORT": 3000,
            "NODE_ENV": "qa",
            "SMTP_PORT"=2525,
            "SMTP_HOST"="smtp.mailtrap.io",
            "SMTP_USER"="e7a1a548c2b5fa",
            "SMTP_PASSWORD"="375ad49c0a886c",
            "email"="ssparkertesting@gmail.com",
            "CONFIRM_URL_BASE"="http://parker-qa.aplaline.com"
        }
      }
  ]
}
