# Parker backend

## Prerequisites

_click the links for installation guide_

- [ Node 10.x.x ](https://nodejs.org/en/download/)
- docker 19.03.2 or greater [Windows](https://docs.docker.com/docker-for-windows/install/)/[Linux](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- [docker-compose v18.06.0 or greater](https://docs.docker.com/compose/install/#install-compose)

## Setup

1. Run `npm install`
2. Run `docker-compose up` and wait for the 'parker-mysql' server to complete initialization which usually takes about 30 seconds tops
3. Run `npm run db:migrate` to initialize the database
4. Run `npm run dev` to start the application
5. Done! The app backend is set up. Go to the link shown in the terminal (`Success! Started at localhost:xxxx`).
   Press CTRL+Space after the page loads to see the possible queries.

## Troubleshooting

### Database

- **Migrations**:
  To create a new migration run
  ```
  $ npm run db:create-migration -- <migration-name>
  ```
  This will create a new file in the `migrations` folder. Follow the documentation on https://db-migrate.readthedocs.io to see how to create migrations

