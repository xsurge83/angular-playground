'use strict';
(function (angular) {

  function NavSwipeCtrl($scope) {
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
  }

  function navSwipeDirective($swipe) {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: 'NavSwipeCtrl',
      link: function (scope, element) {

        var startX = 0, offsetX = 0;
        var $swipeContentUl = element.find('.swipe-content-list');

        function swipeStart(coords) {
          if (!startX) {
            startX = coords.x;
          }
        }

        function swipeEnd(coords) {
          console.log('end ' + coords.x);
          startX = 0;
          // todo: finish
        }

        function swipeMove(coords) {
          var delta = coords.x - startX;
          if (delta > 2 || delta < -2) {
            startX = coords.x;
            offsetX += delta;
            console.log('delta ' + delta);

            $swipeContentUl
              .velocity(
              { translateX: offsetX},
              10,
              "ease"
            );
          }

        }

        $swipe.bind($swipeContentUl, {
          start: swipeStart,
          move: swipeMove,
          end: swipeEnd,
          cancel: function (event) {
            swipeEnd({}, event);
          }
        });

      },
      templateUrl: '../../../views/navSwipe/nav-swipe.html'
    };
  }

  function swipeContentDirective() {
    return {
      require: '^navSwipe',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        title: '@'
      },
      link: function (scope, element, attrs, navSwipeCtrl) {
        navSwipeCtrl.addPane(scope);
      },
      templateUrl: '../../../views/navSwipe/swipe-content.html'
    };
  }

  /**
   * @ngdoc directive
   * @name myAngularAppApp.directives.navSwipe
   * @description
   *
   */
  angular.module('myAngularApp.directives.navSwipe', [])

    .controller('NavSwipeCtrl', ['$scope', NavSwipeCtrl])

    .directive('navSwipe', ['$swipe', navSwipeDirective])

    .directive('swipeContent', swipeContentDirective);

})(angular);
