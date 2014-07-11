emmiManager.factory('Api', ['$http', function ($http) {
    return {
        load: function () {
            return $http.get('webapi').then(function (response) {
                return response.data;
            });
        }
    }
}]);