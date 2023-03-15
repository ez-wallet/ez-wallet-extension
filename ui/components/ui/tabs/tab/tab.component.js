import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Tab = (props) => {
  const {
    className,
    'data-testid': dataTestId,
    isActive,
    name,
    onClick,
    tabIndex,
    tabKey,
  } = props;

  return (
    <div
      className={classnames(
        'text-center py-4 text-[15px] cursor-pointer',
        {
          'border-b-[3px] border-green-2': isActive,
          'text-grey border-b border-grey-5': !isActive,
        },
        className,
      )}
      data-testid={dataTestId}
      onClick={(event) => {
        event.preventDefault();
        onClick(tabIndex);
      }}
      key={tabKey}
    >
      {name}
    </div>
  );
};

Tab.propTypes = {
  className: PropTypes.string,
  'data-testid': PropTypes.string,
  isActive: PropTypes.bool, // required, but added using React.cloneElement
  name: PropTypes.string.isRequired,
  tabKey: PropTypes.string.isRequired, // for Tabs selection purpose
  onClick: PropTypes.func,
  tabIndex: PropTypes.number, // required, but added using React.cloneElement
};

Tab.defaultProps = {
  className: undefined,
  onClick: undefined,
};

export default Tab;
