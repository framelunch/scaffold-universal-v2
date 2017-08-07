FORMAT: 1A

# Data Structure

## User
+ _id: 5778bb42a87cf16c4a1a3c2f
+ id: `abcde (string required)`
+ name: `ikeda (string required)`
+ email: `ikeda@framelunch.jp (string)`
+ role: `user (user or admin)`
+ createAt: `2016-07-10T06:45:00.000Z`
+ updateAt: `2016-07-10T06:45:00.000Z`


# Group About API

## Login token

認証が必要なAPIの呼び出しには、ログイン時に取得できるトークン情報を使用します。  
リクエストヘッダに以下の情報を追加。

```
Content-Type : application/json  
Authorization : Bearer eyJ0eXAiOiJ....  
```

またはGETリクエストのパラメータに以下の情報を追加。 

```
?access_token=eyJ0eXAiOiJ....
```

認証のレベルは以下の2種類です。

role | note
--- | ---
user | ユーザーとしてログインする必要があります
admin | Adminユーザーとしてログインする必要があります

## Query

複数のデータがレスポンスされるAPIに対してGET Requestを行う場合、  
URLに検索クエリを付与することが可能です。例えば以下のような形式です。

```
/api/races?query={name:'七夕賞'}
```

クエリはMongoDBで使用可能なクエリパターンを  
JSON形式にて指定する形で利用してください。

実際にAPIをコールする場合、JSON部分はencodeUIComponentでエンコードする必要があります。  
MongoDBで使用可能なクエリは以下を参考にしてください。  

https://docs.mongodb.com/manual/reference/operator/query/

以下にサンプルを示します。

### 最大軒数100件の2ページ目

```
?query={limit:100, skip:100}
```

### レスポンスに必要なフィールドを指定する

```
?query={select:{name:1, datetime:1}}
```
    
### 昇順、降順のソート

```    
?query={sort: {datetime:1}} //昇順
?query={sort: {datetime:-1}} //降順
```
    
### 日付範囲を指定した検索
    
```    
?query={
    datetime: {
       '$gte': '2016-08-09T15:00:00.000Z', 
       '$lt': '2016-09-09T15:00:00.000Z'
    }
}
```
# Group AUTH  /auth/
認証に関するAPIです。  
Mail&Password, Facebook, Twitter, Googleに対応  
Appからの認証の場合は、WebViewを利用してログインを行います。  
コールバック後にレスポンスされるトークン情報をAPIコールに使用します。  

## Local Auth [POST /auth/local/]
メールアドレスとパスワードによるユーザー認証を行います。  
成功するとトークンがレスポンスされます。
+ Request Auth User (application/json)
    + Attributes
        + email: admin@admin.com
        + password: adminadmin                
+ Response 200 (application/json)    
    + Attributes
        + token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmYxMWQ5MjdhNjIzOWJhODFhNzc2NDQiLCJpYXQiOjE0NTg2NDIzMjIsImV4cCI6MTQ1ODY2MDMyMn0.VZ9eDe4vLBGVTaSsCCSil1osJJXrmd0-C1enEZCwRk8
+ Response 401 (application/json)
    Unauthorized
+ Response 404 (application/json)
    + Attributes
        + message: Something went wrong. please try again.

# Group USERS  /api/users/
ユーザー情報に関するAPIです

## Get users --admin [GET /api/users/] 
ユーザー情報一覧を取得。

+ Response
    + header
    Content-Type : application/json
    Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmYxMWQ5MjdhNjIzOWJhODFhNzc2NDQiLCJpYXQiOjE0NTg2NDIzMjIsImV4cCI6MTQ1ODY2MDMyMn0.VZ9eDe4vLBGVTaSsCCSil1osJJXrmd0-C1enEZCwRk8
    + Attributes (array[User])

## Create user [POST /api/users/]
ユーザーを作成。
ユーザー作成後にアクティベートのためのURLを記載したメールが送信。
メールのURLからアクティベートを行います。

+ Request (application/json)
    + Attributes
        + displayName: frame lunch (required)
        + email: frame@framelunch.jp (required)
        + password: asdfghjkl (required)

## Activate user [GET /api/users/activate/{?access_token}]
トークンを用いて新規ユーザーのアクティベートを行います。
+ Parameters
    + access_token: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmYxMWQ5MjdhNjIzOWJhODFhNzc2NDQiLCJpYXQiOjE0NTg2NDIzMjIsImV4cCI6MTQ1ODY2MDMyMn0.VZ9eDe4vLBGVTaSsCCSil1osJJXrmd0-C1enEZCwRk8

## Get myself [GET /api/users/me]
ログイン中のユーザーの情報を取得。

+ Request
    + header
    Content-Type : application/json
    Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmYxMWQ5MjdhNjIzOWJhODFhNzc2NDQiLCJpYXQiOjE0NTg2NDIzMjIsImV4cCI6MTQ1ODY2MDMyMn0.VZ9eDe4vLBGVTaSsCCSil1osJJXrmd0-C1enEZCwRk8
+ Response (application/json)
    + Attributes (User) 

