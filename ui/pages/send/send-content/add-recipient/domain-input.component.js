import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { addHexPrefix } from '../../../../../app/scripts/lib/util';
import { isValidDomainName } from '../../../../helpers/utils/util';
import {
  isBurnAddress,
  isValidHexAddress,
} from '../../../../../shared/modules/hexstring-utils';
import {
  ButtonIcon,
  ICON_NAMES,
} from '../../../../components/component-library';
import { IconColor } from '../../../../helpers/constants/design-system';

export default class DomainInput extends Component {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  };

  static propTypes = {
    className: PropTypes.string,
    selectedAddress: PropTypes.string,
    selectedName: PropTypes.string,
    scanQrCode: PropTypes.func,
    onPaste: PropTypes.func,
    onValidAddressTyped: PropTypes.func,
    internalSearch: PropTypes.bool,
    userInput: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    lookupEnsName: PropTypes.func.isRequired,
    initializeDomainSlice: PropTypes.func.isRequired,
    resetDomainResolution: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.initializeDomainSlice();
  }

  onPaste = (event) => {
    if (event.clipboardData.items?.length) {
      const clipboardItem = event.clipboardData.items[0];
      clipboardItem?.getAsString((text) => {
        const input = text.trim();
        if (
          !isBurnAddress(input) &&
          isValidHexAddress(input, { mixedCaseUseChecksum: true })
        ) {
          this.props.onPaste(addHexPrefix(input));
        }
      });
    }
  };

  onChange = ({ target: { value } }) => {
    const {
      onValidAddressTyped,
      internalSearch,
      onChange,
      lookupEnsName,
      resetDomainResolution,
    } = this.props;
    const input = value.trim();

    onChange(input);
    if (internalSearch) {
      return null;
    }
    // Empty ENS state if input is empty
    // maybe scan ENS
    if (isValidDomainName(input)) {
      lookupEnsName(input);
    } else {
      resetDomainResolution();
      if (
        onValidAddressTyped &&
        !isBurnAddress(input) &&
        isValidHexAddress(input, { mixedCaseUseChecksum: true })
      ) {
        onValidAddressTyped(addHexPrefix(input));
      }
    }

    return null;
  };

  render() {
    const { t } = this.context;
    const { className, selectedAddress, selectedName, userInput } = this.props;

    const hasSelectedAddress = Boolean(selectedAddress);

    return (
      <div
        className={classnames(
          'flex items-center bg-grey-6 shadow-input rounded-full h-[60px] py-2 px-4 w-full gap-1 mb-3',
          className,
        )}
      >
        {hasSelectedAddress && <i className="text-green fa fa-check-circle" />}
        {hasSelectedAddress ? (
          <>
            <div className="flex flex-col flex-grow">
              <div className="ens-input__selected-input__title">
                {selectedName || selectedAddress}
              </div>
              {selectedName !== selectedAddress && (
                <div className="ens-input__selected-input__subtitle">
                  {selectedAddress}
                </div>
              )}
            </div>
            <button
              onClick={this.props.onReset}
              className="ens-input__wrapper__action-icon-button"
            >
              <i
                className="fa fa-times"
                style={{
                  color: 'var(--color-icon-default)',
                }}
                title={t('close')}
              />
            </button>
          </>
        ) : (
          <div className="flex w-full">
            <input
              className="flex-grow border-0 bg-transparent box-border w-full focus:outline-0 text-[15px]"
              type="text"
              dir="auto"
              placeholder={t('recipientAddressPlaceholder')}
              onChange={this.onChange}
              onPaste={this.onPaste}
              spellCheck="false"
              value={selectedAddress || userInput}
              autoFocus
              data-testid="ens-input"
            />
            <ButtonIcon
              onClick={() => {
                if (userInput) {
                  this.props.onReset();
                } else {
                  this.props.scanQrCode();
                }
              }}
              iconName={userInput ? ICON_NAMES.CLOSE : ICON_NAMES.SCAN_BARCODE}
              ariaLabel={t(userInput ? 'close' : 'scanQrCode')}
              color={
                userInput ? IconColor.iconDefault : IconColor.primaryDefault
              }
            />
          </div>
        )}
      </div>
    );
  }
}
