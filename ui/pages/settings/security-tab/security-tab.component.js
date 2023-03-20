import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { startCase } from 'lodash';
import ToggleButton from '../../../components/ui/toggle-button';
import TextField from '../../../components/ui/text-field';
import {
  ADD_POPULAR_CUSTOM_NETWORK,
  REVEAL_SEED_ROUTE,
} from '../../../helpers/constants/routes';
import Button from '../../../components/ui/button';
import {
  getNumberOfSettingsInSection,
  handleSettingsRefs,
} from '../../../helpers/utils/settings-search';
import { EVENT, EVENT_NAMES } from '../../../../shared/constants/metametrics';
import {
  COINGECKO_LINK,
  CRYPTOCOMPARE_LINK,
  PRIVACY_POLICY_LINK,
  AUTO_DETECT_TOKEN_LEARN_MORE_LINK,
  CONSENSYS_PRIVACY_LINK,
  ETHERSCAN_PRIVACY_LINK,
} from '../../../../shared/lib/ui-utils';
import { ENVIRONMENT_TYPE_POPUP } from '../../../../shared/constants/app';
import {
  addUrlProtocolPrefix,
  getEnvironmentType,
} from '../../../../app/scripts/lib/util';

export default class SecurityTab extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    trackEvent: PropTypes.func,
  };

  static propTypes = {
    warning: PropTypes.string,
    history: PropTypes.object,
    participateInMetaMetrics: PropTypes.bool.isRequired,
    setParticipateInMetaMetrics: PropTypes.func.isRequired,
    showIncomingTransactions: PropTypes.bool.isRequired,
    setShowIncomingTransactionsFeatureFlag: PropTypes.func.isRequired,
    setUsePhishDetect: PropTypes.func.isRequired,
    usePhishDetect: PropTypes.bool.isRequired,
    useTokenDetection: PropTypes.bool.isRequired,
    setUseTokenDetection: PropTypes.func.isRequired,
    setIpfsGateway: PropTypes.func.isRequired,
    ipfsGateway: PropTypes.string.isRequired,
    useMultiAccountBalanceChecker: PropTypes.bool.isRequired,
    setUseMultiAccountBalanceChecker: PropTypes.func.isRequired,
    useCurrencyRateCheck: PropTypes.bool.isRequired,
    setUseCurrencyRateCheck: PropTypes.func.isRequired,
  };

  state = {
    ipfsGateway: this.props.ipfsGateway,
    ipfsGatewayError: '',
  };

  settingsRefCounter = 0;

  settingsRefs = Array(
    getNumberOfSettingsInSection(
      this.context.t,
      this.context.t('securityAndPrivacy'),
    ),
  )
    .fill(undefined)
    .map(() => {
      return React.createRef();
    });

  componentDidUpdate() {
    const { t } = this.context;
    handleSettingsRefs(t, t('securityAndPrivacy'), this.settingsRefs);
  }

  componentDidMount() {
    const { t } = this.context;
    handleSettingsRefs(t, t('securityAndPrivacy'), this.settingsRefs);
  }

  toggleSetting(value, eventName, eventAction, toggleMethod) {
    this.context.trackEvent({
      category: EVENT.CATEGORIES.SETTINGS,
      event: eventName,
      properties: {
        action: eventAction,
        legacy_event: true,
      },
    });
    toggleMethod(!value);
  }

  renderSeedWords() {
    const { t } = this.context;
    const { history } = this.props;

    return (
      <div ref={this.settingsRefs[0]} className="w-full flex flex-col gap-3">
        <div className="text-[15px] font-bold text-black">
          {t('revealSeedWords')}
        </div>
        <Button
          data-testid="reveal-seed-words"
          type="danger"
          large
          onClick={(event) => {
            event.preventDefault();
            this.context.trackEvent({
              category: EVENT.CATEGORIES.SETTINGS,
              event: EVENT_NAMES.KEY_EXPORT_SELECTED,
              properties: {
                key_type: EVENT.KEY_TYPES.SRP,
                location: 'Settings',
              },
            });
            history.push(REVEAL_SEED_ROUTE);
          }}
        >
          {t('revealSeedWords')}
        </Button>
      </div>
    );
  }

  renderIncomingTransactionsOptIn() {
    const { t } = this.context;
    const { showIncomingTransactions, setShowIncomingTransactionsFeatureFlag } =
      this.props;

    return (
      <div ref={this.settingsRefs[1]} className="w-full flex flex-col gap-3">
        <div className="text-[15px] font-bold text-black">
          {t('showIncomingTransactions')}
        </div>
        <div className="text-[13px] text-black">
          {t('showIncomingTransactionsDescription', [
            // TODO: Update to use real link
            <a
              href={ETHERSCAN_PRIVACY_LINK}
              target="_blank"
              className="text-blue"
              rel="noopener noreferrer"
              key="etherscan-privacy-link"
            >
              {t('etherscan')}
            </a>,
            // TODO: Update to use real link
            <a
              href={CONSENSYS_PRIVACY_LINK}
              target="_blank"
              className="text-blue"
              rel="noopener noreferrer"
              key="ic-consensys-privacy-link"
            >
              {t('privacyMsg')}
            </a>,
          ])}
        </div>
        <ToggleButton
          value={showIncomingTransactions}
          onToggle={(value) => setShowIncomingTransactionsFeatureFlag(!value)}
          offLabel={t('off')}
          onLabel={t('on')}
        />
      </div>
    );
  }

  renderPhishingDetectionToggle() {
    const { t } = this.context;
    const { usePhishDetect, setUsePhishDetect } = this.props;

    return (
      <div ref={this.settingsRefs[2]} className="w-full flex flex-col gap-3">
        <div className="text-[15px] font-bold text-black">
          {t('usePhishingDetection')}
        </div>
        <div className="text-[13px] text-black">
          {t('usePhishingDetectionDescription')}
        </div>
        <ToggleButton
          value={usePhishDetect}
          onToggle={(value) => setUsePhishDetect(!value)}
          offLabel={t('off')}
          onLabel={t('on')}
        />
      </div>
    );
  }

  renderMetaMetricsOptIn() {
    const { t } = this.context;
    const { participateInMetaMetrics, setParticipateInMetaMetrics } =
      this.props;

    return (
      <div ref={this.settingsRefs[3]} className="w-full flex flex-col">
        <div className="settings-page__content-item">
          <span>{t('participateInMetaMetrics')}</span>
          <div className="settings-page__content-description">
            <span>{t('participateInMetaMetricsDescription')}</span>
          </div>
        </div>
        <div className="settings-page__content-item">
          <div className="settings-page__content-item-col">
            <ToggleButton
              value={participateInMetaMetrics}
              onToggle={(value) => setParticipateInMetaMetrics(!value)}
              offLabel={t('off')}
              onLabel={t('on')}
            />
          </div>
        </div>
      </div>
    );
  }

  renderChooseYourNetworkButton() {
    const { t } = this.context;

    return (
      <div
        ref={this.settingsRefs[5]}
        className="w-full flex flex-col"
        data-testid="advanced-setting-choose-your-network"
      >
        <div className="settings-page__content-item">
          <span>{t('chooseYourNetwork')}</span>
          <div className="settings-page__content-description">
            {t('chooseYourNetworkDescription', [
              // TODO: Update to use real link
              <a
                href={CONSENSYS_PRIVACY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                key="cyn-consensys-privacy-link"
              >
                {t('privacyMsg')}
              </a>,
            ])}
          </div>
        </div>
        <div className="settings-page__content-item">
          <div className="settings-page__content-item-col">
            <Button
              type="secondary"
              className="settings-page__button"
              onClick={() => {
                getEnvironmentType() === ENVIRONMENT_TYPE_POPUP
                  ? global.platform.openExtensionInBrowser(
                      ADD_POPULAR_CUSTOM_NETWORK,
                    )
                  : this.props.history.push(ADD_POPULAR_CUSTOM_NETWORK);
              }}
            >
              {t('addCustomNetwork')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  renderIpfsGatewayControl() {
    const { t } = this.context;
    const { ipfsGatewayError } = this.state;

    const handleIpfsGatewaySave = (gateway) => {
      const url = new URL(addUrlProtocolPrefix(gateway));
      const { host } = url;

      this.props.setIpfsGateway(host);
    };

    const handleIpfsGatewayChange = (url) => {
      this.setState(() => {
        let ipfsError = '';

        try {
          const urlObj = new URL(addUrlProtocolPrefix(url));
          if (!urlObj.host) {
            throw new Error();
          }

          // don't allow the use of this gateway
          if (urlObj.host === 'gateway.ipfs.io') {
            throw new Error('Forbidden gateway');
          }
        } catch (error) {
          ipfsError =
            error.message === 'Forbidden gateway'
              ? t('forbiddenIpfsGateway')
              : t('invalidIpfsGateway');
        }

        handleIpfsGatewaySave(url);
        return {
          ipfsGateway: url,
          ipfsGatewayError: ipfsError,
        };
      });
    };

    return (
      <div
        ref={this.settingsRefs[6]}
        className="w-full flex flex-col"
        data-testid="setting-ipfs-gateway"
      >
        <div className="settings-page__content-item">
          <span>{t('addCustomIPFSGateway')}</span>
          <div className="settings-page__content-description">
            {t('addCustomIPFSGatewayDescription')}
          </div>
        </div>
        <div className="settings-page__content-item">
          <div className="settings-page__content-item-col">
            <TextField
              type="text"
              value={this.state.ipfsGateway}
              onChange={(e) => handleIpfsGatewayChange(e.target.value)}
              error={ipfsGatewayError}
              fullWidth
              margin="dense"
            />
          </div>
        </div>
      </div>
    );
  }

  renderAutoDectectTokensToggle() {
    const { t } = this.context;
    const { useTokenDetection, setUseTokenDetection } = this.props;

    return (
      <div
        ref={this.settingsRefs[4]}
        className="w-full flex flex-col gap-3"
        data-testid="advanced-setting-gas-fee-estimation"
      >
        <div className="text-[15px] font-bold text-black">
          {t('autoDetectTokens')}
        </div>
        <div className="text-[13px] text-black">
          {t('autoDetectTokensDescription', [
            // TODO: Update to use real link
            <a
              href={AUTO_DETECT_TOKEN_LEARN_MORE_LINK}
              target="_blank"
              className="text-blue"
              rel="noopener noreferrer"
              key="cyn-consensys-privacy-link"
            >
              {startCase(t('learnMore'))}
            </a>,
          ])}
        </div>
        <ToggleButton
          value={useTokenDetection}
          onToggle={(value) => {
            this.toggleSetting(
              value,
              EVENT_NAMES.KEY_AUTO_DETECT_TOKENS,
              EVENT_NAMES.KEY_AUTO_DETECT_TOKENS,
              setUseTokenDetection,
            );
          }}
          offLabel={t('off')}
          onLabel={t('on')}
        />
      </div>
    );
  }

  renderBatchAccountBalanceRequestsToggle() {
    const { t } = this.context;
    const { useMultiAccountBalanceChecker, setUseMultiAccountBalanceChecker } =
      this.props;

    return (
      <div ref={this.settingsRefs[8]} className="w-full flex flex-col gap-3">
        <div className="text-[15px] font-bold text-black">
          {t('useMultiAccountBalanceChecker')}
        </div>
        <div className="text-[13px] text-black">
          {t('useMultiAccountBalanceCheckerDescription')}
        </div>
        <ToggleButton
          value={useMultiAccountBalanceChecker}
          onToggle={(value) => {
            this.toggleSetting(
              value,
              EVENT_NAMES.KEY_BATCH_ACCOUNT_BALANCE_REQUESTS,
              EVENT_NAMES.KEY_BATCH_ACCOUNT_BALANCE_REQUESTS,
              setUseMultiAccountBalanceChecker,
            );
          }}
          offLabel={t('off')}
          onLabel={t('on')}
        />
      </div>
    );
  }

  renderCurrencyRateCheckToggle() {
    const { t } = this.context;
    const { useCurrencyRateCheck, setUseCurrencyRateCheck } = this.props;

    return (
      <div ref={this.settingsRefs[9]} className="w-full flex flex-col gap-3">
        <div className="text-[15px] font-bold text-black">
          {t('currencyRateCheckToggle')}
        </div>
        <div className="text-[13px] text-black">
          {t('currencyRateCheckToggleDescription', [
            <a
              key="coingecko_link"
              className="text-blue"
              href={COINGECKO_LINK}
              rel="noreferrer"
              target="_blank"
            >
              {t('coingecko')}
            </a>,
            <a
              key="cryptocompare_link"
              className="text-blue"
              href={CRYPTOCOMPARE_LINK}
              rel="noreferrer"
              target="_blank"
            >
              {t('cryptoCompare')}
            </a>,
            <a
              key="privacy_policy_link"
              className="text-blue"
              href={PRIVACY_POLICY_LINK}
              rel="noreferrer"
              target="_blank"
            >
              {t('privacyMsg')}
            </a>,
          ])}
        </div>

        <ToggleButton
          value={useCurrencyRateCheck}
          onToggle={(value) => setUseCurrencyRateCheck(!value)}
          offLabel={t('off')}
          onLabel={t('on')}
        />
      </div>
    );
  }

  render() {
    const { warning } = this.props;

    return (
      <div className="flex flex-col gap-[48px]">
        {warning ? <div className="settings-tab__error">{warning}</div> : null}
        <div className="w-full">
          <div className="text-[19px] text-black font-bold">
            {this.context.t('security')}
          </div>
          <div className="settings-page__content-padded">
            {this.renderSeedWords()}
          </div>
        </div>
        <div className="w-full flex flex-col gap-[48px]">
          <div className="text-[19px] text-black font-bold">
            {this.context.t('privacy')}
          </div>
          <div className="w-full">
            <div className="text-[15px] text-grey font-bold">Alerts</div>
            <div className="settings-page__content-padded">
              {this.renderPhishingDetectionToggle()}
            </div>
          </div>
          <div className="w-full">
            <div className="text-[15px] text-grey font-bold">
              {this.context.t('transactions')}
            </div>
            <div className="settings-page__content-padded">
              {this.renderCurrencyRateCheckToggle()}
              {this.renderIncomingTransactionsOptIn()}
            </div>
          </div>

          <div className="text-[15px] text-grey font-bold">
            {this.context.t('networkProvider')}
          </div>
          {/* <div className="settings-page__content-padded">
          {this.renderChooseYourNetworkButton()}
          {this.renderIpfsGatewayControl()}
        </div> */}
          <span className="text-[15px] font-bold text-black">
            {this.context.t('tokenAutoDetection')}
          </span>
          <div className="settings-page__content-padded">
            {this.renderAutoDectectTokensToggle()}
            {this.renderBatchAccountBalanceRequestsToggle()}
          </div>
          {/* <span className="settings-page__security-tab-sub-header">
          {this.context.t('metrics')}
        </span>
        <div className="settings-page__content-padded">
          {this.renderMetaMetricsOptIn()}
        </div> */}
        </div>
      </div>
    );
  }
}
