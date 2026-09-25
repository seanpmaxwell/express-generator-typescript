// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Wrap a module's top-level entry logic (scripts, playgrounds). The callback
 * runs immediately and may be async; await the result. If it throws or
 * rejects, the error is logged with `cbName` for context and then rethrown
 * so the process still exits non-zero.
 *
 * @param {() => void | Promise<void>} cb
 * @param {string} [cbName]
 * @returns {Promise<void>}
 */
async function onInit(cb, cbName) {
  if (cbName) {
    Object.defineProperty(cb, 'name', { value: cbName, configurable: true });
  }
  try {
    await cb();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`onInit function "${cbName}" failed:`, err);
    throw err;
  }
}

/**
 * Useful for temporarily disabling the callback (e.g. in playgrounds).
 *
 * @param {() => void | Promise<void>} _
 * @param {string} [__]
 * @returns {Promise<void>}
 */
onInit.skip = async function skip(_, __) {};

// ========================================================================= //
//                                   EXPORT                                  //
// ========================================================================= //

module.exports = onInit;
