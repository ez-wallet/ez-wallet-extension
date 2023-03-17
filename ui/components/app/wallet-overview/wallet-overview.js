import React, { useState, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import PropTypes from 'prop-types';
import classnames from 'classnames';
import copyToClipboard from 'copy-to-clipboard';
import { showModal } from '../../../store/actions';
import Tooltip from '../../ui/tooltip';
import { Icon, ICON_NAMES, ICON_SIZES } from '../../component-library';
import { IconColor } from '../../../helpers/constants/design-system';
import { shortenAddress } from '../../../helpers/utils/util';
import { SECOND } from '../../../../shared/constants/time';
import { toChecksumHexAddress } from '../../../../shared/modules/hexstring-utils';
import { I18nContext } from '../../../contexts/i18n';
import AccountButton from '../account-button';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import { EVENT, EVENT_NAMES } from '../../../../shared/constants/metametrics';

const WalletOverview = ({
  token,
  balance,
  buttons,
  className,
  icon,
  loading,
}) => {
  const t = useContext(I18nContext);
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch();
  const trackEvent = useContext(MetaMetricsContext);

  const checkSummedAddress = toChecksumHexAddress(token.address);

  useEffect(() => {
    let copyTimeout;
    if (copied) {
      copyTimeout = setTimeout(() => setCopied(false), SECOND * 3);
    }
    return () => {
      clearTimeout(copyTimeout);
    };
  }, [copied]);

  return (
    <div className={classnames('wallet-overview', className)}>
      <div className="wallet-overview__container">
        <div className="wallet-overview__name-container">
          <div className="wallet-overview__name">{token.name}</div>
          <AccountButton />
        </div>

        <p className="wallet-overview__title">{t('yourBalance')}</p>
        <div className="wallet-overview__balance">
          {loading ? null : icon}
          {balance}
        </div>
        <div className="wallet-overview__actions">
          <Tooltip
            wrapperClassName="wallet-overview__tooltip-wrapper"
            position="bottom"
            title={copied ? t('copiedExclamation') : t('copyToClipboard')}
          >
            <button
              className="wallet-overview__clickable"
              data-testid="wallet-overview-click"
              onClick={() => {
                setCopied(true);
                copyToClipboard(checkSummedAddress);
              }}
            >
              <div className="wallet-overview__address">
                {shortenAddress(checkSummedAddress)}
                <div className="wallet-overview__copy">
                  <Icon
                    name={copied ? ICON_NAMES.COPY_SUCCESS : ICON_NAMES.COPY}
                    size={ICON_SIZES.SM}
                    color={IconColor.iconAlternative}
                  />
                </div>
              </div>
            </button>
          </Tooltip>
          <button
            className="wallet-overview__qr-code"
            onClick={() => {
              dispatch(showModal({ name: 'ACCOUNT_QR' }));
              trackEvent({
                event: EVENT_NAMES.NAV_ACCOUNT_DETAILS_OPENED,
                category: EVENT.CATEGORIES.NAVIGATION,
                properties: {
                  location: 'Account Options',
                },
              });
            }}
          >
            <Icon name="qr-code" />
          </button>
        </div>
      </div>

      <div className="wallet-overview__buttons">{buttons}</div>
    </div>
  );
};

WalletOverview.propTypes = {
  token: PropTypes.object,
  balance: PropTypes.element.isRequired,
  buttons: PropTypes.element.isRequired,
  className: PropTypes.string,
  icon: PropTypes.element.isRequired,
  loading: PropTypes.bool,
};

WalletOverview.defaultProps = {
  className: undefined,
};

export default WalletOverview;
