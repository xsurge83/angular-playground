'use strict';

/**
 * @ngdoc directive
 * @name myAngularAppApp.directive:tabs
 * @description
 * # tabs
 */
angular.module('myAngularApp.directives.tabs', [])
  .directive('myTabs', function ($swipe) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: function ($scope) {
        var _panes = $scope.panes = [],
          _currentIndex = 0;
        $scope.direction = 'go-right';

        /***
         *
         * @param {Object|number} pane
         */
        $scope.select = function (pane) {
          var selectedIndex;
          if (angular.isNumber(pane)) {
            pane = _panes[pane];
          }
          if (pane) {
            selectedIndex = _panes.indexOf(pane);
            $scope.direction = selectedIndex < _currentIndex ? 'go-right' : 'go-left';

            angular.forEach(_panes, function (pane) {
              pane.selected = false;
            });

            pane.selected = true;
            _currentIndex = selectedIndex;
          }
        };

        $scope.swipeLeft = function () {
          $scope.select(_currentIndex + 1)
        };

        $scope.swipeRight = function () {
          $scope.select(_currentIndex - 1);
        };

        this.addPane = function (pane) {
          if (_panes.length === 0) {
            $scope.select(pane);
          }
          _panes.push(pane);
        };
      },
      templateUrl: 'views/tabs/my-tabs.html'
    };
  })
  .directive('myPane', function () {
    return {
      require: '^myTabs',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        title: '@'
      },
      link: function (scope, element, attrs, tabsCtrl) {
        tabsCtrl.addPane(scope);
      },
      templateUrl: 'views/tabs/my-pane.html'
    };
  });

