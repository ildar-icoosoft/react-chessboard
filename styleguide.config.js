module.exports = {
  webpackConfig: {
    resolve: {
      extensions: [".ts", ".tsx", ".css", ".scss", ".sass"],
    },
    module: {
      rules: [
        {
          test: /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/,
          loaders: [
            {
              loader: require.resolve("file-loader"),
              options: { name: "static/media/[name].[hash:8].[ext]" },
            },
          ],
        },
        {
          test: /\.css$/,
          sideEffects: true,
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
          ],
        },
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
        },
      ],
    },
  },
};
