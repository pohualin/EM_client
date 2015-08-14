'use strict';
angular.module('emmiManager')
.factory('RolesFactory', [function(){
    var rolesFactory = {};
    
    var _clientRoles = [];
    var _clientTeamRoles = [];

    rolesFactory.setClientRoles = function(clientRoles){
        _clientRoles = clientRoles;
    };
    
    rolesFactory.getClientRoles = function(){
        return _clientRoles;
    };
    
    rolesFactory.setClientTeamRoles = function(clientTeamRoles){
        _clientTeamRoles = clientTeamRoles;
    };
    
    rolesFactory.getClientTeamRoles = function(){
        return _clientTeamRoles;
    };
    
    return rolesFactory;
}]);