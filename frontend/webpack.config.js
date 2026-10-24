const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// output.clean wipes dist on every build; copy public/images back so the backend (which serves dist) has them.
class CopyPublicImagesPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap("CopyPublicImagesPlugin", () => {
      fs.cpSync(path.join(__dirname, "public/images"), path.join(compiler.outputPath, "images"), { recursive: true });
    });
  }
}

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/beta/node/",
    clean: true
  },
  devServer: {
    // Serve the site under /beta/node/ locally, matching the VPS path used by the HTML/JS asset URLs
    static: { directory: path.join(__dirname, "public"), publicPath: "/beta/node/" },
    port: 3000,
    open: "/beta/node/",
    hot: true,
    historyApiFallback: { index: "/beta/node/index.html" },
    // Staff portal and API live on the backend; forward them so links work on the dev server too.
    proxy: [{ context: ["/beta/node/staff", "/beta/node/api"], target: "http://localhost:4000" }],
    setupMiddlewares: (middlewares) => {
      middlewares.unshift({
        name: "redirect-root",
        path: "/",
        middleware: (req, res, next) => {
          if (req.path === "/" || req.path === "/beta/node") return res.redirect("/beta/node/");
          next();
        }
      });
      return middlewares;
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    new CopyPublicImagesPlugin()
  ]
};
