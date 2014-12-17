'use strict';

describe('Main controller', function(){
  var scope;
  var $httpBackend;
  var $translate, $locale, tmhDynamicLocale;

  var api = {};
  api.messages = '/webapi/messages';
  angular.module('emmiManager.api', []).constant('API', api);

  beforeEach(module('emmiManager'));

  beforeEach(inject(function($rootScope, _$httpBackend_, _$translate_, _$locale_, _tmhDynamicLocale_) {
  	scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    // $translate = _$translate_;
    // $locale = _$locale_;
    // tmhDynamicLocale = _tmhDynamicLocale_;
  }));

  it('should define today\'s date', inject(function($controller) {
    expect(scope.today).toBeUndefined();

    $controller('MainCtrl', {
      $scope: scope
  	});

    expect(scope.today).toBeDefined();
  }));
});
