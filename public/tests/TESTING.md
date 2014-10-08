# How to do Jasmine Testing.#
Learn to create your own Jasmine tests for MEANStack

## Unit tests: ##
**Install Karma**
```
sudo npm install -g karma
```
**Run the Tests**
```
karma start karma.conf.js #from the public/tests directory
```

**Test Location**
```
webapp/tests/unit/myTestNameTest.js (Test names must end in 'Test.js')
```

## E2E tests: ##
**Installation**
```
sudo npm install -g protractor #Installs the e2e tester "protractor"
webdriver-manager update #selenium requirements

```
###Running Tests###
**Launch server**
```
npm start #in root directory
```

**Launch protractor tests**
```
protractor protractor-conf.js #in public/tests directory
```

## Best Resource: ##
[Learn to write Tests for MEANstack](http://andyshora.com/unit-testing-best-practices-angularjs.html)