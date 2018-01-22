import React, { Component } from 'react'

import { Menu, Icon } from 'antd'

const links = [
  {
    label: 'Docs',
    url: 'https://github.com/jaredpalmer/razzle',
    icon: 'book',
  },
  {
    label: 'Issues',
    url: 'https://github.com/jaredpalmer/razzle/issues',
    icon: 'exception',
  },
  {
    label: 'Chat',
    url: 'https://palmer.chat',
    icon: 'message',
  },
  {
    label: 'Ant Design',
    url: 'https://ant.design',
    icon: 'ant-design',
  },
]

class SiderMenu extends Component {
  onClick = item => window.open(item.key, '__blank')

  render() {
    return (
      <Menu onClick={this.onClick} theme="dark">
        {links.map(link => (
          <Menu.Item key={link.url}>
            {link.icon && <Icon type={link.icon} />}
            <span>{link.label}</span>
          </Menu.Item>
        ))}
      </Menu>
    )
  }
}

export default SiderMenu
