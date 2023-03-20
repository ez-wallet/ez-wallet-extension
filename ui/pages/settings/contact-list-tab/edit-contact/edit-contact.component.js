import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import TextField from '../../../../components/ui/text-field';
import PageContainerFooter from '../../../../components/ui/page-container/page-container-footer';
import {
  isBurnAddress,
  isValidHexAddress,
} from '../../../../../shared/modules/hexstring-utils';
import FormField from '../../../../components/ui/form-field/form-field';
import Button from '../../../../components/ui/button';

export default class EditContact extends PureComponent {
  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    addToAddressBook: PropTypes.func,
    removeFromAddressBook: PropTypes.func,
    history: PropTypes.object,
    name: PropTypes.string,
    address: PropTypes.string,
    chainId: PropTypes.string,
    memo: PropTypes.string,
    viewRoute: PropTypes.string,
    listRoute: PropTypes.string,
  };

  static defaultProps = {
    name: '',
    memo: '',
  };

  state = {
    newName: this.props.name,
    newAddress: this.props.address,
    newMemo: this.props.memo,
    error: '',
  };

  render() {
    const { t } = this.context;
    const {
      address,
      addToAddressBook,
      chainId,
      history,
      listRoute,
      memo,
      name,
      removeFromAddressBook,
      viewRoute,
    } = this.props;

    if (!address) {
      return <Redirect to={{ pathname: listRoute }} />;
    }

    return (
      <div className="p-4 flex flex-col">
        <div className="flex flex-col mb-4">
          <div className="flex flex-col">
            <div className="text-[15px] text-black">{t('userName')}</div>
            <FormField
              type="text"
              id="nickname"
              placeholder={this.context.t('addAlias')}
              value={this.state.newName}
              onChange={(value) => this.setState({ newName: value })}
              fullWidth
              margin="dense"
            />
          </div>

          <div className="flex flex-col mb-4">
            <div className="text-[15px] text-black">
              {t('ethereumPublicAddress')}
            </div>
            <FormField
              type="text"
              id="address"
              value={this.state.newAddress}
              error={this.state.error}
              onChange={(value) => this.setState({ newAddress: value })}
              fullWidth
              multiline
              rows={4}
              margin="dense"
              classes={{
                inputMultiline:
                  'address-book__view-contact__address__text-area',
                inputRoot: 'address-book__view-contact__address',
              }}
            />
          </div>

          <div className="flex flex-col mb-4">
            <div className="text-[15px] text-black capitalize">{t('memo')}</div>
            <TextField
              type="text"
              id="memo"
              placeholder={memo}
              value={this.state.newMemo}
              onChange={(e) => this.setState({ newMemo: e.target.value })}
              fullWidth
              margin="dense"
              multiline
              rows={3}
              classes={{
                inputRoot: 'bg-transparent shadow-input !h-[100px] !border-0',
              }}
            />
          </div>
        </div>

        <PageContainerFooter
          hideCancel
          onSubmit={async () => {
            if (
              this.state.newAddress !== '' &&
              this.state.newAddress !== address
            ) {
              // if the user makes a valid change to the address field, remove the original address
              if (
                !isBurnAddress(this.state.newAddress) &&
                isValidHexAddress(this.state.newAddress, {
                  mixedCaseUseChecksum: true,
                })
              ) {
                await removeFromAddressBook(chainId, address);
                await addToAddressBook(
                  this.state.newAddress,
                  this.state.newName || name,
                  this.state.newMemo || memo,
                );
                history.push(listRoute);
              } else {
                this.setState({ error: this.context.t('invalidAddress') });
              }
            } else {
              // update name
              await addToAddressBook(
                address,
                this.state.newName || name,
                this.state.newMemo || memo,
              );
              history.push(listRoute);
            }
          }}
          onCancel={() => {
            history.push(`${viewRoute}/${address}`);
          }}
          submitText={this.context.t('edit')}
          disabled={
            (this.state.newName === name &&
              this.state.newAddress === address &&
              this.state.newMemo === memo) ||
            !this.state.newName.trim()
          }
        />
        <Button
          large
          type="danger"
          onClick={async () => {
            await removeFromAddressBook(chainId, address);
            history.push(listRoute);
          }}
        >
          {this.context.t('deleteAccount')}
        </Button>
      </div>
    );
  }
}
