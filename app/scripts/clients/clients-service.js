'use strict';
angular.module('emmiManager')
    .service('Client', function ($http, $q, Session, UriTemplate, $location) {
        var selectedClient;
        var referenceData;
        return {
            find: function (query, status, sort, pageSize) {
                return $http.get(UriTemplate.create(Session.link.clients).stringify({
                        name: query,
                        status: status,
                        sort: sort && sort.property ? sort.property + ',' + (sort.ascending ? 'asc' : 'desc') : '',
                        size: pageSize
                    }
                )).then(function (response) {
                    return response.data;
                });
            },
            fetchPage: function (href) {
                return $http.get(href)
                    .then(function (response) {
                        return response.data;
                    });

            },
            insertClient: function (client) {
                return $http.post(UriTemplate.create(Session.link.clients).stringify(), client)
                    .success(function (response) {
                        // update the selected client with the response
                        angular.extend(selectedClient.entity, response.entity);
                        selectedClient.link = response.link;
                        return response;
                    });
            },
            updateClient: function (client) {
                return $http.put(UriTemplate.create(Session.link.clients).stringify(), client)
                    .success(function (response) {
                        angular.extend(client, response.entity);
                        return response;
                    });
            },
            deleteClient: function (id) {

            },
            viewClient: function (clientEntity) {
                $location.path('/clients/' + clientEntity.id + '/view');
            },
            viewClientList: function () {
                $location.path('/clients');
            },
            editClient: function (clientEntity) {
                $location.path('/clients/' + clientEntity.id + '/edit');
            },
            getClient: function () {
                return selectedClient;
            },
            setClient: function (clientResource) {
                selectedClient = clientResource;
            },
            newClient: function () {
                selectedClient = {
                    entity: {
                        'name': null,
                        'type': null,
                        'active': true,
                        'contractOwner': null,
                        'contractStart': null,
                        'contractEnd': null,
                        'region': null,
                        'salesForceAccount': null
                    }
                };
                return selectedClient;
            },
            selectClient: function (clientId) {
                return $http.get(UriTemplate.create(Session.link.clientById).stringify({id: clientId}))
                    .then(function (response) {
                        selectedClient = response.data;
                        return selectedClient;
                    });
            },
            getReferenceData: function () {
                var deferred = $q.defer();
                if (!referenceData) {
                    $http.get(Session.link.clientsReferenceData).then(function (response) {
                        referenceData = response.data;
                        deferred.resolve(referenceData);
                    });
                } else {
                    deferred.resolve(referenceData);
                }
                return deferred.promise;
            },
            getOwnersReferenceDataList: function (href) {
                return $http.get(UriTemplate.create(href).stringify({size: 100}))
                    .then(function (response) {
                        return response.data;
                    });
            },
            findSalesForceAccount: function (href, searchString) {
                return $http.get(UriTemplate.create(href).stringify({q: searchString}))
                    .then(function (response) {
                        return response.data;
                    });
            }
        };

    })
    .directive('cancelClick', ['$popover', 'Client', 'Location', '$timeout', '$translate', function ($popover, Client, Location, $timeout, $translate) {
        return {
            restrict: 'EA',
            scope: {
                'ok': '&onOk'
            },
            link: function (scope, element) {
                scope.cancel = function () {
                    scope.cancelWarning.hide();
                };
                element.on('click', function () {
                    if (Location.hasLocationModifications(Client.getClient())) {
                        // pop a warning dialog
                        if (!scope.cancelWarning) {
                            $translate('client_edit_page.cancel_dialog.title').then(function (title) {
                                scope.cancelWarning = $popover(element, {
                                    title: title,
                                    scope: scope,
                                    show: true,
                                    placement: 'top',
                                    contentTemplate: 'partials/client/cancel_popover.tpl.html'
                                });
                            });
                        }
                    } else {
                        $timeout(function () {
                            scope.ok();
                        });
                    }
                });
            }
        };
    }])

    .directive('saveClick', ['$popover', 'Client', '$timeout', '$translate', function ($popover, Client, $timeout, $translate) {
        return {
            restrict: 'EA',
            scope: {
                'okDeactivatePopover': '&onOk'
            },
            link: function (scope, element) {
                scope.cancelDeactivatePopover = function () {
                    scope.saveWarning.hide();
                };
                element.on('click', function () {
                    var clientResource = Client.getClient();
                    if (!clientResource.entity.active && clientResource.currentlyActive) {
                        // pop a warning dialog
                        if (!scope.saveWarning) {
                            $translate('client_edit_page.deactivate_dialog.title').then(function (title) {
                                scope.saveWarning = $popover(element, {
                                    title: title,
                                    scope: scope,
                                    show: true,
                                    placement: 'top',
                                    contentTemplate: 'partials/client/deactivate_popover.tpl.html'
                                });
                            });
                        }
                    } else {
                        $timeout(function () {
                            scope.okDeactivatePopover();
                        });
                    }
                });
            }
        };
    }])

    .factory('dateFunctions', function(){
        return {
            getDateDifference: function (fromDate, toDate) {
                return Date.parse(toDate) - Date.parse(fromDate);
            },
            isValidDate: function (dateStr) {
                return dateStr && !isNaN(Date.parse(dateStr));
            },
            isValidDateRange: function (fromDate, toDate, numDays) {
                if (fromDate === '' || toDate === '') {
                    return true;
                }
                if (this.isValidDate(fromDate) === false) {
                    return false;
                }
                if (this.isValidDate(toDate) === true) {
                    var days = this.getDateDifference(fromDate, toDate);
                    if (days < numDays) {
                        return false;
                    }
                }
                return true;
            }
        };
    })

    .filter('minusDays', ['moment', function (moment) {
        return function (value, days) {
            if (typeof value === 'undefined' || value === null) {
                return '';
            }
            var date = moment(value, 'YYYY-MM-DD').add(days, 'days');
            if (!date.isValid()) {
                return value;
            }
            return date.format('YYYY-MM-DD');
        };
    }])

    .directive('dateLowerThan', ['$filter', 'dateFunctions', function ($filter, df) {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                var validateDateRange = function (inputValue) {
                    var fromDate = $filter('date')(inputValue, 'short');
                    var toDate = $filter('date')(attrs.dateLowerThan, 'short');
                    var isValid = df.isValidDateRange(fromDate, toDate, attrs.numDays);
                    ctrl.$setValidity('dateLowerThan', isValid);
                    return inputValue;
                };

                ctrl.$parsers.unshift(validateDateRange);
                ctrl.$formatters.push(validateDateRange);
                attrs.$observe('dateLowerThan', function () {
                    validateDateRange(ctrl.$viewValue);
                });
            }
        };
    }])

    .directive('dateGreaterThan', ['$filter', 'dateFunctions', function ($filter, df) {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                var validateDateRange = function (inputValue) {
                    var fromDate = $filter('date')(attrs.dateGreaterThan, 'short');
                    var toDate = $filter('date')(inputValue, 'short');
                    var isValid = df.isValidDateRange(fromDate, toDate, attrs.numDays);
                    ctrl.$setValidity('dateGreaterThan', isValid);
                    return inputValue;
                };

                ctrl.$parsers.unshift(validateDateRange);
                ctrl.$formatters.push(validateDateRange);
                attrs.$observe('dateGreaterThan', function () {
                    validateDateRange(ctrl.$viewValue);
                });
            }
        };
    }])

;
