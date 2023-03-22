import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { I18nContext } from '../../../contexts/i18n';
import Box from '../../ui/box';
import Typography from '../../ui/typography';
import {
  DISPLAY,
  FLEX_DIRECTION,
  TypographyVariant,
  BorderRadius,
  BackgroundColor,
  TextColor,
} from '../../../helpers/constants/design-system';
import Button from '../../ui/button';
import Tooltip from '../../ui/tooltip';
import IconWithFallback from '../../ui/icon-with-fallback';
import IconBorder from '../../ui/icon-border';
import {
  getFrequentRpcListDetail,
  getUnapprovedConfirmations,
} from '../../../selectors';

import {
  ENVIRONMENT_TYPE_POPUP,
  MESSAGE_TYPE,
} from '../../../../shared/constants/app';
import { requestAddNetworkApproval } from '../../../store/actions';
import Popover from '../../ui/popover';
import ConfirmationPage from '../../../pages/confirmation/confirmation';
import { FEATURED_RPCS } from '../../../../shared/constants/network';
import { ADD_NETWORK_ROUTE } from '../../../helpers/constants/routes';
import { getEnvironmentType } from '../../../../app/scripts/lib/util';
import ZENDESK_URLS from '../../../helpers/constants/zendesk-url';
import { GET_NETWORKS_URL } from '../../../helpers/constants/url';
import { Icon } from '../../component-library';

