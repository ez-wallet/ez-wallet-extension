import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from '../../button';
import { Icon } from '../../../component-library';

export default class PageContainerHeader extends Component {
  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    onClose: PropTypes.func,
    showBackButton: PropTypes.bool,
    onBackButtonClick: PropTypes.func,
    backButtonStyles: PropTypes.object,
    backButtonString: PropTypes.string,
    tabs: PropTypes.node,
    headerCloseText: PropTypes.string,
    className: PropTypes.string,
    hideClose: PropTypes.bool,
  };

  renderTabs() {
    const { tabs } = this.props;
    const numberOfTabs = React.Children.count(tabs);
    return tabs ? (
      <div className={`grid grid-cols-${numberOfTabs}`}>{tabs}</div>
    ) : null;
  }

  renderCloseAction() {
    const { hideClose, onClose, headerCloseText } = this.props;

    if (hideClose) {
      return null;
    }

    if (headerCloseText) {
      return (
        onClose && (
          <Button
            type="link"
            className="rounded-full shadow-neumorphic h-[48px] w-[68px] bg-grey-6 flex justify-center items-center"
            onClick={() => onClose()}
          >
            {headerCloseText}
          </Button>
        )
      );
    }

    return (
      onClose && (
        <button
          className="rounded-full shadow-neumorphic h-[48px] w-[68px] bg-grey-6 flex justify-center items-center"
          onClick={() => onClose()}
          aria-label="close"
        >
          <Icon name="close" />
        </button>
      )
    );
  }

  renderHeaderRow() {
    const {
      showBackButton,
      onBackButtonClick,
      backButtonStyles,
      backButtonString,
    } = this.props;

    return (
      showBackButton && (
        <div className="page-container__header-row">
          <span
            className="page-container__back-button"
            onClick={onBackButtonClick}
            style={backButtonStyles}
          >
            {backButtonString || 'Back'}
          </span>
        </div>
      )
    );
  }

  render() {
    const { title, subtitle, tabs, className, hideClose } = this.props;

    return (
      <div
        className={classnames('page-container__header', className, {
          'page-container__header--no-padding-bottom': Boolean(tabs),
        })}
        data-testid="page-container__header"
      >
        <div className="flex justify-end py-2">{this.renderCloseAction()}</div>

        {this.renderHeaderRow()}

        {title && (
          <div
            className={classnames('text-[32px] font-bold text-black', {
              'page-container__title--no-margin-right': hideClose,
            })}
          >
            {title}
          </div>
        )}
        {subtitle ? (
          <div className="page-container__subtitle">{subtitle}</div>
        ) : null}

        {this.renderTabs()}
      </div>
    );
  }
}
