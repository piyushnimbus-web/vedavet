
const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Copy public images into dist after the Webpack build.
class CopyPublicImagesPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap("CopyPublicImagesPlugin", () => {
      const source = path.join(__dirname, "public", "images");
      const destination = path.join(compiler.outputPath, "images");

      if (fs.existsSync(source)) {
        fs.cpSync(source, destination, { recursive: true });
      }
    });
  }
}

module.exports = {
  mode: "production",

  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/beta/node/",
    clean: true,
  },

  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
      publicPath: "/beta/node/",
    },

    port: 3000,
    open: "/beta/node/",
    hot: true,

    historyApiFallback: {
      index: "/beta/node/index.html",
    },

    // Forward staff portal and API requests to the backend.
    proxy: [
      {
        context: ["/beta/node/staff", "/beta/node/api"],
        target: "http://localhost:4000",
      },
    ],

    setupMiddlewares: (middlewares) => {
      middlewares.unshift({
        name: "redirect-root",
        path: "/",

        middleware: (req, res, next) => {
          if (req.path === "/" || req.path === "/beta/node") {
            return res.redirect("/beta/node/");
          }

          next();
        },
      });

      return middlewares;
    },
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,

        use: {
          loader: "babel-loader",

          options: {
            envName: "production",

            presets: [
              "@babel/preset-env",
              [
                "@babel/preset-react",
                {
                  runtime: "automatic",
                  development: false,
                },
              ],
            ],
          },
        },
      },

      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),

    new CopyPublicImagesPlugin(),
  ],
};
