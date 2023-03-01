import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '../../../components/ui/box';
import Typography from '../../../components/ui/typography';
import Button from '../../../components/ui/button';
import {
  FONT_WEIGHT,
  TEXT_ALIGN,
  TypographyVariant,
  AlignItems,
} from '../../../helpers/constants/design-system';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { DEFAULT_ROUTE, ONBOARDING_PIN_EXTENSION_ROUTE } from '../../../helpers/constants/routes';
import { isBeta } from '../../../helpers/utils/build-types';
import { setCompletedOnboarding } from '../../../store/actions';
import { getFirstTimeFlowType } from '../../../selectors';
import { EVENT_NAMES, EVENT } from '../../../../shared/constants/metametrics';
import { FIRST_TIME_FLOW_TYPES } from '../../../helpers/constants/onboarding';
import { MetaMetricsContext } from '../../../contexts/metametrics';

export default function CreationSuccessful() {
  const history = useHistory();
  const t = useI18nContext();
  const trackEvent = useContext(MetaMetricsContext);
  const dispatch = useDispatch();
  const firstTimeFlowType = useSelector(getFirstTimeFlowType);

  const handleClick = async () => {
    await dispatch(setCompletedOnboarding());
    trackEvent({
      category: EVENT.CATEGORIES.ONBOARDING,
      event: EVENT_NAMES.ONBOARDING_WALLET_SETUP_COMPLETE,
      properties: {
        wallet_setup_type:
          firstTimeFlowType === FIRST_TIME_FLOW_TYPES.IMPORT
            ? 'import'
            : 'new',
        new_wallet: firstTimeFlowType === FIRST_TIME_FLOW_TYPES.CREATE,
      },
    });
    history.push(DEFAULT_ROUTE);
  };

  return (
    <div className="onboarding-pin-extension" data-testid="creation-successful">
      <Box textAlign={TEXT_ALIGN.CENTER}>
        <img src="./images/tada.png" />
        <Typography
          variant={TypographyVariant.H2}
          fontWeight={FONT_WEIGHT.BOLD}
          margin={6}
        >
          {t('walletCreationSuccessTitle')}
        </Typography>
      </Box>
      <Box textAlign={TEXT_ALIGN.LEFT}>
        <Typography variant={TypographyVariant.H4}>
          {t('walletCreationSuccessDetailOne')}
        </Typography>
        <a
          href="https://community.metamask.io/t/what-is-a-secret-recovery-phrase-and-how-to-keep-your-crypto-wallet-secure/3440"
          target="_blank"
          type="link"
          className='btn-link'
          rel="noopener noreferrer"
        >
          {t('learnMoreUpperCase')}
        </a>
        <Typography variant={TypographyVariant.H4}>
          {t('walletCreationSuccessDetailTwo')}
        </Typography>
        <a
          href="https://community.metamask.io/t/what-is-a-secret-recovery-phrase-and-how-to-keep-your-crypto-wallet-secure/3440"
          target="_blank"
          type="link"
          className='btn-link'
          rel="noopener noreferrer"
        >
          {t('leaveYourselfAHint')}
        </a>
      </Box>
      <div className="onboarding-pin-extension__buttons">
        <Button
          large={true}
          data-testid='pin-extension-done'
          type="primary"
          onClick={handleClick}
        >
          {t('done')}
        </Button>
      </div>
    </div>
  );
}
