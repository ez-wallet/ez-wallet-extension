import React, { Fragment, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';
import Identicon from '../../ui/identicon';
import Tooltip from '../../ui/tooltip';
import CurrencyDisplay from '../../ui/currency-display';
import { I18nContext } from '../../../contexts/i18n';
import { isHardwareKeyring } from '../../../helpers/utils/hardware';
import {
  SEND_ROUTE,
  BUILD_QUOTE_ROUTE,
} from '../../../helpers/constants/routes';
import { useTokenTracker } from '../../../hooks/useTokenTracker';
import { useTokenFiatAmount } from '../../../hooks/useTokenFiatAmount';
import { startNewDraftTransaction } from '../../../ducks/send';
import { setSwapsFromToken } from '../../../ducks/swaps/swaps';
import {
  getCurrentKeyring,
  getIsSwapsChain,
  getIsBuyableCoinbasePayToken,
  getIsBuyableTransakToken,
  getIsBuyableMoonpayToken,
  getIsBuyableWyreToken,
} from '../../../selectors';

import IconButton from '../../ui/icon-button';
import { INVALID_ASSET_TYPE } from '../../../helpers/constants/error-keys';
import { showModal } from '../../../store/actions';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import { EVENT, EVENT_NAMES } from '../../../../shared/constants/metametrics';
import { AssetType } from '../../../../shared/constants/transaction';
import DepositPopover from '../deposit-popover';

import { Icon, ICON_NAMES } from '../../component-library';

const TokenOverview = ({ token }) => {
  const dispatch = useDispatch();
  const t = useContext(I18nContext);
  const trackEvent = useContext(MetaMetricsContext);
  const history = useHistory();
  const [showDepositPopover, setShowDepositPopover] = useState(false);
  const keyring = useSelector(getCurrentKeyring);
  const usingHardwareWallet = isHardwareKeyring(keyring.type);
  const { tokensWithBalances } = useTokenTracker([token]);
  const balanceToRender = tokensWithBalances[0]?.string;
  const balance = tokensWithBalances[0]?.balance;
  const formattedFiatBalance = useTokenFiatAmount(
    token.address,
    balanceToRender,
    token.symbol,
  );
  const isSwapsChain = useSelector(getIsSwapsChain);
  const isTokenBuyableCoinbasePay = useSelector((state) =>
    getIsBuyableCoinbasePayToken(state, token.symbol),
  );
  const isTokenBuyableTransak = useSelector((state) =>
    getIsBuyableTransakToken(state, token.symbol),
  );
  const isTokenBuyableMoonpay = useSelector((state) =>
    getIsBuyableMoonpayToken(state, token.symbol),
  );
  const isTokenBuyableWyre = useSelector((state) =>
    getIsBuyableWyreToken(state, token.symbol),
  );

  const isBuyable =
    isTokenBuyableCoinbasePay ||
    isTokenBuyableTransak ||
    isTokenBuyableMoonpay ||
    isTokenBuyableWyre;

  useEffect(() => {
    if (token.isERC721 && process.env.NFTS_V1) {
      dispatch(
        showModal({
          name: 'CONVERT_TOKEN_TO_NFT',
          tokenAddress: token.address,
        }),
      );
    }
  }, [token.isERC721, token.address, dispatch]);

  return (
    <Fragment>
      {showDepositPopover && (
        <DepositPopover
          onClose={() => setShowDepositPopover(false)}
          token={token}
        />
      )}
      <div className="flex flex-col items-center justify-center mb-[30px] gap-6">
        <Identicon diameter={32} address={token.address} image={token.image} />
        <CurrencyDisplay
          className="text-center text-[32px] font-semibold text-black"
          displayValue={balanceToRender}
          suffix={token.symbol}
        />
        {formattedFiatBalance ? (
          <CurrencyDisplay
            className="text-center text-[17px] text-grey"
            displayValue={formattedFiatBalance}
            hideLabel
          />
        ) : null}
        <div
          className={classnames('grid gap-12', {
            'grid-cols-3': !isBuyable,
            'grid-cols-4': isBuyable,
          })}
        >
          <IconButton
            className="text-green"
            Icon={<Icon name="directbox-receive" size="lg" />}
            label={t('receive')}
          />

          <IconButton
            className="text-blue"
            onClick={async () => {
              trackEvent({
                event: EVENT_NAMES.NAV_SEND_BUTTON_CLICKED,
                category: EVENT.CATEGORIES.NAVIGATION,
                properties: {
                  token_symbol: token.symbol,
                  location: EVENT.SOURCE.SWAPS.TOKEN_VIEW,
                  text: 'Send',
                },
              });
              try {
                await dispatch(
                  startNewDraftTransaction({
                    type: AssetType.token,
                    details: token,
                  }),
                );
                history.push(SEND_ROUTE);
              } catch (err) {
                if (!err.message.includes(INVALID_ASSET_TYPE)) {
                  throw err;
                }
              }
            }}
            Icon={<Icon name="wallet-square" />}
            label={t('send')}
            data-testid="eth-overview-send"
            disabled={token.isERC721}
          />
          {isBuyable && (
            <IconButton
              className="text-purple"
              Icon={<Icon name="wallet" />}
              label={t('buy')}
              onClick={() => {
                trackEvent({
                  event: 'Clicked Deposit: Token',
                  category: EVENT.CATEGORIES.NAVIGATION,
                  properties: {
                    action: 'Home',
                    legacy_event: true,
                  },
                });
                setShowDepositPopover(true);
              }}
              disabled={token.isERC721}
            />
          )}
          <IconButton
            className="text-yellow"
            disabled={!isSwapsChain}
            Icon={<Icon name={ICON_NAMES.SWAP_HORIZONTAL} />}
            onClick={() => {
              if (isSwapsChain) {
                trackEvent({
                  event: EVENT_NAMES.NAV_SWAP_BUTTON_CLICKED,
                  category: EVENT.CATEGORIES.SWAPS,
                  properties: {
                    token_symbol: token.symbol,
                    location: EVENT.SOURCE.SWAPS.TOKEN_VIEW,
                    text: 'Swap',
                  },
                });
                dispatch(
                  setSwapsFromToken({
                    ...token,
                    address: token.address.toLowerCase(),
                    iconUrl: token.image,
                    balance,
                    string: balanceToRender,
                  }),
                );
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
                      disabled={isSwapsChain}
                    >
                      {contents}
                    </Tooltip>
                  )
            }
          />
        </div>
      </div>
    </Fragment>
  );
};

TokenOverview.propTypes = {
  token: PropTypes.shape({
    address: PropTypes.string.isRequired,
    decimals: PropTypes.number,
    symbol: PropTypes.string,
    image: PropTypes.string,
    isERC721: PropTypes.bool,
  }).isRequired,
};

export default TokenOverview;