const AddNetwork = () => {
  const t = useContext(I18nContext);
  const dispatch = useDispatch();
  const history = useHistory();
  const frequentRpcList = useSelector(getFrequentRpcListDetail);

  const frequentRpcListChainIds = Object.values(frequentRpcList).map(
    (net) => net.chainId,
  );

  const infuraRegex = /infura.io/u;

  const nets = FEATURED_RPCS.sort((a, b) =>
    a.nickname > b.nickname ? 1 : -1,
  ).slice(0, FEATURED_RPCS.length);

  const notFrequentRpcNetworks = nets.filter(
    (net) => frequentRpcListChainIds.indexOf(net.chainId) === -1,
  );
  const unapprovedConfirmations = useSelector(getUnapprovedConfirmations);
  const [showPopover, setShowPopover] = useState(false);
  const [networks, setNetworks] = useState(null);
  const [error, setError] = useState(false);
  const fetchNetworks = () => {
    return fetch(GET_NETWORKS_URL)
      .then((response) => response.json())
      .then((data) => {
        const parsedData = data.map((item) => ({
          ...item,
          chainId: `0x${item.chainId.toString(16)}`,
        }));
        setNetworks(parsedData);
      })
      .catch((e) => {
        console.log(e);
        setError(true);
      });
  };
  useEffect(() => {
    const anAddNetworkConfirmationFromMetaMaskExists =
      unapprovedConfirmations?.find((confirmation) => {
        return (
          confirmation.origin === 'metamask' &&
          confirmation.type === MESSAGE_TYPE.ADD_ETHEREUM_CHAIN
        );
      });
    if (!showPopover && anAddNetworkConfirmationFromMetaMaskExists) {
      setShowPopover(true);
    }

    if (showPopover && !anAddNetworkConfirmationFromMetaMaskExists) {
      setShowPopover(false);
    }
  }, [unapprovedConfirmations, showPopover]);

  useEffect(() => {
    fetchNetworks();
  }, []);

  return (
    <>
      {Object.keys(notFrequentRpcNetworks).length === 0 ? (
        <Box
          className="add-network__edge-case-box"
          borderRadius={BorderRadius.MD}
          padding={4}
          marginTop={4}
          marginRight={6}
          marginLeft={6}
          display={DISPLAY.FLEX}
          flexDirection={FLEX_DIRECTION.ROW}
          backgroundColor={BackgroundColor.backgroundAlternative}
        >
          <Box marginRight={4}>
            <img src="images/info-fox.svg" />
          </Box>
          <Box>
            <Typography variant={TypographyVariant.H7}>
              {t('youHaveAddedAll', [
                <a
                  key="link"
                  className="add-network__edge-case-box__link"
                  href="https://chainlist.wtf/"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('here')}.
                </a>,
                <Button
                  key="button"
                  type="inline"
                  onClick={(event) => {
                    event.preventDefault();
                    getEnvironmentType() === ENVIRONMENT_TYPE_POPUP
                      ? global.platform.openExtensionInBrowser(
                          ADD_NETWORK_ROUTE,
                        )
                      : history.push(ADD_NETWORK_ROUTE);
                  }}
                >
                  <Typography
                    variant={TypographyVariant.H7}
                    color={TextColor.infoDefault}
                  >
                    {t('addMoreNetworks')}.
                  </Typography>
                </Button>,
              ])}
            </Typography>
          </Box>
        </Box>
      ) : (
        <div className="w-full">
          {/* {getEnvironmentType() === ENVIRONMENT_TYPE_FULLSCREEN && (
            <Box
              display={DISPLAY.FLEX}
              alignItems={AlignItems.center}
              flexDirection={FLEX_DIRECTION.ROW}
              marginTop={7}
              marginBottom={4}
              paddingBottom={2}
              className="add-network__header"
            >
              <Typography
                variant={TypographyVariant.H4}
                color={TextColor.textMuted}
              >
                {t('networks')}
              </Typography>
              <span className="add-network__header__subtitle">{'  >  '}</span>
              <Typography
                variant={TypographyVariant.H4}
                color={TextColor.textDefault}
              >
                {t('addANetwork')}
              </Typography>
            </Box>
          )} */}
          {networks && (
            <div className="w-full">
              {networks.map((item, index) => (
                <div
                  key={index}
                  className="flex w-full items-center justify-center py-4 gap-2"
                >
                  <IconBorder size={24}>
                    <IconWithFallback
                      icon={item.rpcPrefs.imageUrl}
                      name={item.nickname}
                      size={24}
                    />
                  </IconBorder>
                  <div className="text-[15px] flex-grow text-black font-medium">
                    {item.nickname}
                  </div>
                  <div className="flex items-center gap-2">
                    {
                      // Warning for the networks that doesn't use infura.io as the RPC
                      !infuraRegex.test(item.rpcUrl) && (
                        <Tooltip
                          position="top"
                          interactive
                          html={
                            <div>
                              {t('addNetworkTooltipWarning', [
                                <a
                                  key="zendesk_page_link"
                                  href={ZENDESK_URLS.UNKNOWN_NETWORK}
                                  rel="noreferrer"
                                  target="_blank"
                                >
                                  {t('learnMoreUpperCase')}
                                </a>,
                              ])}
                            </div>
                          }
                          trigger="mouseenter"
                        >
                          <i
                            className="fa fa-exclamation-triangle add-network__warning-icon"
                            title={t('warning')}
                          />
                        </Tooltip>
                      )
                    }
                    <Icon
                      name="add-circle"
                      className="text-blue cursor-pointer"
                      onClick={async () => {
                        await dispatch(requestAddNetworkApproval(item, true));
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {error && (
            <div className="text-red text-[13px] text-center">
              Cannot load networks
            </div>
          )}
          {/* <div>
            <a
              href="#"
              className="text-blue"
              data-testid="add-network-manually"
              onClick={(event) => {
                event.preventDefault();
                getEnvironmentType() === ENVIRONMENT_TYPE_POPUP
                  ? global.platform.openExtensionInBrowser(ADD_NETWORK_ROUTE)
                  : history.push(ADD_NETWORK_ROUTE);
              }}
            >
              {t('addANetworkManually')}
            </a>
          </div> */}
        </div>
      )}
      {showPopover && (
        <Popover>
          <ConfirmationPage redirectToHomeOnZeroConfirmations={false} />
        </Popover>
      )}
    </>
  );
};

export default AddNetwork;
