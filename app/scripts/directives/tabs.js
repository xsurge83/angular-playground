'use strict';

/**
 * @ngdoc directive
 * @name myAngularAppApp.directive:tabs
 * @description
 * # tabs
 */
angular.module('myAngularAppApp')
    .directive('myTabs', function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            controller: function($scope) {
                var panes = $scope.panes = [];
                    $scope.direction = 'go-right';
                $scope.select = function(pane) {

                    $scope.direction = $scope.direction === 'go-right' ? 'go-left' : 'go-right';
                    angular.forEach(panes, function(pane) {
                        pane.selected = false;
                    });
                    pane.selected = true;
                };

                this.addPane = function(pane) {
                    if (panes.length === 0) {
                        $scope.select(pane);
                    }
                    panes.push(pane);
                };
            },
            templateUrl: 'views/tabs/my-tabs.html'
        };
    })
    .directive('myPane', function() {
        return {
            require: '^myTabs',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {
                title: '@'
            },
            link: function(scope, element, attrs, tabsCtrl) {
                tabsCtrl.addPane(scope);
            },
            templateUrl: 'views/tabs/my-pane.html'
        };
    });

