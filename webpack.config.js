const path = require('path');

module.exports = {
    entry: './index.js', // Update this path to your main entry file
    output: {
        path: path.resolve(__dirname, 'dist'), // Update the 'dist' directory as per your preference
        filename: 'bundle.js'
    },
    target: 'node', // This ensures the bundle works in a Node.js environment
    mode: 'production', // You can set this to 'development' if you want webpack to run in development mode
    // Add any necessary loaders or plugins here
    // For example, you might want to use babel-loader for transpiling ES6+ code
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(node)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'node_modules/@mongodb-js/zstd-darwin-arm64' // Adjust the outputPath as needed
                    }
                }
            }
        ]
    }
};
