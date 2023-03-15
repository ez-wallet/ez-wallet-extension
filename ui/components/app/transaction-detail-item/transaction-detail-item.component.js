import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function TransactionDetailItem({
  detailTitle = '',
  detailText = '',
  detailTotal = '',
  subTitle = '',
  subText = '',
  flexWidthValues = false,
}) {
  return (
    <div className="transaction-detail-item">
      <div className="transaction-detail-item__row">
        <div className="text-[15px] text-black">{detailTitle}</div>
        <div
          className={classnames('transaction-detail-item__detail-values', {
            'transaction-detail-item__detail-values--flex-width':
              flexWidthValues,
          })}
        >
          {detailText && <p className="text-[15px] text-black">{detailText}</p>}
          <p className="text-[15px] text-black">{detailTotal}</p>
        </div>
      </div>
      <div className="transaction-detail-item__row">
        {React.isValidElement(subTitle) ? (
          <div className="text-[13px] text-grey">{subTitle}</div>
        ) : (
          <p className="text-[13px] text-grey">{subTitle}</p>
        )}

        <p className="text-[13px] text-grey">{subText}</p>
      </div>
    </div>
  );
}

TransactionDetailItem.propTypes = {
  /**
   * Detail title text wrapped in Typography component.
   */
  detailTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /**
   * Text to show on the left of the detailTotal. Wrapped in Typography component.
   */
  detailText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /**
   * Total amount to show. Wrapped in Typography component. Will be bold if boldHeadings is true
   */
  detailTotal: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /**
   * Subtitle text. Checks if React.isValidElement before displaying. Displays under detailTitle
   */
  subTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /**
   * Text to show under detailTotal. Wrapped in Typography component.
   */
  subText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /**
   * Changes width to auto for transaction-detail-item__detail-values
   */
  flexWidthValues: PropTypes.bool,
};
