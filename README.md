# Welcome to Mean API.#
The one stop shop for recipes and ingredients before you compose your edible art.
## Getting Started on Linux - A list of commands used to create project: ##

```
#!bash

curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs  //Installs Nodejs
sudo apt-get install npm //Install Node Package Manager
sudo npm install -g express express-generator mongoose
express -e mean_api
cd mean_api && sudo npm_install
sudo npm install --save mongoose passport
```

**Setup Complete.**

## Important Information: ##
After you clone the repo run sudo npm install
To run the server use DEBUG=mean_api ./bin/www
To test api calls you can use Postman. Install the plugin for your browser
and test by launching the server. Postman's plugin has an address input and 
an http request type. I provided a **sample api call** that is built in to return
a **sample schema object** I created and defined named sandwich. The url for this post 
request is http://localhost:3000/api/sandwiches.

## Syntax and style rules: ##
* 2 spaces for tabs
*   tabs instead of spaces
*   avoid typing lines longer than 80 characters

## Sample Sublime Text Preferences: ##
{
  "draw_white_space": "all",
  "font_size": 9,
  "rulers":
  [
    80
  ],
  "tab_size": 2,
  "translate_tabs_to_spaces": true
}


## Developers: ##
* Jayd Saucedo
* Cameron Brownfield
* Erik Mellum