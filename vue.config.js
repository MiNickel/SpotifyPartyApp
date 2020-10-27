module.exports = {
  transpileDependencies: ["vuetify"],
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "./custom-service-worker.js",
      swDest: `${process.env.BASE_URL}service-worker.js`
    }
  }
};
