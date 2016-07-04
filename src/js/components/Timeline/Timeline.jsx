import _ from 'lodash';
import cx from 'classnames';
import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import moment from 'moment';

import TimelineYear from './TimelineYear.jsx';
import TimelineDays from './TimelineDays.jsx';
import TimelineTimer from './TimelineTimer.jsx';
import TimelinePeriods from './TimelinePeriods.jsx';

import PanelScale from '../Panels/PanelScale.jsx';

import {
  HOUR_LABEL_MIN_WIDTH,
  HOUR_WIDTH_PX,
  HOURS_PER_DAY,
  MINUTES_PER_HOUR,
  DELAY,
  SCALE_MIN,
  SCALE_MAX,
  SCALE_STEP,
  ID_PERIOD_FORMAT,
  DEFAULT_FIELDS_VALUES } from '../../utils/constants.js';

class Timeline extends Component {
  static propTypes = {
    scale: PropTypes.number,
    offset: PropTypes.any
  }

  state = {
    time: moment(), // now
    timeSince: null, // start time when timer is on
    scale: 0.3,
    offset: 0,
    userOffset: 0,
    sizeOf: {},

    drag: {
      active: false,
      startPosition: null
    },

    periods: [],
    activePeriod: null
  }

  componentDidMount() {
    Object.keys(DEFAULT_FIELDS_VALUES).map(storage => {
      if (localStorage[storage]) {
        return;
      }
      const values = DEFAULT_FIELDS_VALUES[storage];
      localStorage[storage] = JSON.stringify(values);
    });

    const demoPeriods = [{
      id: moment().add(-3, 'h').format(ID_PERIOD_FORMAT),
      from: moment().add(-3, 'h'),
      to: moment().add(-1.5, 'h'),
      description: 'Проверка',
      project: 'relef',
      color: '#fa6a23'
    }, {
      id: moment().add(-8, 'h').format(ID_PERIOD_FORMAT),
      from: moment().add(-8, 'h'),
      to: moment().add(-4, 'h'),
      description: 'Долго сидел',
      project: 'TCS',
      label: 'read'
    }];

    let periods = localStorage['periods'];
    if (!periods) {
      periods = demoPeriods;
    } else {
      try {
        periods = JSON.pasrse(periods);
      } catch(e) {
        periods = demoPeriods;
      }
    }

    let timeSince;
    if (periods && periods.length > 0) {
      periods.map((period, key) => {
        period.from = moment(period.from);
        if (!period.id) {
          period.id = period.from.format(ID_PERIOD_FORMAT);
        }
        if (!period.to) {
          timeSince = period.from;
          this.state.activePeriod = key;
        } else {
          period.to = moment(period.to);
        }
        return period;
      });
      this.state.periods = periods;
    }

    this.updateSizes(this.state);
    this.startTimer(timeSince);

    this.firstTime = localStorage['showedIntro'] ? false : true;
    localStorage['showedIntro'] = true;

    // Stop drag'n'drop when mouseup
    window.addEventListener('mouseup', this.stopDrag);
  }

  componentWillUpdate(nextProps, nextState) {
    const { periods } = nextState;
    const str = JSON.stringify(periods);
    localStorage['periods'] = str;
  }

  updateSizes(state) {
    state = state || this.state;
    const { time, scale, userOffset } = state;
    const sizeOf = this.getSizeOf(scale);
    const offset = this.getOffset(sizeOf, time) + userOffset
    this.setState({ sizeOf, offset });
  }

  startTimer = timeSince => {
    this.setState({ timeSince });
    this.timer = setInterval(() => {
      this.setState({
        time: moment()
      });
    }, DELAY);
  }

  stopTimer = () => {
    clearInterval(this.timer);
  }

  changeScale = event => {
    const { deltaY } = event;
    const delta = deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
    let newScale = this.state.scale + delta;

    if (newScale > SCALE_MAX) {
      newScale = SCALE_MAX;
    }

    if (newScale < SCALE_MIN) {
      newScale = SCALE_MIN;
    }

    this.state.scale = newScale;
    this.updateSizes(this.state);
  }

