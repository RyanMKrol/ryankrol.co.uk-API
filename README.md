# ryankrol.co.uk-API

## Deployment

### Clone the repo

* SSH on to the box you want to run this on
* Run the following to grab the repo:
  * `git clone https://github.com/RyanMKrol/ryankrol.co.uk-API`

### Npm Install

* First step is nice and easy, run the following:
  * `npm install`

### Generate dot files

* First we need credentials to run the site, so run the following to generate a .env.me file:
  * `npx dotenv-vault@latest pull`
* Once you have a .env.me file, you should be able to run the command above again to get the latest dotenv file

### Configure a daemon to run the site

* I usually use PM2 for this, so run the following
  * `npm install pm2@latest -g`
  * `pm2 start npm --name "ryankrol.co.uk-API" -- start`
