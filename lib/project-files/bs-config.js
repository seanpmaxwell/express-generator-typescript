module.exports = {
  proxy: "http://localhost:3000/", // The address where your Express app runs
  open: true, // Avoid reopening the browser on every nodemon restart
  port: 3001, // The port BrowserSync will run on
  files: ["src/**/*.*"], // Files to watch
  ignore: ['**/node_modules/**', '**/repos/**/*.json'],
  reloadDelay: 500, // Wait for nodemon to restart
};
