'use strict';

describe('Authentication capabilities', function() {
  var loginURL = 'http://localhost:3002/index.html#/login';
  var username = element(by.id('username'));
  var password = element(by.id('password'));
  var loginButton = element(by.buttonText('Login'));
  var error = element(by.css('.alert-danger'));

  beforeEach(function () {
    browser.get(loginURL);
  });

  // it('should redirect to the login page if trying to load protected page while not authenticated', function() {
  //   browser.get('http://localhost:3002/index.html#/clients').then(function(){
  //     expect(browser.getCurrentUrl()).toEqual(loginURL);
  //   });
  // });

  it('should warn on missing/malformed credentials', function() {
    username.clear();
    password.clear();

    password.sendKeys('test');
    loginButton.click();
    expect(error.isDisplayed()).toBe(true);

    username.sendKeys('test');
    loginButton.click();
    expect(error.isDisplayed()).toBe(true);

    username.sendKeys('@example.com');
    password.clear();
    loginButton.click();
    expect(error.isDisplayed()).toBe(true);
  });

  it('should accept a valid username and password', function() {
    username.clear();
    password.clear();

    username.sendKeys('super_admin');
    password.sendKeys('super_admin');
    loginButton.click();
    expect(browser.getCurrentUrl()).not.toEqual(loginURL);
  });

});
