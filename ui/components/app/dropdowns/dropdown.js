import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MenuDroppo from '../menu-droppo';

export class Dropdown extends Component {
  render() {
    const {
      containerClassName,
      isOpen,
      onClickOutside,
      style,
      innerStyle,
      children,
      useCssTransition,
    } = this.props;

    const innerStyleDefaults = {
      ...innerStyle,
    };

    return (
      <MenuDroppo
        containerClassName={containerClassName}
        useCssTransition={useCssTransition}
        isOpen={isOpen}
        zIndex={55}
        onClickOutside={onClickOutside}
        style={style}
        innerStyle={innerStyleDefaults}
      >
        {children}
      </MenuDroppo>
    );
  }
}

Dropdown.defaultProps = {
  useCssTransition: false,
};

Dropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node,
  style: PropTypes.object.isRequired,
  onClickOutside: PropTypes.func,
  innerStyle: PropTypes.object,
  useCssTransition: PropTypes.bool,
  containerClassName: PropTypes.string,
};

export class DropdownMenuItem extends Component {
  render() {
    const { onClick, closeMenu, children, style } = this.props;

    return (
      <li
        className="dropdown-menu-item"
        data-testid="dropdown-menu-item"
        onClick={() => {
          onClick();
          closeMenu();
        }}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            onClick();
            closeMenu();
          }
        }}
        style={{
          listStyle: 'none',
          padding: '8px 0px',
          fontSize: '18px',
          fontStyle: 'normal',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          ...style,
        }}
        tabIndex="0"
      >
        {children}
      </li>
    );
  }
}

DropdownMenuItem.propTypes = {
  closeMenu: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
  style: PropTypes.object,
};
