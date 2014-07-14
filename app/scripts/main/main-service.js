emmiManager.factory('Api', ['$http', function ($http) {
    return {
        load: function () {
            return $http.get('webapi', {cache: true}).then(function (response) {
                return response.data;
            });
        }
    }
}]);