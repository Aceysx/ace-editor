import Time from "./time"

const CardReview = {
  INTERVAL: [0, 1, 2, 4, 7, 15, 30, 60],
  STATUS: {NO_REVIEW: 'no-review', STRANGE: 'strange', JUST_SO_SO: 'just-so-so', WELL: 'well'},
  updateToCardsReview: (cardsReview, filePath) => {
    const afterFilter = cardsReview.filter(item => item.path !== filePath)
    if (afterFilter.length === cardsReview.length) {
      return [...cardsReview, CardReview._createCard(filePath)]
    }
    return afterFilter
  },
  isReviewOver: (card, current) => {
    if (card.isFinish) {
      const lastReview = card.history[card.history.length - 1]
      return Time.interval(lastReview.reviewTime, current) > 0
    }
    return false
  },
  isTodayInReviewRange: (card, current) => {
    if (CardReview.isReviewOver(card, current)) {
      return false
    }
    if (Time.isSameDay(current, card.nextReviewTime)) {
      return true;
    }
    if (CardReview._isTodayInHistoryReview(card, current)) {
      return true;
    }
    const lastReviewHistory = card.history.length
      ? card.history[card.history.length - 1]
      : card
    const planIntervals = CardReview.INTERVAL.slice(CardReview.INTERVAL.indexOf(lastReviewHistory.interval || 0) + 1)
    const intervalTimes = planIntervals.map((interval, index) => {
      return eval(planIntervals.slice(0, index + 1).join("+"))
    })
    return intervalTimes.some(interval => {
      const nextReviewTime = lastReviewHistory.nextReviewTime || lastReviewHistory.reviewTime
      return Time.diff(nextReviewTime, current, interval)
    })
  },
  reviewCard: (cardsReview, _path, status) => {
    return cardsReview.map(card => {
      if (card.path === _path) {
        const lastReviewInterval = card.history.length
          ? card.history[card.history.length - 1].interval
          : 0
        const nextInterval = CardReview._nextInterval(status, lastReviewInterval)
        const nextReviewTime = Time.add(card.nextReviewTime, nextInterval === 0 ? 1 : nextInterval)
        const isFinish = nextInterval === CardReview.INTERVAL[CardReview.INTERVAL.length - 1]

        if (card.history.length === 0) {
          return Object.assign({},
            {
              ...card,
              nextReviewTime: Time.add(card.nextReviewTime, 1)
            },
            {history: [...card.history, CardReview._createReviewHistory(status, 0)]})
        }
        return Object.assign({},
          {...card, isFinish, nextReviewTime},
          {history: [...card.history, CardReview._createReviewHistory(status, nextInterval)]})
      }
      return card
    })
  },
  isTodayReviewed: (card, current) => {
    return Time.isSameDay(current, card.nextReviewTime)
      && Time.isSameDay(card.nextReviewTime, new Date().getTime())
  },
  _nextInterval: (status, interval) => {
    const intervals = CardReview.INTERVAL
    const index = intervals.indexOf(interval)
    if (status === CardReview.STATUS.WELL) {
      return index === intervals.length ? interval : intervals[index + 1]
    }
    if (status === CardReview.STATUS.JUST_SO_SO) {
      return interval
    }
    return index === 0 ? interval : intervals[index - 1]
  },
  _isTodayInHistoryReview: (card, current) => {
    return card.history.find(item => {
      return Time.isSameDay(item.reviewTime, current)
    })
  },
  _createCard: filePath => {
    const current = new Date().getTime()
    return {
      path: filePath,
      startReviewTime: current,
      nextReviewTime: current,
      isFinish: false,
      history: []
    }
  },
  _createReviewHistory: (status, interval) => {
    return {
      reviewTime: new Date().getTime(),
      status,
      interval
    }
  }
}

export default CardReview