import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from '../../ui/button';

export default class Modal extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    contentClass: PropTypes.string,
    containerClass: PropTypes.string,
    // Header text
    headerText: PropTypes.string,
    onClose: PropTypes.func,
    // Submit button (right button)
    onSubmit: PropTypes.func,
    submitType: PropTypes.string,
    submitText: PropTypes.string,
    submitDisabled: PropTypes.bool,
    hideFooter: PropTypes.bool,
    // Cancel button (left button)
    onCancel: PropTypes.func,
    cancelType: PropTypes.string,
    cancelText: PropTypes.string,
  };

  static defaultProps = {
    submitType: 'primary',
    cancelType: 'secondary',
  };

  render() {
    const {
      children,
      headerText,
      onClose,
      onSubmit,
      submitType,
      submitText,
      submitDisabled,
      onCancel,
      cancelType,
      cancelText,
      contentClass,
      containerClass,
      hideFooter,
    } = this.props;

    return (
      <div className={classnames('modal-container', containerClass)}>
        {headerText && (
          <div className="modal-container__header">
            <div className="modal-container__header-text">{headerText}</div>
            <div
              className="modal-container__header-close"
              data-testid="modal-header-close"
              onClick={onClose}
            />
          </div>
        )}
        <div className={classnames('modal-container__content', contentClass)}>
          {children}
        </div>
        {hideFooter ? null : (
          <div className="w-full grid grid-cols-1 gap-4 p-4">
            {onCancel && (
              <Button large type={cancelType} onClick={onCancel}>
                {cancelText}
              </Button>
            )}
            <Button
              large
              type={submitType}
              onClick={onSubmit}
              disabled={submitDisabled}
            >
              {submitText}
            </Button>
          </div>
        )}
      </div>
    );
  }
}
