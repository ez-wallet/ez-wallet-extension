import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Icon } from '../../../components/component-library';
import { I18nContext } from '../../../contexts/i18n';
import {
  SETTINGS_ROUTE,
  DEFAULT_ROUTE,
} from '../../../helpers/constants/routes';
import { lockMetamask } from '../../../store/actions';

const SettingsCard = () => {
  const t = useContext(I18nContext);
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <div className="w-full bg-grey-6 rounded-[20px] flex flex-col shadow-neumorphic overflow-hidden">
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-grey-4"
        onClick={() => {
          history.push(SETTINGS_ROUTE);
        }}
      >
        <Icon name="setting" />
        <div className="flex-grow text-[15px] text-black font-medium">
          {t('settings')}
        </div>
      </div>
      <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-grey-4">
        <Icon name="head-phone" />
        <div className="flex-grow text-[15px] text-black font-medium">
          {t('support')}
        </div>
      </div>
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-grey-4"
        onClick={() => {
          dispatch(lockMetamask());
          history.push(DEFAULT_ROUTE);
        }}
      >
        <Icon name="lock" />
        <div className="flex-grow text-[15px] text-black font-medium">
          {t('lock')}
        </div>
      </div>
    </div>
  );
};

export default SettingsCard;
