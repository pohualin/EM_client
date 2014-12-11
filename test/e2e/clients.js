'use strict';

describe('Client functionality', function() {
  var loginURL = 'http://localhost:3002/index.html#/login';
  var LoginPage = function() {
    this.loginButton = element(by.buttonText('Login'));
    this.login = function(url) {
      browser.get(url);
      this.loginButton.click();
    };
  };

  // beforeAll is not supported in Protractor yet
  // beforeAll(function() {
  //   var loginPage = new LoginPage();
  //   loginPage.login(loginURL);
  // });

  beforeEach(function () {
    var loginPage = new LoginPage();
    loginPage.login(loginURL);
    browser.waitForAngular();
  });

  it('should show create button when no search results are returned', function() {
    browser.get('http://localhost:3002/index.html#/clients');
    var input = element(by.id('query'));
    input.sendKeys('test');
    var searchButton = element(by.buttonText('Search'));
    searchButton.click();
    browser.sleep(1000);
    var createButton = element(by.css('.btn-primary'));
    expect(createButton.isDisplayed()).toBe(true);
  });

});
