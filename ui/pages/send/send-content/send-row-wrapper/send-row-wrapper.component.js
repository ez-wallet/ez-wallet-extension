import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SendRowErrorMessage from './send-row-error-message';

export default class SendRowWrapper extends Component {
  static propTypes = {
    children: PropTypes.node,
    errorType: PropTypes.string,
    label: PropTypes.string,
    showError: PropTypes.bool,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  renderAmountFormRow() {
    const { children, errorType = '', label, showError = false } = this.props;
    const formField = Array.isArray(children)
      ? children[1] || children[0]
      : children;
    const customLabelContent = children.length > 1 ? children[0] : null;

    return (
      <div className="grid grid-cols-1 gap-2">
        <div className="text-[15px] font-medium text-black flex justify-between">
          {label}
          {customLabelContent}
        </div>
        <div className="w-full">
          <div className="send-v2__form-field">{formField}</div>
          <div>
            {showError ? <SendRowErrorMessage errorType={errorType} /> : null}
          </div>
        </div>
      </div>
    );
  }

  renderFormRow() {
    const { children, errorType = '', label, showError = false } = this.props;

    const formField = Array.isArray(children)
      ? children[1] || children[0]
      : children;
    const customLabelContent =
      (Array.isArray(children) && children.length) > 1 ? children[0] : null;

    return (
      <div className="grid grid-cols-1 gap-2">
        <div className="text-[15px] font-medium text-black">
          {label}
          {showError ? <SendRowErrorMessage errorType={errorType} /> : null}
          {customLabelContent}
        </div>
        <div className="w-full">{formField}</div>
      </div>
    );
  }

  render() {
    const { errorType = '' } = this.props;

    return errorType === 'amount'
      ? this.renderAmountFormRow()
      : this.renderFormRow();
  }
}
