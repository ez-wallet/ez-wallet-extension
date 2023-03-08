import React, { useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Button from '../../../components/ui/button';
import {
  ThreeStepProgressBar,
  threeStepStages,
} from '../../../components/app/step-progress-bar';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import { ONBOARDING_REVIEW_SRP_ROUTE } from '../../../helpers/constants/routes';
// import { getCurrentLocale } from '../../../ducks/locale/locale';
import { EVENT_NAMES, EVENT } from '../../../../shared/constants/metametrics';
import SkipSRPBackup from './skip-srp-backup-popover';

export default function SecureYourWallet() {
  const history = useHistory();
  const t = useI18nContext();
  const { search } = useLocation();
  // const currentLocale = useSelector(getCurrentLocale);
  const [showSkipSRPBackupPopover, setShowSkipSRPBackupPopover] =
    useState(false);
  const searchParams = new URLSearchParams(search);
  const isFromReminderParam = searchParams.get('isFromReminder')
    ? '/?isFromReminder=true'
    : '';

  const trackEvent = useContext(MetaMetricsContext);

  const handleClickRecommended = () => {
    trackEvent({
      category: EVENT.CATEGORIES.ONBOARDING,
      event: EVENT_NAMES.ONBOARDING_WALLET_SECURITY_STARTED,
    });
    history.push(`${ONBOARDING_REVIEW_SRP_ROUTE}${isFromReminderParam}`);
  };

  const handleClickNotRecommended = () => {
    trackEvent({
      category: EVENT.CATEGORIES.ONBOARDING,
      event: EVENT_NAMES.ONBOARDING_WALLET_SECURITY_SKIP_INITIATED,
    });
    setShowSkipSRPBackupPopover(true);
  };

  // const subtitles = {
  //   en: 'English',
  //   es: 'Spanish',
  //   hi: 'Hindi',
  //   id: 'Indonesian',
  //   ja: 'Japanese',
  //   ko: 'Korean',
  //   pt: 'Portuguese',
  //   ru: 'Russian',
  //   tl: 'Tagalog',
  //   vi: 'Vietnamese',
  //   de: 'German',
  //   el: 'Greek',
  //   fr: 'French',
  //   tr: 'Turkish',
  //   zh: 'Chinese - China',
  // };

  // const defaultLang = subtitles[currentLocale] ? currentLocale : 'en';
  return (
    <div data-testid="secure-your-wallet">
      {showSkipSRPBackupPopover && (
        <SkipSRPBackup handleClose={() => setShowSkipSRPBackupPopover(false)} />
      )}
      <ThreeStepProgressBar
        stage={threeStepStages.RECOVERY_PHRASE_VIDEO}
        marginBottom={4}
      />
      <div className="w-full h-[1px] bg-grey-5 my-5 box-border" />

      <h1 className="text-[24px] text-black">{t('seedPhraseIntroTitle')}</h1>
      <p className="text-[15px] text-black">{t('seedPhraseIntroTitleCopy')}</p>
      <div className="grid grid-cols-1 gap-4 bg-grey-6 py-5 px-4 rounded-xl shadow-neumorphic mb-6 mt-4">
        <div className="w-full">
          <p className="text-[13px] text-black font-bold">
            {t('seedPhraseIntroSidebarTitleOne')}
          </p>
          <p className="text-[13px] text-grey">
            {t('seedPhraseIntroSidebarCopyOne')}
          </p>
        </div>
        <div className="w-full">
          <p className="text-[13px] text-black font-bold">
            {t('seedPhraseIntroSidebarTitleTwo')}
          </p>
          <ul className="text-[13px] text-grey list-disc px-4">
            <li>{t('seedPhraseIntroSidebarBulletOne')}</li>
            <li>{t('seedPhraseIntroSidebarBulletThree')}</li>
            <li>{t('seedPhraseIntroSidebarBulletFour')}</li>
          </ul>
        </div>
        <div className="w-full">
          <p className="text-[13px] text-black font-bold">
            {t('seedPhraseIntroSidebarTitleThree')}
          </p>
          <p className="text-[13px] text-grey">
            {t('seedPhraseIntroSidebarCopyTwo')}
          </p>
        </div>
        <div className="w-full">
          <p className="text-[13px] text-black font-bold">
            {t('seedPhraseIntroSidebarTitleFour')}
          </p>
          <ul className="text-[13px] text-grey list-disc px-4">
            <li>{t('seedPhraseIntroSidebarTipOne')}</li>
            <li>{t('seedPhraseIntroSidebarTipTwo')}</li>
            <li>{t('seedPhraseIntroSidebarTipThree')}</li>
          </ul>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 gap-5">
        <Button
          data-testid="secure-wallet-recommended"
          type="primary"
          rounded
          large
          onClick={handleClickRecommended}
        >
          {t('seedPhraseIntroRecommendedButtonCopy')}
        </Button>
        <a
          data-testid="secure-wallet-later"
          type="default"
          className="text-center text-blue"
          onClick={handleClickNotRecommended}
        >
          {t('seedPhraseIntroNotRecommendedButtonCopy')}
        </a>
      </div>
    </div>
  );
}
