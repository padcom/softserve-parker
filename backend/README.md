# Parker backend

## Prerequisites

_click the links for installation guide_

- [ Node 10.x.x ](https://nodejs.org/en/download/)
- docker 19.03.2 or greater [Windows](https://docs.docker.com/docker-for-windows/install/)/[Linux](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- [docker-compose v18.06.0 or greater](https://docs.docker.com/compose/install/#install-compose)

## Setup

1. Run `npm install`
2. Run `npm run dev:db` **<--make sure docker & docker-compose is installed!**
3. Run `npm run dev:backend`. If you get _Database connection was closed_ error just try running the command again in 5 seconds. The db probably didn't manage to come online so fast.
4. Done! The app backend is set up. Go to the link shown in the terminal (`Success! Started at localhost:xxxx`).
   Press CTRL+Space after the page loads to see the possible queries.

## Troubleshooting

### Database

- **Migrations**:
  If you need to recreate the local dev database and have it load the `db.sql` script again, just run `npm run dev:db`. It will completely destroy the current database and start it from zero with the fresh `db.sql` script (do this if you want to migrate)

- **How do I run manually written MySQL queries inside the `mysql` command prompt?**:
  If you ever need write some manual queries to see if your API call will return the right rows (eg. for debugging reasons), run `npm run dev:db-ssh`.
  You will get an mysql prompt for root user, then you will be able to write manual queries like `SELECT * FROM someParkerTable`

- **Something is completely broken. How do I revert my machine to the state as if I never installed/ran the parker local dev db?:** Just run `npm run dev:db-purge`
