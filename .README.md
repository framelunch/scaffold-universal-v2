# RACE MANAGEMENT TOOL

## Motivation

- Universal Javascript環境を使ったWeb Applicationを構築する
- 馬主向けの有料サービスとする

## Important Technology

### Package manager

* [yarn (recommend)](https://yarnpkg.com/)
* [npm](https://www.npmjs.com/)

### Task runner

* [Gulp](http://gulpjs.com/)

### Build tools

#### JavaScript

* [Webpack](https://webpack.github.io/)
    * [hot module replacement](https://github.com/webpack/docs/wiki/hot-module-replacement-with-webpack)
* [babel](https://babeljs.io/)
    * [env](https://github.com/babel/babel-preset-env)

#### CSS

* [PostCSS](http://postcss.org/) 
    * [autoprefixer](https://github.com/postcss/autoprefixer)
    * [css-mqpacker](https://github.com/hail2u/node-css-mqpacker)
    * [postcss-flexbugs-fixes](https://github.com/luisrudge/postcss-flexbugs-fixes)
    * [postcss-nth-child-fix](https://github.com/MattDiMu/postcss-nth-child-fix)

#### html

* [EJS](http://www.embeddedjs.com/)

### Code checker

#### JavaScript

* [ESLint](http://eslint.org/)
    * [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)

#### CSS

* [stylelint](https://stylelint.io/)

## Directory Layout
```text
.
|- /build/                  # yarn run buildコマンドで生成されるコンパイル済みファイル
|- /src
|    |- /api/               # REST API
|    |- /app/               # ReactによるSPAモジュール
|         |- /components      # Reactコンポーネント
|         |- /containers      # Reduxと連携したコンテナ
|         |- /helpers         # ヘルパーモジュール
|         |- /store           # Redux Store関連
|         |- route-config.js  # ルーティング情報
|         |- client.jsx       # クライアントサイドのエントリーポイント
|         |- index.jsx        # アプリケーションルート
|         |- server.jsx       # サーバーサイドのエントリーポイント
|    |- /assets/            # 画像など静的リソース
|    |- /auth/              # 認証系のAPI
|    |- /config             # where we do the bulk of our apps configuration
|         |- /environment/  # configuration specific to the node environment
|         |- /express.js    # setting for express framework
|    |- /helpers/           # ヘルパーモジュール
|    |- /libs/              # オリジナルライブラリ群
|    |- /models/            # mongooseのモデルスキーマ
|    |- /routes/            # サーバーサイドのルーティング設定
|    |- /scripts/           # Javascriptのエントリーディレクトリ
|    |- /styles/            # CSSのエントリーディレクトリ
|    |- /views/             # EJSのエントリーディレクトリ
|    |- favicon.ico
|    |- server.js           # initialize app
|    |- routers.jsx         # URL routing
|    |- robots.txt
|    |- sitemap.xml
|- /node_modules/           # 3rd-party libraries and utilities for nodeJs
|- /tools/                  # ビルドツール関連
|    |- /gulp/              # gulpタスクを記述したjs。タスクごとに1ファイルとする
|    |- /webpack/           # webpackビルド設定
|    |- /config.js          # ビルド関係設定ファイル
|- .babelrc                 # babel設定ファイル
|- .eslintignore            # eslintから除外するファイル
|- .eslintrc                # eslint設定ファイル
|- .gitignore               # git管理対象外を記述
|- .node-version            # ndenv用のバージョン指定
|- .stylelintrc             # stylelint設定ファイル
|- gulpfile.babel.js        # gulp実行ファイル
|- package.json             # The list of 3rd party libraries for nodeJs
|- README.md                # README
|- yarn.lock                # yarn用利用npmsバージョン管理ファイル
```
## Settings
- ProjectのSettingでsrcディレクトリをrootに設定する
- assetは必ず絶対パスで記述する
