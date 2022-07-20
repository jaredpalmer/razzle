# Deploy Razzle on Vercel

Create this vercel.json in the root directory of your project:

```json
{
    "name": "my-razzle-app",
    "version": 2,
    "builds": [
        {
            "src": "build/public/**",
            "use": "@vercel/static"
        },
        {
            "src": "build/server.js",
            "use": "@vercel/node"
        }
    ],
    "routes": [
        { "src": "/favicon.ico", "dest": "build/public/favicon.ico" },
        { "src": "/robots.txt", "dest": "build/public/robots.txt" },
        { "src": "/static/(.*)", "dest": "build/public/static/$1" },
        { "src": "/(.*)", "dest": "build/server.js" }

    ]
}
```

Then do a local build with 'yarn build'.

Afterwards deploy from a local terminal with 'vercel'
