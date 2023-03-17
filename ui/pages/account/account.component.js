import React from 'react';
import AccountCardComponent from './account-card/account-card.container';
import SettingsCard from './setting-card';

const AccountPage = () => {
  return (
    <div className="w-full p-4 flex flex-col gap-5">
      <AccountCardComponent />
      <SettingsCard />
    </div>
  );
};

export default AccountPage;
