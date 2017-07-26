// @flow
import React from 'react';
import { connect } from 'react-redux';
import style from './top.css';

const Top = () => (
  <div className="mod-Container">
    <div className={style.SignIn}>
      <h1 className="h1 mt20">TOP PAGE</h1>
      <div className="mt20 mb20">
        <p>top page</p>
        <p>top page</p>
      </div>
    </div>
  </div>
);

function mapStateToProps(): any {
  return {};
}

export default connect(mapStateToProps)(Top);
