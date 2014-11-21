'use strict';

describe('The main view', function () {

  beforeEach(function () {
    browser.get('http://localhost:3002');
  });

  it('displays a logout link', function () {
    expect(element.all(by.css('li')).last().getText()).toEqual('Logout');
  });

});
