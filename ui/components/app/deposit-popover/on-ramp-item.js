import React from 'react';
import PropTypes from 'prop-types';

const OnRampItem = ({ logo, title, text, onButtonClick, hide = false }) => {
  if (hide) {
    return null;
  }
  return (
    <div
      className="flex bg-white py-4 px-5 rounded-xl items-center gap-4 shadow-neumorphic"
      onClick={onButtonClick}
    >
      {logo}
      <div className="flex-grow">
        {title && <div>{title}</div>}
        {text && <div>{text}</div>}
      </div>
    </div>
  );
};

OnRampItem.propTypes = {
  logo: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func.isRequired,
  hide: PropTypes.bool,
};

export default OnRampItem;
