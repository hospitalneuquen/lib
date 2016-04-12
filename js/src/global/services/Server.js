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
            data: options.minify ? Global.minify(data, true) : data,
            cache: options.cache,
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
            .error(function(response, status) {
                if (options.updateUI) {
                    Plex.loading.update(false, options.updateUI == "big");

                    switch (status) {
                        case 401:
                        case 403:
                            Session.login();
                            break;
                        case 400:
                            if (response && response.message)
                                Plex.alert(response.message, "warning", 0);
                            else
                                Plex.alert("No se pudo comunicar con la base de datos. Por favor intente la operación nuevamente...", "danger", 0);
                            break;
                        default:
                            Plex.alert("No se pudo comunicar con la base de datos. Por favor intente la operación nuevamente...", "danger", 0);
                    }
                }
                return response;
            })
            .then(function(response) {
                if (response && angular.isDefined(response.data))
                    return response.data;
                else return response;
            });
    };

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
    };
}]);
