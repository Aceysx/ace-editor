import React from 'react'
import {Divider, Icon, Tooltip, Badge} from 'antd'

const SideBarBottom = ({pushToRepo}) => {
  return <div style={{
    bottom: 0,
    height: 30,
    position: 'fixed',
    width: 220,
    zIndex: 30,
    background: '#f8f6f1'
  }}>
        <span>
          <Badge status="processing" text="1.0.0"/>
        </span>
    <Divider type='vertical'/>
    <Tooltip title="push to remote repo">
      <Icon type="github"
            onClick={pushToRepo}
            style={{fontSize: 18, color: '#b7906b'}}/>
    </Tooltip>
  </div>
}

export default SideBarBottom