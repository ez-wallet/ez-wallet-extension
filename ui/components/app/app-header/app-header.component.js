import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { EVENT, EVENT_NAMES } from '../../../../shared/constants/metametrics';
import NetworkDisplay from '../network-display';

export default class AppHeader extends PureComponent {
  static propTypes = {
    networkDropdownOpen: PropTypes.bool,
    showNetworkDropdown: PropTypes.func,
    hideNetworkDropdown: PropTypes.func,
    hideNetworkIndicator: PropTypes.bool,
    disabled: PropTypes.bool,
    disableNetworkIndicator: PropTypes.bool,
  };

  static contextTypes = {
    t: PropTypes.func,
    trackEvent: PropTypes.func,
  };

  handleNetworkIndicatorClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const {
      networkDropdownOpen,
      showNetworkDropdown,
      hideNetworkDropdown,
      disabled,
      disableNetworkIndicator,
    } = this.props;

    if (disabled || disableNetworkIndicator) {
      return;
    }

    if (networkDropdownOpen === false) {
      this.context.trackEvent({
        category: EVENT.CATEGORIES.NAVIGATION,
        event: EVENT_NAMES.NAV_NETWORK_MENU_OPENED,
        properties: {},
      });
      showNetworkDropdown();
    } else {
      hideNetworkDropdown();
    }
  }

  render() {
    const { hideNetworkIndicator, disableNetworkIndicator, disabled } =
      this.props;

    return (
      <div className="w-full flex flex-col items-center justify-center p-4">
        {!hideNetworkIndicator && (
          <NetworkDisplay
            onClick={(event) => this.handleNetworkIndicatorClick(event)}
            disabled={disabled || disableNetworkIndicator}
          />
        )}
      </div>
    );
  }
}
