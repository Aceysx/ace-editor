import React from 'react'
import Calendar from 'react-github-contribution-calendar'
import {Col, Divider, Row} from "antd"
import Time from "../../model/time"

const total_part_of_one_day = 24 * 60 / 20

const STATUS_COLORS = ['#EEE', '#36b8ff', '#1e678f', '#0e2e40',];
const TimecardCalendar = ({plans}) => {
  const values = {}
  plans.forEach(plan => {
    const key = plan.date
    const value = plan.tasks.reduce((sum, current) => {
      return sum + Object.values(current.label)[0]
    }, 0)
    values[key] = Math.ceil(value / total_part_of_one_day)
  })
  return <Row type='flex' justify='center'>
    <Col span={15}>
      <Calendar panelColors={STATUS_COLORS} values={values}
                until={Time.format(Time.tomorrow())}/>
      <span>
        <span style={{fontSize: 12, fontWeight: 'bold', margin: '0 5px', display: 'inline-block'}}>Less</span>
        {
          STATUS_COLORS.map(color =>
            <span style={{
              background: `${color}`, margin: '0 2px',
              width: 12, height: 12, display: 'inline-block',
              borderRadius: 2
            }}/>
          )
        }
        <span style={{fontSize: 12, fontWeight: 'bold', margin: '0 5px', display: 'inline-block'}}>More</span>
        <Divider type='vertical'/>
        <span style={{fontSize: 12, opacity: '0.8', color: 'gray'}}>1=20mins</span>
      </span>
    </Col>
  </Row>
}

export default TimecardCalendar