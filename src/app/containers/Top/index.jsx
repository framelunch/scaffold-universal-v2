// @flow
import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import style from './top.css';

const Top = () => (
  <div className="mod-Container">
    <Helmet>
      <title>Top | RMT</title>
      <meta name="description" content="Top page" />
      <meta name="keywords" content="test,test,aaa" />
      <meta property="og:title" content="TOP | RMT" />
      <meta property="og:description" content="Top page" />
    </Helmet>

    <div className={style.SignIn}>
      <h1 className="h1 mt20">TOP PAGE</h1>
      <div className="mt20 mb20">
        <p>top page aaaa</p>
        <p>top page</p>
      </div>
    </div>
  </div>
);

function mapStateToProps(): any {
  return {};
}

export default connect(mapStateToProps)(Top);
