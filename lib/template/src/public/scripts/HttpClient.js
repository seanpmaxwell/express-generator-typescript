// ========================================================================= //
//                                   TYPES                                   //
// ========================================================================= //

/**
 * Thin wrapper around `fetch` for calling the JSON API. Each method sends and
 * accepts JSON and resolves with the raw `Response`.
 *
 * @typedef {object} HttpClient
 * @property {(path: string) => Promise<Response>} get
 * @property {(path: string, data: unknown) => Promise<Response>} post - `data`
 *   is sent as the JSON request body.
 * @property {(path: string, data: unknown) => Promise<Response>} put - `data`
 *   is sent as the JSON request body.
 * @property {(path: string) => Promise<Response>} delete
 */

// ========================================================================= //
//                                   EXEC                                    //
// ========================================================================= //

/** @type {HttpClient} */
var HttpClient = (() => {
  /**
   * Build `fetch` options for a JSON request.
   *
   * Used by:
   *   {@link HttpClient.get}
   *   {@link HttpClient.post}
   *   {@link HttpClient.put}
   *   {@link HttpClient.delete}
   *
   * @param {string} verb - HTTP method, e.g. "GET".
   * @param {unknown} [data] - Request body; serialized to JSON when present.
   * @returns {RequestInit}
   */
  var getOptions = (verb, data) => {
    var options = {
      dataType: 'json',
      method: verb,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    if (!!data) {
      options.body = JSON.stringify(data);
    }
    return options;
  };

  // Set HttpClient methods
  return {
    get: (path) => fetch(path, getOptions('GET')),
    post: (path, data) => fetch(path, getOptions('POST', data)),
    put: (path, data) => fetch(path, getOptions('PUT', data)),
    delete: (path) => fetch(path, getOptions('DELETE')),
  };
})();
