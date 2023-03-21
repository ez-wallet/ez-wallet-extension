import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from '../../../../components/ui/button';

export default function ConfirmationFooter({
  onSubmit,
  onCancel,
  submitText,
  cancelText,
  alerts,
}) {
  return (
    <div className="confirmation-footer px-4 mb-4">
      {alerts}
      <div className="w-full flex flex-col gap-3">
        {onCancel ? (
          <Button type="default" large onClick={onCancel}>
            {cancelText}
          </Button>
        ) : null}
        <Button
          type="primary"
          large
          onClick={onSubmit}
          className={classnames({
            centered: !onCancel,
          })}
        >
          {submitText}
        </Button>
      </div>
    </div>
  );
}

ConfirmationFooter.propTypes = {
  alerts: PropTypes.node,
  onCancel: PropTypes.func,
  cancelText: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string.isRequired,
};
