import React, { useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { I18nContext } from '../../../contexts/i18n';
import { useGasFeeContext } from '../../../contexts/gasFee';
import { PRIMARY, SECONDARY } from '../../../helpers/constants/common';
import UserPreferencedCurrencyDisplay from '../../../components/app/user-preferenced-currency-display';
import GasTiming from '../../../components/app/gas-timing';
import InfoTooltip from '../../../components/ui/info-tooltip';
import { TokenStandard } from '../../../../shared/constants/transaction';
import LoadingHeartBeat from '../../../components/ui/loading-heartbeat';
import TransactionDetailItem from '../../../components/app/transaction-detail-item';
import { NETWORK_TO_NAME_MAP } from '../../../../shared/constants/network';
import TransactionDetail from '../../../components/app/transaction-detail';
import ActionableMessage from '../../../components/ui/actionable-message';
import DepositPopover from '../../../components/app/deposit-popover';
import {
  getProvider,
  getPreferences,
  getIsBuyableChain,
  transactionFeeSelector,
  getIsMainnet,
  getIsTestnet,
  getUseCurrencyRateCheck,
} from '../../../selectors';

import { INSUFFICIENT_TOKENS_ERROR } from '../send.constants';
import { getCurrentDraftTransaction } from '../../../ducks/send';
import { showModal } from '../../../store/actions';
import {
  addHexes,
  hexWEIToDecETH,
  hexWEIToDecGWEI,
} from '../../../../shared/modules/conversion.utils';

export default function GasDisplay({ gasError }) {
  const t = useContext(I18nContext);
  const dispatch = useDispatch();
  const { estimateUsed } = useGasFeeContext();
  const [showDepositPopover, setShowDepositPopover] = useState(false);

  const currentProvider = useSelector(getProvider);
  const isMainnet = useSelector(getIsMainnet);
  const isTestnet = useSelector(getIsTestnet);
  const isBuyableChain = useSelector(getIsBuyableChain);
  const draftTransaction = useSelector(getCurrentDraftTransaction);
  const useCurrencyRateCheck = useSelector(getUseCurrencyRateCheck);
  const { showFiatInTestnets, useNativeCurrencyAsPrimaryCurrency } =
    useSelector(getPreferences);
  const { provider, unapprovedTxs } = useSelector((state) => state.metamask);
  const nativeCurrency = provider.ticker;
  const { chainId } = provider;
  const networkName = NETWORK_TO_NAME_MAP[chainId];
  const isInsufficientTokenError =
    draftTransaction?.amount.error === INSUFFICIENT_TOKENS_ERROR;
  const editingTransaction = unapprovedTxs[draftTransaction.id];
  const currentNetworkName = networkName || currentProvider.nickname;

  const transactionData = {
    txParams: {
      gasPrice: draftTransaction.gas?.gasPrice,
      gas: editingTransaction?.userEditedGasLimit
        ? editingTransaction?.txParams?.gas
        : draftTransaction.gas?.gasLimit,
      maxFeePerGas: editingTransaction?.txParams?.maxFeePerGas
        ? editingTransaction?.txParams?.maxFeePerGas
        : draftTransaction.gas?.maxFeePerGas,
      maxPriorityFeePerGas: editingTransaction?.txParams?.maxPriorityFeePerGas
        ? editingTransaction?.txParams?.maxPriorityFeePerGas
        : draftTransaction.gas?.maxPriorityFeePerGas,
      value: draftTransaction.amount?.value,
      type: draftTransaction.transactionType,
    },
    userFeeLevel: editingTransaction?.userFeeLevel,
  };

  const {
    hexMinimumTransactionFee,
    hexMaximumTransactionFee,
    hexTransactionTotal,
  } = useSelector((state) => transactionFeeSelector(state, transactionData));

  let title;
  if (
    draftTransaction?.asset.details?.standard === TokenStandard.ERC721 ||
    draftTransaction?.asset.details?.standard === TokenStandard.ERC1155
  ) {
    title = draftTransaction?.asset.details?.name;
  } else if (
    draftTransaction?.asset.details?.standard === TokenStandard.ERC20
  ) {
    title = `${hexWEIToDecETH(draftTransaction.amount.value)} ${
      draftTransaction?.asset.details?.symbol
    }`;
  }

  const ethTransactionTotalMaxAmount = Number(
    hexWEIToDecETH(hexMaximumTransactionFee),
  );

  const primaryTotalTextOverrideMaxAmount = `${title} + ${ethTransactionTotalMaxAmount} ${nativeCurrency}`;

  const showCurrencyRateCheck =
    useCurrencyRateCheck && (!isTestnet || showFiatInTestnets);

  let detailTotal, maxAmount;

  if (draftTransaction?.asset.type === 'NATIVE') {
    detailTotal = (
      <div className="flex flex-col font-bold text-black">
        <LoadingHeartBeat estimateUsed={transactionData?.userFeeLevel} />
        <UserPreferencedCurrencyDisplay
          type={PRIMARY}
          key="total-detail-value"
          value={hexTransactionTotal}
          hideLabel={!useNativeCurrencyAsPrimaryCurrency}
        />
      </div>
    );
    maxAmount = (
      <UserPreferencedCurrencyDisplay
        type={PRIMARY}
        key="total-max-amount"
        value={addHexes(
          draftTransaction.amount.value,
          hexMaximumTransactionFee,
        )}
        hideLabel={!useNativeCurrencyAsPrimaryCurrency}
      />
    );
  } else if (useNativeCurrencyAsPrimaryCurrency) {
    detailTotal = primaryTotalTextOverrideMaxAmount;
    maxAmount = primaryTotalTextOverrideMaxAmount;
  }

  return (
    <div className="flex flex-col gap-5 mx-4 my-[1.3rem]">
      {showDepositPopover && (
        <DepositPopover onClose={() => setShowDepositPopover(false)} />
      )}
      <div className="w-full shadow-neumorphic bg-grey-6 rounded-xl overflow-hidden">
        <TransactionDetail
          userAcknowledgedGasMissing={false}
          rows={[
            <TransactionDetailItem
              key="gas-item"
              detailTitle={
                <div className="flex">
                  <div>{t('gas')}</div>
                  <span>({t('transactionDetailGasInfoV2')})</span>
                  <InfoTooltip
                    contentText={
                      <>
                        <p>
                          {t('transactionDetailGasTooltipIntro', [
                            isMainnet ? t('networkNameEthereum') : '',
                          ])}
                        </p>
                        <p>{t('transactionDetailGasTooltipExplanation')}</p>
                        <p>
                          <a
                            href="https://www.ezwallet.xyz/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t('transactionDetailGasTooltipConversion')}
                          </a>
                        </p>
                      </>
                    }
                    position="right"
                  />
                </div>
              }
              detailText={
                showCurrencyRateCheck && (
                  <div className="text-[15px] text-black font-bold">
                    <LoadingHeartBeat estimateUsed={estimateUsed} />
                    <UserPreferencedCurrencyDisplay
                      type={SECONDARY}
                      value={hexMinimumTransactionFee}
                      hideLabel={Boolean(useNativeCurrencyAsPrimaryCurrency)}
                    />
                  </div>
                )
              }
              detailTotal={
                <div className="text-[15px] text-black font-bold">
                  <LoadingHeartBeat estimateUsed={estimateUsed} />
                  <UserPreferencedCurrencyDisplay
                    type={PRIMARY}
                    value={hexMinimumTransactionFee}
                    hideLabel={!useNativeCurrencyAsPrimaryCurrency}
                  />
                </div>
              }
              subText={
                <>
                  <div
                    className={classNames('flex text-[13px] text-grey', {
                      'text-yellow-2': estimateUsed === 'high',
                    })}
                  >
                    <LoadingHeartBeat estimateUsed={estimateUsed} />
                    <div className="text-[13px] text-grey">
                      <p>
                        {estimateUsed === 'high' && '⚠ '}
                        {t('editGasSubTextFeeLabel')}
                      </p>
                    </div>
                    <div className="text-[13px] text-grey">
                      <LoadingHeartBeat estimateUsed={estimateUsed} />
                      <UserPreferencedCurrencyDisplay
                        key="editGasSubTextFeeAmount"
                        type={PRIMARY}
                        value={hexMaximumTransactionFee}
                        hideLabel={!useNativeCurrencyAsPrimaryCurrency}
                      />
                    </div>
                  </div>
                </>
              }
              subTitle={
                <GasTiming
                  maxPriorityFeePerGas={hexWEIToDecGWEI(
                    draftTransaction.gas.maxPriorityFeePerGas,
                  )}
                  maxFeePerGas={hexWEIToDecGWEI(
                    draftTransaction.gas.maxFeePerGas,
                  )}
                />
              }
            />,
            (gasError || isInsufficientTokenError) && (
              <TransactionDetailItem
                key="total-item"
                detailTitle={t('total')}
                detailText={
                  showCurrencyRateCheck && (
                    <div className="flex flex-col text-[15px] font-bold text-black">
                      <LoadingHeartBeat
                        estimateUsed={transactionData?.userFeeLevel}
                      />
                      <UserPreferencedCurrencyDisplay
                        type={SECONDARY}
                        key="total-detail-text"
                        value={hexTransactionTotal}
                        hideLabel={Boolean(useNativeCurrencyAsPrimaryCurrency)}
                      />
                    </div>
                  )
                }
                detailTotal={detailTotal}
                subTitle={t('transactionDetailGasTotalSubtitle')}
                subText={
                  <div className="flex text-[13px] text-grey">
                    <LoadingHeartBeat
                      estimateUsed={
                        transactionData?.userFeeLevel ?? estimateUsed
                      }
                    />
                    <p key="editGasSubTextAmountLabel">
                      {t('editGasSubTextAmountLabel')}
                    </p>
                    {maxAmount}
                  </div>
                }
              />
            ),
          ]}
        />
      </div>
      {(gasError || isInsufficientTokenError) && currentNetworkName && (
        <div data-testid="gas-warning-message">
          <div className="gas-display__confirm-approve-content__warning">
            <ActionableMessage
              message={
                isBuyableChain && draftTransaction.asset.type === 'NATIVE' ? (
                  <div className="flex">
                    {t('insufficientCurrencyBuyOrReceive', [
                      nativeCurrency,
                      currentNetworkName,
                      <a
                        href="#"
                        className="text-blue"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowDepositPopover(true);
                        }}
                        key={`${nativeCurrency}-buy-button`}
                      >
                        {t('buyAsset', [nativeCurrency])}
                      </a>,
                      <a
                        href="#"
                        className="text-blue"
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(showModal({ name: 'ACCOUNT_DETAILS' }));
                        }}
                        key="receive-button"
                      >
                        {t('deposit')}
                      </a>,
                    ])}
                  </div>
                ) : (
                  <div className="flex">
                    {t('insufficientCurrencyBuyOrReceive', [
                      draftTransaction.asset.details?.symbol ?? nativeCurrency,
                      currentNetworkName,
                      `${t('buyAsset', [
                        draftTransaction.asset.details?.symbol ??
                          nativeCurrency,
                      ])}`,
                      <a
                        href="#"
                        className="text-blue"
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(showModal({ name: 'ACCOUNT_DETAILS' }));
                        }}
                        key="receive-button"
                      >
                        {t('deposit')}
                      </a>,
                    ])}
                  </div>
                )
              }
              useIcon
              type="danger"
            />
          </div>
        </div>
      )}
    </div>
  );
}
GasDisplay.propTypes = {
  gasError: PropTypes.string,
};
