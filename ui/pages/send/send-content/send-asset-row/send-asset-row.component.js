import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SendRowWrapper from '../send-row-wrapper';
import Identicon from '../../../../components/ui/identicon';
import TokenBalance from '../../../../components/ui/token-balance';
import TokenListDisplay from '../../../../components/app/token-list-display';
import UserPreferencedCurrencyDisplay from '../../../../components/app/user-preferenced-currency-display';
import { PRIMARY } from '../../../../helpers/constants/common';
import { isEqualCaseInsensitive } from '../../../../../shared/modules/string-utils';
import { EVENT } from '../../../../../shared/constants/metametrics';
import {
  AssetType,
  TokenStandard,
} from '../../../../../shared/constants/transaction';

export default class SendAssetRow extends Component {
  static propTypes = {
    tokens: PropTypes.arrayOf(
      PropTypes.shape({
        address: PropTypes.string,
        decimals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        symbol: PropTypes.string,
        image: PropTypes.string,
      }),
    ).isRequired,
    accounts: PropTypes.object.isRequired,
    selectedAddress: PropTypes.string.isRequired,
    sendAsset: PropTypes.object,
    updateSendAsset: PropTypes.func.isRequired,
    nativeCurrency: PropTypes.string,
    nativeCurrencyImage: PropTypes.string,
    nfts: PropTypes.arrayOf(
      PropTypes.shape({
        address: PropTypes.string.isRequired,
        tokenId: PropTypes.string.isRequired,
        name: PropTypes.string,
        description: PropTypes.string,
        image: PropTypes.string,
        standard: PropTypes.string,
        imageThumbnail: PropTypes.string,
        imagePreview: PropTypes.string,
        creator: PropTypes.shape({
          address: PropTypes.string,
          config: PropTypes.string,
          profile_img_url: PropTypes.string,
        }),
      }),
    ),
    collections: PropTypes.arrayOf(
      PropTypes.shape({
        address: PropTypes.string.isRequired,
        name: PropTypes.string,
      }),
    ),
  };

  static contextTypes = {
    t: PropTypes.func,
    trackEvent: PropTypes.func,
  };

  state = {
    isShowingDropdown: false,
    sendableTokens: [],
    sendableNfts: [],
  };

  async componentDidMount() {
    const sendableTokens = this.props.tokens.filter((token) => !token.isERC721);
    const sendableNfts = this.props.nfts.filter(
      (nft) => nft.isCurrentlyOwned && nft.standard === TokenStandard.ERC721,
    );
    this.setState({ sendableTokens, sendableNfts });
  }

  openDropdown = () => this.setState({ isShowingDropdown: true });

  closeDropdown = () => this.setState({ isShowingDropdown: false });

  getAssetSelected = (type, token) => {
    switch (type) {
      case AssetType.native:
        return this.props.nativeCurrency;
      case AssetType.token:
        return TokenStandard.ERC20;
      case AssetType.NFT:
        return token?.standard;
      default:
        return null;
    }
  };

  selectToken = (type, token) => {
    this.setState(
      {
        isShowingDropdown: false,
      },
      () => {
        this.context.trackEvent({
          category: EVENT.CATEGORIES.TRANSACTIONS,
          event: 'User clicks "Assets" dropdown',
          properties: {
            action: 'Send Screen',
            legacy_event: true,
            assetSelected: this.getAssetSelected(type, token),
          },
        });
        this.props.updateSendAsset({
          type,
          details: type === AssetType.native ? null : token,
        });
      },
    );
  };

  render() {
    const { t } = this.context;

    return (
      <SendRowWrapper label={t('asset')}>
        <div className="flex items-center bg-grey-6 shadow-input rounded-full h-[60px] py-2 px-4 gap-1 mb-3">
          <div className="w-full" onClick={this.openDropdown}>
            {this.renderSendAsset()}
          </div>
          {[...this.state.sendableTokens, ...this.state.sendableNfts].length > 0
            ? this.renderAssetDropdown()
            : null}
        </div>
      </SendRowWrapper>
    );
  }

