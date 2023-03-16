import { useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { isMetamaskSuggestedGasEstimate } from '../../../helpers/utils/gas';
import { getGasLoadingAnimationIsShowing } from '../../../ducks/app/app';
import { useShouldAnimateGasEstimations } from '../../../hooks/useShouldAnimateGasEstimations';

const BASE_CLASS = 'loading-heartbeat';
const LOADING_CLASS = `${BASE_CLASS}--active`;

export default function LoadingHeartBeat({ estimateUsed }) {
  useShouldAnimateGasEstimations();
  const active = useSelector(getGasLoadingAnimationIsShowing);

  if (
    process.env.IN_TEST ||
    (estimateUsed && !isMetamaskSuggestedGasEstimate(estimateUsed))
  ) {
    return null;
  }

  return (
    <div
      className={classNames('loading-heartbeat bg-grey-6', {
        [LOADING_CLASS]: active,
      })}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    ></div>
  );
}

LoadingHeartBeat.propTypes = {
  estimateUsed: PropTypes.string,
};
