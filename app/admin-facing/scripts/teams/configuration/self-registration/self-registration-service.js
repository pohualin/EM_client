'use strict';

angular.module('emmiManager')
    .service('SelfRegistrationService', ['$http', function($http){
        return {
            getSelfRegCode : function () {
                //get for team.
            },
            saveSelfRegCode : function () {
                //verify duplicates //post
            }
        }
    }])
;
