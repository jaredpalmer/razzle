const text = [
  {
    header: 'About',
    text: `This is an example react application (master-detail feed)
      with isomorphic rendering, async react-router routes, async
      redux reducers, async data fetching, and code-splitting.`
  },
  {
    header: 'Motivation',
    text: `The file size of isomorphic React apps can quickly get
      out of hand. Many isomorphic starter kits look awesome
      to begin with but yield a several megabyte javascript
      file for the client to download. This project aims to
      demonstrate some possible solutions.`
  }
]

const resources = [
  {
    resource: 'Node.js',
    link: 'https://nodejs.org/en/',
    description: `Node.js® is a JavaScript runtime built on
      Chrome's V8 JavaScript engine. Node.js uses an event-driven,
      non-blocking I/O model that makes it lightweight and efficient.
      Node.js' package ecosystem, npm, is the largest ecosystem
      of open source libraries in the world.`
  },
  {
    resource: 'Express',
    link: 'https://github.com/expressjs/express',
    description: 'Fast, unopinionated, minimalist web framework for Node.js'
  },
  {
    resource: 'React',
    link: 'https://github.com/facebook/react',
    description: `A declarative, efficient, and flexible JavaScript
      library for building user interfaces.`
  },
  {
    resource: 'Redux',
    link: 'https://github.com/reactjs/redux',
    description: 'Predictable state container for JavaScript apps'
  },
  {
    resource: 'React Router 2.0',
    link: 'https://github.com/reactjs/react-router',
    description: 'A complete routing solution for React.js'
  },
  {
    resource: 'Aphrodite for CSS',
    link: 'https://github.com/Khan/aphrodite',
    description: `Support for colocating your styles with your JavaScript
      component. It's inline styles, but they work!`
  },
  {
    resource: 'React Helmet',
    link: 'https://github.com/nfl/react-helmet',
    description: 'A document head manager for React'
  },
  {
    resource: 'Redial for data fetching',
    link: 'https://github.com/markdalgleish/redial',
    description: 'Universal data fetching and route lifecycle management for React'
  },
  {
    resource: 'Babel 6',
    link: 'https://github.com/babel/babel',
    description: 'Babel is a compiler for writing next generation JavaScript.'
  },
  {
    resource: 'Webpack',
    link: 'https://github.com/webpack/webpack',
    description: `Webpack is a bundler for modules. The main purpose is to
      bundle JavaScript files for usage in a browser, yet it is also capable
      of transforming, bundling, or packaging just about any resource or asset.`
  }
]

export default { text, resources }
