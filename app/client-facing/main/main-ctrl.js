'use strict';

angular.module('emmiManager')
    .controller('MainCtrl', ['$scope', '$translate', '$locale', 'tmhDynamicLocale', 'account',
        function ($scope, $translate, $locale, tmhDynamicLocale, account) {
        $scope.today = new Date();
        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
            tmhDynamicLocale.set(langKey);
        };

        if (account && account.clientResource) {
            $scope.page.setTitle(account.clientResource.entity.name + ' Home');
			angular.extend($scope.account, account);
        }
    }])
;
