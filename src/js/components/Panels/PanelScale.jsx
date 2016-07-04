import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import moment from 'moment';

import { SCALE_MIN, SCALE_MAX, SCALE_STEP } from '../../utils/constants.js';

class PanelScale extends Component {
  static propTypes = {
    scale: PropTypes.number
  }

  state = {
    scaleMin: 0,
    scaleMax: 0,
    scale: 0
  }

  componentDidMount() {
    const { scale } = this.props;
    const scaleMin = SCALE_MIN;
    const scaleMax = SCALE_MAX;
    this.setState({
      scaleMin,
      scaleMax,
      scale
    });
  }

  componentWillReceiveProps(nextProps) {
    const { scale } = nextProps;
    this.setState({ scale });
  }

	render() {
    const { scaleMin, scaleMax, scale } = this.state;
    const scalePosition = scale / ((scaleMax - scaleMin) / 100).toFixed(2);

    return (
      <div className="panel-scale">

      </div>
    );
	}
}

export default PanelScale;
