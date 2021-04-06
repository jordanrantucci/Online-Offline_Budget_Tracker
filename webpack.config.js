const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");
const config = {
    entry: "./public/index.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    mode: "development",
    plugins: [
        new WebpackPwaManifest({
            name: "Budget Tracker App",
            short_name: "Budget Tracker",
            description: "An application for budget tracking.",
            background_color: "#01579B",
            theme_color: "#FFFFFF",
            "theme-color": "#FFFFFF",
            start_url: "/",
            icons: [
                {
                    src: path.resolve("public/icons/icon-192x192.png"),
                    sizes: [96, 128, 192, 256, 384, 512],
                    destination: path.join("public", "icons")
                }
            ]
        })
    ],
    
    // configure webpack to use babel-loader to bundle our separate modules and transpile the code
    // refer to https://github.com/babel/babel-loader for more information on the settings
    module: {
        rules: [
            {
                test: /\.js$/, // files must end in ".js" to be transpiled
                exclude: /node_modules/, // don't transpile code from "node_modules"
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    }
};

module.exports = config;