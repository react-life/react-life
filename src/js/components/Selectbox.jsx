import React, { Component, PropTypes } from 'react';

class Selectbox extends Component {
  static propTypes = {
    items: PropTypes.array,
    selected: PropTypes.number,
    onChange: PropTypes.func
  }

  state = {
    selected: 0,
    isOpen: false
  }

  toggleState = event => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  setSelected = num => event => {
    const { onChange, items } = this.props;
    const item = items[num];
    onChange({
      project: {
        ...item
      }
    });    
    this.setState({
      selected: num
    });
  }

	render() {
    const { selected, isOpen } = this.state;
    const { items } = this.props;
    const currentItem = items[selected];
    return (
      <div
        className="selectbox"
        onClick={this.toggleState}
      >
        <span className="selectbox__arrow">
          <i className="material-icons">expand_more</i>
        </span>
        {currentItem.value}
        {isOpen && <div className="selectbox__list">
        {items.map((item, i) => {
          const attrs = {};
          let value = '';
          if (typeof(item) === 'object') {
            value = item.value;
            Object.keys(item).map(key => attrs['data-'+key] = item[key]);
          } else {
            value = item;
            attrs['data-value'] = item;
          }

          return (
            <div
              key={i}
              className="selectbox__item"
              onClick={this.setSelected(i)}
              {...attrs}
            >
              {value}
            </div>
          )}
        )}
        </div>}
      </div>
    );
	}
}

export default Selectbox;
