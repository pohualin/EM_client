'use strict';

describe('Client controllers', function(){
  var scope, ctrl, $httpBackend, Session;

  var api = {};
  api.messages = '/webapi/messages?lang=en';
  api.authenticate = '/webapi/authenticate';
  angular.module('emmiManager.api', []).constant('API', api);

  beforeEach(module('emmiManager'));

  beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _Session_) {
    Session = _Session_;
    Session.create(
      "super_admin",
      "System",
      "Administrator",
      null,
      ["PERM_GOD"],
      {
          clientById: "/web-rest/webapi/clients/{id}",
          clients: "/web-rest/webapi/clients{?page,size,sort,name,status}",
          clientsReferenceData: "/web-rest/webapi/clients/ref",
          locationReferenceData: "/web-rest/webapi/locations/ref",
          locations: "/web-rest/webapi/locations{?page,size,sort,name,status}",
          providers: "/web-rest/webapi/providers{?page,size,sort,name,status}",
          providersReferenceData: "/web-rest/webapi/providersReferenceData",
          refDataGroups: "/web-rest/webapi/referenceGroups{?page,size,sort}",
          self: "/web-rest/webapi/authenticated",
          teams: "/web-rest/webapi/teams{?page,size,sort,name,status}",
          teamsByClientId: "/web-rest/webapi/clients/{clientId}/teams",
          teamsReferenceData: "/web-rest/webapi/teams/ref"
      }
    );
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET(api.messages).respond({});
    $httpBackend.expectGET('/web-rest/webapi/clients/ref').
          respond(
            {
              "link" : [ {
                "rel" : "potentialOwners",
                "href" : "/web-rest/webapi/clients/ref/potentialOwners{?page,size,sort}"
              }, {
                "rel" : "findSalesForceAccount",
                "href" : "/web-rest/webapi/sf/find{?q}"
              }, {
                "rel" : "findByNormalizedName",
                "href" : "/web-rest/webapi/clients/ref/findByNormalizedName{?normalizedName}"
              }, {
                "rel" : "refDataGroups",
                "href" : "/web-rest/webapi/referenceGroups{?page,size,sort}"
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
    $httpBackend.expectGET('/web-rest/webapi/clients/ref/potentialOwners').
          respond(
            {
              "sort" : [ {
                "property" : "firstName",
                "direction" : "ASC"
              } ],
              "page" : {
                "size" : 100,
                "totalElements" : 2,
                "totalPages" : 1,
                "number" : 0
              },
              "link" : [ {
                "rel" : "self",
                "href" : "/web-rest/webapi/clients/ref/potentialOwners{?page,size,sort}"
              } ],
              "content" : [ {
                "link" : [ ],
                "id" : 3,
                "version" : 0,
                "login" : "contract_owner",
                "firstName" : "Contract",
                "lastName" : "Owner I",
                "email" : "contract_owner@emmis0lutions.com"
              }, {
                "link" : [ ],
                "id" : 4,
                "version" : 0,
                "login" : "contract_owner2",
                "firstName" : "Contract",
                "lastName" : "Owner II",
                "email" : "contract_owner2@emmis0lutions.com"
              } ]
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
