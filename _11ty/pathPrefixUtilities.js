module.exports = {
  hasPathPrefix: () => {
    return /pathprefix/.test(process.argv.join());
  },
  getPathPrefix: () => {
    const argv = require("minimist")(process.argv.slice(2), {
      boolean: ["quiet"],
      default: {
        quiet: null
      }
    });
    return argv.pathprefix;
  }
}
