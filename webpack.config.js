const path = require('path');

module.exports = {
    entry: './src/main/main.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        alias: {
            react: path.resolve(__dirname, 'node_modules', 'react')
        }
    },
}