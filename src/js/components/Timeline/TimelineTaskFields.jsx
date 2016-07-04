import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import moment from 'moment';
import Selectbox from '../Selectbox.jsx';
import { DEFAULT_LABELS, TASK_USER_FIELDS } from '../../utils/constants.js';
class TimelineTaskFields extends Component {
  static propTypes = {
    period: PropTypes.object,
    onChange: PropTypes.func
  }

  renderSelect = options => {
    const { onChange } = this.props;
    const { value, name, limit = 0, storage = '', label } = options;
    const variants = JSON.parse(localStorage[storage]) || null;
    if (!variants) {
      return null;
    }

    if (!limit || limit > 1) {
      return variants.map((variant, key) => {
        return this.renderCheckbox({ key, label, name, value, variant });
      })
    }

    return (
      <select
        name={name}
        value={value}
        className="timeline-task-fields__select"
        onChange={event => onChange({
          [name]: event.target.value
        })}
      >
        {variants.map((variant, key) => (
          <option
            key={key}
            value={variant}
          >
            {variant}
          </option>
        ))}
      </select>
    );
  }

  renderText = options => {
    const { onChange } = this.props;
    const { name, value, key = 0, placeholder = '' } = options;

    return (
      <input
        key={key}
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        className="timeline-task-fields__input"
        onChange={event =>
          onChange({ [name]: event.target.value })
        }
      />
    );
  }

  renderCheckbox = options => {
    const { onChange } = this.props;
    const { value, label, name, key = 0 } = options;
    return (
      <label
        key={key}
        className="timeline-task-fields__label"
      >
        <input
          type="checkbox"
          name={name}
          checked={value === true}
          className="timeline-task-fields__checkbox"
          onChange={event => {
            onChange({[name]: event.target.checked})
          }}
        />
        {label}
      </label>
    );
  }

  renderField = options => {
    const {
      period,
      type,
      name,
      limit = 0,
      label,
      key = 0
    } = options;

    const value = period[name] || '';
    const data = { value, ...options };
    return (
      <div
        key={key}
        className="timeline-task-fields__field"
      >
        <div className="timeline-task-fields__field-label">
          { type !== 'checkbox' && label }
        </div>
        <div className="timeline-task-fields__field-input">
          { type === 'select' && this.renderSelect(data) }
          { type === 'checkbox' && this.renderCheckbox(data) }
          { type === 'text' && this.renderText(data) }
        </div>
      </div>
    );
  }

	render() {
    const { period, onChange } = this.props;

    return (
      <div className="timeline-task-fields">
        <div className="timeline-task-fields__desc">
          {TASK_USER_FIELDS.map((field, key) => {
            return this.renderField({ period, key, ...field })
          })}
        </div>
    </div>);
	}
}

export default TimelineTaskFields;
