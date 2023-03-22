import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import * as actions from '../../../store/actions';
import { openAlert as displayInvalidCustomNetworkAlert } from '../../../ducks/alerts/invalid-custom-network';
import {
  LOCALHOST_RPC_URL,
  NETWORK_TYPES,
} from '../../../../shared/constants/network';
import { isPrefixedFormattedHexString } from '../../../../shared/modules/network.utils';
import { getShowTestNetworks } from '../../../selectors';
import { getEnvironmentType } from '../../../../app/scripts/lib/util';
import { ENVIRONMENT_TYPE_POPUP } from '../../../../shared/constants/app';
import { EVENT, EVENT_NAMES } from '../../../../shared/constants/metametrics';
import {
  ADD_POPULAR_CUSTOM_NETWORK,
  ADVANCED_ROUTE,
} from '../../../helpers/constants/routes';
import IconCheck from '../../ui/icon/icon-check';
import Button from '../../ui/button';
import { Dropdown } from './dropdown';

// classes from nodes of the toggle element.
const notToggleElementClassnames = [
  'menu-icon',
  'network-name',
  'network-indicator',
  'network-caret',
  'network-component',
  'modal-container__footer-button',
];

function mapStateToProps(state) {
  return {
    provider: state.metamask.provider,
    shouldShowTestNetworks: getShowTestNetworks(state),
    frequentRpcListDetail: state.metamask.frequentRpcListDetail || [],
    networkDropdownOpen: state.appState.networkDropdownOpen,
    showTestnetMessageInDropdown: state.metamask.showTestnetMessageInDropdown,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setProviderType: (type) => {
      dispatch(actions.setProviderType(type));
    },
    setRpcTarget: (target, chainId, ticker, nickname) => {
      dispatch(actions.setRpcTarget(target, chainId, ticker, nickname));
    },
    hideNetworkDropdown: () => dispatch(actions.hideNetworkDropdown()),
    displayInvalidCustomNetworkAlert: (networkName) => {
      dispatch(displayInvalidCustomNetworkAlert(networkName));
    },
    showConfirmDeleteNetworkModal: ({ target, onConfirm }) => {
      return dispatch(
        actions.showModal({
          name: 'CONFIRM_DELETE_NETWORK',
          target,
          onConfirm,
        }),
      );
    },
    hideTestNetMessage: () => actions.hideTestNetMessage(),
  };
}

class NetworkDropdown extends Component {
  static contextTypes = {
    t: PropTypes.func,
    trackEvent: PropTypes.func,
  };

  static propTypes = {
    provider: PropTypes.shape({
      nickname: PropTypes.string,
      rpcUrl: PropTypes.string,
      type: PropTypes.string,
      ticker: PropTypes.string,
    }).isRequired,
    setProviderType: PropTypes.func.isRequired,
    setRpcTarget: PropTypes.func.isRequired,
    hideNetworkDropdown: PropTypes.func.isRequired,
    frequentRpcListDetail: PropTypes.array.isRequired,
    shouldShowTestNetworks: PropTypes.bool,
    networkDropdownOpen: PropTypes.bool.isRequired,
    displayInvalidCustomNetworkAlert: PropTypes.func.isRequired,
    showConfirmDeleteNetworkModal: PropTypes.func.isRequired,
    showTestnetMessageInDropdown: PropTypes.bool.isRequired,
    hideTestNetMessage: PropTypes.func.isRequired,
    history: PropTypes.object,
    dropdownStyles: PropTypes.object,
    hideElementsForOnboarding: PropTypes.bool,
    onAddClick: PropTypes.func,
  };

  handleClick(newProviderType) {
    const {
      provider: { type: providerType },
      setProviderType,
    } = this.props;
    const { trackEvent } = this.context;

    trackEvent({
      category: EVENT.CATEGORIES.NAVIGATION,
      event: EVENT_NAMES.NAV_NETWORK_SWITCHED,
      properties: {
        from_network: providerType,
        to_network: newProviderType,
      },
    });
    setProviderType(newProviderType);
  }

  renderAddCustomButton() {
    const { onAddClick } = this.props;
    return (
      <Button
        large
        type="primary"
        onClick={() => {
          if (onAddClick) {
            onAddClick();
          } else {
            getEnvironmentType() === ENVIRONMENT_TYPE_POPUP
              ? global.platform.openExtensionInBrowser(
                  ADD_POPULAR_CUSTOM_NETWORK,
                )
              : this.props.history.push(ADD_POPULAR_CUSTOM_NETWORK);
          }
          this.props.hideNetworkDropdown();
        }}
      >
        {this.context.t('addNetwork')}
      </Button>
    );
  }

