// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import style from './header.css';
import { signOut } from '../../store/signIn';

import type { AppState } from '../../store';
import type { SignInState } from '../../store/signIn';

type SignInDispatch = {
  onSignOut: Function
};
type SignInProps = SignInState & SignInDispatch;

class Header extends React.Component<void, SignInProps, void> {
  constructor(props: SignInProps) {
    super(props);
    console.log('header');
  }
  render() {
    const { onSignOut } = this.props;
    let sign = null;

    if (this.props.data) {
      sign = (
        <div
          className={`p pointer ${style.Menu_Target}`}
          role="menuitem"
          tabIndex={0}
          onClick={onSignOut}
        >
          Sign Out
        </div>
      );
    } else {
      sign = (
        <Link to="/signin" className={style.Menu_Target}>
          <div>
            <img src="/assets/svg/icon_logout.svg" alt="print" />
            <div className="mt10 h4 yellow-dark">
              Sign In
            </div>
          </div>
        </Link>
      );
    }

    return (
      <header className={style.Container}>

        <h1 className="yellow-dark font-bold h1 txt-center">
          SCAFFOLD FOR UNIVERSAL APP
        </h1>

        <div className="flex flex-spaceBetween mt20">

          <div>
            <ul className={style.Menu}>
              <li className={style.Menu_Item}>
                <Link to="/" className={style.Menu_Target}>
                  <span className="marcellus h2">TOP</span>
                </Link>
              </li>
              <li className={style.Menu_Item}>
                <Link to="/users" className={style.Menu_Target}>
                  <span>
                    <span className="h2">USER LIST</span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <ul className={style.Menu}>
              <li className={style.Menu_Item}>
                {sign}
              </li>
            </ul>
          </div>

        </div>

      </header>
    );
  }
}

function mapStateToProps(state: AppState): SignInState {
  return { ...state.signIn };
}

function mapDispatchToProps(dispatch: Function): SignInDispatch {
  return {
    onSignOut() {
      dispatch(signOut());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
