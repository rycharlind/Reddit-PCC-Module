Reddit-PCC-Module
=================

Reddit API Module for Parse Cloud Code

## Getting Started
1. Add `reddit.js` to your cloud directory. 
2. Add the following two lines of code near the top of `app.js`.

```
var Reddit = require('cloud/reddit.js').Reddit;
var reddit = new Reddit('YOUR-CLIENT-ID', 'YOUR-CLIENT-SECRET', 'YOUR-CALLBACK-URL');
```

## References

#### Parse Dynamic Express App Hosting Guide
https://www.parse.com/docs/hosting_guide

#### Reddit API OAuth Guide
https://github.com/reddit/reddit/wiki/OAuth2

## How To Examples
####Note:  
These examples are intended to work with a Parse Express App.  See reference above for more info how to set up. 


### OAuth Flow

#### Step 1 - OAuth Request
Retrieve the OAuth request url and redirect the user to that location. 
**authUrl
- @Param: String - duration
- @Param: Array(String) - scope 
```
app.get('/auth_request', function(req, res) {
    res.redirect(reddit.authUrl('permanent', ['identity','read','vote','submit']));
});
```

#### Step 2 - OAuth Callback
After the user has clicked allow, reddit will post back to the specifid callback url with a code that you will use to request an access token.  In this exmaple, we will persist the access token to a Parse table called `Reddit-User` once we receive it.
**requestAccessToken
- @Param: String code
```
app.get('/auth_callback', function(req, res) {
    var Reddit_User = Parse.Object.extend("Reddit_User");
    reddit.requestAccessToken(req.query.code).then(function(resp) {
        reddit.set('access_token', resp.data.access_token);
        reddit.set('refresh_token', resp.data.refresh_token);
        return reddit.api('me');
    }).then(function(response) {
        reddit.set('identity', response.data);
        var query = new Parse.Query(Reddit_User);
        query.equalTo("name", reddit.get('identity').name);
        return query.find();
    }).then(function(results) {
        var user;
        if(results.length) {
            user = results[0];
        } else {
            user = new Reddit_User();
            user.set("name", reddit.get('identity').name)
        }
        user.set("access_token", reddit.get('access_token'));
        user.set("refresh_token", reddit.get('refresh_token'));
        return user.save();
    }).then(function(user) {
        res.render('user', { 
            user: user.get('name'),
            access_token: user.get('access_token'),
            refresh_token: user.get('refresh_token') 
        });
    });
});
```

#### Step 3 - API Request
Once you have the access token, you can now use that to make API requests.  The below example takes a param of username that we stored in the database.  We first find the user so we can grab their corresponding access token and make the request.  We then render the reponse text to the page.  
```
app.get('/api', function(req, res) {
    findUser(req.query.name).then(function(results) {
        var user = results[0];
        reddit.set('access_token', user.get('access_token'));
        return reddit.api(req.query.action);
    }).then(function(response) {
        res.render('response', { response: response.text });
    });
});

function findUser(name) {
    var Reddit_User = Parse.Object.extend("Reddit_User");
    var query = new Parse.Query(Reddit_User);
    query.equalTo("name", name);
    return query.find();
}
```
