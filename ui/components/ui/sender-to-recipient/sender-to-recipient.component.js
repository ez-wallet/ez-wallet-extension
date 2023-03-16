import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import copyToClipboard from 'copy-to-clipboard';
import Tooltip from '../tooltip';
import Identicon from '../identicon';
import { shortenAddress } from '../../../helpers/utils/util';
import AccountMismatchWarning from '../account-mismatch-warning/account-mismatch-warning.component';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { toChecksumHexAddress } from '../../../../shared/modules/hexstring-utils';
import NicknamePopovers from '../../app/modals/nickname-popovers';
import { Icon, ICON_NAMES } from '../../component-library';
import {
  DEFAULT_VARIANT,
  CARDS_VARIANT,
  FLAT_VARIANT,
} from './sender-to-recipient.constants';

const variantHash = {
  [DEFAULT_VARIANT]: 'sender-to-recipient--default',
  [CARDS_VARIANT]: 'sender-to-recipient--cards',
  [FLAT_VARIANT]: 'sender-to-recipient--flat',
};

function SenderAddress({
  addressOnly,
  checksummedSenderAddress,
  senderName,
  onSenderClick,
  senderAddress,
  warnUserOnAccountMismatch,
}) {
  const t = useI18nContext();
  const [addressCopied, setAddressCopied] = useState(false);
  let tooltipHtml = <p>{t('copiedExclamation')}</p>;
  if (!addressCopied) {
    tooltipHtml = addressOnly ? (
      <p>{t('copyAddress')}</p>
    ) : (
      <p>
        {shortenAddress(checksummedSenderAddress)}
        <br />
        {t('copyAddress')}
      </p>
    );
  }
  return (
    <div
      className={classnames(
        'px-4 py-2 h-[60px] rounded-full shadow-input flex gap-3 items-center',
      )}
      onClick={() => {
        setAddressCopied(true);
        copyToClipboard(checksummedSenderAddress);
        if (onSenderClick) {
          onSenderClick();
        }
      }}
    >
      <div className="sender-to-recipient__sender-icon">
        <Identicon
          address={toChecksumHexAddress(senderAddress)}
          diameter={24}
        />
      </div>
      <Tooltip
        position="bottom"
        html={tooltipHtml}
        wrapperClassName="sender-to-recipient__tooltip-wrapper"
        containerClassName="sender-to-recipient__tooltip-container"
        onHidden={() => setAddressCopied(false)}
      >
        <div className="flex-grow flex flex-col">
          <p className="text-[15px] text-black">{senderName}</p>
          <p className="text-[13px] text-grey">
            {shortenAddress(checksummedSenderAddress)}
          </p>
        </div>
      </Tooltip>
      {warnUserOnAccountMismatch && (
        <AccountMismatchWarning address={senderAddress} />
      )}
    </div>
  );
}

SenderAddress.propTypes = {
  senderName: PropTypes.string,
  checksummedSenderAddress: PropTypes.string,
  addressOnly: PropTypes.bool,
  senderAddress: PropTypes.string,
  onSenderClick: PropTypes.func,
  warnUserOnAccountMismatch: PropTypes.bool,
};

export function RecipientWithAddress({
  checksummedRecipientAddress,
  onRecipientClick,
  addressOnly,
  recipientNickname,
  recipientEns,
  recipientName,
  recipientMetadataName,
  recipientIsOwnedAccount,
}) {
  const t = useI18nContext();
  const [showNicknamePopovers, setShowNicknamePopovers] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);

  let tooltipHtml = <p>{t('copiedExclamation')}</p>;
  if (!addressCopied) {
    tooltipHtml = addressOnly ? (
      <p>{t('copyAddress')}</p>
    ) : (
      <p>
        {shortenAddress(checksummedRecipientAddress)}
        <br />
        {t('copyAddress')}
      </p>
    );
  }

  return (
    <>
      <div
        className="px-4 py-2 h-[60px] rounded-full shadow-input flex gap-3 items-center"
        onClick={() => {
          if (recipientIsOwnedAccount) {
            setAddressCopied(true);
            copyToClipboard(checksummedRecipientAddress);
          } else {
            setShowNicknamePopovers(true);
            if (onRecipientClick) {
              onRecipientClick();
            }
          }
        }}
      >
        <div className="sender-to-recipient__sender-icon">
          <Identicon address={checksummedRecipientAddress} diameter={24} />
        </div>
        <Tooltip
          position="bottom"
          disabled={!recipientName}
          html={tooltipHtml}
          wrapperClassName="sender-to-recipient__tooltip-wrapper"
          containerClassName="sender-to-recipient__tooltip-container"
          onHidden={() => setAddressCopied(false)}
        >
          <div className="flex-grow flex flex-col">
            <p className="text-[15px] text-black">
              {recipientName ??
                recipientNickname ??
                recipientMetadataName ??
                recipientEns}
            </p>
            <p className="text-[13px] text-grey">
              {shortenAddress(checksummedRecipientAddress)}
            </p>
          </div>
        </Tooltip>
      </div>
      {showNicknamePopovers ? (
        <NicknamePopovers
          onClose={() => setShowNicknamePopovers(false)}
          address={checksummedRecipientAddress}
        />
      ) : null}
    </>
  );
}

