'use strict';
(function (angular) {

  function NavSwipeCtrl($scope) {
    var _panes = $scope.panes = [];
    $scope.currentIndex = 0;
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
        $scope.direction = selectedIndex < $scope.currentIndex ? 'go-right' : 'go-left';

        angular.forEach(_panes, function (pane) {
          pane.selected = false;
        });

        pane.selected = true;
        $scope.currentIndex = selectedIndex;
      }
    };

    $scope.swipeLeft = function () {
      $scope.select($scope.currentIndex + 1)
    };

    $scope.swipeRight = function () {
      $scope.select($scope.currentIndex - 1);
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

        var _startX = 0, _offsetX = 0;
        var _containerWidth = element.find('.swipe-content-container')[0]
          .getBoundingClientRect().width;
        var _allPanesWidth = _containerWidth * (scope.panes.length - 1);

        var $swipeContentListEl = element.find('.swipe-content-list');

        scope.$watch('currentIndex', function (newValue, oldValue) {
          var width;
          if (newValue >= 0) {
            width = getSwipeContentWidth();

            if (newValue > oldValue) {
              width = -width;
            }
            _offsetX += width;
            performTranslateX(_offsetX, 1000);
          }
        });

        function getSwipeContentWidth() {
          var swipeContent = $swipeContentListEl.children()[0];
          return swipeContent.getBoundingClientRect().width;
        }

        function performTranslateX(offsetX, duration) {

          if (!angular.isDefined(duration)) {
            duration = 1;
          }
          $swipeContentListEl
            .velocity({ translateX: offsetX }, duration, "ease");
        }

        function swipeStart(coords) {
          if (!_startX) {
            _startX = coords.x;
          }
        }

        function swipeEnd(coords) {
          console.log('end ' + coords.x);
          _startX = 0;
          var swipeWidth = getSwipeContentWidth();
          var move = (scope.currentIndex) * swipeWidth;

          // todo: finish
        }

        function swipeMove(coords) {
          var delta = coords.x - _startX,
            numOfPanes = scope.panes.length;
          if (delta > 2 || delta < -2) {

            // check for left and right limits
            if ((_offsetX <= 0) &&

              _offsetX > -(_allPanesWidth)) {
              _startX = coords.x;
              _offsetX += delta;

              if (_offsetX > 0) {
                _offsetX = 0;
              } else if (_offsetX <= -(_allPanesWidth)) {
                _offsetX = -_allPanesWidth + 1;
              }
              performTranslateX(_offsetX, 10);
            }

          }
        }

        $swipe.bind($swipeContentListEl, {
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
