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
  render() {
    const { onSignOut } = this.props;
    let sign = null;

    if (this.props.data) {
      sign = (
        <span
          className="p pointer"
          role="menuitem"
          tabIndex={0}
          onClick={onSignOut}
        >Sign Out</span>
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

        <div className="flex">
          <span className="ml20 mr20 mod-Separation-double flex_item" />
          <h1 className="yellow-dark font-bold h3 txt-center">
            <img src="/assets/svg/logo_rmt.svg" alt="RACE MANAGEMENT TOOL" />
          </h1>
          <span className="ml20 mr20 mod-Separation-double flex_item" />
        </div>

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
                    <span className="h2">登録・変更</span>
                    <div className={`${style.Menu_Subtitle} marcellus mt10`}>REGISTER / CHANGE</div>
                  </span>
                </Link>
              </li>
              <li className={style.Menu_Item}>
                <Link to="/users" className={style.Menu_Target}>
                  <span>
                    <span className="h2">番組表</span>
                    <div className={`${style.Menu_Subtitle} marcellus mt10`}>PROGRAM</div>
                  </span>
                </Link>
              </li>
              <li className={style.Menu_Item}>
                <Link to="/users" className={style.Menu_Target}>
                  <span>
                    <span className="h2">スケジュール</span>
                    <div className={`${style.Menu_Subtitle} marcellus mt10`}>SCHEDULE</div>
                  </span>
                </Link>
              </li>

            </ul>
          </div>

          <div>
            <ul className={style.Menu}>
              <li className={style.Menu_Item}>
                <div className={style.Menu_Target}>
                  <span className="pointer">
                    <img src="/assets/svg/ico_print.svg" alt="print" />
                    <div className="mt10 h4 yellow-dark">
                      印刷
                    </div>
                  </span>
                </div>
              </li>
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
