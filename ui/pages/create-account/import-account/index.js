import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dropdown from '../../../components/ui/dropdown';

// Subviews
import ZENDESK_URLS from '../../../helpers/constants/zendesk-url';
import { Icon } from '../../../components/component-library';

import JsonImportView from './json';
import PrivateKeyImportView from './private-key';

export default class AccountImportSubview extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };

  state = {};

  getMenuItemTexts() {
    return [this.context.t('privateKey'), this.context.t('jsonFile')];
  }

  renderImportView() {
    const { type } = this.state;
    const menuItems = this.getMenuItemTexts();
    const current = type || menuItems[0];

    switch (current) {
      case this.context.t('privateKey'):
        return <PrivateKeyImportView />;
      case this.context.t('jsonFile'):
        return <JsonImportView />;
      default:
        return <JsonImportView />;
    }
  }

  render() {
    const menuItems = this.getMenuItemTexts();
    const { type } = this.state;
    const { t } = this.context;

    return (
      <>
        <div className="w-full flex flex-col p-4 bg-green-6">
          <Icon name="import" size="xl" />
          <div className="text-[32px] text-black">{t('importAccount')}</div>
          <div className="page-container__subtitle text-[13px] text-black">
            {t('importAccountMsg')}
            <span
              className="new-account-info-link"
              onClick={() => {
                global.platform.openTab({
                  url: ZENDESK_URLS.IMPORTED_ACCOUNTS,
                });
              }}
            >
              {t('here')}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-grow text-[13px]">{t('selectType')}</div>
            <Dropdown
              className="first:w-full"
              options={menuItems.map((text) => ({ value: text }))}
              selectedOption={type || menuItems[0]}
              onChange={(value) => {
                this.setState({ type: value });
              }}
            />
          </div>
          {this.renderImportView()}
        </div>
      </>
    );
  }
}
