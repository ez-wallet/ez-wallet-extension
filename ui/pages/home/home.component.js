import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import AssetList from '../../components/app/asset-list';
import NftsTab from '../../components/app/nfts-tab';
import HomeNotification from '../../components/app/home-notification';
import MultipleNotifications from '../../components/app/multiple-notifications';
// import TransactionList from '../../components/app/transaction-list';
import MenuBar from '../../components/app/menu-bar';
import Popover from '../../components/ui/popover';
import Button from '../../components/ui/button';
import ConnectedSites from '../connected-sites';
import ConnectedAccounts from '../connected-accounts';
import { Tabs, Tab } from '../../components/ui/tabs';
import { EthOverview } from '../../components/app/wallet-overview';
import WhatsNewPopup from '../../components/app/whats-new-popup';
import RecoveryPhraseReminder from '../../components/app/recovery-phrase-reminder';
import ActionableMessage from '../../components/ui/actionable-message/actionable-message';
import { SECOND } from '../../../shared/constants/time';
// import { ButtonLink, ICON_NAMES } from '../../components/component-library';
// import ImportTokenLink from '../../components/app/import-token-link';
import {
  ASSET_ROUTE,
  RESTORE_VAULT_ROUTE,
  CONFIRM_TRANSACTION_ROUTE,
  CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE,
  CONNECT_ROUTE,
  CONNECTED_ROUTE,
  CONNECTED_ACCOUNTS_ROUTE,
  AWAITING_SWAP_ROUTE,
  BUILD_QUOTE_ROUTE,
  VIEW_QUOTE_ROUTE,
  CONFIRMATION_V_NEXT_ROUTE,
  ADD_NFT_ROUTE,
  ONBOARDING_SECURE_YOUR_WALLET_ROUTE,
} from '../../helpers/constants/routes';
import ZENDESK_URLS from '../../helpers/constants/zendesk-url';
// import Tooltip from '../../components/ui/tooltip';

function shouldCloseNotificationPopup({
  isNotification,
  totalUnapprovedCount,
  isSigningQRHardwareTransaction,
}) {
  return (
    isNotification &&
    totalUnapprovedCount === 0 &&
    !isSigningQRHardwareTransaction
  );
}

