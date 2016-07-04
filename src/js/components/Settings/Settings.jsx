import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

import SettingsLabel from './SettingsLabel.jsx';

import { SETTINGS_LIST } from '../../utils/constants.js';

class Settings extends Component {
	static propTypes = {
    scale: PropTypes.number,
    userOffset: PropTypes.number
  }

  state = {
    isSettingsOpened: false,
    selectedItem: null
  }

  toggleSettingsMenu = () => {
    this.setState({
      isSettingsOpened: !this.state.isSettingsOpened
    });
  }

  showSettingsMenu = item => event => {
    this.setState({
      selectedItem: item
    });
  }

	render() {
    const { isSettingsOpened, selectedItem } = this.state;

		return (
			<div className="settings">
        {isSettingsOpened && <div className="settings__menu">
          <button
            className="settings__item settings__item_labels"
            onClick={this.showSettingsMenu('labels')}
          >
            Labels
          </button>
          {selectedItem === 'labels' &&
            <SettingsLabel />}
        </div>}
        <button
          className={cx({
            "settings__button": true,
            "settings__button_active": isSettingsOpened
          })}
          onClick={this.toggleSettingsMenu}
        >
          <i className="material-icons">settings</i>
        </button>
			</div>
		)
	}
}

export default Settings;
