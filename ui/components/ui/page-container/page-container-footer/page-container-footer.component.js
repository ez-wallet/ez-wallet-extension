import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from '../../button';

export default class PageContainerFooter extends Component {
  static propTypes = {
    children: PropTypes.node,
    onCancel: PropTypes.func,
    cancelText: PropTypes.string,
    onSubmit: PropTypes.func,
    submitText: PropTypes.string,
    disabled: PropTypes.bool,
    submitButtonType: PropTypes.string,
    hideCancel: PropTypes.bool,
    footerClassName: PropTypes.string,
    footerButtonClassName: PropTypes.string,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  render() {
    const {
      children,
      onCancel,
      cancelText,
      onSubmit,
      submitText,
      disabled,
      submitButtonType,
      hideCancel,
      footerClassName,
      footerButtonClassName,
    } = this.props;

    return (
      <div
        className={classnames(
          '"w-full grid grid-cols-1 gap-3 py-4',
          footerClassName,
        )}
      >
        {!hideCancel && (
          <Button
            type="default"
            large
            className={classnames(footerButtonClassName)}
            onClick={(e) => onCancel(e)}
            data-testid="page-container-footer-cancel"
          >
            {cancelText || this.context.t('cancel')}
          </Button>
        )}

        <Button
          type={submitButtonType || 'primary'}
          large
          className={classnames(footerButtonClassName)}
          disabled={disabled}
          onClick={(e) => onSubmit(e)}
          data-testid="page-container-footer-next"
        >
          {submitText || this.context.t('next')}
        </Button>

        {children && (
          <div className="page-container__footer-secondary">{children}</div>
        )}
      </div>
    );
  }
}
