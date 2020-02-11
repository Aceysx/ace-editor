import React from 'react'
import {Icon, Tree, notification} from 'antd'
import File from '../../model/file'
import SideBarHeader from './sidebar-header'
import SideBarBottom from './sidebar-bottom'
import {PUSH_TO_REPO_FINISHED} from '../../model/listener-event'

import '../../resources/css/overwrite-react-contextmenu-style.css'

const {TreeNode, DirectoryTree} = Tree

export default class LeftMenu extends React.Component {

  componentDidMount() {
    window.electron.ipcRenderer.on(PUSH_TO_REPO_FINISHED, (e, result) => {
      const {isSuccess, message} = result
      if (isSuccess) {
        notification.success({message, duration: 2})
        return
      }
      notification.error({message, duration: 2})
    })
  }

  onSelect = keys => {
    this.props.updateMenu(keys[0])
  }

  pushToRepo = () => {
    notification.info({message: '正在推送......', duration: 2})
    this.props.pushToRepo(window.getNoteWorkspacePath())
  }

  listTree = dirs => {
    return dirs.filter(item => item.type === 'dir')
      .map(dir => {
        const subDirs = dir.sub.filter(item => item.type === 'dir')
        return <TreeNode
          title={this.buildItem(File.name(dir.path))}
          key={dir.path}>
          {this.listTree(subDirs)}
        </TreeNode>
      })
  }
  buildItem = title => {
    return <span style={{fontWeight: 550, color: 'rgba(25, 23, 17, 0.6)'}}>{title}</span>
  }

  render() {
    const {leftMenu} = this.props

    return <div>
      <div style={{height: 80}}>
        <SideBarHeader/>
      </div>
      {
        leftMenu.path
          ?
          <div>
            <DirectoryTree
              defaultExpandedKeys={[leftMenu.path]}
              onSelect={this.onSelect}>
              <TreeNode title={this.buildItem('我的文件夹')} key={leftMenu.path}>
                {
                  this.listTree(leftMenu.sub)
                }
              </TreeNode>
              <TreeNode title={this.buildItem('设置')}
                        key='setting'
                        icon={<Icon type="setting"/>}>
              </TreeNode>
            </DirectoryTree>
          </div>
          : ''
      }
      <div style={{height: 30}}/>
      <SideBarBottom
        pushToRepo={this.pushToRepo}/>
    </div>
  }
}