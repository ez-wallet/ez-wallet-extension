import { ethErrors } from 'eth-rpc-errors';
import {
  JustifyContent,
  SEVERITIES,
  TextColor,
  TypographyVariant,
} from '../../../helpers/constants/design-system';

const PENDING_TX_DROP_NOTICE = {
  id: 'PENDING_TX_DROP_NOTICE',
  severity: SEVERITIES.WARNING,
  content: {
    element: 'span',
    children: {
      element: 'MetaMaskTranslation',
      props: {
        translationKey: 'switchingNetworksCancelsPendingConfirmations',
      },
    },
  },
};

async function getAlerts() {
  return [PENDING_TX_DROP_NOTICE];
}

function getValues(pendingApproval, t, actions) {
  return {
    content: [
      {
        element: 'Typography',
        key: 'title',
        children: t('switchEthereumChainConfirmationTitle'),
        props: {
          variant: TypographyVariant.H3,
          align: 'center',
          fontWeight: 'normal',
          boxProps: {
            margin: [0, 0, 2],
            padding: [0, 4, 0, 4],
          },
        },
      },
      {
        element: 'Typography',
        key: 'description',
        children: t('switchEthereumChainConfirmationDescription'),
        props: {
          variant: TypographyVariant.H7,
          color: TextColor.textAlternative,
          align: 'center',
          boxProps: {
            padding: [0, 4, 0, 4],
          },
        },
      },
      {
        element: 'Box',
        key: 'status-box',
        props: {
          justifyContent: JustifyContent.center,
        },
        children: {
          element: 'ConfirmationNetworkSwitch',
          key: 'network-being-switched',
          props: {
            newNetwork: {
              chainId: pendingApproval.requestData.chainId,
              name: pendingApproval.requestData.nickname,
            },
          },
        },
      },
    ],
    cancelText: t('cancel'),
    submitText: t('switchNetwork'),
    onSubmit: () =>
      actions.resolvePendingApproval(
        pendingApproval.id,
        pendingApproval.requestData,
      ),

    onCancel: () =>
      actions.rejectPendingApproval(
        pendingApproval.id,
        ethErrors.provider.userRejectedRequest().serialize(),
      ),
    networkDisplay: true,
  };
}

const switchEthereumChain = {
  getAlerts,
  getValues,
};

export default switchEthereumChain;
