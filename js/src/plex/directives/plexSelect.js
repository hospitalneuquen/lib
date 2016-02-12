'use strict';

/**
 * @ngdoc directive
 * @module plex
 * @name plex-select
 * @description
 * Decora un input con una lista de selección. Requiere la directiva {@link module:plex.directive:plex}.
 *
 * Pueden utilizarse de dos maneras:
 *   - &lt;input type="hidden" ```plex="item.nombre for item in opciones"``` &gt;
 *   - &lt;input type="hidden" ```plex plex-select="item.nombre for item in opciones"``` &gt;
 * @param {boolean=} multiple Permite seleccionar múltiples items. *Por defecto: false*
 * @param {number=} timeout Indica el timeout para comenzar a buscar las opciones (muy útil cuando se utilizan promises). *Por defecto: 300*
 * @param {boolean=} allowClear Indica el timeout para comenzar a buscar las opciones (muy útil cuando se utilizan promises). *Por defecto: 300*
 * @param {min=} min Indica la cantidad mínima de caracteres para comenzar a buscar. *Por defecto: 0*
 * @example
    <example module="app" deps="" animate="false">
      <file name="index.html">
        <div ng-controller="ExampleController">
            <label>Ingrese un valor texto de menos de tres caracteres para mostrar el error</label><br/>
            <input type="text" ng-model="modelo" plex="item.nombre for item in opciones" />
            <pre ng-show="modelo">{{modelo | json}}</pre>
        </div>
      </file>
      <file name="main.js">
        angular.module('app').controller('ExampleController', function($scope){
            $scope.opciones = [
                {id: 1, nombre: "Argentina"},
                {id: 2, nombre: "Brasil"},
                {id: 3, nombre: "Chile"},
            ]
        });
      </file>
    </example>
 **/
angular.module('plex').directive('plexSelect', ['$timeout', '$parse', '$q', 'Global', function ($timeout, $parse, $q, Global) {
    return {
        require: 'ngModel',
        compile: function (element, attrs) {
            var watch,
              repeatOption,
              repeatAttr,
              isSelect = false,
              isMultiple = (attrs.multiple !== undefined),
              timeout = attrs.timeout || 300;

            // Parse input expression. Eg: (item.documento + ' | ' + item.apellido + ', ' + item.nombre) for item in buscarPorDocumento($value)
            var inputExpression = attrs.plexSelect;
            var match = inputExpression.match(/^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/);
            if (!match) {
                throw new Error("Expected specification in form of '_modelValue_ (as _label_)? for _item_ in _collection_' but got '" + inputExpression + "'.");
            }
            var itemName = match[3];
            var source = $parse(match[4]);
            var viewMapper = $parse(match[2] || match[1]);
            var modelMapper = $parse(match[1]);
            var timer;

            return function (scope, element, attrs, controller) {
                // Init Select2
                var allowClear = scope.$eval(attrs.allowClear);
                $timeout(function () {
                    element.select2({
                        minimumInputLength: attrs.min || null,
                        allowClear: allowClear,
                        placeholder: allowClear ? " " : null,
                        multiple: isMultiple,
                        query: function (query) {
                            if (timer) {
                                $timeout.cancel(timer);
                                timer = null;
                            }
                            timer = $timeout(function () {
                                var locals = { $value: query.term };
                                $q.when(source(scope, locals)).then(function (matches) {
                                    // Si "$value" no está definido en inputExpression, asume que 'matches' equivale a todos los valores sin filtrar (i.e. filtramos acá)
                                    if (matches && query.term && inputExpression.indexOf("$value") < 0) {
                                        matches = matches.filter(function (i) {
                                            var locals = {};
                                            locals[itemName] = i;
                                            return Global.matchText(viewMapper(scope, locals), query.term);
                                        })
                                    }
                                    query.callback({ results: matches })
                                    timer = null;
                                });
                            }, ((query && query.term) ? timeout : 0));
                        },
                        initSelection: function (element, callback) {
                            element.select2('data', controller.$modelValue) // Setea valor inicial
                            callback(controller.$modelValue);
                        },
                        formatResult: function (result, container, query, escapeMarkup) {
                            if (result) {
                                var locals = {};
                                locals[itemName] = result;
                                var label = viewMapper(scope, locals);
                                if (query && query.term) {
                                    var markup = [];
                                    Select2.util.markMatch(label, query.term, markup, escapeMarkup);
                                    return markup.join('');
                                } else
                                    return label;
                            }
                            else
                                return null;
                        },
                        formatSelection: function (item) {
                            return this.formatResult(item);
                        }
                    });

                    // Datos iniciales
                    element.select2('data', controller.$modelValue);

                    // Eventos
                    element.on("select2-close", function () {
                        // Corrige un bug con el focus
                        $timeout(function () {
                            element.select2("focus");
                        });
                    });
                });

                // Watch the model for programmatic changes
                scope.$watch(attrs.ngModel, function (current, old) {
                    //console.log("cambio valor: " + JSON.stringify(current));
                    element.select2('data', controller.$modelValue);
                }, true);

                // If changed from UI ...
                element.off('change'); // Remove default angular.js handlers for input[hidden]
                element.on('change', function () {
                    var current = element.select2('data');
                    scope.$apply(function () {
                        controller.$setViewValue(current);
                    });
                });

                // Update valid and dirty statuses
                controller.$parsers.push(function (value) {
                    element.prev().toggleClass('ng-invalid', !controller.$valid)
                                  .toggleClass('ng-valid', controller.$valid)
                                  .toggleClass('ng-invalid-required', !controller.$valid)
                                  .toggleClass('ng-valid-required', controller.$valid)
                                  .toggleClass('ng-dirty', controller.$dirty)
                                  .toggleClass('ng-pristine', controller.$pristine);
                    return value;
                });

                // Observe property changes
                attrs.$observe('disabled', function (value) { element.select2('enable', !value); });
                attrs.$observe('readonly', function (value) { element.select2('readonly', !!value); });

                // On destroy
                element.on("$destroy", function () { element.select2("destroy"); });
            };
        }
    };
}]);
