import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import {
  // Size,
  TypographyVariant,
} from '../../../helpers/constants/design-system';
import Tooltip from '../tooltip';

// const MARGIN_MAP = {
//   [Size.XS]: 0,
//   [Size.SM]: 2,
//   [Size.MD]: 4,
//   [Size.LG]: 6,
//   [Size.XL]: 8,
// };

export default function DefinitionList({
  dictionary,

  tooltips = {},
}) {
  return (
    <div className="flex flex-col gap-3">
      {Object.entries(dictionary).map(([term, definition]) => (
        <div className="flex flex-col" key={`definition-for-${term}`}>
          <div className="text-[15px] text-grey flex gap-2">
            {term}
            {tooltips[term] && (
              <Tooltip
                title={tooltips[term]}
                position="top"
                containerClassName="definition-list__tooltip-wrapper"
              >
                <i className="fas fa-info-circle" />
              </Tooltip>
            )}
          </div>
          <div className="text-[15px] text-black break-words">{definition}</div>
        </div>
      ))}
    </div>
  );
}

DefinitionList.propTypes = {
  // gapSize: PropTypes.oneOf(Object.values(Size)),
  dictionary: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
  tooltips: PropTypes.objectOf(PropTypes.string),
  termTypography: PropTypes.shape({
    ...omit(TypographyVariant.propTypes, ['tag', 'className', 'boxProps']),
  }),
  definitionTypography: PropTypes.shape({
    ...omit(TypographyVariant.propTypes, ['tag', 'className', 'boxProps']),
  }),
};
