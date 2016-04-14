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
angular.module('plex').directive('plexSelect', ['$timeout', '$parse', '$q', 'Global', function($timeout, $parse, $q, Global) {
    return {
        require: 'ngModel',
        compile: function(element, attrs) {
            var isMultiple = (attrs.multiple !== undefined),
                timeout = attrs.timeout || 300;

            // Aplica CSS
            //element.addClass("form-control");
            element.css('width', '100%');

            var inputExpression = attrs.plexSelect;
            var match;
            var itemName;
            var source;
            var viewMapper;
            var isPromise;
            var hasOptions;
            var timer;
            var select2;

            if (inputExpression) {
                // Parse input expression. Eg: (item.documento + ' | ' + item.apellido + ', ' + item.nombre) for item in buscarPorDocumento($value)
                match = inputExpression.match(/^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/);
                if (!match)
                    throw new Error("Expected specification in form of '_modelValue_ (as _label_)? for _item_ in _collection_' but got '" + inputExpression + "'.");

                itemName = match[3];
                source = $parse(match[4]);
                viewMapper = $parse(match[2] || match[1]);
                isPromise = inputExpression.indexOf("$value") > 0;
                hasOptions = false;
            } else {
                hasOptions = true;
            }

            return function(scope, element, attrs, controller) {
                var allowClear = scope.$eval(attrs.allowClear);
                var minimumLength = Number(attrs.min || 0);
                $timeout(function() {
                    element.select2({
                        theme: "bootstrap",
                        allowClear: allowClear,
                        placeholder: allowClear ? " " : null,
                        multiple: isMultiple,
                        dataAdapter: function($element, options) {
                            return {
                                current: function(callback) {
                                    if (!controller.$modelValue)
                                        callback([]);
                                    else {
                                        var result = angular.isArray(controller.$modelValue) ? controller.$modelValue : [controller.$modelValue];
                                        if (hasOptions) {
                                            var $options = element.find('option');
                                            callback(result.map(function(value) {
                                                // Find option by value
                                                for (var i = 0; i < $options.length; i++) {
                                                    var $option = angular.element($options[i]);
                                                    if ($option.val() == value)
                                                        return {
                                                            id: $option.val(),
                                                            text: $option.text()
                                                        };
                                                }
                                            }));
                                        } else {
                                            callback(result.map(function(i) {
                                                var locals = {};
                                                locals[itemName] = i;
                                                return {
                                                    id: i.id,
                                                    text: viewMapper(scope, locals),
                                                };
                                            }));
                                        }
                                    }
                                },
                                select: function(item) {
                                    var newValue;
                                    if (isMultiple) {
                                        if (angular.isArray(controller.$modelValue)) {
                                            newValue = controller.$modelValue;
                                            newValue.push(hasOptions ? item.id : item.dataItem);
                                        } else {
                                            newValue = [hasOptions ? item.id : item.dataItem];
                                        }
                                    } else {
                                        newValue = hasOptions ? item.id : item.dataItem;
                                    }
                                    scope.$apply(function() {
                                        controller.$setViewValue(newValue);
                                    });
                                    $element.trigger('change');
                                },
                                unselect: function(data) {
                                    if (isMultiple) {
                                        if (angular.isArray(controller.$modelValue)) {
                                            controller.$modelValue.splice(controller.$modelValue.indexOf(data), 1);
                                            data = controller.$modelValue;
                                        } else {
                                            data = null;
                                        }
                                    } else {
                                        data = null;
                                    }
                                    scope.$apply(function() {
                                        controller.$setViewValue(data);
                                    });
                                    $element.trigger('change');
                                },
                                bind: function(container, $container) {
                                    var self = this;
                                    select2 = container;
                                    container.on('select', function(params) {
                                        self.select(params.data);
                                    });
                                    container.on('unselect', function(params) {
                                        self.unselect(params.data);
                                    });
                                },
                                destroy: function() {},
                                query: function(params, callback) {
                                    if (minimumLength > 0 && (!params || !params.term || params.term.length < minimumLength)) {
                                        select2.trigger('results:message', {
                                            message: 'inputTooShort',
                                            args: {
                                                minimum: minimumLength,
                                                input: params.term || '',
                                                params: params
                                            }
                                        });
                                        return;
                                    }

                                    if (isPromise) {
                                        if (timer) {
                                            $timeout.cancel(timer);
                                            timer = null;
                                        }
                                        timer = $timeout(function() {
                                            var locals = {
                                                $value: params.term
                                            };
                                            $q.when(source(scope, locals)).then(function(matches) {
                                                callback({
                                                    results: matches.map(function(i) {
                                                        var locals = {};
                                                        locals[itemName] = i;
                                                        return {
                                                            id: i.id,
                                                            text: viewMapper(scope, locals),
                                                            dataItem: i,
                                                        };
                                                    })
                                                });
                                                timer = null;
                                            });
                                        }, ((params && params.term) ? timeout : 0));
                                    } else {
                                        var matches;
                                        if (hasOptions) {
                                            matches = [];
                                            var $options = element.find('option');
                                            $options.each(function() {
                                                var $option = angular.element(this);
                                                if ($option.val() != '? undefined:undefined ?' && (!(params && params.term) || Global.matchText($option.text(), params.term))) {
                                                    matches.push({
                                                        id: $option.val(),
                                                        text: $option.text(),
                                                        dataItem: {
                                                            value: $option.val(),
                                                            text: $option.text()
                                                        }
                                                    });
                                                }
                                            });
                                            callback({
                                                results: matches
                                            });
                                        } else {
                                            matches = source(scope, {});
                                            if (params && params.term)
                                                matches = matches.filter(function(i) {
                                                    var locals = {};
                                                    locals[itemName] = i;
                                                    return Global.matchText(viewMapper(scope, locals), params.term);
                                                });
                                            callback({
                                                results: matches.map(function(i) {
                                                    var locals = {};
                                                    locals[itemName] = i;
                                                    return {
                                                        id: i.id,
                                                        text: viewMapper(scope, locals),
                                                        dataItem: i,
                                                    };
                                                })
                                            });
                                        }
                                    }
                                },
                                listeners: {},
                                on: function(event, callback) {
                                    this.listeners = this.listeners || {};

                                    if (event in this.listeners) {
                                        this.listeners[event].push(callback);
                                    } else {
                                        this.listeners[event] = [callback];
                                    }
                                },
                                trigger: function(event) {
                                    var slice = Array.prototype.slice;

                                    this.listeners = this.listeners || {};

                                    if (event in this.listeners) {
                                        this.invoke(this.listeners[event], slice.call(arguments, 1));
                                    }

                                    if ('*' in this.listeners) {
                                        this.invoke(this.listeners['*'], arguments);
                                    }
                                },
                                invoke: function(listeners, params) {
                                    for (var i = 0, len = listeners.length; i < len; i++) {
                                        listeners[i].apply(this, params);
                                    }
                                }
                            };
                        }
                    });
                });

                // Update valid and dirty statuses
                controller.$parsers.push(function(value) {
                    element.prev().toggleClass('ng-invalid', !controller.$valid)
                        .toggleClass('ng-valid', controller.$valid)
                        .toggleClass('ng-invalid-required', !controller.$valid)
                        .toggleClass('ng-valid-required', controller.$valid)
                        .toggleClass('ng-dirty', controller.$dirty)
                        .toggleClass('ng-pristine', controller.$pristine);
                    return value;
                });

                // Observe property changes
                attrs.$observe('disabled', function(value) {
                    element.select2('enable', !value);
                });
                attrs.$observe('readonly', function(value) {
                    element.select2('readonly', !!value);
                });

                // Events
                element.off('change'); // Remove default angular.js handler
                element.on("$destroy", function() {
                    try {
                        if (element.data('select2'))
                            element.select2("destroy");
                    } catch (e) {}
                });
                scope.$watch(attrs.ngModel, function() {
                    element.trigger('change');
                }, true);
            };
        }
    };
}]);
