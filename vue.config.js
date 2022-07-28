// const AutoImport = require('unplugin-auto-import/webpack')
// const Components = require('unplugin-vue-components/webpack')
// const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

// module.exports = {
//     // ...
//     plugins: [
//         AutoImport({
//             resolvers: [ElementPlusResolver()],
//         }),
//         Components({
//             resolvers: [ElementPlusResolver()],
//         }),
//     ],
// }
// const path = require('path')
// element-plus 按需导入
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
module.exports = {
  lintOnSave: false,
  publicPath: './',
    devServer: {
      overlay: {
        warnings: true,
        errors: true,
      },
    },
    // element-plus 按需导入
    configureWebpack: {
        plugins: [
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        ],
    },
    
    //   pluginOptions: {
    //     // less自动注入
    //     "style-resources-loader": {
    //       preProcessor: "less",
    //       patterns: [
    //         path.join(__dirname, "./src/assets/styles/variables.less"),
    //         path.join(__dirname, "./src/assets/styles/mixins.less"),
    //       ],
    //     },
    //   },
};