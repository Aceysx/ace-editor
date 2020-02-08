import * as React from 'react'
import {Empty, Layout, message} from 'antd'
import {connect} from 'react-redux'
import {
  SELECTED_DIR_STACK,
  UPDATE_CURRENT_EDIT_FILE,
  UPDATE_FILES,
  UPDATE_NOTES_TAGS,
  UPDATE_SELECTED_DIR
} from '../redux/reducers/dispatch-command/commands'
import LeftMenu from './left-menu/left-menu'
import '../resources/css/app.css'
import FileResource from '../infrastructure/file-resource'
import Note from './note/note'
import Setting from './setting/setting'
import NoteTagModel from '../model/note-tag'
import File from '../model/file'
import path from 'path'
import GitResource from '../infrastructure/git-resource'

const {Sider, Content} = Layout

const MENU = {
  NONE: 'none',
  NOTE: 'note',
  SETTING: 'setting'
}
const NOTE_WORKSPACE_PATH = () => window.localStorage.getItem('workspace')
const NOTES_TAGS_FILE = () => window.localStorage.getItem('workspace') + '/__tags'

class App extends React.Component {
  state = {
    current: MENU.NOTE
  }

  componentDidMount() {
    const {selectedDirStack} = this.props
    let workspace = NOTE_WORKSPACE_PATH()
    if (!workspace) {
      workspace = this.initWorkspace()
      this.pushPathToSelectedDirStack(selectedDirStack)
    }
    this.props.updateDirs(FileResource.initNoteBook(workspace))
    this.props.updateNotesTags(FileResource.getNotesTags(NOTES_TAGS_FILE()))
  }

  resetWorkspace = () => {
    const workspace = this.initWorkspace()
    this.props.updateDirs(FileResource.initNoteBook(workspace))
    this.props.updateNotesTags(FileResource.getNotesTags(NOTES_TAGS_FILE()))

  }

  initWorkspace = () => {
    const workspace = FileResource.openDir()
    window.localStorage.setItem('workspace', workspace)
    window.localStorage.removeItem('note')
    return workspace
  }

  updateNotesTags = (path, notesTags) => {
    FileResource.modifyFileContent({path, content: JSON.stringify(notesTags)})
    this.props.updateNotesTags(FileResource.getNotesTags(NOTES_TAGS_FILE()))
  }

  pushPathToSelectedDirStack = path => {
    if (path === '搜索结果') {
      return
    }
    const {selectedDirStack} = this.props;
    if (selectedDirStack[selectedDirStack.length - 1] !== path) {
      selectedDirStack.push(path);
      this.props.updateSelectedDirStack(selectedDirStack)
    }
  }

  updateSelectedDir = path => {
    if (path === MENU.SETTING) {
      this.setState({current: MENU.SETTING})
      return
    }
    this.setState({current: MENU.NOTE})
    this.pushPathToSelectedDirStack(path);
    this.props.updateSelectedDir(FileResource.findSubFiles(path))
  }

  modifyFileName = (oldPath, newFileName) => {
    if (this.exist(newFileName)) {
      message.warning('文件已存在')
      return false;
    }
    if (this.validate(newFileName)) {
      message.warning('文件名不能包含【\\\\/:*?\"<>|】')
      return false;
    }
    const {selectedDir, currentEditFile} = this.props
    let newPath = FileResource.modifyFileName({oldPath, newFileName})
    if (currentEditFile.path === oldPath) {
      this.props.updateCurrentEditFile(
        FileResource.findFile(newPath)
      )
    }
    this.updateSelectedDir(selectedDir.path)
    this.props.updateDirs(FileResource.initNoteBook(NOTE_WORKSPACE_PATH()))
  }

  exist = fileName => {
    return this.props.selectedDir.sub.filter(file => {
      return File.name(file.path) === fileName
    }).length === 1
  }

  validate = fileName => {
    const reg = new RegExp('[\\\\/:*?\"<>|]')
    return reg.test(fileName)
  }

  modifyFileContent = (path, content) => {
    this.props.updateCurrentEditFile(
      FileResource.modifyFileContent({path, content})
    )
  }

  createFileOrDir = ({path, type}) => {
    let file = FileResource.createFileOrDir({type, path});
    this.updateSelectedDir(path)
    if (type === 'dir') {
      this.props.updateDirs(FileResource.initNoteBook(NOTE_WORKSPACE_PATH()))
      return
    }
    this.props.updateCurrentEditFile(file)
  }

