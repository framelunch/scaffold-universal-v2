// @flow
import React from 'react';
import { connect } from 'react-redux';

import type { AppState } from '../../store';
import type { UsersState } from '../../store/users';

export type UsersProps = UsersState & {
  dispatch: Function
};

class Users extends React.Component<void, UsersProps, void> {
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

/*
function mapDispatchToProps(dispatch) {
  return {};
}
*/

export default connect(mapStateToProps)(Users);