  startDrag = event => {
    const { userOffset } = this.state;

    this.state.drag = {
      active: true,
      startPosition: event.clientX - userOffset
    };
  }

  drag = event => {
    const { time, sizeOf, drag: { active, startPosition } } = this.state;
    if (!active || startPosition === null) return;

    this.state.userOffset = event.clientX - startPosition;
    this.updateSizes(this.state);
  }

  stopDrag = event => {
    this.state.drag = {
      active: false,
      startPosition: null
    };
  }

  toggleTimer = event => {
    const { timeSince, periods } = this.state;
    this.stopTimer();

    if (!timeSince) {
      const from = moment();
      periods.push({
        id: moment().format(ID_PERIOD_FORMAT),
        from
      });
      this.state.activePeriod = periods.length - 1;
      this.startTimer(from);
    } else {
      const lastPeriod = periods.pop();
      periods.push({
        to: moment(),
        ...lastPeriod
      });
      this.state.activePeriod = null;
      this.startTimer();
    }
    this.setState({ periods });
  }

  getSizeOf(scale) {
    const hour = Number((HOUR_WIDTH_PX * scale).toFixed(0));
    const minute = Number((hour / MINUTES_PER_HOUR).toFixed(2));
    const day = hour * HOURS_PER_DAY;

    return {
      minute,
      hour,
      day
    };
  }

  getOffset(sizeOf, time) {
    const timePosition = window.innerWidth / 2;
    return Math.round(
        timePosition -
        (sizeOf.minute * time.minutes()) -
        (sizeOf.hour * time.hours())
      );
  }

  setPeriodData = id => config => {
    const { periods } = this.state;
    const keys = Object.keys(config);

    periods.map(period => {
      if ((!id && !period.to) || (id === period.id)) {
        keys.map(key => period[key] = config[key]);
      }
      return period;
    });

    this.setState({ periods });
  }

  taskContinue = id => event => {
    const { timeSince, periods, time } = this.state;
    let newPeriod;
    periods.map(period => {
      if (period.id === id) {
        newPeriod = Object.assign({}, period);
      }
    });
    if (newPeriod) {
      if (timeSince) { this.toggleTimer(); }
      const from = moment(time);
      newPeriod.id = from.format(ID_PERIOD_FORMAT);
      newPeriod.from = from;
      newPeriod.to = null;
      periods.push(newPeriod);
      this.state.activePeriod = periods.length - 1;
      this.startTimer(from);
    }
  }

  renderIntro() {
    return (
      <div className="timeline__intro"
        ref={ref => this.intro = ref}
        onClick={event => {
          this.intro.style.display = 'none';
        }}>
        <i className="timeline__intro-arrow material-icons">undo</i>
        <div className="timeline__intro-dnd">
          Эту панельку можно хватать и тянуть. <br />Почувствуй себя бурлаком!
        </div>

        <div className="timeline__intro-scale">
          А еще по всей странице работает масштабирование колесиком мыши.<br />
          Когда-нибудь я добьюсь масштаба, глядя на который хоть немного осознаешь время
        </div>
      </div>
    );
  }

  render() {
    const { scale, time, userOffset, periods } = this.state;
    const screen = window.innerWidth;
    const timePosition = screen / 2 + userOffset;

    return (
      <div
        className="timeline"
        onWheel={this.changeScale}
      >
        {this.firstTime && this.renderIntro()}
        <div className="timeline__timer">
          <TimelineTimer
            onChange={this.setPeriodData}
            toggleTimer={this.toggleTimer}
            {...this.state}
          />
        </div>

        <div
          className="timeline__line"
          onMouseDown={this.startDrag}
          onMouseMove={this.drag}
        >
          <TimelineDays
            {...this.state} />

          {timePosition > 0 && <div
            className="timeline__past"
            style={{
              width: timePosition
            }}
          >
            <TimelinePeriods
              onChange={this.setPeriodData}
              onTaskContinue={this.taskContinue}
              {...this.state} />
          </div>}
        </div>

      </div>
    )
  }
}

export default Timeline;
