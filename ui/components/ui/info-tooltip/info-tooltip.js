import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Tooltip from '../tooltip';
import { Icon } from '../../component-library';

const positionArrowClassMap = {
  top: 'info-tooltip__top-tooltip-arrow',
  bottom: 'info-tooltip__bottom-tooltip-arrow',
  left: 'info-tooltip__left-tooltip-arrow',
  right: 'info-tooltip__right-tooltip-arrow',
};

export default function InfoTooltip({
  contentText = '',
  position = '',
  containerClassName,
  wrapperClassName,
}) {
  return (
    <div className="info-tooltip">
      <Tooltip
        interactive
        position={position}
        containerClassName={classnames(
          'info-tooltip__tooltip-container',
          containerClassName,
        )}
        wrapperClassName={wrapperClassName}
        tooltipInnerClassName="info-tooltip__tooltip-content"
        tooltipArrowClassName={positionArrowClassMap[position]}
        html={contentText}
        theme="tippy-tooltip-info"
      >
        <Icon name="info" />
      </Tooltip>
    </div>
  );
}

InfoTooltip.propTypes = {
  /**
   * Text label that shows up after hover
   */
  contentText: PropTypes.node,
  /**
   * Shows position of the tooltip
   */
  position: PropTypes.oneOf(['top', 'left', 'bottom', 'right']),
  /**
   * Add custom CSS class for container
   */
  containerClassName: PropTypes.string,
  /**
   * Add custom CSS class for the wrapper
   */
  wrapperClassName: PropTypes.string,
};
