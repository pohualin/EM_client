'use strict';

describe('Client controllers', function(){
  var scope, ctrl, $httpBackend;

  var api = {};
  api.messages = '/webapi/messages';
  api.authenticate = '/webapi/authenticate';
  angular.module('emmiManager.api', []).constant('API', api);

  beforeEach(module('emmiManager'));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/web-rest/webapi/clients/ref').
          respond(
            {
              "link" : [ {
                "rel" : "potentialOwners",
                "href" : "https://dev6.emmisolutions.com/web-rest/webapi/clients/ref/potentialOwners{?page,size,sort}"
              }, {
                "rel" : "findSalesForceAccount",
                "href" : "https://dev6.emmisolutions.com/web-rest/webapi/sf/find{?q}"
              }, {
                "rel" : "findByNormalizedName",
                "href" : "https://dev6.emmisolutions.com/web-rest/webapi/clients/ref/findByNormalizedName{?normalizedName}"
              }, {
                "rel" : "refDataGroups",
                "href" : "https://dev6.emmisolutions.com/web-rest/webapi/referenceGroups{?page,size,sort}"
              } ],
              "clientType" : [ {
                "id" : 1,
                "typeKey" : "PROVIDER"
              }, {
                "id" : 2,
                "typeKey" : "PHYSICIAN_PRACTICE"
              }, {
                "id" : 3,
                "typeKey" : "PAYER"
              }, {
                "id" : 4,
                "typeKey" : "PHARMA"
              }, {
                "id" : 5,
                "typeKey" : "OTHER"
              } ],
              "clientRegion" : [ {
                "id" : 1,
                "typeKey" : "OTHER"
              }, {
                "id" : 2,
                "typeKey" : "SOUTHEAST"
              }, {
                "id" : 3,
                "typeKey" : "NORTHEAST"
              }, {
                "id" : 4,
                "typeKey" : "MIDWEST"
              }, {
                "id" : 5,
                "typeKey" : "WEST"
              } ],
              "clientTier" : [ {
                "id" : 1,
                "typeKey" : "ONE"
              }, {
                "id" : 2,
                "typeKey" : "TWO"
              }, {
                "id" : 3,
                "typeKey" : "THREE"
              }, {
                "id" : 4,
                "typeKey" : "FOUR"
              } ],
              "statusFilter" : [ "ALL", "ACTIVE_ONLY", "INACTIVE_ONLY" ]
            }
          );
    scope = $rootScope.$new();
    ctrl = $controller('ViewEditCommon', { $scope: scope });
  }));

  it('should fetch client data from the api', inject(function() {
    $httpBackend.flush();
    expect(scope.clientTypes).toBeDefined();
    expect(scope.clientRegions).toBeDefined();
    expect(scope.clientTiers).toBeDefined();
    expect(scope.findSalesForceAccountLink).toBeDefined();
    expect(scope.findNormalizedNameLink).toBeDefined();
  }));

});
