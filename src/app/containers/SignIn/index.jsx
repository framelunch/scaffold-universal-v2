// @flow
import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { signInEnter } from '../../store/signIn';
import { STATUS_PROGRESS, STATUS_FINISHED } from '../../store';
import style from './signIn.css';

import type { AppState } from '../../store';
import type { SignInState } from '../../store/signIn';

type SignInDispatch = {
  onEnter: Function
};
type SignInProps = SignInState & SignInDispatch;
type LocalState = {
  email: string,
  password: string,
};

class SignIn extends React.Component<void, SignInProps, LocalState> {
  state: LocalState;
  onChange: (e: Event) => void;

  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };
    this.onChange = this.onChange.bind(this);
  }
  componentWillMount() {

  }
  onChange(e: Event & {target: HTMLInputElement}) {
    const field = e.target.dataset.field;
    this.setState({
      ...this.state,
      [field]: e.target.value,
    });
  }

  render() {
    const { status, onEnter } = this.props;
    const { email, password } = this.state;

    if (status === STATUS_FINISHED) {
      return <Redirect to="/" />;
    }

    return (
      <div className="mod-Container">
        <div className={style.SignIn}>
          <h1 className="h1 mb20">SIGN IN</h1>
          <div className="mb20">
            <label className="label" htmlFor="email">E-mail</label>
            <div className="mt5">
              <input
                type="text"
                className="input w100per"
                placeholder="Please input your email address..."
                data-field="email"
                value={this.state.email}
                onChange={this.onChange}
              />
            </div>
          </div>
          <div className="mb20">
            <label className="label" htmlFor="password">Password</label>
            <div className="mt5">
              <input
                type="password"
                className="input w100per"
                placeholder="Please input your password..."
                data-field="password"
                value={this.state.password}
                onChange={this.onChange}
              />
            </div>
          </div>
          <div className="txt-right">
            <span className="p mr10">{this.props.error}</span>
            <span
              className="mod-Loader mr10"
              style={{ display: this.props.status === STATUS_PROGRESS ? '' : 'none' }}
            />
            <button
              className="btn btn-m btn-primary"
              onClick={() => onEnter(email, password)}
            >ENTER</button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: AppState): SignInState {
  return { ...state.signIn };
}

function mapDispatchToProps(dispatch: Function): SignInDispatch {
  return {
    onEnter(email, password) {
      dispatch(signInEnter(email, password));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
