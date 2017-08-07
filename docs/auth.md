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
