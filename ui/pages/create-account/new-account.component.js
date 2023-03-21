import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from '../../components/ui/button';
import { EVENT, EVENT_NAMES } from '../../../shared/constants/metametrics';
import { getAccountNameErrorMessage } from '../../helpers/utils/accounts';
import FormField from '../../components/ui/form-field/form-field';

export default class NewAccountCreateForm extends Component {
  static defaultProps = {
    newAccountNumber: 0,
  };

  state = {
    newAccountName: '',
    defaultAccountName: this.context.t('newAccountNumberName', [
      this.props.newAccountNumber,
    ]),
  };

  render() {
    const { newAccountName, defaultAccountName } = this.state;
    const { history, createAccount, mostRecentOverviewPage, accounts } =
      this.props;

    const createClick = (event) => {
      event.preventDefault();
      createAccount(newAccountName || defaultAccountName)
        .then(() => {
          this.context.trackEvent({
            category: EVENT.CATEGORIES.ACCOUNTS,
            event: EVENT_NAMES.ACCOUNT_ADDED,
            properties: {
              account_type: EVENT.ACCOUNT_TYPES.DEFAULT,
            },
          });
          history.push(mostRecentOverviewPage);
        })
        .catch((e) => {
          this.context.trackEvent({
            category: EVENT.CATEGORIES.ACCOUNTS,
            event: EVENT_NAMES.ACCOUNT_ADD_FAILED,
            properties: {
              account_type: EVENT.ACCOUNT_TYPES.DEFAULT,
              error: e.message,
            },
          });
        });
    };

    const { isValidAccountName, errorMessage } = getAccountNameErrorMessage(
      accounts,
      this.context,
      newAccountName,
      defaultAccountName,
    );

    return (
      <div className="px-4 h-full w-full flex flex-col items-center justify-center">
        <div className="w-full grid grid-cols-1 gap-5">
          <FormField
            titleText={this.context.t('accountName')}
            className={classnames({
              'new-account-create-form__input': true,
              'new-account-create-form__input__error': !isValidAccountName,
            })}
            value={newAccountName}
            placeholder={defaultAccountName}
            onChange={(value) => this.setState({ newAccountName: value })}
            autoFocus
          />
          {errorMessage && (
            <div className="text-[13px] text-red">{errorMessage}</div>
          )}
          <Button
            type="default"
            large
            onClick={() => history.push(mostRecentOverviewPage)}
          >
            {this.context.t('cancel')}
          </Button>
          <Button
            type="primary"
            large
            onClick={createClick}
            disabled={!isValidAccountName}
          >
            {this.context.t('create')}
          </Button>
        </div>
      </div>
    );
  }
}

NewAccountCreateForm.propTypes = {
  createAccount: PropTypes.func,
  newAccountNumber: PropTypes.number,
  history: PropTypes.object,
  mostRecentOverviewPage: PropTypes.string.isRequired,
  accounts: PropTypes.array,
};

NewAccountCreateForm.contextTypes = {
  t: PropTypes.func,
  trackEvent: PropTypes.func,
};