## Update user --user [PUT /api/users/me]
ログイン中のユーザーの情報を変更する  

+ Request (application/json)
    + header
    Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmYxMWQ5MjdhNjIzOWJhODFhNzc2NDQiLCJpYXQiOjE0NTg2NDIzMjIsImV4cCI6MTQ1ODY2MDMyMn0.VZ9eDe4vLBGVTaSsCCSil1osJJXrmd0-C1enEZCwRk8
    + Attributes
        + name: hihin（必須） (required)
        + status: 絶好調
        + profile: 最高の予想を出すのに筋トレしてます
        + twitter.isAutoPost: true

## Change my password [PUT /api/users/me/pwd-change] 
ログイン中のユーザーのパスワードを変更。
+ Request
    + header
    Content-Type : application/json
    Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmYxMWQ5MjdhNjIzOWJhODFhNzc2NDQiLCJpYXQiOjE0NTg2NDIzMjIsImV4cCI6MTQ1ODY2MDMyMn0.VZ9eDe4vLBGVTaSsCCSil1osJJXrmd0-C1enEZCwRk8
    + Attributes
        + oldPassword: asdfghjkl (required)
        + newPassword: bsdfghjkl (required)  
        
## Change my email [PUT /api/users/me/email-change] 
ログイン中のユーザーのEメールを変更。
+ Request
    + header
    Content-Type : application/json
    Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmYxMWQ5MjdhNjIzOWJhODFhNzc2NDQiLCJpYXQiOjE0NTg2NDIzMjIsImV4cCI6MTQ1ODY2MDMyMn0.VZ9eDe4vLBGVTaSsCCSil1osJJXrmd0-C1enEZCwRk8
    + Attributes
        + email: test@hihin.jp (required)          
            
## Delete user --user [DELETE /api/users/me]
Userを削除

+ Parameters
    + id: 5778bb42a87cf16c4a1a3c2f
+ Request (application/json)
    + header
    Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmYxMWQ5MjdhNjIzOWJhODFhNzc2NDQiLCJpYXQiOjE0NTg2NDIzMjIsImV4cCI6MTQ1ODY2MDMyMn0.VZ9eDe4vLBGVTaSsCCSil1osJJXrmd0-C1enEZCwRk8        

## Forgot my password [POST /api/users/pwd-forgot]
パスワードリセットのためのアクティベーションメールを送信。

+ Request (application/json)
    + Attributes
        + email: frame@framelunch.jp (required)

## Reset my password [POST /api/users/pwd-reset]
+ Request
    + header
    Content-Type : application/json
    Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmYxMWQ5MjdhNjIzOWJhODFhNzc2NDQiLCJpYXQiOjE0NTg2NDIzMjIsImV4cCI6MTQ1ODY2MDMyMn0.VZ9eDe4vLBGVTaSsCCSil1osJJXrmd0-C1enEZCwRk8
    + Attributes
        + newPassword: asdfghjkl (required)

## Get user detail [GET /api/users/{id}]
ユーザー詳細情報を一件取得。

+ Parameters
    + id: 5778bb42a87cf16c4a1a3c2f
+ Response 200 (application/json)
    + Attributes (User)
    
## Get user ranking [GET /api/users/{id}/ranking]
ユーザー詳細情報を一件取得。

+ Parameters
    + id: 5778bb42a87cf16c4a1a3c2f
+ Response 200 (application/json)
    + Attributes (array[PersonalRanking])

## Get user result [GET /api/users/{id}/result]
ユーザーの週ごとのレース結果集計データを取得
*まだ実装してません

+ Parameters
    + id: 5778bb42a87cf16c4a1a3c2f
+ Response 200 (application/json)
    + Attributes (array[Result])    

## Get user count [GET /api/users/count]
Userの総数を取得

+ Response 200 (application/json)
    + Attributes
        + count: 10 (number)     
            
## Vote user --user [PUT /api/users/{id}/vote]
Voteを更新。

+ Parameters
    + id: 5778bb42a87cf16c4a1a3c2f
    
+ Request (application/json)
    + header
    Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmYxMWQ5MjdhNjIzOWJhODFhNzc2NDQiLCJpYXQiOjE0NTg2NDIzMjIsImV4cCI6MTQ1ODY2MDMyMn0.VZ9eDe4vLBGVTaSsCCSil1osJJXrmd0-C1enEZCwRk8

+ Response 200 (application/json)
    + Attributes
        + count: 10 (number)    
          
## Follow user --user [PUT /api/users/{id}/follow]
コールしたユーザーをFollowerとして登録する

+ Parameters
    + id: 5778bb42a87cf16c4a1a3c2f
    
+ Request (application/json)
    + header
    Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmYxMWQ5MjdhNjIzOWJhODFhNzc2NDQiLCJpYXQiOjE0NTg2NDIzMjIsImV4cCI6MTQ1ODY2MDMyMn0.VZ9eDe4vLBGVTaSsCCSil1osJJXrmd0-C1enEZCwRk8

+ Response 200 (application/json)
    + Attributes
        + count: 10 (number)    
