const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        main: { import: "./src/index.ts" },
    },
    output: {
        filename: "[name].[hash].js",
        path: path.resolve(__dirname, "build"),
    },
    resolve: {
        extensions: [".ts", ".js", ".json"],
        alias: {
            src: path.resolve(__dirname, "src/"),
        },
    },
    module: {
        rules: [
            {
            // typescript
                test: /\.ts$/,
                use: [{
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.json"
                    }
                }],
                exclude: /node_modules/,
            },
            {
            // css/sass extract+compile
                test: /\.s?css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
            // assets
                test: /.(jpg|png|svg)/,
                type: "asset/resource",
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "public/index.html",
            favicon: "public/favicon.ico",
        }),
        new MiniCssExtractPlugin({ filename: "[name].[hash].css" }),
    ],
};
