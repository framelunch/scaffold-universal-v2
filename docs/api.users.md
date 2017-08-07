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
