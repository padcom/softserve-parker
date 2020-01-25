# Parker

## Installation

Parker is installed using Docker. It can run on just regular docker or (preferably in production) using Docker Swarm or Kubernetes.

When running in production a user interface for Docker is preferable to gain accesss to all the Docker functions at a glance. For that
one can use Portainer which manages both single containers running on a node as well as stacks.

### Docker

To install Docker swarm first you need to install Docker:

```
$ curl https://get.docker.com | bash
```

During the installation you will be asked to provide `sudo` password to install Docker and required dependencies.

Once Docker is installed and running you should add your user to the `docker` group to be able to instantiate the swarm and run Portainer in it.

```
$ sudo usermod -aG docker $(whoami)
```

This informatino is also present on the screen after Docker installation completes.

After Docker is installed you need to disconnect and reconnect to the machine. This is needed so that your session contains information about your
user being added to the `docker` group.

### Docker Swarm

Next we need to turn this standalone Docker into a 1-node Docker Swarm. To do that you will need the IP address of the machine you are running Docker on.
This information can be obtained from either your trusty IT department. You need it anyway to connect to the machine using SSH so I assume you already have it.

Once you have the IP address at hand start the following command which will automatically create the swarm for you:

```
$ docker swarm init --advertise-addr YOUR-IP-ADDRESS-GOES-HERE
```

And that's it! Your Docker is now the Swarm Master and you can run stacks on it. Easy!

### Portainer

Once that's done it is time to deploy the first stack - the Portainer. It will help you manage your Docker Swarm in a nice graphical way. To do that enter the following commands:

```
$ curl -L https://downloads.portainer.io/portainer-agent-stack.yml -o portainer-agent-stack.yml
$ docker stack deploy --compose-file=portainer-agent-stack.yml portainer
```

In a few moments you can access your Docker via http://YOUR-IP-ADDRESS-GOES-HERE. Follow the instructions on the screen to complete the installation.

### Application

Now it is time to install the application stack. Everything is done using Portainer for simplicity.

- Navigate to the "Stacks" menu
- Click "Add stack"
- Give it a name (for example `parker`)
- Select to upload `docker-compose.yaml` file from your local disk (the one in top-level directory of the repository)
- And click Create

Done.

### Database migrations

The last thing to do is to deploy database migrations. Database migrations contain instructions how to modify the structure and data in MySQL to be compatible with the application.

- Navigate to the "Stacks" menu
- Select "parker" stack
- Expand the "parker_parker" entry
- Click the >_ icon next to it - it will open the console to access that container directly
- Click "Connect"
- Enter the following command

```
$ npm run db:migrate -- --env production
```







