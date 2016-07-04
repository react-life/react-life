import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import TimelineHours from './TimelineHours.jsx';
import { DAYS_IN_YEAR, DAYS_IN_LEAP_YEAR, MONTHS_IN_YEAR } from '../../utils/constants.js';

class TimelineYear extends Component {
  state = {
    screen: window.innerWidth,
    months: []
  }

  componentDidMount() {
    const { screen } = this.state;
    const year = moment().year();
    const daysInYear = year % 4 === 0 ? DAYS_IN_LEAP_YEAR : DAYS_IN_YEAR;
    const dayWidth = screen / daysInYear;
    const months = [];
    for (var i = 0; i < MONTHS_IN_YEAR; i++) {
      const time = moment([ year, i, 1 ]);
      months.push(time.endOf('month').date() * dayWidth);
    }

    this.setState({ months });
  }

	render() {
    const { months } = this.state;
    if (months.length === 0) {
      return null;
    }

    return (
      <div className="timeline-year">
        {months.map((width, key) => (
          <div
            key={key}
            style={{
              width
            }}
            className="timeline-year__month"
          />
        ))}
      </div>
    );
	}
}

export default TimelineYear;
