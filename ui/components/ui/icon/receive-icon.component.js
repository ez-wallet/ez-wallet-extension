import React from 'react';
import PropTypes from 'prop-types';

/**
 * @deprecated This has been deprecated in favour of the `<Icon />` component in ./ui/components/component-library/icon/icon.js
 * See storybook documentation for Icon here https://metamask.github.io/metamask-storybook/?path=/docs/components-componentlibrary-icon--default-story#icon
 */

const Receive = ({ className, size, color }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.11133 10.2347C1.11133 5.22049 5.18045 1.15137 10.1947 1.15137C10.6089 1.15137 10.9447 1.48715 10.9447 1.90137C10.9447 2.31558 10.6089 2.65137 10.1947 2.65137C6.00888 2.65137 2.61133 6.04891 2.61133 10.2347C2.61133 14.4205 6.00888 17.818 10.1947 17.818C14.3804 17.818 17.778 14.4205 17.778 10.2347C17.778 9.82049 18.1138 9.4847 18.528 9.4847C18.9422 9.4847 19.278 9.82049 19.278 10.2347C19.278 15.2489 15.2089 19.318 10.1947 19.318C5.18045 19.318 1.11133 15.2489 1.11133 10.2347Z"
      fill={color}
      stroke={color}
      strokeWidth="0.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.059 1.37104C19.3519 1.66393 19.3519 2.1388 19.059 2.4317L12.2256 9.26503C11.9327 9.55792 11.4579 9.55792 11.165 9.26503C10.8721 8.97214 10.8721 8.49726 11.165 8.20437L17.9983 1.37104C18.2912 1.07814 18.7661 1.07814 19.059 1.37104Z"
      fill={color}
      stroke={color}
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.0273 4.62598C11.4416 4.62598 11.7773 4.96176 11.7773 5.37598V8.65098H15.0523C15.4666 8.65098 15.8023 8.98676 15.8023 9.40098C15.8023 9.81519 15.4666 10.151 15.0523 10.151H11.0273C10.6131 10.151 10.2773 9.81519 10.2773 9.40098V5.37598C10.2773 4.96176 10.6131 4.62598 11.0273 4.62598Z"
      fill={color}
      stroke={color}
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

Receive.defaultProps = {
  className: undefined,
};

Receive.propTypes = {
  /**
   * Additional className
   */
  className: PropTypes.string,
  /**
   * Size of the icon should adhere to 8px grid. e.g: 8, 16, 24, 32, 40 and is required
   */
  size: PropTypes.number.isRequired,
  /**
   * Color of the icon should be a valid design system color and is required
   */
  color: PropTypes.string.isRequired,
};

export default Receive;
