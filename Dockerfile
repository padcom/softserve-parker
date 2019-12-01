FROM parker-runtime

ARG environment=production
ARG port=3000

ENV NODE_ENV=$environment
ENV PORT=$port
ENV SMTP_PORT=2525
ENV SMTP_HOST=smtp.mailtrap.io
ENV SMTP_USER=e7a1a548c2b5fa
ENV SMTP_PASSWORD=375ad49c0a886c
ENV EMAIL=ssparkertesting@gmail.com
ENV CONFIRM_URL_BASE=http://parker-qa.aplaline.com

COPY backend/dist /app/
COPY backend/node_modules /app/node_modules
COPY backend/private.key /app/
COPY backend/public.key /app/
COPY frontend/dist /app/public
COPY admin/dist /app/public/admin

CMD node app/main.js

EXPOSE $port
