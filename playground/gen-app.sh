#!/usr/bin/env bash
set -uo pipefail

# ========================================================================= //
#                                 CONSTANTS                                 //
# ========================================================================= //

PLAYGROUND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$PLAYGROUND_DIR/my-app.tmp"

FAILED=()

# ========================================================================= //
#                                 FUNCTIONS                                 //
# ========================================================================= //

# Delete any leftover *.tmp folders from previous runs of this script.
clean_tmp_folders() {
  find "$PLAYGROUND_DIR" -maxdepth 1 -type d -name '*.tmp' -print -exec rm -rf {} +
}

# Run a command inside $APP_DIR and record failures without stopping the
# remaining checks. First arg is a label for reporting; the rest is the
# command to run.
run_check() {
  local label="$1"
  shift
  echo
  echo "--- $label ($*) ---"
  if (cd "$APP_DIR" && "$@"); then
    echo "--- $label: OK ---"
  else
    echo "--- $label: FAILED ---"
    FAILED+=("$label")
  fi
}

# ========================================================================= //
#                                   EXEC                                    //
# ========================================================================= //

echo "==> Clearing express-generator-typescript from the npx cache"
npx clear-npx-cache;

echo "==> Removing stale *.tmp folders in $PLAYGROUND_DIR"
clean_tmp_folders

echo "==> Generating a fresh app with the latest express-generator-typescript"
npx --yes express-generator-typescript@latest "$APP_DIR" || {
  echo "Generation failed." >&2
  exit 1
}

echo "==> Running checks in $APP_DIR"
run_check lint npm run lint
run_check test env VITE_CONFIG_NATIVE_IGNORE_WARNING=true npx vitest run
run_check build npm run build

# ================================== Report ================================= #

echo
if [ "${#FAILED[@]}" -eq 0 ]; then
  echo "All checks passed."
  exit 0
else
  echo "Checks failed: ${FAILED[*]}"
  exit 1
fi
