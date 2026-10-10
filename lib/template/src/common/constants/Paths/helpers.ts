// ========================================================================= //
//                                   TYPES                                   //
// ========================================================================= //

type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * `ep` stands for "Endpoint"
 */
export function ep<V extends HttpVerb>(base: string, path: string, verb: V) {
  const template = `${base}${path}`;
  return {
    PATH: path,
    FULL_PATH: template,
    VERB: verb,
    DISPLAY: `<${verb}>${template}`,
  } as const;
}

/**
 * `pp` stands for path params
 */
export function pp(param: string | number | boolean): string {
  return encodeURIComponent(param);
}
