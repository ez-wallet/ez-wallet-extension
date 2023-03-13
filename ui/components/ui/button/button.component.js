import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const BUTTON_TYPE = {
  default: 'default',
  primary: 'primary',
  secondary: 'secondary',
  warning: 'warning',
  danger: 'danger',
  link: 'link',
  inline: 'inline',
  raised: 'raised',
};
const Button = ({
  type,
  submit = false,
  large,
  children,
  icon,
  className,
  rounded = true,
  ...buttonProps
}) => {
  const doRounding = rounded && type !== 'link' && type !== 'inline';
  // To support using the Button component to render styled links that are semantic html
  // we swap the html tag we use to render this component and delete any buttonProps that
  // we know to be erroneous attributes for a link. We will likely want to extract Link
  // to its own component in the future.
  let Tag = 'button';
  if (type === BUTTON_TYPE.link) {
    Tag = 'a';
  } else if (submit) {
    buttonProps.type = 'submit';
  }
  if (typeof buttonProps.onClick === 'function') {
    buttonProps.onKeyUp ??= (event) => {
      if (event.key === 'Enter') {
        buttonProps.onClick();
      }
    };
    buttonProps.role ??= 'button';
    buttonProps.tabIndex ??= 0;
  }
  return (
    <Tag
      className={classnames(
        'text-[15px] py-4 px-3 flex justify-center whitespace-nowrap',
        {
          'bg-transparent text-black border border-grey-1':
            type === BUTTON_TYPE.default || !type,
          'bg-green-2 text-black ': type === BUTTON_TYPE.primary,
          'bg-purple text-white': type === BUTTON_TYPE.secondary,
          'bg-yellow-3 text-black': type === BUTTON_TYPE.warning,
          'bg-red text-white': type === BUTTON_TYPE.danger,
          'bg-transparent text-blue': type === BUTTON_TYPE.link,
          'inline p-0': type === BUTTON_TYPE.inline,
          'bg-green-2 text-black p-3 shadow-sm': type === BUTTON_TYPE.raised,
          'rounded-full': doRounding,
          'w-full': large,
        },
        className,
      )}
      {...buttonProps}
    >
      {icon && icon}
      <div>{children}</div>
    </Tag>
  );
};

Button.propTypes = {
  /**
   * The type of variation a button can be.
   * Can be one of 'default','primary','secondary','warning','danger','danger-primary' or 'link'
   */
  type: PropTypes.string,
  /**
   * If true sets the html 'type' attribute to type="submit"
   */
  submit: PropTypes.bool,
  /**
   * Increase the height of the button to 54px
   */
  large: PropTypes.bool,
  /**
   * Additional className to provide on the root element of the button
   */
  className: PropTypes.string,
  /**
   * The children of the button component
   */
  children: PropTypes.node,
  /**
   * Provide an icon component for an icon to appear on the left side of the button
   */
  icon: PropTypes.node,
  /**
   * Buttons are rounded by default.
   */
  rounded: PropTypes.bool,
};

export default Button;
