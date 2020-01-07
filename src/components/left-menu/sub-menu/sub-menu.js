import React from 'react'
import {Divider, Empty} from "antd"
import FileCard from "../../commons/file-card"
import FileResource from "../../../resources/file-resources"
import '../../../css/sub-menu.css'
import Files from "../../../utils/files";

const DEFAULT_EDITED_FILE_NAME = {
  old: null,
  now: '',
  type: ''
}

class SubMenu extends React.Component {
  state = {
    selectedDirPath: '',
    editedFileName: DEFAULT_EDITED_FILE_NAME
  }

  openFile = file => {
    this.setState({selectedDirPath: file.path})
    if (file.type === 'dir') {
      this.props.updateSelectedDir(file.path)
      return
    }
    if (file.path === this.props.currentEditFile.path) {
      return
    }
    this.props.updateCurrentEditFile(
      FileResource.findFile(file.path)
    )
  }

  changeFileName = now => {
    const {editedFileName} = this.state
    editedFileName.now = now
    this.setState({editedFileName})
  }

  updateFileName = () => {
    const {editedFileName} = this.state
    const {old, now, type} = editedFileName
    if (Files.nameByPath(old) !== now) {
      this.props.modifyFileName(old, now, type)
    }
    this.setState({editedFileName: DEFAULT_EDITED_FILE_NAME})
  }

  change2EditModal = file => {
    const editedFileName = {
      old: file.path,
      now: Files.nameByPath(file.path),
      type: file.type
    }
    this.setState({editedFileName})
  }

  sort = (filesOrDirs) => {
    let dirs = [], files = []
    filesOrDirs.forEach(item => {
      if (item.type === 'dir') dirs.push(item)
      else files.push(item)
    })

    return [...dirs.sort((a, b) => a.name > b.name ? -1 : 1),
      ...files.sort((a, b) => a.name > b.name ? -1 : 1)]
  }

  subFiles = selectedDir => {
    const {editedFileName, selectedDirPath} = this.state

    return this.sort(selectedDir.sub)
      .map(file => {
        return <FileCard key={file.path}
                         selectedPath={selectedDirPath}
                         deleteFileOrDir={this.props.deleteFileOrDir}
                         file={file}
                         editedFileName={editedFileName}
                         changeFileName={this.changeFileName}
                         updateFileName={this.updateFileName}
                         change2EditModal={this.change2EditModal}
                         openFile={this.openFile}
        />
      })
  }

  render() {
    const {selectedDir} = this.props
    const subFiles = this.subFiles(selectedDir)
    return <div className='layout_right_content_layout_left_menu'>
      <div className='layout_right_content_layout_left_menu_scroll'>
        <div className='layout_right_content_layout_left_menu_tool'>
          <div>{Files.nameByPath(selectedDir.path)}</div>
        </div>
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
      <div className='layout_right_content_layout_left_menu_bottom'>
        <Divider/>
        共 {selectedDir.sub.length} 项
      </div>
    </div>
  }
}

export default SubMenu