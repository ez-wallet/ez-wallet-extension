import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Typography from '../typography/typography';
import Box from '../box/box';
import {
  TEXT_ALIGN,
  DISPLAY,
  TypographyVariant,
  AlignItems,
  TextColor,
} from '../../../helpers/constants/design-system';

import NumericInput from '../numeric-input/numeric-input.component';
import InfoTooltip from '../info-tooltip/info-tooltip';
import { Icon } from '../../component-library';

export default function FormField({
  dataTestId,
  titleText = '',
  TitleTextCustomComponent,
  titleUnit = '',
  TitleUnitCustomComponent,
  tooltipText = '',
  TooltipCustomComponent,
  titleDetail = '',
  titleDetailWrapperProps,
  error,
  onChange = undefined,
  value = 0,
  numeric,
  detailText = '',
  autoFocus = false,
  password = false,
  allowDecimals = false,
  disabled = false,
  placeholder,
  warning,
  passwordStrength,
  passwordStrengthText,
  id,
  inputProps,
  wrappingLabelProps,
  leadingIcon,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const onSetShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={classNames('form-field', {
        'form-field__row--error': error,
      })}
    >
      <Box as="label" {...wrappingLabelProps}>
        <div className="form-field__heading mb-3">
          <Box
            className="form-field__heading-title"
            display={DISPLAY.FLEX}
            alignItems={AlignItems.baseline}
          >
            {TitleTextCustomComponent ||
              (titleText && (
                <label className="text-[15px] font-medium text-black">
                  {titleText}
                </label>
              ))}
            {TitleUnitCustomComponent ||
              (titleUnit && (
                <Typography
                  tag={TypographyVariant.H6}
                  variant={TypographyVariant.H6}
                  color={TextColor.textAlternative}
                  boxProps={{ display: DISPLAY.INLINE_BLOCK }}
                >
                  {titleUnit}
                </Typography>
              ))}
            {TooltipCustomComponent ||
              (tooltipText && (
                <InfoTooltip position="top" contentText={tooltipText} />
              ))}
          </Box>
          {titleDetail && (
            <Box
              className="form-field__heading-detail"
              textAlign={TEXT_ALIGN.END}
              marginRight={2}
              {...titleDetailWrapperProps}
            >
              {titleDetail}
            </Box>
          )}
        </div>
        <div className="flex items-center bg-grey-6 shadow-input rounded-full h-[60px] py-2 px-4 w-full gap-1 mb-3">
          {leadingIcon && (
            <Icon className="text-grey text-[15px]" name={leadingIcon} />
          )}
          {numeric ? (
            <NumericInput
              error={error}
              onChange={onChange}
              value={value}
              detailText={detailText}
              autoFocus={autoFocus}
              allowDecimals={allowDecimals}
              disabled={disabled}
              dataTestId={dataTestId}
              placeholder={placeholder}
              id={id}
            />
          ) : (
            <input
              className={classNames(
                'border-0 bg-transparent box-border w-full focus:outline-0 text-[15px]',
                {
                  'form-field__input--error': error,
                  'form-field__input--warning': warning,
                },
              )}
              onChange={(e) => onChange(e.target.value)}
              value={value}
              type={password && !showPassword ? 'password' : 'text'}
              autoFocus={autoFocus}
              disabled={disabled}
              data-testid={dataTestId}
              placeholder={placeholder}
              id={id}
              {...inputProps}
            />
          )}
          {password && (
            <button className="w-fit h-fit" onClick={onSetShowPassword}>
              {showPassword === false ? (
                <Icon name="eye-slash" />
              ) : (
                <Icon name="eye" />
              )}
            </button>
          )}
        </div>
        {error && <p className="text-[13px] text-red">{error}</p>}
        {warning && <p className="text-[13px] text-yellow">{warning}</p>}
        {passwordStrength && <p className="text-[13px]">{passwordStrength}</p>}
        {passwordStrengthText && (
          <p className="text-[13px]">{passwordStrengthText}</p>
        )}
      </Box>
    </div>
  );
}

FormField.propTypes = {
  /**
   * Identifier for testing purpose
   */
  dataTestId: PropTypes.string,
  /**
   * Form Fields Title
   */
  titleText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /**
   * A custom component to replace the title text Typography component
   * titleText will be ignored if this is provided
   */
  TitleTextCustomComponent: PropTypes.node,
  /**
   * Show unit (eg. ETH)
   */
  titleUnit: PropTypes.string,
  /**
   * A custom component to replace the title unit Typography component
   * titleUnit will be ignored if this is provided
   */
  TitleUnitCustomComponent: PropTypes.node,
  /**
   * Add Tooltip and text content
   */
  tooltipText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /**
   * A custom component to replace the tooltip component
   * tooltipText will be ignored if this is provided
   */
  TooltipCustomComponent: PropTypes.node,
  /**
   * Show content (text, image, component) in title
   */
  titleDetail: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /**
   * Props to pass to wrapping Box component of the titleDetail component
   * Accepts all props of the Box component
   */
  titleDetailWrapperProps: PropTypes.shape({
    ...Box.propTypes,
  }),
  /**
   * Show error message
   */
  error: PropTypes.string,
  /**
   * Show warning message
   */
  warning: PropTypes.string,
  /**
   * Handler when fields change
   */
  onChange: PropTypes.func,
  /**
   * Field value
   */
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Show detail text if field mode is numeric
   */
  detailText: PropTypes.string,
  /**
   * Set autofocus on render
   */
  autoFocus: PropTypes.bool,
  /**
   * Set numeric mode, the default is text
   */
  numeric: PropTypes.bool,
  /**
   * Set password mode
   */
  password: PropTypes.bool,
  /**
   * Allow decimals on the field
   */
  allowDecimals: PropTypes.bool,
  /**
   * Check if the form disabled
   */
  disabled: PropTypes.bool,
  /**
   * Set the placeholder text for the input field
   */
  placeholder: PropTypes.string,
  /**
   * Show password strength according to the score
   */
  passwordStrength: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /**
   * Show password strength description
   */
  passwordStrengthText: PropTypes.string,
  /**
   * The id of the input element. Should be used when the wrapping label is changed to a div to ensure accessibility.
   */
  id: PropTypes.string,
  /**
   * Any additional input attributes or overrides not provided by exposed props
   */
  inputProps: PropTypes.object,
  /**
   * The FormField is wrapped in a Box component that is rendered as a <label/> using the polymorphic "as" prop.
   * This object allows you to override the rendering of the label by using the wrapperProps={{ as: 'div' }} prop.
   * If used ensure the id prop is set on the input and a label element is present using htmlFor with the same id to ensure accessibility.
   */
  wrappingLabelProps: PropTypes.object,
  leadingIcon: PropTypes.string,
};
