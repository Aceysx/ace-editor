import React from 'react'
import {Divider} from "antd"
import FileCard from "../../commons/file-card"
import FileResource from "../../../resources/file-resources"
import {Empty} from "antd/lib/index";

class SubMenu extends React.Component {
  state = {
    selectedDirPath: ''
  }

  openFile = file => {
    this.setState({selectedDirPath: file.path})
    if (file.type === 'dir') {
      this.props.findSubFiles(file.path)
      return
    }
    if (file.path === this.props.currentEditFile.path) {
      return
    }
    this.props.updateCurrentEditFile(
      FileResource.findFile(file.path)
    )
  }

  subFiles = selectedDir => {
    return selectedDir.sub.map(file => {
      return <FileCard key={file.path}
                       selectedPath={this.state.selectedDirPath}
                       file={file}
                       openFile={this.openFile}
      />
    })
  }

  render() {
    const {selectedDir} = this.props
    const subFiles = this.subFiles(selectedDir)
    return <div className='layout_right_content_layout_left_menu'>
      <div className='layout_right_content_layout_left_menu_scroll'>
        <div style={{height: 50}}></div>
        <Divider/>
        {
          subFiles.length
            ? subFiles
            : <Empty
              style={{marginTop: '20%', width: '250px'}}
              description={false}
              image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        }
      </div>
    </div>
  }
}

export default SubMenu