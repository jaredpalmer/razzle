import React from 'react'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import { Layout, Icon } from 'antd'

import Home from './Home'
import SiderMenu from './SiderMenu'
import './App.css'

const { Sider, Content, Header } = Layout

const App = () => (
  <Layout className="app">
    <Header className="app__header">
      <h2 className="app__logo">
        <Icon type="ant-design" /> Razzle-Ant Design
      </h2>
    </Header>
    <Layout className="app__content">
      <Sider breakpoint="sm" collapsible>
        <SiderMenu />
      </Sider>
      <Layout>
        <Content>
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
        </Content>
      </Layout>
    </Layout>
  </Layout>
)

export default App
