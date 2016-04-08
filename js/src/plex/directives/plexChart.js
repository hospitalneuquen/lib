angular.module('plex').directive('plexChart', ['Global', function (Global) {
    return {
        restrict: 'EAC',
        replace: true,
        template: '<div></div>',
        scope: {
            config: '=',
            updateWhen: '='
        },
        link: function (scope, element, attrs) {
            Global.loadScript('/lib-md/js/dist/highcharts.js').then(function(){
                var chart;
                var seriesId = 0;
                var ensureIds = function (series) {
                    series.forEach(function (s) {
                        if (!angular.isDefined(s.id)) {
                            s.id = "series-" + seriesId++;
                        }
                    });
                };

                var updateZoom = function (axis, modelAxis) {
                    var extremes = axis.getExtremes();
                    if (modelAxis.currentMin !== extremes.dataMin || modelAxis.currentMax !== extremes.dataMax) {
                        axis.setExtremes(modelAxis.currentMin, modelAxis.currentMax, false);
                    }
                };

                var processExtremes = function (chart, axis) {
                    if (axis.currentMin || axis.currentMax) {
                        chart.xAxis[0].setExtremes(axis.currentMin, axis.currentMax, true);
                    }
                };

                var processSeries = function (chart, series) {
                    var ids = [];
                    if (series) {
                        ensureIds(series);

                        //Find series to add or update
                        series.forEach(function (s) {
                            ids.push(s.id);
                            var chartSeries = chart.get(s.id);
                            if (chartSeries) {
                                chartSeries.update(angular.copy(s), false);
                            } else {
                                chart.addSeries(angular.copy(s), false);
                            }
                        });
                    }

                    //Now remove any missing series
                    for (var i = chart.series.length - 1; i >= 0; i--) {
                        var s = chart.series[i];
                        if (ids.indexOf(s.options.id) < 0) {
                            s.remove(false);
                        }
                    }
                };

                // Init
                Highcharts.setOptions({
                    global: {
                        useUTC: false
                    }
                });

                var initialiseChart = function (scope, element, config) {
                    config = angular.merge({
                        chart: {
                            events: {},
                            renderTo: element[0]
                        },
                        title: {
                            text: ''
                        },
                        subtitle: {},
                        series: [],
                        credits: {
                            enabled: false
                        },
                        plotOptions: {},
                        navigator: { enabled: false }
                    }, config);

                    var chart = new Highcharts.Chart(config);
                    if (config.xAxis) {
                        processExtremes(chart, config.xAxis);
                    }
                    processSeries(chart, config.series);
                    chart.redraw();
                    return chart;
                };

                // Watches
                scope.$watch("updateWhen", function (current, old) {
                    if (current == old && chart)
                        return;

                    if (chart)
                        chart.destroy();
                    chart = initialiseChart(scope, element, scope.config);
                });
            });
        }
    };
}]);
