# Local Development

Install Docker
https://docs.docker.com/docker-for-mac/install/

Then run
`docker-compose run`

## Add a new dependency
If you need to add a new dependency:

Stop docker
`docker-compose down`

Add package to app's package.json
`npx install package`

Rebuild the docker image
`docker-compose build ui`
or
`docker-compose build api`

Start up docker-compose
`docker-compose run`