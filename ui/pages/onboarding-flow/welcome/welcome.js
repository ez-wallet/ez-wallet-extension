import EventEmitter from 'events';
import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from '../../../components/ui/button';
import Typography from '../../../components/ui/typography/typography';
import {
  TypographyVariant,
  FONT_WEIGHT,
  TEXT_ALIGN,
} from '../../../helpers/constants/design-system';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import { EVENT, EVENT_NAMES } from '../../../../shared/constants/metametrics';
import { setFirstTimeFlowType } from '../../../store/actions';
import {
  ONBOARDING_METAMETRICS,
  ONBOARDING_SECURE_YOUR_WALLET_ROUTE,
  ONBOARDING_COMPLETION_ROUTE,
  ONBOARDING_CREATE_PASSWORD_ROUTE
} from '../../../helpers/constants/routes';
import { FIRST_TIME_FLOW_TYPES } from '../../../helpers/constants/onboarding';
import { getFirstTimeFlowType, getCurrentKeyring } from '../../../selectors';

export default function OnboardingWelcome() {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const history = useHistory();
  const [eventEmitter] = useState(new EventEmitter());
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
    <div className="onboarding-welcome" data-testid="onboarding-welcome">
      <div className="onboarding-welcome__header">
        <Typography
          variant={TypographyVariant.H2}
          align={TEXT_ALIGN.CENTER}
          fontWeight={FONT_WEIGHT.BOLD}
        >
          {t('welcomeToEzWallet')}
        </Typography>
        <Typography align={TEXT_ALIGN.CENTER} marginLeft={6} marginRight={6}>
          {t('welcomeToEzWalletIntro')}
        </Typography>
      </div>
      <ul className="onboarding-welcome__buttons">
        <li>
          <Button
            data-testid="onboarding-import-wallet"
            onClick={onImportClick}
          >
            {t('onboardingImportWallet')}
          </Button>
        </li>
        <li>
          <Button
            data-testid="onboarding-create-wallet"
            type="primary"
            // className="onboarding-welcome__button-create"
            onClick={onCreateClick}
          >
            {t('onboardingCreateWallet')}
          </Button>
        </li>
      </ul>
    </div>
  );
}
