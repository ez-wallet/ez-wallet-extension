import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TwoStepProgressBar,
  twoStepStages,
} from '../../../components/app/step-progress-bar';
import Button from '../../../components/ui/button';
import { ONBOARDING_CREATE_PASSWORD_ROUTE } from '../../../helpers/constants/routes';
import { useI18nContext } from '../../../hooks/useI18nContext';
import SrpInput from '../../../components/app/srp-input';
import { getCurrentKeyring } from '../../../selectors';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import { EVENT_NAMES, EVENT } from '../../../../shared/constants/metametrics';

export default function ImportSRP({ submitSecretRecoveryPhrase }) {
  const [secretRecoveryPhrase, setSecretRecoveryPhrase] = useState('');
  const history = useHistory();
  const t = useI18nContext();
  const currentKeyring = useSelector(getCurrentKeyring);

  useEffect(() => {
    if (currentKeyring) {
      history.replace(ONBOARDING_CREATE_PASSWORD_ROUTE);
    }
  }, [currentKeyring, history]);
  const trackEvent = useContext(MetaMetricsContext);

  return (
    <div
      className="flex flex-col items-center justify-center"
      data-testid="import-srp"
    >
      <TwoStepProgressBar
        stage={twoStepStages.RECOVERY_PHRASE_CONFIRM}
        marginBottom={4}
      />
      <div className="w-full h-[1px] bg-grey-5 my-5 box-border" />
      <div className="px-4">
        <SrpInput
          onChange={setSecretRecoveryPhrase}
          srpText={t('accessYourWalletWithSRP')}
        />
        <Button
          type="primary"
          className="mt-[70px]"
          data-testid="import-srp-confirm"
          large
          onClick={() => {
            submitSecretRecoveryPhrase(secretRecoveryPhrase);
            trackEvent({
              category: EVENT.CATEGORIES.ONBOARDING,
              event: EVENT_NAMES.ONBOARDING_WALLET_SECURITY_PHRASE_CONFIRMED,
            });
            history.replace(ONBOARDING_CREATE_PASSWORD_ROUTE);
          }}
          disabled={!secretRecoveryPhrase.trim()}
        >
          {t('confirmRecoveryPhrase')}
        </Button>
      </div>
    </div>
  );
}

ImportSRP.propTypes = {
  submitSecretRecoveryPhrase: PropTypes.func,
};
