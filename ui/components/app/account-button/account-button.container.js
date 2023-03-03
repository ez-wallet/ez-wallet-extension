import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import * as actions from '../../../store/actions';
import AccountButton from './account-button.component';

const mapStateToProps = (state) => {
  const { metamask } = state;
  const { selectedAddress, isUnlocked, isAccountMenuOpen } = metamask;
  return {
    selectedAddress,
    isUnlocked,
    isAccountMenuOpen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleAccountMenu: () => dispatch(actions.toggleAccountMenu()),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(AccountButton);
