import { EventEmitter } from 'events';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../components/ui/button';
import FormField from '../../components/ui/form-field';
import { DEFAULT_ROUTE } from '../../helpers/constants/routes';
import { EVENT, EVENT_NAMES } from '../../../shared/constants/metametrics';
import { Icon } from '../../components/component-library';
import { getCaretCoordinates } from './unlock-page.util';

export default class UnlockPage extends Component {
  static contextTypes = {
    trackEvent: PropTypes.func,
    t: PropTypes.func,
  };

  static propTypes = {
    /**
     * History router for redirect after action
     */
    history: PropTypes.object.isRequired,
    /**
     * If isUnlocked is true will redirect to most recent route in history
     */
    isUnlocked: PropTypes.bool,
    /**
     * onClick handler for "Forgot password?" link
     */
    // onRestore: PropTypes.func,
    /**
     * onSubmit handler when form is submitted
     */
    onSubmit: PropTypes.func,
    /**
     * Force update metamask data state
     */
    forceUpdateMetamaskState: PropTypes.func,
    /**
     * Event handler to show metametrics modal
     */
    showOptInModal: PropTypes.func,
  };

  state = {
    password: '',
    error: null,
  };

  submitting = false;

  failed_attempts = 0;

  animationEventEmitter = new EventEmitter();

  UNSAFE_componentWillMount() {
    const { isUnlocked, history } = this.props;

    if (isUnlocked) {
      history.push(DEFAULT_ROUTE);
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { password } = this.state;
    const { onSubmit, forceUpdateMetamaskState, showOptInModal } = this.props;

    if (password === '' || this.submitting) {
      return;
    }

    this.setState({ error: null });
    this.submitting = true;

    try {
      await onSubmit(password);
      const newState = await forceUpdateMetamaskState();
      this.context.trackEvent(
        {
          category: EVENT.CATEGORIES.NAVIGATION,
          event: EVENT_NAMES.APP_UNLOCKED,
          properties: {
            failed_attempts: this.failed_attempts,
          },
        },
        {
          isNewVisit: true,
        },
      );

      if (
        newState.participateInMetaMetrics === null ||
        newState.participateInMetaMetrics === undefined
      ) {
        showOptInModal();
      }
    } catch ({ message }) {
      this.failed_attempts += 1;

      if (message === 'Incorrect password') {
        await forceUpdateMetamaskState();
        this.context.trackEvent({
          category: EVENT.CATEGORIES.NAVIGATION,
          event: EVENT_NAMES.APP_UNLOCKED_FAILED,
          properties: {
            reason: 'incorrect_password',
            failed_attempts: this.failed_attempts,
          },
        });
      }

      this.setState({ error: message });
      this.submitting = false;
    }
  };

  handleInputChange({ target }) {
    this.setState({ password: target.value, error: null });
    // tell mascot to look at page action
    if (target.getBoundingClientRect) {
      const element = target;
      const boundingRect = element.getBoundingClientRect();
      const coordinates = getCaretCoordinates(element, element.selectionEnd);
      this.animationEventEmitter.emit('point', {
        x: boundingRect.left + coordinates.left - element.scrollLeft,
        y: boundingRect.top + coordinates.top - element.scrollTop,
      });
    }
  }

  render() {
    const { password, error } = this.state;
    const { t } = this.context;
    // const { onRestore } = this.props;

    return (
      <div className="flex flex-col">
        <div className="flex items-end justify-start min-w-max h-[200px] bg-[length:600px_100%] bg-[url('./images/unlock-bg.svg')] ml-4 mb-[30px]">
          <h1 className="text-[45px] w-[215px] break-all font-bold text-black leading-none">
            {t('welcomeBack')}
          </h1>
        </div>

        <form
          className="w-full grid grid-cols-1 gap-[90px] px-4"
          onSubmit={this.handleSubmit}
        >
          <FormField
            id="password"
            data-testid="unlock-password"
            autoFocus
            password
            onChange={(value) => {
              this.handleInputChange({
                target: {
                  value,
                },
              });
            }}
            placeholder={t('password')}
            error={error}
            value={password}
          />
          <Button
            type="primary"
            data-testid="unlock-submit"
            disabled={!this.state.password}
            large
            onClick={this.handleSubmit}
            className="relative"
            icon={<Icon className="absolute right-4" size="sm" name="unlock" />}
          >
            {this.context.t('unlock')}
          </Button>
        </form>

        {/* <div className="unlock-page__links">
            {t('walletWontUnlock')}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onRestore();
              }}
            >
              {t('resetWallet')}
            </a>
            {/* <Button
              type="link"
              key="import-account"
              className="unlock-page__link"
              onClick={() => onRestore()}
            >
              {t('forgotPassword')}
            </Button> 
          </div>
          <div className="unlock-page__support">
            {t('needHelp', [
              <a
                href={SUPPORT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                key="need-help-link"
                onClick={() => {
                  this.context.trackEvent(
                    {
                      category: EVENT.CATEGORIES.NAVIGATION,
                      event: EVENT_NAMES.SUPPORT_LINK_CLICKED,
                      properties: {
                        url: SUPPORT_LINK,
                      },
                    },
                    {
                      contextPropsIntoEventProperties: [
                        CONTEXT_PROPS.PAGE_TITLE,
                      ],
                    },
                  );
                }}
              >
                {t('needHelpLinkText')}
              </a>,
            ])}
          </div>*/}
      </div>
    );
  }
}
