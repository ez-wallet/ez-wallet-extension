import React, { useState, useContext, Fragment } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '../../../components/ui/button';
import { Icon } from '../../../components/component-library';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { ONBOARDING_CONFIRM_SRP_ROUTE } from '../../../helpers/constants/routes';
import {
  ThreeStepProgressBar,
  threeStepStages,
} from '../../../components/app/step-progress-bar';

import { EVENT_NAMES, EVENT } from '../../../../shared/constants/metametrics';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import RecoveryPhraseChips from './recovery-phrase-chips';

export default function RecoveryPhrase({ secretRecoveryPhrase }) {
  const history = useHistory();
  const t = useI18nContext();
  const { search } = useLocation();
  const [copied, handleCopy] = useCopyToClipboard();
  const [phraseRevealed, setPhraseRevealed] = useState(false);
  const [hiddenPhrase, setHiddenPhrase] = useState(false);
  const searchParams = new URLSearchParams(search);
  const isFromReminderParam = searchParams.get('isFromReminder')
    ? '/?isFromReminder=true'
    : '';
  const trackEvent = useContext(MetaMetricsContext);

  return (
    <div className="h-full" data-testid="recovery-phrase">
      <ThreeStepProgressBar stage={threeStepStages.RECOVERY_PHRASE_REVIEW} />
      <div className="w-full h-[1px] bg-grey-5 my-5 box-border" />
      <div className="px-4">
        <div>
          <h1 className="text-[24px] text-black mb-4">
            {t('seedPhraseWriteDownHeader')}
          </h1>

          <p className="text-[13px] text-grey mb-4">
            {t('seedPhraseWriteDownDetails')}
          </p>
          <RecoveryPhraseChips
            secretRecoveryPhrase={secretRecoveryPhrase.split(' ')}
            phraseRevealed={phraseRevealed && !hiddenPhrase}
            hiddenPhrase={hiddenPhrase}
          />
        </div>

        <div className="w-full mt-8">
          {phraseRevealed ? (
            <Fragment>
              <div className="flex items-center justify-between">
                <Button
                  type="link"
                  icon={<Icon name={hiddenPhrase ? 'eye' : 'eye-slash'} />}
                  onClick={() => {
                    setHiddenPhrase(!hiddenPhrase);
                  }}
                >
                  {hiddenPhrase
                    ? t('revealTheSeedPhrase')
                    : t('hideSeedPhrase')}
                </Button>
                <Button
                  onClick={() => {
                    handleCopy(secretRecoveryPhrase);
                  }}
                  type="link"
                >
                  {copied ? t('copiedExclamation') : t('copyToClipboard')}
                </Button>
              </div>

              <Button
                data-testid="recovery-phrase-next"
                type="primary"
                large
                onClick={() => {
                  trackEvent({
                    category: EVENT.CATEGORIES.ONBOARDING,
                    event:
                      EVENT_NAMES.ONBOARDING_WALLET_SECURITY_PHRASE_WRITTEN_DOWN,
                  });
                  history.push(
                    `${ONBOARDING_CONFIRM_SRP_ROUTE}${isFromReminderParam}`,
                  );
                }}
              >
                {t('revealSeedWords')}
              </Button>
            </Fragment>
          ) : (
            <Button
              data-testid="recovery-phrase-reveal"
              type="primary"
              large
              onClick={() => {
                trackEvent({
                  category: EVENT.CATEGORIES.ONBOARDING,
                  event: EVENT_NAMES.ONBOARDING_WALLET_SECURITY_PHRASE_REVEALED,
                });
                setPhraseRevealed(true);
              }}
            >
              {t('revealSeedWords')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

RecoveryPhrase.propTypes = {
  secretRecoveryPhrase: PropTypes.string,
};
