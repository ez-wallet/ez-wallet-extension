import React from 'react';
// import { useDispatch } from 'react-redux';
import MetaFoxLogo from '../../../components/ui/metafox-logo';
// import locales from '../../../../app/_locales/index.json';

export default function OnboardingAppHeader() {
  // const dispatch = useDispatch();
  // // const currentLocale = useSelector(getCurrentLocale);
  // const localeOptions = locales.map((locale) => {
  //   return {
  //     name: locale.name,
  //     value: locale.code,
  //   };
  // });

  return (
    <div className="w-full p-4 ">
      <MetaFoxLogo unsetIconHeight isOnboarding />
      {/* <Dropdown
          id="select-locale"
          options={localeOptions}
          selectedOption={currentLocale}
          onChange={async (newLocale) =>
            dispatch(updateCurrentLocale(newLocale))
          }
        /> */}
    </div>
  );
}
