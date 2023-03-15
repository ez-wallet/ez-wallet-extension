import React from 'react';
import PropTypes from 'prop-types';

/**
 * @deprecated This has been deprecated in favour of the `<Icon />` component in ./ui/components/component-library/icon/icon.js
 * See storybook documentation for Icon here https://metamask.github.io/metamask-storybook/?path=/docs/components-componentlibrary-icon--default-story#icon
 */

const Send = ({ className, size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 21 21"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.29883 10.9261C1.29883 5.91189 5.36795 1.84277 10.3822 1.84277C10.7964 1.84277 11.1322 2.17856 11.1322 2.59277C11.1322 3.00699 10.7964 3.34277 10.3822 3.34277C6.19638 3.34277 2.79883 6.74032 2.79883 10.9261C2.79883 15.1119 6.19638 18.5094 10.3822 18.5094C14.5679 18.5094 17.9655 15.1119 17.9655 10.9261C17.9655 10.5119 18.3013 10.1761 18.7155 10.1761C19.1297 10.1761 19.4655 10.5119 19.4655 10.9261C19.4655 15.9403 15.3964 20.0094 10.3822 20.0094C5.36795 20.0094 1.29883 15.9403 1.29883 10.9261Z"
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
      d="M18.5785 2.72944C18.8714 3.02233 18.8714 3.4972 18.5785 3.7901L11.7452 10.6234C11.4523 10.9163 10.9774 10.9163 10.6845 10.6234C10.3916 10.3305 10.3916 9.85566 10.6845 9.56277L17.5178 2.72944C17.8107 2.43654 18.2856 2.43654 18.5785 2.72944Z"
      fill={color}
      stroke={color}
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.9395 2.59277C13.9395 2.17856 14.2752 1.84277 14.6895 1.84277H18.7145C19.1287 1.84277 19.4645 2.17856 19.4645 2.59277V6.61777C19.4645 7.03199 19.1287 7.36777 18.7145 7.36777C18.3002 7.36777 17.9645 7.03199 17.9645 6.61777V3.34277H14.6895C14.2752 3.34277 13.9395 3.00699 13.9395 2.59277Z"
      fill={color}
      stroke={color}
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

Send.defaultProps = {
  className: undefined,
};

Send.propTypes = {
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

export default Send;
