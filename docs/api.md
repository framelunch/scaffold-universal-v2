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