  renderCustomRpcList(rpcListDetail, provider) {
    const reversedRpcListDetail = rpcListDetail.slice().reverse();

    return reversedRpcListDetail.map((entry) => {
      const { rpcUrl, chainId, ticker = 'ETH', nickname = '' } = entry;
      const isCurrentRpcTarget =
        provider.type === NETWORK_TYPES.RPC && rpcUrl === provider.rpcUrl;

      return (
        <div
          key={`common${rpcUrl}`}
          closeMenu={() => this.props.hideNetworkDropdown()}
          onClick={() => {
            if (isPrefixedFormattedHexString(chainId)) {
              this.props.setRpcTarget(rpcUrl, chainId, ticker, nickname);
            } else {
              this.props.displayInvalidCustomNetworkAlert(nickname || rpcUrl);
            }
          }}
          className="flex items-center gap-2 bg-white rounded-xl p-4 shadow-xl cursor-pointer"
        >
          <div
            className="flex-grow text-[13px] text-black"
            data-testid={`${nickname}-network-item`}
          >
            {nickname || rpcUrl}
          </div>
          {isCurrentRpcTarget && <IconCheck />}
          {isCurrentRpcTarget ? null : (
            <i
              className="fa fa-times delete"
              onClick={(e) => {
                e.stopPropagation();
                this.props.showConfirmDeleteNetworkModal({
                  target: rpcUrl,
                  onConfirm: () => undefined,
                });
              }}
            />
          )}
        </div>
      );
    });
  }

  getNetworkName() {
    const { provider } = this.props;
    const providerName = provider.type;
    const { t } = this.context;

    switch (providerName) {
      case NETWORK_TYPES.MAINNET:
        return t('mainnet');
      case NETWORK_TYPES.GOERLI:
        return t('goerli');
      case NETWORK_TYPES.SEPOLIA:
        return t('sepolia');
      case NETWORK_TYPES.LOCALHOST:
        return t('localhost');
      default:
        return provider.nickname || t('unknownNetwork');
    }
  }

  renderNetworkEntry(network) {
    const {
      provider: { type: providerType },
    } = this.props;
    return (
      <div
        key={network}
        closeMenu={this.props.hideNetworkDropdown}
        onClick={() => this.handleClick(network)}
        className="flex items-center gap-2 bg-white rounded-xl p-4 shadow-xl cursor-pointer"
      >
        <div
          className="flex-grow text-[13px] text-black"
          data-testid={`${network}-network-item`}
        >
          {this.context.t(network)}
        </div>
        {providerType === network && <IconCheck />}
      </div>
    );
  }

  render() {
    const {
      history,
      hideElementsForOnboarding,
      hideNetworkDropdown,
      shouldShowTestNetworks,
      showTestnetMessageInDropdown,
      hideTestNetMessage,
    } = this.props;
    const rpcListDetail = this.props.frequentRpcListDetail;
    const rpcListDetailWithoutLocalHost = rpcListDetail.filter(
      (rpc) => rpc.rpcUrl !== LOCALHOST_RPC_URL,
    );
    const rpcListDetailForLocalHost = rpcListDetail.filter(
      (rpc) => rpc.rpcUrl === LOCALHOST_RPC_URL,
    );
    const isOpen = this.props.networkDropdownOpen;
    const { t } = this.context;

    return (
      <Dropdown
        isOpen={isOpen}
        onClickOutside={(event) => {
          const { classList } = event.target;
          const isInClassList = (className) => classList.contains(className);
          const notToggleElementIndex =
            notToggleElementClassnames.findIndex(isInClassList);

          if (notToggleElementIndex === -1) {
            event.stopPropagation();
            hideNetworkDropdown();
          }
        }}
        containerClassName="network-droppo px-4"
        zIndex={55}
        style={
          this.props.dropdownStyles || {
            position: 'absolute',
            left: '0',
            right: '0',
            zIndex: '55',
          }
        }
      >
        <div className="network-dropdown-header px-4">
          {hideElementsForOnboarding ? null : (
            <div className="text-[19px] text-black font-bold mb-3">
              {t('networks')}
            </div>
          )}
          {showTestnetMessageInDropdown && !hideElementsForOnboarding ? (
            <div className="w-full flex items-center justify-between text-[13px]">
              {t('toggleTestNetworks', [
                <a
                  href="#"
                  key="advancedSettingsLink"
                  className="text-[13px] text-blue"
                  onClick={(e) => {
                    e.preventDefault();
                    hideNetworkDropdown();
                    history.push(`${ADVANCED_ROUTE}#show-testnets`);
                  }}
                >
                  {t('showHide')}
                </a>,
              ])}
              <button
                onClick={hideTestNetMessage}
                className="text-[13px] border text-grey border-grey rounded-full px-2"
              >
                {t('dismiss')}
              </button>
            </div>
          ) : null}
        </div>

        <div className="network-dropdown-list flex flex-col gap-3 p-4">
          {this.renderNetworkEntry(NETWORK_TYPES.MAINNET)}

          {this.renderCustomRpcList(
            rpcListDetailWithoutLocalHost,
            this.props.provider,
          )}

          {shouldShowTestNetworks && (
            <>
              {this.renderNetworkEntry(NETWORK_TYPES.GOERLI)}
              {this.renderNetworkEntry(NETWORK_TYPES.SEPOLIA)}
              {this.renderCustomRpcList(
                rpcListDetailForLocalHost,
                this.props.provider,
                { isLocalHost: true },
              )}
            </>
          )}
        </div>
        <div className="w-full px-4">{this.renderAddCustomButton()} </div>
      </Dropdown>
    );
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(NetworkDropdown);
