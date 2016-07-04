import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

import { DEFAULT_LABELS } from '../../utils/constants.js';

class SettingsLabel extends Component {
  state = {
    labels: []
  }

	componentDidMount() {
    const labels = DEFAULT_LABELS;
    this.setState({ labels });
	}

  componentWillUpdate(nextProps, nextState) {
    const { labels } = nextState;
    localStorage['labels'] = JSON.stringify(labels);
  }

	render() {
    const { menuOpened, labels } = this.state;
		return (
			<div className="settings-label">
        {labels.map((label, key) => {
          return (
            <div key={key}>
              {label.title}
            </div>
          );
        })}
			</div>
		)
	}
}

export default SettingsLabel;
