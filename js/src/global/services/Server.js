
'use strict';

angular.module('global').factory('Server', ["Plex", "$http", "$window", "Global", "Session", function(Plex, $http, $window, Global, Session) {
    // Private methods
    var request = function(method, url, data, options) {
        // Opciones por default
        options = angular.extend({
            minify: false,
            updateUI: "small"
        }, options);

        // Prepara request
        var req = {
            method: method,
            url: url,
            data: options.minify ? Global.minify(data) : data,
            cache : options.cache,
            params: options.params,
        };

        // Actualiza UI
        if (options.updateUI)
            Plex.loading.update(true, options.updateUI == "big");

        // Envía el request
        return $http(Session.authRequest(req))
            .success(function(response) {
                if (options.updateUI) {
                    Plex.loading.update(false, options.updateUI == "big");
                }
                return response;
            })
            .error(function(response) {
                if (options.updateUI) {
                    if (response && response.statusCode)
                        switch (response.statusCode) {
                            case 401:
                            case 403:
                                Session.login();
                                break;
                                //    case 405:
                                //        if (response.response && response.response.data && response.response.data.responseStatus && response.response.data.responseStatus.message)
                                //            Plex.showWarning(response.response.data.responseStatus.message);
                                //        else
                                //            Plex.showError();
                                //        break;
                            default:
                                Plex.showError();
                        }
                    else
                        Plex.showError();
                    Plex.loading.update(false, options.updateUI == "big");
                }
                return response;
            })
            .then(function(response) {
                if (response && angular.isDefined(response.data))
                    return response.data;
                else return response;
            })
    }

    // Public methods
    return {
        get: function(url, options) {
            return request("GET", url, null, options);
        },
        post: function(url, data, options) {
            return request("POST", url, data, options);
        },
        put: function(url, data, options) {
            return request("PUT", url, data, options);
        },
        patch: function(url, data, options) {
            return request("PATCH", url, data, options);
        },
        delete: function(url, data, options) {
            return request("DELETE", url, data, options);
        }
    }
}]);
