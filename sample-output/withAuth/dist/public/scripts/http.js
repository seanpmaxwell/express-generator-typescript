var Http = (function () {
    // Setup request for json
    var getOptions = function (verb, data) {
        var options = {
            dataType: 'json',
            method: verb,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        return options;
    }
    // Set Http methods
    return {
        Get: function (path) {
            return fetch(path, getOptions('GET'))
        },
        Post: function (path, data) {
            return fetch(path, getOptions('POST', data));
        },
        Put: function (path, data) {
            return fetch(path, getOptions('PUT', data));
        },
        Delete: function (path) {
            return fetch(path, getOptions('DELETE'));
        }
    };
})();
