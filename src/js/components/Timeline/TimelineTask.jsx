import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import moment from 'moment';
import TimelineTaskFields from './TimelineTaskFields.jsx';

class TimelineTask extends Component {
  static propTypes = {
    time: PropTypes.object,
    period: PropTypes.object,
    isActive: PropTypes.bool,
    onClose: PropTypes.func,
    onChange: PropTypes.func,
    onTaskContinue: PropTypes.func
  }

	render() {
    const { period, isActive, onClose, onChange, onTaskContinue } = this.props;
    if (!period || !period.to) {
      return null;
    }

    const { id, from, to, desc = '', color = '' } = period;

    const diffMinutes = to.diff(from, 'minutes');
    const duration = moment.duration(diffMinutes, 'minutes');

    return (<div className={cx({
        "timeline-task": true,
        "timeline-task_hidden": !isActive
      })}
      style={{
        borderColor: color
      }}
    >
      <div className="timeline-task__content">

        <div className="timeline-task__controls">
          <button
          className="timeline-task__button timeline-task__button_close"
          onClick={onTaskContinue}
          >
          <i className="material-icons timeline-task__button_continue">
          play_arrow
          </i>
          </button>
          <button
            className="timeline-task__button timeline-task__button_close"
            onClick={onClose}
          >
            <i className="material-icons timeline-task__button_close">
              close
            </i>
          </button>
        </div>

        <div
          className="timeline-task__duration"
          style={{
            color
          }}
        >
          {duration.humanize()}
        </div>
        <div className="timeline-task__since">
          {from.format('HH:mm')} − {to.format('HH:mm')}
        </div>
        <div className="timeline-task__fields">
          <TimelineTaskFields
            onChange={onChange}
            period={period}
          />
        </div>
      </div>
    </div>);
	}
}

export default TimelineTask;
