import React from "react"
import TitleBar from "../title-bar/title-bar"
import moment from "moment"
import {Calendar, Card, Divider, Icon, Tag} from "antd";
import File from '../../model/file'
import '../../resources/css/cards-review.css'
import Time from "../../model/time";

const data = [
  {
    path: 'a/b/c.txt',
    startReviewTime: new Date().getTime(),
    nextReviewTime: moment('2020-02-22').valueOf(),
    type: 'review',
    isFinish: false,
    history: []
  }, {
    path: 'a/b/d.txt',
    startReviewTime: new Date().getTime(),
    nextReviewTime: moment('2020-02-23').valueOf(),
    type: 'review',
    isFinish: false,
    history: []
  },
]

class CardsReview extends React.Component {
  state = {
    bottomVisible: true,
    current: moment(new Date().getTime())
  }

  onSelect = current => {
    this.setState({
      current,
      bottomVisible: true
    });
  };

  onPanelChange = current => {
    this.setState({current});
  }

  dateCellRender = (value) => {
    const {cardsReview} = this.props
    const renderData = cardsReview.filter(card => {
      return Time.isSameDay(value, card.nextReviewTime) ||
        card.history.find(item => Time.isSameDay(item.reviewTime, value))
    })
    return (
      <ul className="events">
        {renderData.map(item => (
          <li key={item.path}>
            {File.name(item.path)}
          </li>
        ))}
      </ul>
    );
  }

  getNeedReviewCards = () => {
    const {cardsReview} = this.props
    return cardsReview.filter(item => Time.isSameDay(item.nextReviewTime, new Date().getTime()))
  }

  render() {
    const {leftMenuVisible, cardsReview} = this.props
    const {current, bottomVisible} = this.state
    return <div>
      <TitleBar
        title=' 📑️ Cards Review'
        leftMenuVisible={leftMenuVisible}
        changeLeftMenuVisible={this.props.updateStatus}
        pushToRepo={this.props.pushToRepo}/>
      <div style={{height: 35}}/>

      <div className='cards-review-body'>
        <Calendar
          className='cards-review-calendar-box'
          value={current}
          dateCellRender={this.dateCellRender}
          onSelect={this.onSelect}
          onPanelChange={this.onPanelChange}/>
      </div>

      <div className='cards-review-bottom'
           style={{
             height: `${bottomVisible ? 200 : 20}px`,
             paddingRight: `${leftMenuVisible ? 215 : 0}px`
           }}>
        <div className='cards-review-bottom-visible-icon cursor_pointer'
             onClick={() => this.setState({bottomVisible: !bottomVisible})}>
          <span style={{float: 'left'}}>
          💔 ❣️ 💘 💖 🕳
            </span>
          <Icon type={
            bottomVisible
              ? 'vertical-align-bottom'
              : 'vertical-align-top'}/>
        </div>

        <div className='cards-review-bottom-item-box'>
          {
            this.getNeedReviewCards().map(item => {
              return <Card
                className='cards-review-bottom-card-item'
                hoverable>
                <header>
                  <span style={{borderBottom: '2px solid #f8f6f1'}}>last status</span> 💖
                  <span style={{float: 'right', color: '#b7906b'}}>
                    let's review
                  </span>
                </header>
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  margin: '5px 0 '
                }}>
                  {File.name(item.path)}
                </div>
                <div style={{margin: 6}}>
                  <Tag> 语法</Tag>
                  <Tag> 英语</Tag>
                </div>
                <Divider orientation="left">history review</Divider>
                <div>💔 ❣️ 💘 💖 🕳 🕳 🕳 🕳</div>
              </Card>
            })
          }
        </div>
      </div>
    </div>
  }
}

export default CardsReview