import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Identicon from '../../../ui/identicon';
import { ellipsify } from '../../../../pages/send/send.utils';

function addressesEqual(address1, address2) {
  return String(address1).toLowerCase() === String(address2).toLowerCase();
}

export default function RecipientGroup({
  label,
  items,
  onSelect,
  selectedAddress,
}) {
  if (!items || !items.length) {
    return null;
  }

  return (
    <div
      className="send__select-recipient-wrapper__group"
      data-testid="recipient-group"
    >
      {label && (
        <div className="text-[15px] text-black-2 font-medium">{label}</div>
      )}
      {items.map(({ address, name }) => (
        <div
          key={address}
          onClick={() => onSelect(address, name)}
          className={classnames('py-2 flex gap-3', {
            'border-green-2 border-2 rounded-xl': addressesEqual(
              address,
              selectedAddress,
            ),
          })}
        >
          <Identicon address={address} diameter={28} />
          <div className="flex flex-col flex-grow" data-testid="recipient">
            <div className="text-[15px] text-black">
              {name || ellipsify(address)}
            </div>
            {name && (
              <div className="text-[15px] text-grey">{ellipsify(address)}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

RecipientGroup.propTypes = {
  label: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string.isRequired,
      name: PropTypes.string,
    }),
  ),
  onSelect: PropTypes.func.isRequired,
  selectedAddress: PropTypes.string,
};
