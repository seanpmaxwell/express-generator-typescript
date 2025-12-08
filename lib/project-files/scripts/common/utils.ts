import fs from 'fs-extra';
import logger from 'jet-logger';
import childProcess from 'child_process';
import path from 'path';


/******************************************************************************
                                Functions
*******************************************************************************

/**
 * Copy file.
 */
export function copy(src: string, dest: string): Promise<void> {
  return new Promise((res, rej) => {
    return fs.copy(src, dest, err => {
      return (!!err ? rej(err) : res());
    });
  });
}

/**
 * Remove file
 */
export function remove(loc: string): Promise<void> {
  return new Promise((res, rej) => {
    return fs.remove(loc, err => {
      return (!!err ? rej(err) : res());
    });
  });
}

/**
 * Run command-line command.
 */
export function exec(cmd: string, loc = './'): Promise<string> {
  // Setup directory
  const callingDir = path.dirname(require.main?.filename ?? './'),
    cwd = path.join(callingDir, loc);
  // Wrap in promise
  return new Promise((res, rej) => 
    childProcess.exec(cmd, { cwd }, (err, stdout, stderr) => {
      if (!!stdout) {
        logger.info(stdout);
      }
      if (!!stderr) {
        logger.err(stderr);
      }
      if (!!err) {
        return rej(err);
      } else if (!!stderr) {
        return rej(new Error(stderr));
      } else {
        return res(stdout);
      }
    }),
  );
}

/**
 * Recursively search for a folder for all files and copy them to the new 
 * destination keeping their paths relative to the "src" param.
 * 
 * Example: 
 *  If file "./src/foo/bar.txt" exists then:
 *  copyFilesRec('./src', './dest') => ["./dest/foo/bar.txt"]
 * 
 * @param excludeExt Exlude a list of file extensions.
 */
export async function copyFilesRec(
  src: string,
  dest: string, 
  excludeExt?: string[],
): Promise<void> {
  const copyReqs: Promise<void>[] = [];
  try {
    const entries = await fs.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
      const currPath = src + '/' + entry.name,
        currDest = dest + '/' + entry.name,
        ext = path.extname(entry.name);
      if (entry.isFile() && !excludeExt?.includes(ext)) {
        const req = fs.copy(currPath, currDest);
        copyReqs.push(req);
      } else if (entry.isDirectory()) {
        const req = copyFilesRec(currPath, currDest, excludeExt);
        copyReqs.push(req);
      }
    }
  } catch (error) {
    logger.err(`Error searching in ${src}: ` + String(error));
  }
  await Promise.all(copyReqs);
}
