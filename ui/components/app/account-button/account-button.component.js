import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Identicon from '../../ui/identicon';
import { EVENT, EVENT_NAMES } from '../../../../shared/constants/metametrics';
import AccountMenu from '../account-menu';

export default class AccountButton extends PureComponent {
  static propTypes = {
    toggleAccountMenu: PropTypes.func,
    selectedAddress: PropTypes.string,
    isUnlocked: PropTypes.bool,
    disabled: PropTypes.bool,
    isAccountMenuOpen: PropTypes.bool,
  };

  static contextTypes = {
    t: PropTypes.func,
    trackEvent: PropTypes.func,
  };

  render() {
    const {
      isUnlocked,
      toggleAccountMenu,
      selectedAddress,
      disabled,
      isAccountMenuOpen,
    } = this.props;

    return isUnlocked ? (
      <div className="account-menu-container">
        <button
          data-testid="account-menu-icon"
          className={classnames('account-menu__icon', {
            'account-menu__icon--disabled': disabled,
          })}
          onClick={() => {
            if (!disabled) {
              !isAccountMenuOpen &&
                this.context.trackEvent({
                  category: EVENT.CATEGORIES.NAVIGATION,
                  event: EVENT_NAMES.NAV_MAIN_MENU_OPENED,
                  properties: {},
                });
              toggleAccountMenu();
            }
          }}
        >
          <Identicon address={selectedAddress} diameter={36} addBorder />
        </button>
        <AccountMenu />
      </div>
    ) : (
      <div></div>
    );
  }
}
