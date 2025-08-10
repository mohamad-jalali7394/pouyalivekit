const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: false,
//   devServer: {
//     open: false,
//     host: "localhost",
//     port: 8085,
//   },
//   pluginOptions: {
//     i18n: {
//       locale: 'fa',
//       fallbackLocale: 'fa',
//       localeDir: 'locales',
//       enableLegacy: false,
//       runtimeOnly: false,
//       compositionOnly: false,
//       fullInstall: true
//     }
//   }
// })


// localhost
// module.exports = {
//   devServer: {
//     open: false,
//     host: "localhost",
//     port: 8085,
//     disableHostCheck: false,
//   },
//
//   pluginOptions: {
//     i18n: {
//       locale: 'fa',
//       fallbackLocale: 'fa',
//       localeDir: 'locales',
//       enableLegacy: false,
//       runtimeOnly: false,
//       compositionOnly: false,
//       fullInstall: true
//     }
//   }
// };

// ancerz
//
// module.exports = {
// pluginOptions: {
//   i18n: {
//     locale: 'fa',
//         fallbackLocale: 'fa',
//         localeDir: 'locales',
//         enableLegacy: false,
//         runtimeOnly: false,
//         compositionOnly: false,
//         fullInstall: true
//   }
// },
//   devServer: {
//     open: false,
//     host: "webl.shooka.com",
//     port: 80,
//     disableHostCheck: true,
//   },
// };


// ancerzir
//
// module.exports = {
//     pluginOptions: {
//         i18n: {
//             locale: 'fa',
//             fallbackLocale: 'fa',
//             localeDir: 'locales',
//             enableLegacy: false,
//             runtimeOnly: false,
//             compositionOnly: false,
//             fullInstall: true
//         }
//     },
//     devServer: {
//         open: false,
//         host: "360.shooka.com",
//         port: 80,
//         disableHostCheck: true,
//     },
// };


///360

//
//
module.exports = defineConfig({
  transpileDependencies: false,
  pluginOptions: {
    i18n: {
      locale: 'fa',
      fallbackLocale: 'fa',
      localeDir: 'locales',
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true
    }
  },
  devServer: {
    open: false,
    host: "webl.shooka.com",
    port: 80,
  },

})



