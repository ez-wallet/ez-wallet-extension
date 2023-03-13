import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { useI18nContext } from '../../../hooks/useI18nContext';
import Box from '../../ui/box';
import { Icon } from '../../component-library';

export const threeStepStages = {
  PASSWORD_CREATE: 1,
  RECOVERY_PHRASE_VIDEO: 2,
  RECOVERY_PHRASE_REVIEW: 3,
  RECOVERY_PHRASE_CONFIRM: 4,
  ONBOARDING_COMPLETE: 5,
};

export const twoStepStages = {
  RECOVERY_PHRASE_CONFIRM: 1,
  PASSWORD_CREATE: 2,
};

export function ThreeStepProgressBar({ stage, ...boxProps }) {
  const t = useI18nContext();
  return (
    <Box {...boxProps}>
      <ul className="progressbar grid grid-cols-3 gap-5">
        <li
          className={classnames(
            {
              active: stage >= 1,
              complete: stage > 1,
            },
            'relative',
          )}
        >
          {capitalize(t('createPassword'))}
          <Icon
            className="mt-[5px] absolute -right-5 text-grey"
            size="sm"
            name="arrow-right"
          />
        </li>

        <li
          className={classnames(
            {
              active: stage >= 2,
              complete: stage > 3,
            },
            'relative',
          )}
        >
          {capitalize(t('secureWallet'))}
          <Icon
            className="mt-[5px] absolute -right-5 text-grey"
            size="sm"
            name="arrow-right"
          />
        </li>

        <li
          className={classnames({
            active: stage >= 4,
            complete: stage > 5,
          })}
        >
          {capitalize(t('confirmRecoveryPhrase'))}
        </li>
      </ul>
    </Box>
  );
}

export function TwoStepProgressBar({ stage }) {
  const t = useI18nContext();
  return (
    <div>
      <ul className="progressbar grid grid-cols-2 gap-5">
        <li
          className={classnames(
            {
              active: stage >= 1,
              complete: stage > 1,
            },
            'relative',
          )}
        >
          {capitalize(t('confirmRecoveryPhrase'))}
          <Icon
            className="mt-[5px] absolute -right-5 text-grey"
            size="sm"
            name="arrow-right"
          />
        </li>
        <li
          className={classnames('two-steps', {
            active: stage >= 2,
            complete: stage > 2,
          })}
        >
          {capitalize(t('createPassword'))}
        </li>
      </ul>
    </div>
  );
}

ThreeStepProgressBar.propTypes = {
  stage: PropTypes.number,
  ...Box.propTypes,
};

TwoStepProgressBar.propTypes = {
  stage: PropTypes.number,
  ...Box.propTypes,
};
