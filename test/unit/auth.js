'use strict';

describe('Auth controllers', function(){
  var scope;
  var ctrl;
  var $httpBackend;
  var AuthSharedService;

  var api = {};
  api.messages = '/webapi/messages';
  api.authenticate = '/webapi/authenticate';
  angular.module('emmiManager.api', []).constant('API', api);

  beforeEach(module('emmiManager'));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _AuthSharedService_) {
  	scope = $rootScope.$new();
    ctrl = $controller('LoginCtrl', { $scope: scope });
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('phones/phones.json').
          respond([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);
    AuthSharedService = _AuthSharedService_;
  }));

  it('should define credentials', inject(function() {
    expect(scope.credentials).toBeDefined();
  }));

  it('should login', inject(function() {
    scope.login(scope.credentials);
    //expect(scope.authenticated).toBe(true);
    //console.log(scope);
    //$httpBackend.flush();
  }));

});
