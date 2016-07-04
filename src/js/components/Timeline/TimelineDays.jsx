import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import cx from 'classnames';
import TimelineHours from './TimelineHours.jsx';
import { HOUR_LABEL_MIN_WIDTH, HOURS_PER_DAY } from '../../utils/constants.js';

class TimelineDays extends Component {
  static propTypes = {
    sizeOf: PropTypes.object,
    time: PropTypes.object,
    offset: PropTypes.number,
    userOffset: PropTypes.number
  }

  state = {
    renderDays: [],
    renderHours: [],
    timeInMiddle: null,
    hoverTime: null,
    clientX: 0
  }

  componentDidMount() {
    moment.locale('ru');
    this.updateState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
  }

  updateState(props) {
    const { sizeOf, time, userOffset } = props;
    const renderDays = this.getRenderDays(props);
    const renderHours = this.getRenderHours(props);
    const addMinutesForMiddle = userOffset / sizeOf.minute;
    const timeInMiddle = moment(time).subtract(addMinutesForMiddle, 'm');
    this.setState({
      renderDays,
      renderHours,
      timeInMiddle
    });
  }

  getRenderDays(props) {
    const { sizeOf, time, offset } = props;
    const daysBefore = Math.floor(offset / sizeOf.day) + 1;
    const dateStart = moment(time).subtract(daysBefore, 'd');
    const daysOnScreen = Math.ceil(window.innerWidth / sizeOf.day);

    const renderDays = [];
    for (var i = 0; i <= daysOnScreen; i++) {
      renderDays.push({
        label: dateStart.format('D MMMM'),
        offset: i - daysBefore,
        weekday: dateStart.format('dddd'),
        wd: dateStart.format('dd'),
        date: moment(dateStart)
      });
      dateStart.add(1, 'd');
    }

    return renderDays;
  }

  getRenderHours(props) {
    const { sizeOf } = props;
    const renderHours = [];
    if (sizeOf.hour >= HOUR_LABEL_MIN_WIDTH) {
      for (var i = 0; i < 24; i++) {
        renderHours.push(i);
      }
    } else {
      let skipHours = Math.floor(sizeOf.day / HOUR_LABEL_MIN_WIDTH);

      while (HOURS_PER_DAY % skipHours !== 0 && skipHours > 1) {
        skipHours--;
      }
      const delta = HOURS_PER_DAY / skipHours;
      let hour = 0;
      while (hour < HOURS_PER_DAY) {
        renderHours.push(hour);
        hour += delta;
      }
    }

    return renderHours;
  }

  setHoverTime = event => {
    const { sizeOf } = this.props;
    const { timeInMiddle } = this.state;
    const { clientX } = event;
    const middleOffset = clientX - window.innerWidth / 2;
    const minutesOffset = middleOffset / sizeOf.minute;
    const hoverTime = moment(timeInMiddle).add(minutesOffset, 'm');
    this.setState({ hoverTime, clientX })
  }

	render() {
    const { sizeOf, time, offset } = this.props;
    const { renderDays, renderHours, hoverTime, clientX } = this.state;

    if (renderDays.length === 0) {
      return null;
    }

    const firstWeekDay = 1;
    const backgroundPosition = `${offset}px top`;
    let timeWidth = offset + sizeOf.hour * time.hours() + sizeOf.minute * time.minutes();

    return (
      <div
        className="timeline-days"
        onMouseMove={this.setHoverTime}
        style={{
          backgroundSize: sizeOf.hour * HOURS_PER_DAY,
          backgroundPosition
        }}
      >
        {renderDays.map((day, key) => {
          let left;
          if (day.offset === 0) {
            const now = moment();
            left = 0; //(now.hours() * sizeOf.hour + now.minutes() * sizeOf.minute);
          }
          return (<div
            key={key}
            className={cx({
              "timeline-days__day": true,
              "timeline-days__day_first-in-week": day.date.isoWeekday() === firstWeekDay
            })}
            style={{
              left: offset + day.offset * sizeOf.day
            }}
          >
            <div
              className="timeline-days__day_date"
              style={{
                marginLeft: left
              }}
            >
              {day.label}
              <span className="timeline-days__day_weekday">
                {renderHours.length > 1 ? day.weekday : day.wd}
              </span>
            </div>
            <TimelineHours
              sizeOf={sizeOf}
              renderHours={renderHours}
            />
          </div>
        )})}
        {hoverTime &&
          <div
            className="timeline-days__hover-time"
            style={{
              left: clientX
            }}
          >
          {hoverTime.format('HH:mm')}
          </div>
        }
      </div>
    );
	}
}

export default TimelineDays;
