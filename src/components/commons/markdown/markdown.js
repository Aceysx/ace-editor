import React from 'react'
import {Col, Divider, Icon, Input, Row, notification} from "antd";
import '../../../css/overwrite-hyperMD-style.css'
import '../../../css/markdown.css'
import path from 'path'

const HyperMD = require('hypermd')
require("codemirror/mode/htmlmixed/htmlmixed")
require("codemirror/mode/stex/stex")
require("codemirror/mode/yaml/yaml")

let md
export default class Markdown extends React.Component {
  state = {
    mdRef: React.createRef(),
    changedPath: '',
    changedContent: ''
  }

  componentDidMount() {
    const node = this.state.mdRef.current
    const {file} = this.props
    this.setState({
      changedPath: path.basename(file.path),
      changedContent: file.content
    }, () => {
      md = HyperMD.fromTextArea(node)
      this._updateMarkdownContent(file.content)
    })
  }

  componentWillReceiveProps(nextProps) {
    const {file} = nextProps
    if (this.props.file.path !== file.path) {
      this.setState({changedPath: path.basename(file.path)})
    }
    if (this.props.file.content !== file.content) {
      this._updateMarkdownContent(file.content)
    }
  }

  _updateMarkdownContent = data => {
    try {
      md.setValue(data)
    } catch (e) {
      md.setValue(data)
    }
  }

  modifyFileName = () => {
    const {file} = this.props
    const {changedPath} = this.state
    this.props.modifyFileName(file.path, changedPath)
  }

  modifyFileContent = () => {
    const {file} = this.props
    const {changedContent} = this.state
    const newlyValue = md.getValue()
    if (changedContent !== newlyValue) {
      this.setState({changedContent: newlyValue}, () => {
        this._updateMarkdownContent(changedContent)
      })
    }
    this.props.modifyFileContent(file.path, newlyValue);
    notification.success({message: '更新成功'});
  }

  render() {
    const {mdRef, changedPath} = this.state
    return <div className='layout_right_content_layout_markdown_scroll'>
      <Row style={{height: 50}}>
        <Col span={20}>
          <Input className='markdown_box_title'
                 onPressEnter={this.modifyFileName}
                 onChange={e => this.setState({changedPath: e.target.value})}
                 size="large" value={changedPath || ''}/>
        </Col>
      </Row>
      <Divider style={{display: 'inline-block', marginLeft: 10}}/>
      <Row type='flex'
           justify='space-between'>
        <span></span>
        <div style={{color: 'black'}}>
          <span onClick={this.modifyFileContent}><Icon type="save"/>保存</span>
        </div>
      </Row>

      <textarea style={{minHeight: 4000}}
                ref={mdRef}/>
    </div>
  }
}