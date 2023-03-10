import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import InfoTooltip from '../info-tooltip';
import { Icon } from '../../component-library';

const CLASSNAME_WITH_RIGHT_BUTTON = 'actionable-message--with-right-button';
const TYPE_HASH = {
  warning: 'warning',
  danger: 'danger',
  success: 'success',
  info: 'info',
  default: 'default',
};

const ICON = {
  warning: 'info',
  danger: 'danger',
  success: 'check',
  info: 'info',
  default: 'info',
};

export default function ActionableMessage({
  message = '',
  primaryAction = null,
  primaryActionV2 = null,
  secondaryAction = null,
  className = '',
  infoTooltipText = '',
  withRightButton = false,
  type = 'default',
  useIcon = false,
  icon,
  roundedButtons,
  dataTestId,
  autoHideTime = 0,
  onAutoHide,
}) {
  const [shouldDisplay, setShouldDisplay] = useState(true);
  useEffect(
    function () {
      if (autoHideTime === 0) {
        return undefined;
      }

      const timeout = setTimeout(() => {
        onAutoHide?.();
        setShouldDisplay(false);
      }, autoHideTime);

      return function () {
        clearTimeout(timeout);
      };
    },
    [autoHideTime, onAutoHide],
  );

  const onlyOneAction =
    (primaryAction && !secondaryAction) || (secondaryAction && !primaryAction);

  if (!shouldDisplay) {
    return null;
  }

  return (
    <div
      className={classnames(
        'text-[13px] border-0 flex py-2 px-3 rounded-lg gap-3',
        {
          'bg-yellow-5 text-yellow-7': type === TYPE_HASH.warning,
          'bg-grey-5 text-grey': type === TYPE_HASH.default,
          'bg-red-3 text-red': type === TYPE_HASH.danger,
          'bg-green-6 text-green-7': type === TYPE_HASH.success,
          'bg-blue-3 text-blue': type === TYPE_HASH.info,
        },
        withRightButton ? CLASSNAME_WITH_RIGHT_BUTTON : null,
        className,
      )}
      data-testid={dataTestId}
    >
      {useIcon ? icon || <Icon name={ICON[type]} /> : null}
      {infoTooltipText && (
        <InfoTooltip position="left" contentText={infoTooltipText} />
      )}
      <div>{message}</div>
      {primaryActionV2 && (
        <button
          className="actionable-message__action-v2"
          onClick={primaryActionV2.onClick}
        >
          {primaryActionV2.label}
        </button>
      )}
      {(primaryAction || secondaryAction) && (
        <div
          className={classnames('actionable-message__actions', {
            'actionable-message__actions--single': onlyOneAction,
          })}
        >
          {primaryAction && (
            <button
              className={classnames(
                'actionable-message__action',
                'actionable-message__action--primary',
                `actionable-message__action-${type}`,
                {
                  'actionable-message__action--rounded': roundedButtons,
                },
              )}
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <button
              className={classnames(
                'actionable-message__action',
                'actionable-message__action--secondary',
                `actionable-message__action-${type}`,
                {
                  'actionable-message__action--rounded': roundedButtons,
                },
              )}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

ActionableMessage.propTypes = {
  /**
   * Text inside actionable message
   */
  message: PropTypes.node.isRequired,
  /**
   * First button props that have label and onClick props
   */
  primaryAction: PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
  }),
  /**
   * Another style of primary action.
   * This probably shouldn't have been added. A `children` prop might have been more appropriate.
   */
  primaryActionV2: PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
  }),
  /**
   * Second button props that have label and onClick props
   */
  secondaryAction: PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
  }),
  /**
   * Additional css className for the component based on the parent css
   */
  className: PropTypes.string,
  /**
   * change color theme for the component that already predefined in css
   */
  type: PropTypes.oneOf(Object.keys(TYPE_HASH)),
  /**
   * change text align to left and button to bottom right
   */
  withRightButton: PropTypes.bool,
  /**
   * Add tooltip and custom message
   */
  infoTooltipText: PropTypes.string,
  /**
   * Add tooltip icon in the left component without message
   */
  useIcon: PropTypes.bool,
  /**
   * Custom icon component
   */
  icon: PropTypes.node,
  /**
   * Whether the buttons are rounded
   */
  roundedButtons: PropTypes.bool,
  dataTestId: PropTypes.string,
  /**
   * Whether the actionable message should auto-hide itself after a given amount of time
   */
  autoHideTime: PropTypes.number,
  /**
   * Callback when autoHide time expires
   */
  onAutoHide: PropTypes.func,
};
