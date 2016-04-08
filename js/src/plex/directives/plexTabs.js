/**
 * @ngdoc directive
 * @module plex
 * @name plex-tabs
 * @description
 * To-do
 **/
angular.module('plex').directive("plexTabs", [function() {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function(scope, element, attrs, controller) {
            var lis = element.find("> UL > LI");
            var divs = element.find("> DIV");

            // Functions
            var activate = function(index) {
                try {
                    lis.removeClass('active');
                    divs.css('display', 'none');
                    angular.element(lis[index]).addClass('active');
                    angular.element(divs[index]).css('display', 'block');
                } catch (e) {}
            };

            // Prepare LIs
            element.find("> UL").addClass("nav nav-tabs");
            lis.on("click", function() {
                var $this = angular.element(this);
                activate($this.index());

                // Bind
                scope.$apply(function() {
                    controller.$setViewValue($this.index());
                });
            });

            // Prepare DIVs
            divs.css('display', 'none');

            // Watch changes
            scope.$watch(function() {
                return controller.$modelValue;
            }, function(current) {
                activate(current);
            });
        }
    };
}]);
