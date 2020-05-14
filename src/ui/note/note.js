import React from 'react'
import {Divider, Empty, message} from 'antd'
import SubMenu from './sub-menu/sub-menu'
import Markdown from './markdown/markdown'
import {connect} from 'react-redux'
import File from '../../model/file'
import FileResource from '../../infrastructure/file-resource'
import TitleBar from '../title-bar/title-bar'
import FileCreatorButton from '../title-bar/file-creator-button'
import FoldSubMenuButton from '../title-bar/fold-sub-menu-button'
import {UPDATE_CURRENT_EDIT_FILE,} from '../../redux/reducers/dispatch-command/commands'
import MENU from '../note/menu-item'
import CardReview from "../../model/card-review";
import {publish} from "../event/pubsub-event";
import {CREATE_DIR_OR_FILE_EVENT, DELETE_DIR_EVENT, DELETE_FILE_EVENT, FILE_NAME_CHANGE_EVENT} from "../event/event";

class Note extends React.Component {
  componentWillReceiveProps = nextProps => {
    if (this.props.selectedDir.path === nextProps.selectedDir.path) {
      return false
    }
    this.props.updateStatus({subMenuVisible: true})
  }

  modifyFileName = (oldPath, newFileName) => {
    if (this._exist(newFileName)) {
      message.warning('file  already exist')
      return false;
    }
    if (this._validate(newFileName)) {
      message.warning('file name could not include 【\\\\/:*?\"<>|】')
      return false;
    }
    const {selectedDir, currentEditFile} = this.props
    let newPath = FileResource.modifyFileName({oldPath, newFileName})
    if (currentEditFile.path === oldPath) {
      this.props.updateCurrentEditFile(
        FileResource.findFile(newPath)
      )
    }
    this.props.updateSelectedDir(
      selectedDir.path === MENU.SEARCH_RESULT
        ? File.dir(newPath)
        : selectedDir.path)

    publish(FILE_NAME_CHANGE_EVENT, {props: this.props, oldPath, newFileName})
  }

  modifyFileContent = (path, content) => {
    this.props.updateCurrentEditFile(
      FileResource.modifyFileContent({path, content})
    )
  }

  createFileOrDir = ({path, type}) => {
    let file = FileResource.createFileOrDir({type, path});
    this.props.updateSelectedDir(path)
    if (type === 'dir') {
      publish(CREATE_DIR_OR_FILE_EVENT, {props: this.props})
      return
    }
    this.props.updateCurrentEditFile(file)
  }

  deleteFileOrDir = ({path, type}) => {
    const {selectedDir, notesTags} = this.props
    FileResource.delete({path, type})
    if (type === 'file') {
      const _path = path.split(window.getNoteWorkspacePath())[1]
      publish(DELETE_FILE_EVENT, {props: this.props, _path, notesTags})
      this.props.updateCurrentEditFile({})
    }

    if (type === 'dir') {
      publish(DELETE_DIR_EVENT, {props: this.props})
    }

    if (selectedDir.path !== MENU.SEARCH_RESULT) {
      this.props.updateSelectedDir(selectedDir.path)
    }
  }

  _exist = fileName => {
    return this.props.selectedDir.sub.filter(file => {
      return File.name(file.path) === fileName
    }).length === 1
  }

  _validate = fileName => {
    const reg = new RegExp('[\\\\/:*?\"<>|]')
    return reg.test(fileName)
  }

  formatMenus = (current) => {
    const workspace = window.getNoteWorkspacePath()
    const {currentEditFile} = this.props
    if (workspace === current.path) {
      return []
    }
    const menus = current.path.substring(workspace.length + 1).split('/');
    if (currentEditFile.path) {
      menus.push(File.name(currentEditFile.path))
    }
    return menus
  }

  updateSelectedDir = _path => {
    this.props.updateCurrentEditFile({})
    this.props.updateSelectedDir(_path)
    this.props.updateStatus({subMenuVisible: true})
  }

  updateToCardsReview = filePath => {
    const {cardsReview} = this.props
    const relativePath = File.relativePath(filePath)
    let toCardsReview = CardReview.updateToCardsReview(cardsReview, relativePath);
    this.props.updateCardsReview(toCardsReview)
  }

  getOperateComponents = () => {
    const {selectedDir, status} = this.props
    if (selectedDir.path !== MENU.SEARCH_RESULT) {
      return [
        <FoldSubMenuButton
          changeSubMenuVisible={() => this.props.updateStatus({subMenuVisible: !status.subMenuVisible})}
        />,
        <FileCreatorButton
          createFileOrDir={this.createFileOrDir}
          selectedDir={selectedDir}
        />, <Divider type='vertical'/>
      ]
    }
    return [<FoldSubMenuButton
      changeSubMenuVisible={() => this.props.updateStatus({subMenuVisible: !status.subMenuVisible})}
    />]
  }

  render() {
    const {
      selectedDir, currentEditFile,
      notesTags, updateNotesTags, status, cardsReview
    } = this.props
    const {subMenuVisible, leftMenuVisible} = status

    return <div>
      <TitleBar
        title='📔NoteBook  '
        leftMenuVisible={leftMenuVisible}
        menus={this.formatMenus(selectedDir)}
        changeLeftMenuVisible={this.props.updateStatus}
        onClickMenuItem={this.updateSelectedDir}
        pushToRepo={this.props.pushToRepo}
        operateComponents={this.getOperateComponents()}/>

      <div style={{height: 35}}></div>
      {
        subMenuVisible
          ? <SubMenu
            modifyFileName={this.modifyFileName}
            deleteFileOrDir={this.deleteFileOrDir}
            currentEditFile={currentEditFile}
            updateCurrentEditFile={this.props.updateCurrentEditFile}
            updateNotesTags={this.props.updateNotesTags}
            notesTags={notesTags}
            updateSelectedDir={this.updateSelectedDir}
            selectedDir={selectedDir}
          />
          : ''
      }
      {
        currentEditFile.path
          ? <Markdown file={currentEditFile}
                      isInReviewed={
                        !!cardsReview.find(item => item.path === File.relativePath(currentEditFile.path))}
                      status={status}
                      notesTags={notesTags}
                      modifyFileContent={this.modifyFileContent}
                      modifyFileName={this.modifyFileName}
                      updateNotesTags={updateNotesTags}
                      updateToCardsReview={this.updateToCardsReview}
          />
          :
          <Empty
            style={{marginTop: 300}}
            description={false}/>
      }
    </div>;
  }
}

const mapDispatchToProps = dispatch => ({
  updateCurrentEditFile: file => dispatch(UPDATE_CURRENT_EDIT_FILE(file))
})

const mapStateToProps = ({currentEditFile}) => ({
  currentEditFile
})
export default connect(mapStateToProps, mapDispatchToProps)(Note)
