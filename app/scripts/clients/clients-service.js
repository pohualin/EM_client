'use strict';

/* Services */

angular.module('emClientServices', ['restangular'])
    .service('Client', ['Restangular', function (Restangular) {

        var clientService = Restangular.all('clients');
        var clientsDemo = [
            {
                id: 1,
                active: 1,
                name: 'Demo hospital client 1',
                type: 'Hospital',
                region: 'Midwest',
                tier: 'Level 1',
                owner: 'Evan',
                start: '2014-5-16',
                end: '2015-5-16',
                salesforce: {
                    id: 10,
                    name: 'Salesforce Account name'
                },
                teams: [
                    { name: 'Team 1' },
                    { name: 'Team 2' }
                ]
            },
            {
                id: 2,
                active: 1,
                name: 'Demo provider client 2',
                type: 'Provider',
                region: 'Midwest',
                tier: 'Level 2',
                owner: 'Kevin',
                start: '2014-4-26',
                end: '2015-4-26',
                salesforce: {
                    id: 8,
                    name: 'Another Salesforce Account name'
                },
                teams: [
                    { name: 'Team 1' },
                    { name: 'Team 2' }
                ]
            }
        ];
        return {
            getClients: function () {
                console.log(clientService.getList());
                return clientsDemo;
            },
            insertClient: function (name, type, region) {
                var topID = clientsDemo.length + 1;
                clientsDemo.push({
                    id: topID,
                    name: name,
                    type: type,
                    region: region
                });
            },
            deleteClient: function (id) {
                for (var i = clientsDemo.length - 1; i >= 0; i--) {
                    if (clientsDemo[i].id === id) {
                        clientsDemo.splice(i, 1);
                        break;
                    }
                }
            },
            getClient: function (id) {
                for (var i = 0; i < clientsDemo.length; i++) {
                    if (clientsDemo[i].id === id) {
                        return clientsDemo[i];
                    }
                }
                return null;
            }
        };

    }])
;
