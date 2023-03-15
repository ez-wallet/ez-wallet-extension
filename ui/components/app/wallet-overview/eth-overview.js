import React, { Fragment, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import { useHistory } from 'react-router-dom';
import Identicon from '../../ui/identicon';
import { I18nContext } from '../../../contexts/i18n';
import {
  SEND_ROUTE,
  BUILD_QUOTE_ROUTE,
} from '../../../helpers/constants/routes';
import Tooltip from '../../ui/tooltip';
import UserPreferencedCurrencyDisplay from '../user-preferenced-currency-display';
import { PRIMARY, SECONDARY } from '../../../helpers/constants/common';
import {
  isBalanceCached,
  getShouldShowFiat,
  getCurrentKeyring,
  getSwapsDefaultToken,
  getIsSwapsChain,
  getIsBuyableChain,
  getNativeCurrencyImage,
  getSelectedAccountCachedBalance,
  getSelectedIdentity,
} from '../../../selectors';
import { setSwapsFromToken } from '../../../ducks/swaps/swaps';
import IconButton from '../../ui/icon-button';
import { isHardwareKeyring } from '../../../helpers/utils/hardware';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import { EVENT, EVENT_NAMES } from '../../../../shared/constants/metametrics';
import Spinner from '../../ui/spinner';
import { startNewDraftTransaction } from '../../../ducks/send';
import { AssetType } from '../../../../shared/constants/transaction';
import DepositPopover from '../deposit-popover';
import { Icon, ICON_NAMES } from '../../component-library';
import WalletOverview from './wallet-overview';

const EthOverview = ({ className }) => {
  const dispatch = useDispatch();
  const t = useContext(I18nContext);
  const trackEvent = useContext(MetaMetricsContext);
  const history = useHistory();
  const [showDepositPopover, setShowDepositPopover] = useState(false);
  const keyring = useSelector(getCurrentKeyring);
  const usingHardwareWallet = isHardwareKeyring(keyring?.type);
  const balanceIsCached = useSelector(isBalanceCached);
  const showFiat = useSelector(getShouldShowFiat);
  const balance = useSelector(getSelectedAccountCachedBalance);
  const isSwapsChain = useSelector(getIsSwapsChain);
  const isBuyableChain = useSelector(getIsBuyableChain);
  const primaryTokenImage = useSelector(getNativeCurrencyImage);
  const defaultSwapsToken = useSelector(getSwapsDefaultToken);
  const selectedIdentity = useSelector(getSelectedIdentity);

  return (
    <>
      {showDepositPopover && (
        <DepositPopover onClose={() => setShowDepositPopover(false)} />
      )}
      <WalletOverview
        token={selectedIdentity}
        loading={!balance}
        balance={
          <Tooltip
            position="top"
            title={t('balanceOutdated')}
            disabled={!balanceIsCached}
          >
            <div className="eth-overview__balance">
              <div className="eth-overview__primary-container">
                {balance ? (
                  <UserPreferencedCurrencyDisplay
                    className={classnames('eth-overview__primary-balance', {
                      'eth-overview__cached-balance': balanceIsCached,
                    })}
                    data-testid="eth-overview__primary-currency"
                    value={balance}
                    type={PRIMARY}
                    ethNumberOfDecimals={4}
                    hideTitle
                  />
                ) : (
                  <Spinner
                    color="var(--color-secondary-default)"
                    className="loading-overlay__spinner"
                  />
                )}
                {balanceIsCached ? (
                  <span className="eth-overview__cached-star">*</span>
                ) : null}
              </div>
              {showFiat && balance && (
                <UserPreferencedCurrencyDisplay
                  className={classnames({
                    'eth-overview__cached-secondary-balance': balanceIsCached,
                    'eth-overview__secondary-balance': !balanceIsCached,
                  })}
                  data-testid="eth-overview__secondary-currency"
                  value={balance}
                  type={SECONDARY}
                  ethNumberOfDecimals={4}
                  hideTitle
                />
              )}
            </div>
          </Tooltip>
        }
        buttons={
          <Fragment>
            <IconButton
              className="eth-overview__button"
              data-testid="eth-overview-receive"
              Icon={
                <Icon
                  name="directbox-receive"
                  size="lg"
                  color="colors-primary-green_01"
                />
              }
              label={t('receive')}
              // onClick={() => {}}
            />
            <IconButton
              className="eth-overview__button"
              data-testid="eth-overview-send"
              Icon={
                <Icon
                  name="wallet-square"
                  size="lg"
                  color="colors-accent-blue_01"
                />
              }
              label={t('send')}
              onClick={() => {
                trackEvent({
                  event: EVENT_NAMES.NAV_SEND_BUTTON_CLICKED,
                  category: EVENT.CATEGORIES.NAVIGATION,
                  properties: {
                    token_symbol: 'ETH',
                    location: 'Home',
                    text: 'Send',
                  },
                });
                dispatch(
                  startNewDraftTransaction({ type: AssetType.native }),
                ).then(() => {
                  history.push(SEND_ROUTE);
                });
              }}
            />
            <IconButton
              className="eth-overview__button"
              Icon={
                <Icon name="wallet" size="lg" color="colors-accent-purple_01" />
              }
              disabled={!isBuyableChain}
              label={t('buy')}
              onClick={() => {
                trackEvent({
                  event: EVENT_NAMES.NAV_BUY_BUTTON_CLICKED,
                  category: EVENT.CATEGORIES.NAVIGATION,
                  properties: {
                    location: 'Home',
                    text: 'Buy',
                  },
                });
                setShowDepositPopover(true);
              }}
            />

            <IconButton
              className="eth-overview__button"
              disabled={!isSwapsChain}
              Icon={
                <Icon
                  size="lg"
                  name={ICON_NAMES.SWAP_HORIZONTAL}
                  color="colors-primary-yellow_01"
                />
              }
              onClick={() => {
                if (isSwapsChain) {
                  trackEvent({
                    event: EVENT_NAMES.NAV_SWAP_BUTTON_CLICKED,
                    category: EVENT.CATEGORIES.SWAPS,
                    properties: {
                      token_symbol: 'ETH',
                      location: EVENT.SOURCE.SWAPS.MAIN_VIEW,
                      text: 'Swap',
                    },
                  });
                  dispatch(setSwapsFromToken(defaultSwapsToken));
                  if (usingHardwareWallet) {
                    global.platform.openExtensionInBrowser(BUILD_QUOTE_ROUTE);
                  } else {
                    history.push(BUILD_QUOTE_ROUTE);
                  }
                }
              }}
              label={t('swap')}
              tooltipRender={
                isSwapsChain
                  ? null
                  : (contents) => (
                      <Tooltip
                        title={t('currentlyUnavailable')}
                        position="bottom"
                      >
                        {contents}
                      </Tooltip>
                    )
              }
            />
          </Fragment>
        }
        className={className}
        icon={<Identicon diameter={32} image={primaryTokenImage} imageBorder />}
      />
    </>
  );
};

EthOverview.propTypes = {
  className: PropTypes.string,
};

EthOverview.defaultProps = {
  className: undefined,
};

export default EthOverview;
