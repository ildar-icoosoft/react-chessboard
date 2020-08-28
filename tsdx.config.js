const postcss = require("rollup-plugin-postcss");
const url = require("postcss-url");

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        modules: true,
        plugins: [
          url({
            url: "inline",
          }),
        ],
      })
    );
    return config;
  },
};
