import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAccountLink } from '@metamask/etherscan-link';
import UserPreferencedCurrencyDisplay from '../../../components/app/user-preferenced-currency-display';
import Identicon from '../../../components/ui/identicon';
import { Icon } from '../../../components/component-library';
import { I18nContext } from '../../../contexts/i18n';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import { EVENT, EVENT_NAMES } from '../../../../shared/constants/metametrics';
import { getURLHostName } from '../../../helpers/utils/util';
import {
  DEFAULT_ROUTE,
  NETWORKS_ROUTE,
} from '../../../helpers/constants/routes';
import {
  getCurrentChainId,
  getSelectedIdentity,
  getRpcPrefsForCurrentProvider,
  getBlockExplorerLinkText,
} from '../../../selectors';

const AccountCardComponent = (props) => {
  const { accounts = [], selectedAddress } = props;
  const t = useContext(I18nContext);
  const history = useHistory();
  const trackEvent = useContext(MetaMetricsContext);
  const selectedIdentity = useSelector(getSelectedIdentity);
  const { address } = selectedIdentity;
  const chainId = useSelector(getCurrentChainId);
  const rpcPrefs = useSelector(getRpcPrefsForCurrentProvider);
  const addressLink = getAccountLink(address, chainId, rpcPrefs);
  const blockExplorerLinkText = useSelector(getBlockExplorerLinkText);

  const routeToAddBlockExplorerUrl = () => {
    history.push(`${NETWORKS_ROUTE}#blockExplorerUrl`);
  };
  const openBlockExplorer = () => {
    trackEvent({
      event: EVENT_NAMES.EXTERNAL_LINK_CLICKED,
      category: EVENT.CATEGORIES.NAVIGATION,
      properties: {
        link_type: EVENT.EXTERNAL_LINK_TYPES.ACCOUNT_TRACKER,
        location: 'Account Options',
        url_domain: getURLHostName(addressLink),
      },
    });
    global.platform.openTab({
      url: addressLink,
    });
  };

  return (
    <div className="w-full bg-grey-6 rounded-[20px] pt-8 flex flex-col shadow-neumorphic overflow-hidden">
      {accounts.map((identity) => {
        if (identity.address === selectedAddress) {
          return (
            <div
              key={identity.address}
              className="flex flex-col items-center justify-center border-b border-grey-5 pb-5"
            >
              <Identicon
                className="flex justify-center items-center mb-3"
                address={identity.address}
                diameter={92}
              />

              <div className="text-center text-[15px] text-black font-bold mb-2">
                {identity.name || ''}
              </div>
              <div className="flex justify-center items-center text-[30px] text-black font-bold">
                <UserPreferencedCurrencyDisplay value={identity.balance} />
              </div>
            </div>
          );
        }
        return null;
      })}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-grey-4"
        onClick={() => {
          history.push(DEFAULT_ROUTE);
        }}
      >
        <Icon name="wallet-outline" />
        <div className="flex-grow text-[15px] text-black font-medium">
          {t('wallet')}
        </div>
      </div>
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-grey-4"
        onClick={
          blockExplorerLinkText.firstPart === 'addBlockExplorer'
            ? routeToAddBlockExplorerUrl
            : openBlockExplorer
        }
      >
        <Icon name="eye" />
        <div className="flex-grow text-[15px] text-black font-medium">
          {t('etherscanViewOn')}
        </div>
      </div>
    </div>
  );
};
AccountCardComponent.propTypes = {
  accounts: PropTypes.array,
  selectedAddress: PropTypes.string,
};
export default AccountCardComponent;
