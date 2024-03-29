const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const BASE_JS = "./src/client/js/";

module.exports = {
    entry : {
        main : BASE_JS + "main.js",
        videoPlayer : BASE_JS + "videoPlayer.js",
        commentSection: BASE_JS + "commentSection.js",
        recorder : BASE_JS + "recorder.js",
    },
    plugins: [new MiniCssExtractPlugin({
        filename: "css/style.css"
    })],
    // 명령어로 교체
    // mode : "development",
    // watch : true,
    output : {
        filename : "js/[name].js",
        path : path.resolve(__dirname, "assets"),
        clean:true,
    },
    module : {
        rules : [
            {
                test: /\.js$/,
                use : {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', { targets: "defaults" }]]
                    }
                }
            },
            {
                test : /\.scss$/,
                use : [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            }
        ]
    }
};