export default class Home extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
    trackEvent: PropTypes.func,
  };

  static propTypes = {
    history: PropTypes.object,
    forgottenPassword: PropTypes.bool,
    suggestedAssets: PropTypes.array,
    unconfirmedTransactionsCount: PropTypes.number,
    shouldShowSeedPhraseReminder: PropTypes.bool.isRequired,
    isPopup: PropTypes.bool,
    isNotification: PropTypes.bool.isRequired,
    firstPermissionsRequestId: PropTypes.string,
    // This prop is used in the `shouldCloseNotificationPopup` function
    // eslint-disable-next-line react/no-unused-prop-types
    totalUnapprovedCount: PropTypes.number.isRequired,
    setConnectedStatusPopoverHasBeenShown: PropTypes.func,
    connectedStatusPopoverHasBeenShown: PropTypes.bool,
    defaultHomeActiveTabName: PropTypes.string,
    firstTimeFlowType: PropTypes.string,
    completedOnboarding: PropTypes.bool,
    onTabClick: PropTypes.func.isRequired,
    haveSwapsQuotes: PropTypes.bool.isRequired,
    showAwaitingSwapScreen: PropTypes.bool.isRequired,
    swapsFetchParams: PropTypes.object,
    shouldShowWeb3ShimUsageNotification: PropTypes.bool.isRequired,
    setWeb3ShimUsageAlertDismissed: PropTypes.func.isRequired,
    originOfCurrentTab: PropTypes.string,
    disableWeb3ShimUsageAlert: PropTypes.func.isRequired,
    pendingConfirmations: PropTypes.arrayOf(PropTypes.object).isRequired,
    infuraBlocked: PropTypes.bool.isRequired,
    showWhatsNewPopup: PropTypes.bool.isRequired,
    hideWhatsNewPopup: PropTypes.func.isRequired,
    showPortfolioTooltip: PropTypes.bool.isRequired,
    // hidePortfolioTooltip: PropTypes.func.isRequired,
    portfolioTooltipWasShownInThisSession: PropTypes.bool.isRequired,
    setPortfolioTooltipWasShownInThisSession: PropTypes.func.isRequired,
    announcementsToShow: PropTypes.bool.isRequired,
    ///: BEGIN:ONLY_INCLUDE_IN(flask)
    errorsToShow: PropTypes.object.isRequired,
    shouldShowErrors: PropTypes.bool.isRequired,
    removeSnapError: PropTypes.func.isRequired,
    ///: END:ONLY_INCLUDE_IN
    showRecoveryPhraseReminder: PropTypes.bool.isRequired,
    setRecoveryPhraseReminderHasBeenShown: PropTypes.func.isRequired,
    setRecoveryPhraseReminderLastShown: PropTypes.func.isRequired,
    showOutdatedBrowserWarning: PropTypes.bool.isRequired,
    setOutdatedBrowserWarningLastShown: PropTypes.func.isRequired,
    seedPhraseBackedUp: (props) => {
      if (
        props.seedPhraseBackedUp !== null &&
        typeof props.seedPhraseBackedUp !== 'boolean'
      ) {
        throw new Error(
          `seedPhraseBackedUp is required to be null or boolean. Received ${props.seedPhraseBackedUp}`,
        );
      }
    },
    newNetworkAdded: PropTypes.string,
    setNewNetworkAdded: PropTypes.func.isRequired,
    // This prop is used in the `shouldCloseNotificationPopup` function
    // eslint-disable-next-line react/no-unused-prop-types
    isSigningQRHardwareTransaction: PropTypes.bool.isRequired,
    newNftAddedMessage: PropTypes.string,
    setNewNftAddedMessage: PropTypes.func.isRequired,
    removeNftMessage: PropTypes.string,
    setRemoveNftMessage: PropTypes.func.isRequired,
    closeNotificationPopup: PropTypes.func.isRequired,
    newTokensImported: PropTypes.string,
    setNewTokensImported: PropTypes.func.isRequired,
    newCustomNetworkAdded: PropTypes.object,
    clearNewCustomNetworkAdded: PropTypes.func,
    setRpcTarget: PropTypes.func,
    onboardedInThisUISession: PropTypes.bool,
  };

  state = {
    canShowBlockageNotification: true,
    notificationClosing: false,
    redirecting: false,
  };

  constructor(props) {
    super(props);

    const {
      closeNotificationPopup,
      firstPermissionsRequestId,
      haveSwapsQuotes,
      isNotification,
      showAwaitingSwapScreen,
      suggestedAssets = [],
      swapsFetchParams,
      unconfirmedTransactionsCount,
    } = this.props;

    if (shouldCloseNotificationPopup(props)) {
      this.state.notificationClosing = true;
      closeNotificationPopup();
    } else if (
      firstPermissionsRequestId ||
      unconfirmedTransactionsCount > 0 ||
      suggestedAssets.length > 0 ||
      (!isNotification &&
        (showAwaitingSwapScreen || haveSwapsQuotes || swapsFetchParams))
    ) {
      this.state.redirecting = true;
    }
  }

  checkStatusAndNavigate() {
    const {
      firstPermissionsRequestId,
      history,
      isNotification,
      suggestedAssets = [],
      unconfirmedTransactionsCount,
      haveSwapsQuotes,
      showAwaitingSwapScreen,
      swapsFetchParams,
      pendingConfirmations,
    } = this.props;
    if (!isNotification && showAwaitingSwapScreen) {
      history.push(AWAITING_SWAP_ROUTE);
    } else if (!isNotification && haveSwapsQuotes) {
      history.push(VIEW_QUOTE_ROUTE);
    } else if (!isNotification && swapsFetchParams) {
      history.push(BUILD_QUOTE_ROUTE);
    } else if (firstPermissionsRequestId) {
      history.push(`${CONNECT_ROUTE}/${firstPermissionsRequestId}`);
    } else if (unconfirmedTransactionsCount > 0) {
      history.push(CONFIRM_TRANSACTION_ROUTE);
    } else if (suggestedAssets.length > 0) {
      history.push(CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE);
    } else if (pendingConfirmations.length > 0) {
      history.push(CONFIRMATION_V_NEXT_ROUTE);
    }
  }

  componentDidMount() {
    const { setPortfolioTooltipWasShownInThisSession, showPortfolioTooltip } =
      this.props;
    this.checkStatusAndNavigate();
    if (showPortfolioTooltip) {
      setPortfolioTooltipWasShownInThisSession();
    }
  }

  static getDerivedStateFromProps(props) {
    if (shouldCloseNotificationPopup(props)) {
      return { notificationClosing: true };
    }
    return null;
  }

  componentDidUpdate(_prevProps, prevState) {
    const { closeNotificationPopup, isNotification } = this.props;
    const { notificationClosing } = this.state;

    if (notificationClosing && !prevState.notificationClosing) {
      closeNotificationPopup();
    } else if (isNotification) {
      this.checkStatusAndNavigate();
    }
  }

  onRecoveryPhraseReminderClose = () => {
    const {
      setRecoveryPhraseReminderHasBeenShown,
      setRecoveryPhraseReminderLastShown,
    } = this.props;
    setRecoveryPhraseReminderHasBeenShown(true);
    setRecoveryPhraseReminderLastShown(new Date().getTime());
  };

  onOutdatedBrowserWarningClose = () => {
    const { setOutdatedBrowserWarningLastShown } = this.props;
    setOutdatedBrowserWarningLastShown(new Date().getTime());
  };

  renderNotifications() {
    const { t } = this.context;
    const {
      history,
      shouldShowSeedPhraseReminder,
      isPopup,
      shouldShowWeb3ShimUsageNotification,
      setWeb3ShimUsageAlertDismissed,
      originOfCurrentTab,
      disableWeb3ShimUsageAlert,
      ///: BEGIN:ONLY_INCLUDE_IN(flask)
      removeSnapError,
      errorsToShow,
      shouldShowErrors,
      ///: END:ONLY_INCLUDE_IN
      infuraBlocked,
      showOutdatedBrowserWarning,
      newNetworkAdded,
      setNewNetworkAdded,
      newNftAddedMessage,
      setNewNftAddedMessage,
      removeNftMessage,
      setRemoveNftMessage,
      newTokensImported,
      setNewTokensImported,
      newCustomNetworkAdded,
      clearNewCustomNetworkAdded,
      setRpcTarget,
    } = this.props;

    const onAutoHide = () => {
      setNewNftAddedMessage('');
      setRemoveNftMessage('');
    };

    const autoHideDelay = 5 * SECOND;

    return (
      <MultipleNotifications>
        {
          ///: BEGIN:ONLY_INCLUDE_IN(flask)
          shouldShowErrors
            ? Object.entries(errorsToShow).map(([errorId, error]) => {
                return (
                  <HomeNotification
                    classNames={['home__error-message']}
                    infoText={error.data.snapId}
                    descriptionText={
                      <>
                        <p className="text-[13px] text-red">
                          {t('somethingWentWrong')}
                        </p>
                        <p className="text-[13px] text-grey">
                          {t('snapError', [error.message, error.code])}
                        </p>
                      </>
                    }
                    onIgnore={async () => {
                      await removeSnapError(errorId);
                    }}
                    ignoreText="Dismiss"
                    key="home-error-message"
                  />
                );
              })
            : null
          ///: END:ONLY_INCLUDE_IN
        }
        {newNftAddedMessage === 'success' ? (
          <ActionableMessage
            type="success"
            className="home__new-network-notification"
            autoHideTime={autoHideDelay}
            onAutoHide={onAutoHide}
            message={
              <div className="flex gap-2">
                <i className="fa fa-check-circle home__new-nft-notification-icon" />
                <div className="text-[13px] text-black">
                  {t('newNftAddedMessage')}
                </div>
                <button
                  className="fas fa-times home__new-nft-notification-close"
                  title={t('close')}
                  onClick={onAutoHide}
                />
              </div>
            }
          />
        ) : null}

        {removeNftMessage === 'success' ? (
          <ActionableMessage
            type="danger"
            className="home__new-network-notification"
            autoHideTime={autoHideDelay}
            onAutoHide={onAutoHide}
            message={
              <div className="flex gap-2">
                <i className="fa fa-check-circle home__new-nft-notification-icon" />
                <div className="text-[13px] text-black font-bold">
                  {t('removeNftMessage')}
                </div>
                <button
                  className="fas fa-times home__new-nft-notification-close"
                  title={t('close')}
                  onClick={onAutoHide}
                />
              </div>
            }
          />
        ) : null}
        {newNetworkAdded ? (
          <ActionableMessage
            type="success"
            className="home__new-network-notification"
            message={
              <div className="flex gap-2">
                <i className="fa fa-check-circle home__new-network-notification-icon" />
                <p className="text-[13px] text-black">
                  {t('newNetworkAdded', [newNetworkAdded])}
                </p>
                <button
                  className="fas fa-times home__new-network-notification-close"
                  title={t('close')}
                  onClick={() => setNewNetworkAdded('')}
                />
              </div>
            }
          />
        ) : null}
        {newTokensImported ? (
          <ActionableMessage
            type="success"
            className="home__new-tokens-imported-notification"
            message={
              <div className="flex gap-2">
                <i className="fa fa-check-circle home__new-tokens-imported-notification-icon" />
                <div>
                  <p className="text-[15px] font-bold text-black">
                    {t('newTokensImportedTitle')}
                  </p>
                  <p className="text-[13px] font-bold text-black">
                    {t('newTokensImportedMessage', [newTokensImported])}
                  </p>
                </div>
                <button
                  className="fas fa-times home__new-tokens-imported-notification-close"
                  title={t('close')}
                  onClick={() => setNewTokensImported('')}
                />
              </div>
            }
          />
        ) : null}
        {shouldShowWeb3ShimUsageNotification ? (
          <HomeNotification
            descriptionText={t('web3ShimUsageNotification', [
              <span
                key="web3ShimUsageNotificationLink"
                className="home-notification__text-link"
                onClick={() =>
                  global.platform.openTab({ url: ZENDESK_URLS.LEGACY_WEB3 })
                }
              >
                {t('here')}
              </span>,
            ])}
            ignoreText={t('dismiss')}
            onIgnore={(disable) => {
              setWeb3ShimUsageAlertDismissed(originOfCurrentTab);
              if (disable) {
                disableWeb3ShimUsageAlert();
              }
            }}
            checkboxText={t('dontShowThisAgain')}
            checkboxTooltipText={t('canToggleInSettings')}
            key="home-web3ShimUsageNotification"
          />
        ) : null}
        {shouldShowSeedPhraseReminder ? (
          <HomeNotification
            descriptionText={t('backupApprovalNotice')}
            acceptText={t('backupNow')}
            onAccept={() => {
              const backUpSRPRoute = `${ONBOARDING_SECURE_YOUR_WALLET_ROUTE}/?isFromReminder=true`;
              if (isPopup) {
                global.platform.openExtensionInBrowser(backUpSRPRoute);
              } else {
                history.push(backUpSRPRoute);
              }
            }}
            infoText={t('backupApprovalInfo')}
            key="home-backupApprovalNotice"
          />
        ) : null}
        {infuraBlocked && this.state.canShowBlockageNotification ? (
          <HomeNotification
            descriptionText={t('infuraBlockedNotification', [
              <span
                key="infuraBlockedNotificationLink"
                className="home-notification__text-link"
                onClick={() =>
                  global.platform.openTab({ url: ZENDESK_URLS.INFURA_BLOCKAGE })
                }
              >
                {t('here')}
              </span>,
            ])}
            ignoreText={t('dismiss')}
            onIgnore={() => {
              this.setState({
                canShowBlockageNotification: false,
              });
            }}
            key="home-infuraBlockedNotification"
          />
        ) : null}
        {showOutdatedBrowserWarning ? (
          <HomeNotification
            descriptionText={t('outdatedBrowserNotification')}
            acceptText={t('gotIt')}
            onAccept={this.onOutdatedBrowserWarningClose}
            key="home-outdatedBrowserNotification"
          />
        ) : null}
        {Object.keys(newCustomNetworkAdded).length !== 0 && (
          <Popover className="rounded-xl bg-grey-6 p-4">
            <div className="flex flex-col items-center gap-4">
              <i className="fa fa-check-circle fa-2x home__new-network-added__check-circle" />
              <p className="text-[19px] font-bold text-green-7">
                {t('networkAddedSuccessfully')}
              </p>

              <Button
                type="primary"
                className="font-bold text-[16px] text-black"
                large
                onClick={() => {
                  setRpcTarget(
                    newCustomNetworkAdded.rpcUrl,
                    newCustomNetworkAdded.chainId,
                    newCustomNetworkAdded.ticker,
                    newCustomNetworkAdded.chainName,
                  );
                  clearNewCustomNetworkAdded();
                }}
              >
                {t('switchToNetwork', [newCustomNetworkAdded.chainName])}
              </Button>
              <a
                href="#"
                className="text-blue text-[15px] text-center"
                onClick={(e) => {
                  e.preventDefault();
                  clearNewCustomNetworkAdded();
                }}
              >
                {t('dismiss')}
              </a>
            </div>
          </Popover>
        )}
      </MultipleNotifications>
    );
  }

  renderPopover = () => {
    const { setConnectedStatusPopoverHasBeenShown } = this.props;
    const { t } = this.context;
    return (
      <Popover
        title={t('whatsThis')}
        onClose={setConnectedStatusPopoverHasBeenShown}
        className="home__connected-status-popover"
        showArrow
        CustomBackground={({ onClose }) => {
          return (
            <div
              className="home__connected-status-popover-bg-container"
              onClick={onClose}
            >
              <div className="home__connected-status-popover-bg" />
            </div>
          );
        }}
        footer={
          <>
            <a
              href={ZENDESK_URLS.USER_GUIDE_DAPPS}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('learnMoreUpperCase')}
            </a>
            <Button
              type="primary"
              onClick={setConnectedStatusPopoverHasBeenShown}
            >
              {t('dismiss')}
            </Button>
          </>
        }
      >
        <main className="home__connect-status-text">
          <div>{t('metaMaskConnectStatusParagraphOne')}</div>
          <div>{t('metaMaskConnectStatusParagraphTwo')}</div>
          <div>{t('metaMaskConnectStatusParagraphThree')}</div>
        </main>
      </Popover>
    );
  };

  render() {
    // const { t } = this.context;
    const {
      defaultHomeActiveTabName,
      onTabClick,
      forgottenPassword,
      history,
      connectedStatusPopoverHasBeenShown,
      isPopup,
      announcementsToShow,
      showWhatsNewPopup,
      hideWhatsNewPopup,
      showPortfolioTooltip,
      // hidePortfolioTooltip,
      portfolioTooltipWasShownInThisSession,
      seedPhraseBackedUp,
      showRecoveryPhraseReminder,
      firstTimeFlowType,
      completedOnboarding,
      // shouldShowSeedPhraseReminder,
      onboardedInThisUISession,
      newCustomNetworkAdded,
    } = this.props;

    if (forgottenPassword) {
      return <Redirect to={{ pathname: RESTORE_VAULT_ROUTE }} />;
    } else if (this.state.notificationClosing || this.state.redirecting) {
      return null;
    }

    const showWhatsNew =
      completedOnboarding &&
      (!onboardedInThisUISession || firstTimeFlowType === 'import') &&
      announcementsToShow &&
      showWhatsNewPopup &&
      !showPortfolioTooltip &&
      !portfolioTooltipWasShownInThisSession &&
      Object.keys(newCustomNetworkAdded).length === 0;
    return (
      <div className="w-full">
        <Route path={CONNECTED_ROUTE} component={ConnectedSites} exact />
        <Route
          path={CONNECTED_ACCOUNTS_ROUTE}
          component={ConnectedAccounts}
          exact
        />
        <div className="home__container">
          {showWhatsNew ? <WhatsNewPopup onClose={hideWhatsNewPopup} /> : null}
          {!showWhatsNew && showRecoveryPhraseReminder ? (
            <RecoveryPhraseReminder
              hasBackedUp={seedPhraseBackedUp}
              onConfirm={this.onRecoveryPhraseReminderClose}
            />
          ) : null}
          {isPopup && !connectedStatusPopoverHasBeenShown
            ? this.renderPopover()
            : null}
          <div className="home__main-view">
            <MenuBar />
            <div className="home__balance-wrapper">
              <EthOverview />
            </div>
          </div>

          <div className="home__bottom-view mx-4 bg-grey-7 rounded-[20px]">
            <Tabs
              t={this.context.t}
              defaultActiveTabKey={defaultHomeActiveTabName}
              onTabClick={onTabClick}
              tabsClassName="grid grid-cols-2"
              // subHeader={
              //   <Tooltip
              //     position="bottom"
              //     open={
              //       !process.env.IN_TEST &&
              //       !shouldShowSeedPhraseReminder &&
              //       !showRecoveryPhraseReminder &&
              //       showPortfolioTooltip
              //     }
              //     interactive
              //     theme="home__subheader-link--tooltip"
              //     html={
              //       <div>
              //         <div className="home__subheader-link--tooltip-content-header">
              //           <div className="home__subheader-link--tooltip-content-header-text">
              //             {t('new')}
              //           </div>
              //           <button
              //             className="home__subheader-link--tooltip-content-header-button"
              //             onClick={() => {
              //               hidePortfolioTooltip();
              //             }}
              //           >
              //             <i className="fa fa-times" />
              //           </button>
              //         </div>
              //         <div>
              //           {t('tryOur')}&nbsp;
              //           <span className="home__subheader-link--tooltip-content-text-bold">
              //             {t('betaPortfolioSite')}
              //           </span>
              //           &nbsp;{t('keepTapsOnTokens')}
              //         </div>
              //       </div>
              //     }
              //   >
              //     <ImportTokenLink />
              //   </Tooltip>
              // }
            >
              <Tab
                className="home__tab"
                data-testid="home__asset-tab"
                name={this.context.t('tokens')}
                tabKey="assets"
              >
                <AssetList
                  onClickAsset={(asset) =>
                    history.push(`${ASSET_ROUTE}/${asset}`)
                  }
                />
              </Tab>
              <Tab
                activeClassName="home__tab--active"
                className="home__tab"
                data-testid="home__nfts-tab"
                name={this.context.t('nfts')}
                tabKey="nfts"
              >
                <NftsTab
                  onAddNFT={() => {
                    history.push(ADD_NFT_ROUTE);
                  }}
                />
              </Tab>
              {process.env.NFTS_V1 ? (
                <Tab
                  activeClassName="home__tab--active"
                  className="home__tab"
                  data-testid="home__nfts-tab"
                  name={this.context.t('nfts')}
                  tabKey="nfts"
                >
                  <NftsTab
                    onAddNFT={() => {
                      history.push(ADD_NFT_ROUTE);
                    }}
                  />
                </Tab>
              ) : null}
              {/* <Tab
                activeClassName="home__tab--active"
                className="home__tab"
                data-testid="home__activity-tab"
                name={this.context.t('activity')}
                tabKey="activity"
              >
                <TransactionList />
              </Tab> */}
            </Tabs>
          </div>
          {/* <Toolbar /> */}
          {this.renderNotifications()}
        </div>
      </div>
    );
  }
}
