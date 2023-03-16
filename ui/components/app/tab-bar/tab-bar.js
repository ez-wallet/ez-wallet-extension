import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Icon, ICON_NAMES } from '../../component-library';

const TabBar = (props) => {
  const { tabs = [], onSelect, isActive } = props;

  return (
    <div className="flex flex-col rounded-[20px] bg-grey-6 px-4 py-3 divide-y divide-grey-5 shadow-neumorphic">
      {tabs.map(({ key, content, icon }) => (
        <button
          key={key}
          className={classnames('flex py-3', {
            'tab-bar__tab--active': isActive(key, content),
          })}
          onClick={() => onSelect(key)}
        >
          <div className="flex-grow flex gap-2">
            <div className="tab-bar__tab__content__icon">{icon}</div>
            <div className="text-[15px] text-black font-medium">{content}</div>
          </div>
          <Icon name={ICON_NAMES.ARROW_RIGHT} size="sm" />
        </button>
      ))}
    </div>
  );
};

TabBar.propTypes = {
  isActive: PropTypes.func.isRequired,
  tabs: PropTypes.array,
  onSelect: PropTypes.func,
};

export default TabBar;
