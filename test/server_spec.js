/* eslint-env mocha */
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import { createServer } from '../server'

chai.use(chaiHttp)

import fakeDB from '../server/fakeDB.js'

const server = createServer({
  nodeEnv: 'test',
  webConcurrency: process.env.WEB_CONCURRENCY || 1,
  port: process.env.PORT || 5000,
  timeout: 29000
})

describe('API', () => {
  it('should list ALL posts on api/v0/posts GET', (done) => {
    chai.request(server)
      .get('/api/v0/posts')
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res).to.be.json
        expect(res.text).to.be.an('string')
        expect(res.text).to.equal(JSON.stringify(fakeDB))
        done()
      })
  })

  it('should list ONE post on api/v0/posts/:slug GET', (done) => {
    const post = {
      id: '128sd043hd',
      title: 'Cloth Talk Part I',
      slug: 'cloth-talk-part-i',
      content: 'Lorem Khaled Ipsum is a major key to success. The weather is amazing, walk with me through the pathway of more success. Take this journey with me, Lion! We don’t see them, we will never see them. Find peace, life is like a water fall, you’ve gotta flow. Wraith talk. You see the hedges, how I got it shaped up? It’s important to shape up your hedges, it’s like getting a haircut, stay fresh. A major key, never panic. Don’t panic, when it gets crazy and rough, don’t panic, stay calm.'
    }

    chai.request(server)
      .get(`/api/v0/posts/${post.slug}`)
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res).to.be.json
        expect(res.text).to.be.an('string')
        expect(res.text).to.equal(JSON.stringify(post))
        done()
      })
  })
})
