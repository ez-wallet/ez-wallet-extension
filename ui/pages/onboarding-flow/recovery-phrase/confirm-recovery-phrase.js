import React, { useState, useMemo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import Button from '../../../components/ui/button';
import {
  ThreeStepProgressBar,
  threeStepStages,
} from '../../../components/app/step-progress-bar';
import { ONBOARDING_COMPLETION_ROUTE } from '../../../helpers/constants/routes';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { setSeedPhraseBackedUp } from '../../../store/actions';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import { EVENT_NAMES, EVENT } from '../../../../shared/constants/metametrics';
import RecoveryPhraseChips from './recovery-phrase-chips';

export default function ConfirmRecoveryPhrase({ secretRecoveryPhrase = '' }) {
  const history = useHistory();
  const t = useI18nContext();
  const dispatch = useDispatch();
  const splitSecretRecoveryPhrase = secretRecoveryPhrase.split(' ');
  const indicesToCheck = [2, 3, 7];
  const [matching, setMatching] = useState(false);
  const trackEvent = useContext(MetaMetricsContext);

  // Removes seed phrase words from chips corresponding to the
  // indicesToCheck so that user has to complete the phrase and confirm
  // they have saved it.
  const initializePhraseElements = () => {
    const phraseElements = { ...splitSecretRecoveryPhrase };
    indicesToCheck.forEach((i) => {
      phraseElements[i] = '';
    });
    return phraseElements;
  };
  const [phraseElements, setPhraseElements] = useState(
    initializePhraseElements(),
  );

  const validate = useMemo(
    () =>
      debounce((elements) => {
        setMatching(Object.values(elements).join(' ') === secretRecoveryPhrase);
      }, 500),
    [setMatching, secretRecoveryPhrase],
  );

  const handleSetPhraseElements = (values) => {
    setPhraseElements(values);
    validate(values);
  };

  return (
    <div className="h-full" data-testid="confirm-recovery-phrase">
      <ThreeStepProgressBar
        stage={threeStepStages.RECOVERY_PHRASE_CONFIRM}
        marginBottom={4}
      />
      <div className="px-4">
        <div className="w-full h-[1px] bg-grey-5 my-5 box-border" />
        <h1 className="text-[24px] text-black mb-4">
          {t('seedPhraseConfirm')}
        </h1>
        <p className="text-[13px] text-grey mb-4">
          {t('seedPhraseEnterMissingWords')}
        </p>
        <RecoveryPhraseChips
          secretRecoveryPhrase={splitSecretRecoveryPhrase}
          confirmPhase
          setInputValue={handleSetPhraseElements}
          inputValue={phraseElements}
          indicesToCheck={indicesToCheck}
        />

        <Button
          data-testid="recovery-phrase-confirm"
          type="primary"
          large
          className="mt-8"
          onClick={async () => {
            await dispatch(setSeedPhraseBackedUp(true));
            trackEvent({
              category: EVENT.CATEGORIES.ONBOARDING,
              event: EVENT_NAMES.ONBOARDING_WALLET_SECURITY_PHRASE_CONFIRMED,
            });
            history.push(ONBOARDING_COMPLETION_ROUTE);
          }}
          disabled={!matching}
        >
          {t('revealSeedWords')}
        </Button>
      </div>
    </div>
  );
}

ConfirmRecoveryPhrase.propTypes = {
  secretRecoveryPhrase: PropTypes.string,
};
