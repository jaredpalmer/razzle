# Razzle Basic Example

## How to use
Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-navigation-digitalocean
cd with-navigation-digitalocean
```

Install it and run:

```bash
yarn install
yarn start
```

## Idea behind the example

This is built off of the basic example provided.  This example achieves how to setup a simple navigation tab that will load your pages in accordance with Server Side Rendering.

## For Digital Ocean
This tutorial is inspired by [this post](https://hackernoon.com/start-to-finish-deploying-a-react-app-on-digitalocean-bcfae9e6d01b), but hopefully is a bit easier to walk through.

First of all, we'll assume you've setup your ssh keys for authentication, and that you have any users setup if you wish to run your server from a non-root user.  For now, we'll assume the server is run from the root user.

[How to Connect to Droplets with SSH](https://www.digitalocean.com/docs/droplets/how-to/connect-with-ssh/)

### 1) Install Node.js if you haven't already.

[This page](https://nodejs.org/en/download/package-manager/) outlines the many ways you can install node.js on your server. For our purposes we will grab the latest LTS (Long Term Support) binary release.  In this case we're using 12.x, but you can check the latest LTS release [here](https://nodejs.org/en/download/).

Install nodejs:
```bash
# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -sL https://deb.nodesource.com/setup_12.x | bash -
apt-get install -y nodejs
```

### 2) Install pm2

`pm2` provides persistence, so when you exit your terminal session it will still be running.  With `node` and `npm` installed, you can install it via the following:

`npm install -g pm2`

### 3) Serve your app!

First, clone your project into your server:

`git clone <url-to-repository.git> [optional-name]` & `cd [your-project-directory]`

install, and build:

`npm install` & `npm run build`

Now tell pm2 to perpetually serve your website:

`pm2 start build/server.js`

You can also use these commands to know what processes are running, etc.
`pm2 list` & `pm2 show [index | process_name]`

Now you should be able to view your website via `[IP | Domain]:3000` (npm uses port 3000 to serve your site by default)

### 4) Extra -- You can use NGINX for a reverse proxy
From here you can do additional steps to make your site more secure, like using NGINX as a reverse proxy

`[sudo] apt-get install nginx`

Nginx works with your firewall, so you can setup SSL certificates (https) via this method.  You can go [here](https://www.digitalocean.com/community/tutorials/how-to-install-an-ssl-certificate-from-a-commercial-certificate-authority) for setting up `https`.

For now we can just use `http`:

`[sudo] ufw allow 'Nginx HTTP'`

You can see the changes via `ufw app list`

#### Configure Nginx

Using the editor of your choice, edit `/etc/nginx/sites-enabled/default`

Modify or add the lines as shown bellow:
```bash
server {
    ...

    root /root/your-project/build/; # point to your build dir

    ...

    server_name my_project # (or example.com www.example.com)

    ...

    location / {
        ...

        proxy_pass http://localhost:3000
    }
}
```

