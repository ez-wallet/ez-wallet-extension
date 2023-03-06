import React, { useState } from 'react';
import classnames from 'classnames';
import { Icon } from '../../component-library';
import { useI18nContext } from '../../../hooks/useI18nContext';

const TABS = {
  WALLET: 'wallet',
  LEARN: 'learn',
  TREND: 'trend',
};

const Toolbar = () => {
  const t = useI18nContext();
  const [activeTab, setActiveTab] = useState(TABS.WALLET);

  return (
    <div className="toolbar-container ">
      <div className="toolbar">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab(TABS.WALLET);
          }}
          className={classnames('toolbar__item ', {
            active: activeTab === TABS.WALLET,
          })}
        >
          <Icon name="wallet-solid" size="lg" />
          <span>{t('wallet')}</span>
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab(TABS.LEARN);
          }}
          className={classnames('toolbar__item ', {
            active: activeTab === TABS.LEARN,
          })}
        >
          <Icon name="learn" size="lg" /> <span>{t('learn')}</span>
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab(TABS.TREND);
          }}
          className={classnames('toolbar__item ', {
            active: activeTab === TABS.TREND,
          })}
        >
          <Icon name="trend-up" size="lg" />
          <span>{t('trend')}</span>
        </a>
      </div>
    </div>
  );
};

export default Toolbar;
