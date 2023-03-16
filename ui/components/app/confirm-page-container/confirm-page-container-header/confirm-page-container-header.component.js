import React from 'react';
import PropTypes from 'prop-types';
import {
  ENVIRONMENT_TYPE_POPUP,
  ENVIRONMENT_TYPE_NOTIFICATION,
} from '../../../../../shared/constants/app';
import { getEnvironmentType } from '../../../../../app/scripts/lib/util';
import NetworkDisplay from '../../network-display';
import Identicon from '../../../ui/identicon';
import { shortenAddress } from '../../../../helpers/utils/util';
import AccountMismatchWarning from '../../../ui/account-mismatch-warning/account-mismatch-warning.component';
// import { useI18nContext } from '../../../../hooks/useI18nContext';
import { Icon, ICON_NAMES } from '../../../component-library';

export default function ConfirmPageContainerHeader({
  onEdit,
  showEdit,
  accountAddress,
  showAccountInHeader,
  children,
}) {
  // const t = useI18nContext();
  const windowType = getEnvironmentType();
  const isFullScreen =
    windowType !== ENVIRONMENT_TYPE_NOTIFICATION &&
    windowType !== ENVIRONMENT_TYPE_POPUP;

  if (!showEdit && isFullScreen) {
    return children;
  }
  return (
    <div data-testid="header-container">
      <div>
        {showAccountInHeader ? (
          <div>
            <div className="confirm-page-container-header__address-identicon">
              <Identicon address={accountAddress} diameter={24} />
            </div>
            <div className="" data-testid="header-address">
              {shortenAddress(accountAddress)}
            </div>
            <AccountMismatchWarning address={accountAddress} />
          </div>
        ) : (
          <div
            className="h-[48px] w-[68px] rounded-[50px] flex items-center justify-center shadow-neumorphic bg-grey-6"
            style={{
              visibility: showEdit ? 'initial' : 'hidden',
            }}
            onClick={() => onEdit()}
          >
            <Icon size="sm" name={ICON_NAMES.ARROW_LEFT} />
          </div>
        )}
        {isFullScreen ? null : <NetworkDisplay />}
      </div>
      {children}
    </div>
  );
}

ConfirmPageContainerHeader.propTypes = {
  accountAddress: PropTypes.string,
  showAccountInHeader: PropTypes.bool,
  showEdit: PropTypes.bool,
  onEdit: PropTypes.func,
  children: PropTypes.node,
};
