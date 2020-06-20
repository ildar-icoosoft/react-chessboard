const path = require("path");

module.exports = {
  stories: ["../stories/**/*.stories.(ts|tsx)"],
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-docs",
    "@storybook/addon-jest/register",
  ],
  webpackFinal: async (config) => {
    config.module.rules.push(
      {
        // https://stackoverflow.com/questions/29302742/is-there-a-way-to-disable-amdplugin
        test: /chess.js/,
        parser: {
          amd: false,
        },
      },
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: require.resolve("ts-loader"),
            options: {
              transpileOnly: true,
            },
          },
          {
            loader: require.resolve("react-docgen-typescript-loader"),
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        loaders: [
          require.resolve("style-loader"),
          {
            loader: require.resolve("css-loader"),
            options: {
              importLoaders: 1,
              modules: {
                mode: "local",
                localIdentName: "[name]__[local]--[hash:base64:5]",
              },
            },
          },
          require.resolve("sass-loader"),
        ],
      }
    );

    config.resolve.extensions.push(".ts", ".tsx", ".css", ".scss", ".sass");

    return config;
  },
};