  deleteFileOrDir = ({path, type}) => {
    const {selectedDir, notesTags} = this.props
    FileResource.delete({path, type})
    this.updateSelectedDir(selectedDir.path)

    if (type === 'file') {
      const _path = path.split(NOTE_WORKSPACE_PATH())[1]
      this.updateNotesTags(NOTES_TAGS_FILE(),
        NoteTagModel.delete(_path, notesTags))
      this.props.updateCurrentEditFile({})
    }

    if (type === 'dir') {
      this.props.updateDirs(FileResource.initNoteBook(NOTE_WORKSPACE_PATH()))
    }
  }
  isEmpty = (current, selectedDir) => {
    return current === MENU.NOTE && selectedDir.sub === undefined
  }

  pushToRepo = (workspace) => {
    GitResource.pushToRepo(workspace)
  }

  searchFiles = content => {
    const selectedDir = {
      path: '搜索结果',
      sub: this._searchByTitleOrTag(content)
    }
    this.props.updateSelectedDir(selectedDir)
  }

  _searchByTitleOrTag = content => {
    const {leftMenu, notesTags} = this.props
    const allFiles = this._formatAllFiles(leftMenu.sub)
    const inFilesPath = allFiles.filter(file => {
      return path.basename(file.path).includes(content)
    })
    const foundInTags = notesTags.filter(tagFile => tagFile.tags.join(',').includes(content))
    const inTagPath = allFiles.filter(file => foundInTags.find(tagFile => file.path.includes(tagFile.path)))
    inFilesPath.push(...inTagPath)
    return inFilesPath
  }

  _formatAllFiles = sub => {
    const files = []
    sub.forEach(item => {
      if (item.type === 'dir') {
        files.push(...this._formatAllFiles(item.sub))
      }
      if (item.type === 'file') {
        files.push(item)
      }
    })
    return files
  }

  render() {
    const {current} = this.state
    const {leftMenu, selectedDir, currentEditFile, selectedDirStack, notesTags} = this.props
    return <Layout className='layout'>
      <Sider
        className='layout_left_sider'
        theme='light'
      >
        <LeftMenu
          pushToRepo={this.pushToRepo}
          leftMenu={leftMenu}
          updateMenu={this.updateSelectedDir}
        />
      </Sider>
      <Layout className='layout_right_content_layout'>
        <Content>
          {
            current === MENU.NOTE && selectedDir.sub !== undefined
              ? <Note
                createFileOrDir={this.createFileOrDir}
                notesTags={notesTags}
                selectedDir={selectedDir}
                currentEditFile={currentEditFile}
                updateCurrentEditFile={this.props.updateCurrentEditFile}
                updateSelectedDir={this.updateSelectedDir}
                deleteFileOrDir={this.deleteFileOrDir}
                selectedDirStack={selectedDirStack}
                updateSelectedDirStack={this.props.updateSelectedDirStack}
                modifyFileContent={this.modifyFileContent}
                modifyFileName={this.modifyFileName}
                updateNotesTags={this.updateNotesTags}
                searchFiles={this.searchFiles}
              />
              : ''
          }
          {
            current === MENU.SETTING
              ? <Setting
                resetWorkspace={this.resetWorkspace}
                workspace={leftMenu.path}
              />
              : ''
          }
          {
            this.isEmpty(current, selectedDir)
              ? <div style={{margin: '50%'}}>
                <Empty description={false}/>
              </div>
              : ''
          }
        </Content>
      </Layout>
    </Layout>
  }
}

const mapDispatchToProps = dispatch => ({
  updateDirs: dirs => dispatch(UPDATE_FILES(dirs)),
  updateNotesTags: noteTags => dispatch(UPDATE_NOTES_TAGS(noteTags)),
  updateSelectedDir: dir => dispatch(UPDATE_SELECTED_DIR(dir)),
  updateCurrentEditFile: file => dispatch(UPDATE_CURRENT_EDIT_FILE(file)),
  updateSelectedDirStack: selectedDirStack => dispatch(SELECTED_DIR_STACK(selectedDirStack)),
})

const mapStateToProps = ({
                           leftMenu,
                           selectedDir,
                           currentEditFile,
                           selectedDirStack,
                           notesTags
                         }) => ({
  leftMenu,
  selectedDir,
  selectedDirStack,
  currentEditFile,
  notesTags
})
export default connect(mapStateToProps, mapDispatchToProps)(App)
