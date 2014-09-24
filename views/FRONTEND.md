# Mean Angular.#

## Creating / Editing HTML: ##
We will be using express and node.js as our server and they render .ejs into html.
That means that when you create html you are going to be saving it with the extension .ejs
The folder location for your partials will be views/partials/mypartial.ejs
It also means you will have to run the server to test and view your code so remember
the command DEBUG=mean_api ./bin/www inside of the root launches the server on 3000!

## Creating / Editing Javascript, Angular, and CSS ##
* public/javascripts 
* public/styles
* public/angular

## Rendering an EJS into an HTML: ##
** The routes/index.js file has the following lines as an example: **
```
router.get('/landing', function(req, res) {
  res.render('partials/landing');
});
```
If you want to add a new partial you must first add the 3 lines of code showed above
(only edited for your route and your filename) into the routes/index.js file.

## Creating the Angular Route for the rendered file: ##
in public/angular/routing/router.js
```
when('/landing', {
    templateUrl: 'landing',
    controller: 'LandingController'
  }).
  ```
**To run the server**
```
DEBUG=mean_api ./bin/www
```
**To view the app**
localhost:3000

## Developers: ##
* Jayd Saucedo
* Cameron Brownfield
* Erik Mellum
* Billy Steffenhegan
* Yaseen Aniss

[Code Style](../STYLE.md)