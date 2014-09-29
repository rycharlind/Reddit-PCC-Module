Reddit-PCC-Module
=================

Reddit API Module for Parse Cloud Code

## Getting Started
1. Add `reddit.js` to your cloud directory. 
2. Add the following two lines of code near the top of your `app.js`.

```
var Reddit = require('cloud/reddit.js').Reddit;
var reddit = new Reddit('YOUR-CLIENT-ID', 'YOUR-CLIENT-SECRET', 'YOUR-CALLBACK-URL');
```

## Examples
####Note:  
These examples are intended to work with a Parse Express App.  You can follow the below tutorial to set up your app.
https://www.parse.com/docs/hosting_guide

### OAuth Flow
