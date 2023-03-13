// import EventEmitter from 'events';
import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from '../../../components/ui/button';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import { EVENT, EVENT_NAMES } from '../../../../shared/constants/metametrics';
import { setFirstTimeFlowType } from '../../../store/actions';
import {
  ONBOARDING_METAMETRICS,
  ONBOARDING_SECURE_YOUR_WALLET_ROUTE,
  ONBOARDING_COMPLETION_ROUTE,
  ONBOARDING_CREATE_PASSWORD_ROUTE,
} from '../../../helpers/constants/routes';
import { FIRST_TIME_FLOW_TYPES } from '../../../helpers/constants/onboarding';
import { getFirstTimeFlowType, getCurrentKeyring } from '../../../selectors';

export default function OnboardingWelcome() {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const history = useHistory();
  // const [eventEmitter] = useState(new EventEmitter());
  const currentKeyring = useSelector(getCurrentKeyring);
  const firstTimeFlowType = useSelector(getFirstTimeFlowType);

  // Don't allow users to come back to this screen after they
  // have already imported or created a wallet
  useEffect(() => {
    if (currentKeyring) {
      if (firstTimeFlowType === FIRST_TIME_FLOW_TYPES.IMPORT) {
        history.replace(ONBOARDING_COMPLETION_ROUTE);
      } else {
        history.replace(ONBOARDING_SECURE_YOUR_WALLET_ROUTE);
      }
    }
  }, [currentKeyring, history, firstTimeFlowType]);
  const trackEvent = useContext(MetaMetricsContext);

  const onCreateClick = () => {
    dispatch(setFirstTimeFlowType('create'));
    trackEvent({
      category: EVENT.CATEGORIES.ONBOARDING,
      event: EVENT_NAMES.ONBOARDING_WALLET_CREATION_STARTED,
      properties: {
        account_type: 'metamask',
      },
    });
    history.push(ONBOARDING_CREATE_PASSWORD_ROUTE);
  };

  const onImportClick = () => {
    dispatch(setFirstTimeFlowType('import'));
    trackEvent({
      category: EVENT.CATEGORIES.ONBOARDING,
      event: EVENT_NAMES.ONBOARDING_WALLET_IMPORT_STARTED,
      properties: {
        account_type: 'imported',
      },
    });
    history.push(ONBOARDING_METAMETRICS);
  };

  trackEvent({
    category: EVENT.CATEGORIES.ONBOARDING,
    event: EVENT_NAMES.ONBOARDING_WELCOME,
    properties: {
      message_title: t('welcomeToEzWallet'),
      app_version: global?.platform?.getVersion(),
    },
  });

  return (
    <div className="px-4 w-full h-full flex flex-col justify-between">
      <div>
        <h2 className="text-[45px] leading-[45px] font-bold text-black max-w-[8ch]">
          {t('welcomeToEzWallet')}
        </h2>
        <p className="text-[15px] text-grey">{t('welcomeToEzWalletIntro')}</p>
      </div>

      <div className="flex flex-col gap-5">
        <Button
          data-testid="onboarding-import-wallet"
          type="default"
          large
          onClick={onImportClick}
        >
          {t('onboardingImportWallet')}
        </Button>

        <Button
          data-testid="onboarding-create-wallet"
          type="primary"
          large
          onClick={onCreateClick}
        >
          {t('onboardingCreateWallet')}
        </Button>
      </div>
    </div>
  );
}
