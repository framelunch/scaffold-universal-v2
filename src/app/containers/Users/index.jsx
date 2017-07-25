// @flow
import React from 'react';
import { connect } from 'react-redux';
import { usersStartFetch } from '../../store/users';
import { STATUS_FINISHED } from '../../store';

import type { AppState } from '../../store';
import type { UsersState } from '../../store/users';

export type UsersProps = UsersState & {
  dispatch: Function
};

class Users extends React.Component<void, UsersProps, void> {
  componentDidMount() {
    const { dispatch, status } = this.props;
    if (status === STATUS_FINISHED) return;
    if (dispatch) dispatch(usersStartFetch());
  }

  render() {
    return (
      <div className="mod-Container">
        <ul>
          {(this.props.data || []).map(({ name }, i) => <li key={i.toString()}>{name}</li>)}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state: AppState): UsersState {
  return { ...state.users };
}

/* デフォルトでprops.dispatchが含まれる。カスタマイズが必要な時のみ定義する
function mapDispatchToProps(dispatch) {
  return {};
}
*/

export default connect(mapStateToProps)(Users);
