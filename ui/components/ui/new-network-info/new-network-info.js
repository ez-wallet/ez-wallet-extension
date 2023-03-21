import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { I18nContext } from '../../../contexts/i18n';
import Popover from '../popover';
import Button from '../button';
import Identicon from '../identicon';
import { TOKEN_API_METASWAP_CODEFI_URL } from '../../../../shared/constants/tokens';
import fetchWithCache from '../../../../shared/lib/fetch-with-cache';
import {
  getNativeCurrencyImage,
  getProvider,
  getUseTokenDetection,
} from '../../../selectors';
import { IMPORT_TOKEN_ROUTE } from '../../../helpers/constants/routes';
import { setFirstTimeUsedNetwork } from '../../../store/actions';
import { NETWORK_TYPES } from '../../../../shared/constants/network';

const NewNetworkInfo = () => {
  const t = useContext(I18nContext);
  const history = useHistory();
  const [tokenDetectionSupported, setTokenDetectionSupported] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const autoDetectToken = useSelector(getUseTokenDetection);
  const primaryTokenImage = useSelector(getNativeCurrencyImage);
  const currentProvider = useSelector(getProvider);

  const onCloseClick = () => {
    setShowPopup(false);
    setFirstTimeUsedNetwork(currentProvider.chainId);
  };

  const addTokenManually = () => {
    history.push(IMPORT_TOKEN_ROUTE);
    setShowPopup(false);
    setFirstTimeUsedNetwork(currentProvider.chainId);
  };

  const getIsTokenDetectionSupported = async () => {
    const fetchedTokenData = await fetchWithCache(
      `${TOKEN_API_METASWAP_CODEFI_URL}${currentProvider.chainId}`,
    );

    return !fetchedTokenData.error;
  };

  const checkTokenDetection = async () => {
    const fetchedData = await getIsTokenDetectionSupported();

    setTokenDetectionSupported(fetchedData);
  };

  useEffect(() => {
    checkTokenDetection();
  });

  if (!showPopup) {
    return null;
  }

  return (
    <Popover
      onClose={onCloseClick}
      className="new-network-info__wrapper bg-grey-6"
      footer={
        <Button large type="primary" onClick={onCloseClick}>
          {t('recoveryPhraseReminderConfirm')}
        </Button>
      }
    >
      <div className="flex flex-col items-center px-4 gap-4">
        <p className="text-[19px] text-black font-bold">{t('switchedTo')}</p>
        <div className="bg-grey-7 rounded-full px-3 py-2 text-[15px] text-black font-medium flex items-center gap-2 shadow-input">
          {primaryTokenImage ? (
            <Identicon image={primaryTokenImage} diameter={14} />
          ) : (
            <i className="fa fa-question-circle" />
          )}
          <span>
            {currentProvider.type === NETWORK_TYPES.RPC
              ? currentProvider.nickname ?? t('privateNetwork')
              : t(currentProvider.type)}
          </span>
        </div>
        <p className="text-[15px] text-black font-bold text-center">
          {t('thingsToKeep')}
        </p>
        <div className="w-full flex flex-col gap-3">
          {currentProvider.ticker ? (
            <div className="flex items-center gap-2">
              <span>&bull;</span>
              <div className="text-[13px]" key="nativeTokenInfo">
                {t('nativeToken', [
                  <span key="ticker" className="text-[13px]">
                    {currentProvider.ticker}
                  </span>,
                ])}
              </div>
            </div>
          ) : null}
          <div className="w-full flex items-center gap-2">
            <span>&bull;</span>
            <div className="text-[13px]">
              {t('attemptSendingAssets')}
              <a
                href="https://ezwallet.zendesk.com/hc/en-us/articles/4404424659995"
                target="_blank"
                className="text-blue"
                rel="noreferrer"
              >
                {t('learnMoreUpperCase')}
              </a>
            </div>
          </div>
          {!autoDetectToken || !tokenDetectionSupported ? (
            <div className="w-full flex items-center gap-2">
              <span>&bull;</span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  addTokenManually();
                }}
                className="text-blue text-[13px]"
              >
                {t('clickToManuallyAdd')}
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </Popover>
  );
};

export default NewNetworkInfo;