RecipientWithAddress.propTypes = {
  checksummedRecipientAddress: PropTypes.string,
  recipientName: PropTypes.string,
  recipientMetadataName: PropTypes.string,
  recipientEns: PropTypes.string,
  recipientNickname: PropTypes.string,
  addressOnly: PropTypes.bool,
  onRecipientClick: PropTypes.func,
  recipientIsOwnedAccount: PropTypes.bool,
};

function Arrow({ variant }) {
  return variant === DEFAULT_VARIANT ? (
    <div className="sender-to-recipient__arrow-container">
      <div className="sender-to-recipient__arrow-circle">
        <i className="fa fa-arrow-right sender-to-recipient__arrow-circle__icon" />
      </div>
    </div>
  ) : (
    <div className="sender-to-recipient__arrow-container">
      <Icon name={ICON_NAMES.ARROW_RIGHT} />
    </div>
  );
}

Arrow.propTypes = {
  variant: PropTypes.oneOf([DEFAULT_VARIANT, CARDS_VARIANT, FLAT_VARIANT]),
};

export default function SenderToRecipient({
  senderAddress,
  addressOnly,
  senderName,
  recipientNickname,
  recipientName,
  recipientMetadataName,
  recipientEns,
  onRecipientClick,
  onSenderClick,
  recipientAddress,
  variant,
  warnUserOnAccountMismatch,
  recipientIsOwnedAccount,
}) {
  const t = useI18nContext();
  const checksummedSenderAddress = toChecksumHexAddress(senderAddress);
  const checksummedRecipientAddress = toChecksumHexAddress(recipientAddress);

  return (
    <div
      className={classnames(
        'w-full grid grid-cols-1 gap-4 py-4 bg-transparent',
        variantHash[variant],
      )}
      data-testid="sender-to-recipient"
    >
      <SenderAddress
        checksummedSenderAddress={checksummedSenderAddress}
        addressOnly={addressOnly}
        senderName={senderName}
        onSenderClick={onSenderClick}
        senderAddress={senderAddress}
        warnUserOnAccountMismatch={warnUserOnAccountMismatch}
      />

      {recipientAddress ? (
        <RecipientWithAddress
          checksummedRecipientAddress={checksummedRecipientAddress}
          onRecipientClick={onRecipientClick}
          addressOnly={addressOnly}
          recipientNickname={recipientNickname}
          recipientEns={recipientEns}
          recipientName={recipientName}
          recipientMetadataName={recipientMetadataName}
          recipientIsOwnedAccount={recipientIsOwnedAccount}
        />
      ) : (
        <div className="sender-to-recipient__party sender-to-recipient__party--recipient">
          <i className="fa fa-file-text-o" />
          <div className="sender-to-recipient__name">{t('newContract')}</div>
        </div>
      )}
    </div>
  );
}

SenderToRecipient.defaultProps = {
  variant: DEFAULT_VARIANT,
  warnUserOnAccountMismatch: true,
};

SenderToRecipient.propTypes = {
  senderName: PropTypes.string,
  senderAddress: PropTypes.string,
  recipientName: PropTypes.string,
  recipientMetadataName: PropTypes.string,
  recipientEns: PropTypes.string,
  recipientAddress: PropTypes.string,
  recipientNickname: PropTypes.string,
  variant: PropTypes.oneOf([DEFAULT_VARIANT, CARDS_VARIANT, FLAT_VARIANT]),
  addressOnly: PropTypes.bool,
  onRecipientClick: PropTypes.func,
  onSenderClick: PropTypes.func,
  warnUserOnAccountMismatch: PropTypes.bool,
  recipientIsOwnedAccount: PropTypes.bool,
};
