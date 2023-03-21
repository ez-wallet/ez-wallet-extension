import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useI18nContext } from '../../../../hooks/useI18nContext';
import CustomContentSearch from '../custom-content-search';
import NetworksListItem from '../networks-list-item';

const NetworksList = ({
  networkIsSelected,
  networksToRender,
  networkDefaultedToProvider,
  selectedRpcUrl,
}) => {
  const t = useI18nContext();
  const [searchedNetworks, setSearchedNetworks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchedNetworksToRender =
    searchedNetworks.length === 0 && searchQuery === ''
      ? networksToRender
      : searchedNetworks;
  const searchedNetworksToRenderThatAreNotTestNetworks =
    searchedNetworksToRender.filter((network) => !network.isATestNetwork);
  const searchedNetworksToRenderThatAreTestNetworks =
    searchedNetworksToRender.filter((network) => network.isATestNetwork);

  return (
    <div
      className={classnames('w-full grid grid-cols-1 gap-5', {
        'networks-tab__networks-list--selection':
          networkIsSelected && !networkDefaultedToProvider,
      })}
    >
      <CustomContentSearch
        onSearch={({
          searchQuery: newSearchQuery = '',
          results: newResults = [],
        }) => {
          setSearchedNetworks(newResults);
          setSearchQuery(newSearchQuery);
        }}
        error={
          searchedNetworksToRender.length === 0
            ? t('settingsSearchMatchingNotFound')
            : null
        }
        networksList={networksToRender}
        searchQueryInput={searchQuery}
      />
      <div className="p-4 shadow-neumorphic bg-grey-6 rounded-xl flex flex-col gap-5">
        <p className="text-[19px] text-black font-bold">{t('mainnet')}</p>
        {searchedNetworksToRenderThatAreNotTestNetworks.map((network, _) => (
          <NetworksListItem
            key={`settings-network-list:${network.rpcUrl}`}
            network={network}
            networkIsSelected={networkIsSelected}
            selectedRpcUrl={selectedRpcUrl}
            setSearchQuery={setSearchQuery}
            setSearchedNetworks={setSearchedNetworks}
          />
        ))}
      </div>

      <div className="p-4 shadow-neumorphic bg-grey-6 rounded-xl flex flex-col gap-5">
        {searchQuery === '' && (
          <p className="text-[19px] text-black font-bold">
            {t('testNetworks')}
          </p>
        )}
        {searchedNetworksToRenderThatAreTestNetworks.map((network, _) => (
          <NetworksListItem
            key={`settings-network-list:${network.rpcUrl}`}
            network={network}
            networkIsSelected={networkIsSelected}
            selectedRpcUrl={selectedRpcUrl}
            setSearchQuery={setSearchQuery}
            setSearchedNetworks={setSearchedNetworks}
          />
        ))}
      </div>
    </div>
  );
};

NetworksList.propTypes = {
  networkDefaultedToProvider: PropTypes.bool,
  networkIsSelected: PropTypes.bool,
  networksToRender: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedRpcUrl: PropTypes.string,
};

export default NetworksList;
