import React, { useState, useMemo, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import zxcvbn from 'zxcvbn';
import { useSelector } from 'react-redux';
import { useI18nContext } from '../../../hooks/useI18nContext';
import Button from '../../../components/ui/button';
import {
  ONBOARDING_COMPLETION_ROUTE,
  ONBOARDING_SECURE_YOUR_WALLET_ROUTE,
} from '../../../helpers/constants/routes';
import FormField from '../../../components/ui/form-field';
import CheckBox from '../../../components/ui/check-box';
import {
  ThreeStepProgressBar,
  threeStepStages,
  TwoStepProgressBar,
  twoStepStages,
} from '../../../components/app/step-progress-bar';
import { PASSWORD_MIN_LENGTH } from '../../../helpers/constants/common';
import ZENDESK_URLS from '../../../helpers/constants/zendesk-url';
import { getFirstTimeFlowType, getCurrentKeyring } from '../../../selectors';
import { FIRST_TIME_FLOW_TYPES } from '../../../helpers/constants/onboarding';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import { EVENT, EVENT_NAMES } from '../../../../shared/constants/metametrics';

export default function CreatePassword({
  createNewAccount,
  importWithRecoveryPhrase,
  secretRecoveryPhrase,
}) {
  const t = useI18nContext();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordStrengthText, setPasswordStrengthText] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const history = useHistory();
  const firstTimeFlowType = useSelector(getFirstTimeFlowType);
  const trackEvent = useContext(MetaMetricsContext);
  const currentKeyring = useSelector(getCurrentKeyring);

  useEffect(() => {
    if (currentKeyring) {
      if (firstTimeFlowType === FIRST_TIME_FLOW_TYPES.IMPORT) {
        history.replace(ONBOARDING_COMPLETION_ROUTE);
      } else {
        history.replace(ONBOARDING_SECURE_YOUR_WALLET_ROUTE);
      }
    }
  }, [currentKeyring, history, firstTimeFlowType]);

  const isValid = useMemo(() => {
    if (!password || !confirmPassword || password !== confirmPassword) {
      return false;
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      return false;
    }

    return !passwordError && !confirmPasswordError;
  }, [password, confirmPassword, passwordError, confirmPasswordError]);

  const getPasswordStrengthLabel = (isTooShort, score) => {
    if (isTooShort) {
      return {
        className: 'create-password__weak',
        text: t('passwordNotLongEnough'),
        description: '',
      };
    }
    if (score >= 4) {
      return {
        className: 'create-password__strong',
        text: t('strong'),
        description: '',
      };
    }
    if (score === 3) {
      return {
        className: 'create-password__average',
        text: t('average'),
        description: '',
      };
    }
    return {
      className: 'create-password__weak',
      text: t('weak'),
      description: '',
    };
  };

  const handlePasswordChange = (passwordInput) => {
    const isTooShort =
      passwordInput.length && passwordInput.length < PASSWORD_MIN_LENGTH;
    const { score } = zxcvbn(passwordInput);
    const passwordStrengthLabel = getPasswordStrengthLabel(isTooShort, score);
    const passwordStrengthComponent = t('passwordStrength', [
      <span key={score} className={passwordStrengthLabel.className}>
        {passwordStrengthLabel.text}
      </span>,
    ]);
    const confirmError =
      !confirmPassword || passwordInput === confirmPassword
        ? ''
        : t('passwordsDontMatch');

    setPassword(passwordInput);
    setPasswordStrength(passwordStrengthComponent);
    setPasswordStrengthText(passwordStrengthLabel.description);
    setConfirmPasswordError(confirmError);
  };

  const handleConfirmPasswordChange = (confirmPasswordInput) => {
    const error =
      password === confirmPasswordInput ? '' : t('passwordsDontMatch');

    setConfirmPassword(confirmPasswordInput);
    setConfirmPasswordError(error);
  };

  const handleCreate = async (event) => {
    event?.preventDefault();

    if (!isValid) {
      return;
    }

    trackEvent({
      category: EVENT.CATEGORIES.ONBOARDING,
      event: EVENT_NAMES.ONBOARDING_WALLET_CREATION_ATTEMPTED,
    });

    // If secretRecoveryPhrase is defined we are in import wallet flow
    if (
      secretRecoveryPhrase &&
      firstTimeFlowType === FIRST_TIME_FLOW_TYPES.IMPORT
    ) {
      await importWithRecoveryPhrase(password, secretRecoveryPhrase);
      history.push(ONBOARDING_COMPLETION_ROUTE);
    } else {
      // Otherwise we are in create new wallet flow
      try {
        if (createNewAccount) {
          await createNewAccount(password);
        }
        history.push(ONBOARDING_SECURE_YOUR_WALLET_ROUTE);
      } catch (error) {
        setPasswordError(error.message);
      }
    }
  };

  return (
    <div className="px-4" data-testid="create-password">
      {secretRecoveryPhrase &&
      firstTimeFlowType === FIRST_TIME_FLOW_TYPES.IMPORT ? (
        <TwoStepProgressBar
          stage={twoStepStages.PASSWORD_CREATE}
          marginBottom={4}
        />
      ) : (
        <ThreeStepProgressBar
          stage={threeStepStages.PASSWORD_CREATE}
          marginBottom={4}
        />
      )}
      <p className="text-[24px] font-bold text-black">{t('createPassword')}</p>
      <p className="text-[15px] text-grey">{t('passwordSetupDetails')}</p>

      <form
        className="grid grid-cols-1 w-full mt-[30px] gap-[30px]"
        onSubmit={handleCreate}
      >
        <FormField
          dataTestId="create-password-new"
          autoFocus
          password
          passwordStrength={passwordStrength}
          passwordStrengthText={passwordStrengthText}
          onChange={handlePasswordChange}
          titleText={t('newPassword')}
          value={password}
        />
        <FormField
          dataTestId="create-password-confirm"
          onChange={handleConfirmPasswordChange}
          error={confirmPasswordError}
          password
          titleText={t('confirmPassword')}
          value={confirmPassword}
          titleDetail={
            isValid && (
              <div className="create-password__form--checkmark">
                <i className="fas fa-check" />
              </div>
            )
          }
        />

        <label className="create-password__form__terms-label">
          <CheckBox
            className="rounded-sm"
            dataTestId="create-password-terms"
            onClick={() => setTermsChecked(!termsChecked)}
            checked={termsChecked}
          />
          <div className="ml-4 text-grey text-[15px]">
            {t('passwordTermsWarning', [
              <a
                onClick={(e) => e.stopPropagation()}
                key="create-password__link-text"
                href={ZENDESK_URLS.PASSWORD_ARTICLE}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-blue">{t('learnMoreUpperCase')}</span>
              </a>,
            ])}
          </div>
        </label>

        <Button
          data-testid={
            secretRecoveryPhrase &&
            firstTimeFlowType === FIRST_TIME_FLOW_TYPES.IMPORT
              ? 'create-password-import'
              : 'create-password-wallet'
          }
          type="primary"
          large
          className="create-password__form--submit-button"
          disabled={!isValid || !termsChecked}
          onClick={handleCreate}
        >
          {secretRecoveryPhrase &&
          firstTimeFlowType === FIRST_TIME_FLOW_TYPES.IMPORT
            ? t('importMyWallet')
            : t('createNewWallet')}
        </Button>
      </form>
    </div>
  );
}

CreatePassword.propTypes = {
  createNewAccount: PropTypes.func,
  importWithRecoveryPhrase: PropTypes.func,
  secretRecoveryPhrase: PropTypes.string,
};
