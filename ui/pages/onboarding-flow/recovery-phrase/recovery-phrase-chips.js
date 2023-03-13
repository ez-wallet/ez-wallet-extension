import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { ChipWithInput } from '../../../components/ui/chip/chip-with-input';
import { useI18nContext } from '../../../hooks/useI18nContext';

export default function RecoveryPhraseChips({
  secretRecoveryPhrase,
  phraseRevealed,
  confirmPhase,
  setInputValue,
  inputValue,
  indicesToCheck,
  hiddenPhrase,
}) {
  const t = useI18nContext();
  const hideSeedPhrase = phraseRevealed === false;
  return (
    <div className="relative">
      <div
        data-testid="recovery-phrase-chips "
        className={classnames('grid grid-cols-3 gap-3 p-2', {
          blur: hideSeedPhrase,
        })}
      >
        {secretRecoveryPhrase.map((word, index) => {
          if (
            confirmPhase &&
            indicesToCheck &&
            indicesToCheck.includes(index)
          ) {
            return (
              <ChipWithInput
                key={index}
                dataTestId={`recovery-phrase-input-${index}`}
                className="w-full rounded-full shadow-input p-2"
                inputValue={inputValue[index]}
                itemNumber={`${index + 1}.`}
                setInputValue={(value) => {
                  setInputValue({ ...inputValue, [index]: value });
                }}
              />
            );
          }

          return (
            <div className="w-full rounded-full shadow-input p-2" key={index}>
              {`${index + 1}. ${word}`}
            </div>
          );
        })}
      </div>

      {hideSeedPhrase && (
        <div className="recovery-phrase__secret-blocker">
          {!hiddenPhrase && (
            <>
              <i className="far fa-eye" color="white" />
              <p className="text-[15px] text-white">
                {t('makeSureNoOneWatching')}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

RecoveryPhraseChips.propTypes = {
  secretRecoveryPhrase: PropTypes.array,
  phraseRevealed: PropTypes.bool,
  confirmPhase: PropTypes.bool,
  setInputValue: PropTypes.func,
  inputValue: PropTypes.object,
  indicesToCheck: PropTypes.array,
  hiddenPhrase: PropTypes.bool,
};
