import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import moment from 'moment';
import TimelineTaskFields from './TimelineTaskFields.jsx';

class TimelineTimer extends Component {
  static propTypes = {
    time: PropTypes.object,
    timeSince: PropTypes.object,
    onChange: PropTypes.func,
    userOffset: PropTypes.number,
    activePeriod: PropTypes.number,
    periods: PropTypes.array,
    toggleTimer: PropTypes.func
  }

  state = {
    displayTime: '',
    displayTimeSince: '',
    showTime: false
  }

  componentDidMount() {
    this.updateState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
  }

  updateState(props) {
    const { time, timeSince, userOffset } = props;
    let displayTime = time.format('HH:mm:ss');
    let displayTimeSince = '';
    if (timeSince) {
      displayTime = moment().subtract(timeSince.seconds(), 's')
        .subtract(timeSince.minutes(), 'm')
        .subtract(timeSince.hour(), 'h')
        .format('HH:mm:ss');

      displayTimeSince = timeSince.format('HH:mm:ss');
    }

    this.setState({
      displayTime,
      displayTimeSince,
      userOffset
    })
  }

	render() {
    const { displayTime, displayTimeSince, userOffset, showTime } = this.state;
    const { toggleTimer, periods, activePeriod, onChange } = this.props;
    const isTimer = displayTimeSince !== '';

    const periodData = activePeriod ? periods[activePeriod] : {};
    const color = periodData.color || '';

    return (<div
      className={cx({
        "timeline-timer": true,
        "timeline-timer_active": isTimer
      })}
      style={{
        marginLeft: userOffset,
        borderColor: color
      }}>
      <div
        className="timeline-timer__content"
        style={{
          color
        }}
      >
        <div className="timeline-timer__controls">
          <button
            className={cx({
              "timeline-timer__button": true,
              "timeline-timer__button_active": isTimer
            })}
            style={{
              color
            }}
            title={isTimer ? 'Stop timer' : 'Start timer'}
            onClick={toggleTimer}
          >
            <i className="material-icons">
              {isTimer ? `timer_off` : `timer`}
            </i>
            {isTimer ? `Остановить ` : `Запустить `} таймер
          </button>
        </div>

        {displayTime}
        {isTimer && <div
          className="timeline-timer__since"
        >
           {showTime ? time.format('HH:mm:ss') : `с ${displayTimeSince}`}
        </div>}
        {isTimer && <div className="timeline-timer__fields">
          <TimelineTaskFields
            onChange={onChange()}
            period={periodData}
          />
        </div>}
      </div>
    </div>);
	}
}

export default TimelineTimer;
