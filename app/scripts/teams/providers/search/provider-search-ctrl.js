'use strict';
angular.module('emmiManager')

	.controller('ProviderSearchController', function($scope, $modal, $controller){
        $controller('TeamProviderCommon', {$scope: $scope});

        $scope.cancel = function () {
            $scope.$hide();
        };
      
        var newProviderModal = $modal({scope: $scope, template: 'partials/team/provider/new.html', animation: 'none', backdropAnimation: 'emmi-fade', show: false});

        $scope.createNewProvider = function () {
            $scope.hideProviderSearchModal();
        	newProviderModal.$promise.then(newProviderModal.show);
        };

        $scope.hideNewProviderModal = function () {
        	newProviderModal.$promise.then(newProviderModal.destroy);
        };
	})
;	