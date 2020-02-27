import React from "react"
import TitleBar from "../title-bar/title-bar"
import moment from "moment"
import {Calendar, Card, Divider, Icon, Tag} from "antd"
import CardReview from "../../model/card-review"
import File from '../../model/file'
import FileResource from "../../infrastructure/file-resource"
import ReviewBody from "./review-body"

import '../../resources/css/cards-review.css'
import CardsReviewBottom from "./cards-review-bottom";

const EMPTY_ITEM = undefined

class CardsReview extends React.Component {
  state = {
    bottomVisible: true,
    reviewCard: EMPTY_ITEM,
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

  getParseRenderData = (current, cardsReview) => {
    return cardsReview.filter(card => {
      return CardReview.isTodayInReviewRange(card, current)
    })
  }

  dateCellRender = (current, cardsReview) => {
    const renderData = this.getParseRenderData(current, cardsReview)

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

  getNeedReviewCards = cardsReview => {
    const {current} = this.state
    return cardsReview.filter(item => CardReview.isTodayInReviewRange(item, current))
  }

  getCardDetail = (reviewCard) => {
    return FileResource.findFile(window.getNoteWorkspacePath() + reviewCard.path)
  }

  submitReview = (_path, status, cardsReview) => {
    let reviewCard = CardReview.reviewCard(cardsReview, File.relativePath(_path), status);
    this.props.updateCardsReview(reviewCard)
  }

  render() {
    const {leftMenuVisible, cardsReview} = this.props
    const {current, bottomVisible, reviewCard} = this.state
    return <div>
      <TitleBar
        title=' 📑️ Cards Review'
        leftMenuVisible={leftMenuVisible}
        changeLeftMenuVisible={this.props.updateStatus}
        pushToRepo={this.props.pushToRepo}/>
      <div style={{height: 35}}/>

      <div className='cards-review-body'>
        {
          reviewCard
            ? <ReviewBody
              reviewToolVisible={CardReview.isTodayReviewed(
                cardsReview.find(item => item.path === reviewCard.path),
                current)}
              bottomVisible={bottomVisible}
              back={() => this.setState({reviewCard: EMPTY_ITEM})}
              submitReview={(_path, status) => this.submitReview(_path, status, cardsReview)}
              cardDetail={this.getCardDetail(reviewCard)}
            />
            : <Calendar
              className='cards-review-calendar-box'
              value={current}
              dateCellRender={current => this.dateCellRender(current, cardsReview)}
              onSelect={this.onSelect}
              onPanelChange={this.onPanelChange}/>
        }
      </div>

      <div className='cards-review-bottom'
           style={{
             height: `${bottomVisible ? 200 : 30}px`,
             paddingRight: `${leftMenuVisible ? 215 : 0}px`
           }}>
        <CardsReviewBottom
          cards={this.getNeedReviewCards(cardsReview)}
          bottomVisible={bottomVisible}
          reviewCard={reviewCard => this.setState({reviewCard, bottomVisible: false})}
          updateBottomVisible={() => this.setState({bottomVisible: !bottomVisible})}
        />
      </div>
    </div>
  }
}

export default CardsReview