// ========================================================================= //
//                                 FUNCTIONS                                 //
// ========================================================================= //

/**
 * Wrap a module's top-level entry logic (scripts, playgrounds). The callback
 * runs immediately and may be async; await the result. If it throws or
 * rejects, the error is logged with `cbName` for context and then rethrown
 * so the process still exits non-zero.
 */
async function onInit(
  cb: () => void | Promise<void>,
  cbName?: string,
): Promise<void> {
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

// Useful for temporarily disabling the callback (e.g. in playgrounds)
onInit.skip = async function skip(
  _: () => void | Promise<void>,
  __?: string,
): Promise<void> {};

// ========================================================================= //
//                                  EXPORT                                   //
// ========================================================================= //

export default onInit;