  renderSendAsset() {
    const {
      sendAsset: { details, type },
      tokens,
      nfts,
    } = this.props;

    if (type === AssetType.token) {
      const token = tokens.find(({ address }) =>
        isEqualCaseInsensitive(address, details.address),
      );
      if (token) {
        return this.renderToken(token);
      }
    } else if (type === AssetType.NFT) {
      const nft = nfts.find(
        ({ address, tokenId }) =>
          isEqualCaseInsensitive(address, details.address) &&
          tokenId === details.tokenId,
      );
      if (nft) {
        return this.renderNft(nft);
      }
    }
    return this.renderNativeCurrency();
  }

  renderAssetDropdown() {
    return (
      this.state.isShowingDropdown && (
        <div>
          <div
            className="send-v2__asset-dropdown__close-area"
            onClick={this.closeDropdown}
          />
          <div className="send-v2__asset-dropdown__list">
            {this.renderNativeCurrency(true)}
            <TokenListDisplay
              clickHandler={(token) => this.selectToken(AssetType.token, token)}
            />

            {this.state.sendableNfts.map((nft) => this.renderNft(nft, true))}
          </div>
        </div>
      )
    );
  }

  renderNativeCurrency(insideDropdown = false) {
    const { t } = this.context;
    const { accounts, selectedAddress, nativeCurrency, nativeCurrencyImage } =
      this.props;

    const { sendableTokens, sendableNfts } = this.state;

    const balanceValue = accounts[selectedAddress]
      ? accounts[selectedAddress].balance
      : '';

    const sendableAssets = [...sendableTokens, ...sendableNfts];
    return (
      <div
        className="flex items-center gap-2 px-2"
        onClick={() => this.selectToken(AssetType.native)}
      >
        <Identicon
          diameter={36}
          image={nativeCurrencyImage}
          address={nativeCurrency}
        />
        <div className="flex-grow">
          <div className="text-[13px] text-black font-semibold">
            {nativeCurrency}
          </div>
          <div className="flex text-[13px] text-black">
            <span>{`${t('balance')}:`}</span>
            <UserPreferencedCurrencyDisplay
              value={balanceValue}
              type={PRIMARY}
            />
          </div>
        </div>
        {!insideDropdown && sendableAssets.length > 0 && (
          <i className="fa fa-caret-down fa-md" />
        )}
      </div>
    );
  }

  renderToken(token, insideDropdown = false) {
    const { address, symbol, image } = token;
    const { t } = this.context;

    return (
      <div
        key={address}
        className="flex items-center gap-2 px-2"
        onClick={() => this.selectToken(AssetType.token, token)}
      >
        <Identicon address={address} diameter={36} image={image} />
        <div className="flex-grow">
          <div className="text-[13px] text-black font-semibold">{symbol}</div>
          <div className="text-[13px] text-black">
            <span>{`${t('balance')}:`}</span>
            <TokenBalance token={token} />
          </div>
        </div>
        {!insideDropdown && <i className="fa fa-caret-down fa-md" />}
      </div>
    );
  }

  renderNft(nft, insideDropdown = false) {
    const { address, name, image, tokenId } = nft;
    const { t } = this.context;
    const nftCollection = this.props.collections.find(
      (collection) => collection.address === address,
    );
    return (
      <div
        className="flex items-center gap-2 px-2"
        key={address}
        onClick={() => this.selectToken(AssetType.NFT, nft)}
      >
        <Identicon address={address} diameter={36} image={image} />
        <div className="flex-grow">
          <div className="text-[13px] text-black font-semibold">
            {nftCollection.name || name}
          </div>
          <div className="text-[13px] text-black">
            <span>{`${t('tokenId')}:`}</span>
            {tokenId}
          </div>
        </div>
        {!insideDropdown && <i className="fa fa-caret-down fa-md" />}
      </div>
    );
  }
}
