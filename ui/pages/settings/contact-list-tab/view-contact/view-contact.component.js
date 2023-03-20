import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import Identicon from '../../../../components/ui/identicon';
import Button from '../../../../components/ui/button/button.component';
import {
  ButtonIcon,
  ICON_NAMES,
  ICON_SIZES,
} from '../../../../components/component-library';

import Tooltip from '../../../../components/ui/tooltip';
import { useI18nContext } from '../../../../hooks/useI18nContext';
import { useCopyToClipboard } from '../../../../hooks/useCopyToClipboard';

function quadSplit(address) {
  return `0x${address
    .slice(2)
    .match(/.{1,4}/gu)
    .join('')}`;
}

function ViewContact({
  history,
  name,
  address,
  checkSummedAddress,
  memo,
  editRoute,
  listRoute,
}) {
  const t = useI18nContext();
  const [copied, handleCopy] = useCopyToClipboard();

  if (!address) {
    return <Redirect to={{ pathname: listRoute }} />;
  }

  return (
    <div className="flex flex-col p-4 gap-5">
      <div className="flex gap-2">
        <Identicon address={address} diameter={60} />
        <div className="flex-grow text-[15px] text-black font-bold">
          {name || address}
        </div>
      </div>

      <Button
        type="secondary"
        onClick={() => {
          history.push(`${editRoute}/${address}`);
        }}
      >
        {t('edit')}
      </Button>
      <div className="flex flex-col">
        <div className="flex-grow text-[15px] text-black font-bold">
          {t('ethereumPublicAddress')}
        </div>
        <div className="address-book__view-contact__group__value">
          <div className="flex-grow text-[13px] text-grey">
            {quadSplit(checkSummedAddress)}
          </div>
          <Tooltip
            position="bottom"
            title={copied ? t('copiedExclamation') : t('copyToClipboard')}
          >
            <ButtonIcon
              ariaLabel="copy"
              className="address-book__view-contact__group__static-address--copy-icon"
              onClick={() => {
                handleCopy(checkSummedAddress);
              }}
              iconName={copied ? ICON_NAMES.COPY_SUCCESS : ICON_NAMES.COPY}
              size={ICON_SIZES.LG}
            />
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="text-[15px] text-black font-bold">{t('memo')}</div>
        <div className="flex-grow text-[13px] text-grey">{memo}</div>
      </div>
    </div>
  );
}

ViewContact.propTypes = {
  name: PropTypes.string,
  address: PropTypes.string,
  history: PropTypes.object,
  checkSummedAddress: PropTypes.string,
  memo: PropTypes.string,
  editRoute: PropTypes.string,
  listRoute: PropTypes.string.isRequired,
};

export default React.memo(ViewContact);
