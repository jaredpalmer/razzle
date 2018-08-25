const modifyBuilder = require('razzle-plugin-pwa').default

const pwaConfig = {
    swDest: 'sw.js',
    clientsClaim: true,
    skipWaiting: true,
    runtimeCaching: [{
        urlPattern: new RegExp('https://www.mysite.co'),
        handler: 'networkFirst'
    }]
}

const manifestConfig = {
    filename: 'manifest.json',
    name: 'Razzle App',
    short_name: 'Razzle',
    description: 'Another Razzle App',
    orientation: 'portrait',
    display: 'fullscreen',
    start_url: '.',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    related_applications: [],
    icons: []
}

const modify = modifyBuilder({ pwaConfig, manifestConfig })

module.exports = {
    plugins: [{ func: modify }]
}