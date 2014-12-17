'use strict';

angular.module('emmiManager')

    .controller('TeamsFilterCommon', function ($scope,$location) {
        var searchObject = $location.search();
        if (searchObject && searchObject.q) {
           var query = searchObject.q;
            var status = searchObject.status;
        }
    });
