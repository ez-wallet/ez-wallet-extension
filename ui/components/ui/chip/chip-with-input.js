import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { BorderColor } from '../../../helpers/constants/design-system';
import Chip from '.';

export function ChipWithInput({
  dataTestId,
  className,
  borderColor = BorderColor.borderDefault,
  inputValue,
  setInputValue,
  // itemNumber,
}) {
  return (
    <Chip
      className={classnames('chip--with-input', className)}
      borderColor={borderColor}
    >
      {/* {itemNumber} */}
      {setInputValue && (
        <input
          data-testid={dataTestId}
          type="text"
          className="chip__input"
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          value={inputValue}
        />
      )}
    </Chip>
  );
}

ChipWithInput.propTypes = {
  dataTestId: PropTypes.string,
  borderColor: PropTypes.oneOf(Object.values(BorderColor)),
  className: PropTypes.string,
  inputValue: PropTypes.string,
  setInputValue: PropTypes.func,
  // itemNumber: PropTypes.string,
};
