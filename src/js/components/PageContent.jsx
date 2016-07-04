import React, { Component, PropTypes } from 'react';

/**
 * Page content container component
 */
class PageContent extends Component {
    render() {
        const { location, children } = this.props;

        return (
            <div>
                {React.createElement('div', {key: location.pathname}, children)}
            </div>
        )
    }
}

export default PageContent;