Reddit-PCC-Module
=================

Reddit API Module for Parse Cloud Code

## Getting Started
1. Add the 'Reddit.js' file to your cloud directory. 
2. Add the following two lines of code to your 'Main.js' file.

```
var Reddit = require('cloud/reddit.js').Reddit;
var reddit = new Reddit('YOUR-CLIENT-ID', 'YOUR-CLIENT-SECRET', 'YOUR-CALLBACK-URL');
```
