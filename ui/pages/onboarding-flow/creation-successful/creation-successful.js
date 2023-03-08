import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/ui/button';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { DEFAULT_ROUTE } from '../../../helpers/constants/routes';
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
          firstTimeFlowType === FIRST_TIME_FLOW_TYPES.IMPORT ? 'import' : 'new',
        new_wallet: firstTimeFlowType === FIRST_TIME_FLOW_TYPES.CREATE,
      },
    });
    history.push(DEFAULT_ROUTE);
  };

  return (
    <div
      className="px-4 flex flex-col items-center justify-center gap-4"
      data-testid="creation-successful"
    >
      <img src="./images/tada.png" />
      <h2 className="text-left w-full text-[24px] font-bold text-black">
        {t('walletCreationSuccessTitle')}
      </h2>
      <div className="grid grid-cols-1 gap-4">
        <p className="text-[15px]  text-grey">
          {t('walletCreationSuccessDetailOne')}
        </p>
        <a
          href="#"
          target="_blank"
          className="text-[15px] text-blue"
          rel="noopener noreferrer"
        >
          {t('learnMoreUpperCase')}
        </a>
        <p className="text-[15px]  text-grey">
          {t('walletCreationSuccessDetailTwo')}
        </p>
        <a
          href="#"
          target="_blank"
          className="text-[15px] text-blue"
          rel="noopener noreferrer"
        >
          {t('leaveYourselfAHint')}
        </a>
      </div>
      <Button
        large
        data-testid="pin-extension-done"
        type="primary"
        onClick={handleClick}
      >
        {t('done')}
      </Button>
    </div>
  );
}
