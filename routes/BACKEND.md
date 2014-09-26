# Mean API.#
## Getting Started: ##
**Clone the repo**
```
git init
git clone https://ErikMellum@bitbucket.org/meanapi/mean-api.git
```
**Install the plugins**
```
cd mean_api
sudo npm install
```

**To run the server**
```
DEBUG=mean_api ./bin/www
```
To test api calls you can use Postman. Install the plugin for your browser
and test by launching the server. Postman's plugin has an address input and 
an http request type. I provided a **sample api call** that is built in to return
a **sample schema object** I created and defined named sandwich. The url for this post 
request is http://localhost:3000/api/sandwiches.

## A list of commands used to create the project: ##

```
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs  //Installs Nodejs
sudo apt-get install npm //Install Node Package Manager
sudo npm install -g express express-generator mongoose socket.io socket.io-client cookgie-signature bytes send
express -e mean_api
cd mean_api && sudo npm_install
sudo npm install --save mongoose passport
```

**Setup Complete.**

## Database Info: ##
### MONGO URI ###
mongodb://sandwich:composer@proximus.modulusmongo.net:27017/orab7aDi
### MONGO CONSOLE ###
mongo proximus.modulusmongo.net:27017/orab7aDi -u sandwich -p composer

## Developers: ##
* Jayd Saucedo
* Cameron Brownfield
* Erik Mellum

[Code Style](../STYLE.md)
