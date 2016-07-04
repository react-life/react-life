import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { HOUR_LABEL_MIN_WIDTH, HOURS_PER_DAY } from '../../utils/constants.js';

class TimelineHours extends Component {
  static propTypes = {
    sizeOf: PropTypes.object,
    renderHours: PropTypes.array
  }

	render() {
    const { sizeOf, renderHours } = this.props;
    if (renderHours.length < 1) {
      return null;
    }
    const skipHours = renderHours.length > 1 ?
      parseInt(renderHours[1]) - parseInt(renderHours[0]) :
      12;

    const backgroundSize = skipHours > 1
      ? sizeOf.hour * skipHours
      : sizeOf.hour;

    return (
      <div
        className="timeline-hours"
        style={{
          backgroundSize,
          width: sizeOf.day
        }}
      >
        {skipHours > 1 && skipHours <= 12 &&
          <div
            className="timeline-hours_line_small"
            style={{
              backgroundSize: sizeOf.hour
            }}
          />}
        {renderHours.length > 1 && renderHours.map((hour, key) => (
          <div
            key={key}
            className="timeline-hours__hour"
            style={{
              left: sizeOf.hour * hour
            }}
          >
            {hour < 10 ? '0'+hour : hour}
          </div>
        ))}
      </div>);
	}
}

export default TimelineHours;
