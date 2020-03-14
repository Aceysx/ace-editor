import React from "react"
import {Divider, Popover, Statistic, Tag} from "antd"
import ColorPicker from "./color-picker"
import NoteTagModel from "../../model/note-tag"

class TagDisplayBox extends React.Component {
  state = {
    colorEdit: '',
    tagValueEdit: ''
  }
  modify = old => {
    const {colorEdit, tagValueEdit} = this.state
    this.props.updateTag(old, [colorEdit, tagValueEdit].join('||'))
  }

  render() {
    const {tagsNotes} = this.props
    const {colorEdit, tagValueEdit} = this.state
    const notesCount = Object.values(tagsNotes)
      .reduce((current, next) => {
        return current + next.length
      }, 0)

    return <div><Statistic
      value={Object.keys(tagsNotes).length}
      suffix={`/ ${notesCount}`}/>
      {
        Object.keys(tagsNotes)
          .map((tag, index) => {
            const [color, content] = NoteTagModel.format(tag)
            return <Tag key={index}
                        className='tag'
                        color={color}>
              <Popover content={<ColorPicker
                color={colorEdit}
                tagValue={tagValueEdit}
                colorChange={colorEdit => this.setState({colorEdit})}
                tagValueChange={tagValueEdit => this.setState({tagValueEdit})}
                modify={() => this.modify(tag)}
              />}>
                <span
                  onMouseOver={() => {
                    this.setState({colorEdit: color, tagValueEdit: content})
                  }} className='cursor_pointer'>🎨</span>
              </Popover>
              {content} <Divider type={'vertical'}/>
              <span style={{fontSize: '12px'}}> {tagsNotes[tag].length}</span>
            </Tag>
          })
      }
    </div>
  }
}


export default TagDisplayBox