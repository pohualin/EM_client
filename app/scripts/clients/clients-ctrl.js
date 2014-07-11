'use strict';

emmiManager.controller('ClientCtrl', function ($scope, $location, Client, Session) {
    //$scope.phones = Phone.query();
    //$scope.orderProp = 'age';

    $scope.insertClient = function () {
        var name = $scope.newClient.name;
        var type = $scope.newClient.type;
        var region = $scope.newClient.region;
        Client.insertClient(Session.createClient.href, name, type, region);
        $scope.newClient.name = '';
        $scope.newClient.type = '';
        $scope.newClient.region = '';
        $location.path('/clients');
    };

});

emmiManager.controller('ClientListCtrl', function ($scope, Client, $http, Session) {

    var fetchPage = function (href) {
        Client.getClients(href).then(function (clientPage) {
            $scope.clients = clientPage.client;
            $scope.total = clientPage.totalNumber;
            $scope.links = clientPage['navigation-link'];
            $scope.load = clientPage['load-link'];
            $scope.currentPage = clientPage.currentPage;
            $scope.currentPageSize = clientPage.pageSize;
            $scope.fetchedLink = null;
            $scope.pageSizes = [10, 25, 50, 100];
        });
    };

    $scope.fetchLink = function (href) {
        $http.get(href)
            .then(function (data) {
                $scope.fetchedLink = JSON.stringify(data.data);
            });
    };

    $scope.fetchPage = function (href) {
        fetchPage(href);
    };

    $scope.changePageSize = function (loadLink, pageSize) {
        var urlToLoad;
        if (loadLink.templated) {
            urlToLoad = new rfc6570.UriTemplate(loadLink.href).stringify({max: pageSize});
        } else {
            urlToLoad = loadLink.href;
        }
        if (urlToLoad) {
            fetchPage(urlToLoad);
        }
    };

    fetchPage(new rfc6570.UriTemplate(Session.listClients.href).stringify({max: 50}));

});

emmiManager.controller('ClientDetailCtrl', function ($scope, $routeParams, Client) {
    // $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
    //   $scope.mainImageUrl = phone.images[0];
    // });

    // $scope.setImage = function(imageUrl) {
    //   $scope.mainImageUrl = imageUrl;
    // }
});
