import React from 'react'
import Helmet from 'react-helmet'
import { StyleSheet, css } from 'aphrodite'

import data from '../data'

const local = [{
  header: 'About',
  text: `This is an example react application (master-detail feed)
    with isomorphic rendering, async react-router routes, async
    redux reducers, async data fetching, and code-splitting.`
}, {
  header: 'Motivation',
  text: `The file size of isomorphic React apps can quickly get
    out of hand. Many isomorphic starter kits look awesome
    to begin with but yield a several megabyte javascript
    file for the client to download. This project aims to
    demonstrate some possible solutions.`
}]

// This is a static page. It uses an array to hold data about the resources
// and maintain DRY
const About = () =>
  <div>
    <Helmet title='About' />
    {local.map((section, i) =>
      <div key={`about-section-${i}`}>
        <h2 className={css(styles.header)}>{section.header}</h2>
        <p className={css(styles.lead)}>{section.text}</p>
      </div>
    )}
    <h2 className={css(styles.header)}>Under the Hood</h2>
    <ul className={css(styles.list)}>
      {data.map((item, i) =>
        <li key={`about-data-${i}`}>
          <h3>
            <a className={css(styles.link)}
              href={item.link}
              target='_blank'>
              {item.resource}
            </a>
          </h3>
          <p className={css(styles.body)}>
            {item.description}
          </p>
        </li>
      )}
    </ul>
  </div>

const styles = StyleSheet.create({
  header: {
    fontSize: '36px',
    lineHeight: '1.5',
    margin: '0 0 1.5rem'
  },
  lead: {
    fontSize: '1.25rem',
    lineHeight: '1.5',
    margin: '0 0 1.5rem',
    color: '#555'
  },
  body: {
    fontSize: '1rem',
    lineHeight: '1.5',
    margin: '0 0 1.5rem',
    color: '#555'
  },
  list: {
    fontSize: '1rem',
    listStyle: 'none',
    padding: 0
  },
  link: {
    display: 'block',
    fontSize: '1.25rem',
    margin: '0 0 .5rem',
    lineHeight: '1.5',
    fontWeight: 'bold',
    color: '#08c',
    opacity: 1,
    transition: '.2s opacity ease',
    ':hover': {
      opacity: 0.5
    }
  }
})

export default About
