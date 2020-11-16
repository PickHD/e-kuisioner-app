const path = require("path");
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, "../public/script/index.js"),
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "production-bundle.js",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, "../../node_modules"),
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.(png|jpe?g|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: "../dist/img",
              publicPath: "../static",
              esModule: false
            }
          }
        ]
      },
    ],
  },
  plugins: [
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          ['optipng', { optimizationLevel: 5 }],
          ["svgo", {
            plugins: [
              {
                removeViewBox: false
              }
            ]
          }
          ]
        ]
      }
    })
  ]

};
