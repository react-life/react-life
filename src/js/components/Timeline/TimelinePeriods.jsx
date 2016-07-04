import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import moment from 'moment';
import TimelineTask from './TimelineTask.jsx';

class TimelinePeriods extends Component {
  static propTypes = {
    time: PropTypes.object,
    sizeOf: PropTypes.object,
    periods: PropTypes.array,
    onChange: PropTypes.func,
    onTaskContinue: PropTypes.func
  }

  state = {
    activePeriod: null,
    renderPeriods: []
  }

  componentDidMount() {
    const renderPeriods = this.getRenderPeriods(this.props);
    this.setState({ renderPeriods });
  }

  componentWillReceiveProps(nextProps) {
    const renderPeriods = this.getRenderPeriods(nextProps);
    this.setState({ renderPeriods });
  }

  getRenderPeriods(props) {
    const { time, sizeOf, periods } = props;
    const renderPeriods = periods.map(period => {
      const { id, from, to = null } = period;
      const right = !to ? 0 : time.diff(to, 'minutes') * sizeOf.minute;
      const width = (to || time).diff(from, 'minutes') * sizeOf.minute;
      return {
        right,
        width,
        ...period
      }
    });

    return renderPeriods;
  }

  setActivePeriod = key => event => {
    event.stopPropagation();
    this.setState({
      activePeriod: key
    });
  }

	render() {
    const { renderPeriods, activePeriod } = this.state;
    const { onChange, onTaskContinue } = this.props;
		return (
			<div className="timeline-periods">
        {renderPeriods.map((period, key) => {
          const isActive = key === activePeriod;
          const isCurrent = !period.to;
          const background = period.color || '';
          return (<div
            key={key}
            onClick={this.setActivePeriod(key)}
            title={period.desc || ''}
            className={cx({
              "timeline-periods__item": true,
              "timeline-periods__item_active": isActive,
              "timeline-periods__item_current": isCurrent
            })}
            style={{
              right: period.right,
              width: period.width,
              background
            }}
          >
            <TimelineTask
              onChange={onChange(period.id)}
              onTaskContinue={onTaskContinue(period.id)}
              isActive={isActive}
              onClose={this.setActivePeriod(null)}
              period={period} />
          </div>);
        }
      )}
			</div>
		)
	}
}

export default TimelinePeriods;
