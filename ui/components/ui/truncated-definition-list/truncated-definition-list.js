import { pick } from 'lodash';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Size } from '../../../helpers/constants/design-system';
import Box from '../box';
import Button from '../button';
import DefinitionList from '../definition-list/definition-list';
import Popover from '../popover';
import { useI18nContext } from '../../../hooks/useI18nContext';

export default function TruncatedDefinitionList({
  dictionary,
  tooltips,
  prefaceKeys,
  title,
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const t = useI18nContext();

  return (
    <>
      <div className="p-4 shadow-input rounded-xl bg-grey-6">
        <DefinitionList
          dictionary={pick(dictionary, prefaceKeys)}
          tooltips={tooltips}
        />
        <Button
          className="truncated-definition-list__view-more"
          type="link"
          onClick={() => setIsPopoverOpen(true)}
        >
          {t('viewAllDetails')}
        </Button>
      </div>
      {isPopoverOpen && (
        <Popover
          title={title}
          open={isPopoverOpen}
          onClose={() => setIsPopoverOpen(false)}
          footer={
            <>
              <div />
              <Button
                type="primary"
                style={{ width: '50%' }}
                onClick={() => setIsPopoverOpen(false)}
              >
                Close
              </Button>
            </>
          }
        >
          <Box padding={6} paddingTop={0}>
            <DefinitionList
              gap={Size.MD}
              tooltips={tooltips}
              dictionary={dictionary}
            />
          </Box>
        </Popover>
      )}
    </>
  );
}

TruncatedDefinitionList.propTypes = {
  dictionary: DefinitionList.propTypes.dictionary,
  tooltips: DefinitionList.propTypes.dictionary,
  title: PropTypes.string,
  prefaceKeys: PropTypes.arrayOf(PropTypes.string),
};
