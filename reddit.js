/**
 * Reddit.js Parse Cloud Code module 
 * 
 * @package     module-reddit
 * @author      Ryan Lindbeck
 * @copyright   2014 Ryan Lindbeck
 * @version 1.0.0
 * 
 */
   
   
 /**
 * A simple wrapper for the Reddit API
 *
 * @package reddit
 * @author R.L. <rycharlind@gmail.com>
 * @copyright 2014 R.L. <rycharlind@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
   
   
  
var Reddit = function (id, secret, redirect) {

    var _p = {};
  
    /**
     * The OAuth client id of your registered app
     */
    _p.client_id = id;
  
    /**
     * The corresponding client secret
     */
    _p.client_secret = secret;
  
    /**
     * The OAuth redirect uri
     */
    _p.redirect_uri = redirect;
     
    /**
     * The User's identity info
     */
    _p.identity = {};
  
    /**
     * The OAuth API endpoint
     */
    _p.oauth_endpoint = 'https://oauth.reddit.com/api/v1/';
  
    /**
     * The API endpoint for the SSL authorize requests
     */  
    _p.ssl_auth_endpoint = 'https://ssl.reddit.com/api/v1/authorize';
  
    /**
     * The API endpoint for the SSL access token requests
     */
    _p.ssl_token_endpoint = 'https://ssl.reddit.com/api/v1/access_token';
  
    /**
     * The Request or access token. Used to sign requests
     */
    _p.access_token = null;
  
    /**
     * The corresponding refresh token.  Used to recreate a new access token.
     */
    _p.refresh_token = null;

    /**
     * The User Agent for the API requests (required)
     */
    _p.user_agent = null;
      
    /**
     * Constructs and returns the authorization url 
     *
     * @return string The url
     */
    var authUrl = function (duration, scope, redirect_uri) {
		var url = _p.ssl_auth_endpoint;
        url += '?client_id=' + _p.client_id;
        url += '&response_type=code'
        url += '&state=' + randomString();
        url += '&redirect_uri=' + _p.redirect_uri;
        url += '&duration=' + duration;
        url += '&scope=' + scope.join();
        return url;
    };

    /**
     * Generate a random 5 char string used for the 'state' param in the authUrl 
     *
     * @return String text
     */
    function randomString() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
      
    /**
     * Constructs and returns the HTTP request for the access token
     *
     * @param String code
     *
     * @return Parse.Cloud.httpRequest (extends Promise)
     */
    var requestAccessToken = function (code) {
        return Parse.Cloud.httpRequest({
            method: "POST",
            url: accessTokenUrl(),
            headers: {
                'Content-Type':'application/x-www-form-urlencoded'
            },
            body: {
                'grant_type':'authorization_code',
                'code':code,
                'redirect_uri':_p.redirect_uri
            },
            success: function(httpResponse) {
                console.log('HTTP Response: ' + httpResponse.text)
            },
            error: function(httpResponse) {
                console.log('HTTP Error: ' + httpResponse.status);
            }
        });
    };
      
    /**
     * Constructs and returns the HTTP request for refreshing the access token
     *
     * @param String token
     *
     * @return Parse.Cloud.httpRequest (extends Promise)
     */
    var refreshAccessToken = function (token) {
        console.log(token);
        return Parse.Cloud.httpRequest({
            method: "POST",
            url: accessTokenUrl(),
            headers: {
                'Content-Type':'application/x-www-form-urlencoded'
            },
            body: {
                'grant_type':'refresh_token',
                'refresh_token':token
            },
            success: function(httpResponse) {
                console.log("HTTP Response: " + httpResponse.text);
            },
            error: function(httpResponse) {
                console.log("HTTP Error: " + httpResponse.status);
            }
        });
    };
      
    /**
     * Adds the client id and screte to the access token endpoint
     *
     * @return String url
     */
    function accessTokenUrl() {
        var url = _p.ssl_token_endpoint.substring(8);
        url = 'https://' + _p.client_id + ':' + _p.client_secret + '@' + url;
        return url;
    };
      
    /**
     * Generic Param Getter
     *
     * @param String key
     *
     * @return String param value
     */
    var get = function (key) {
        return _p[key];
    };

    /**
     * Generic Param Setter
     *
     * @param String key
     * @param String value
     *
     * @return String param
     */
    var set = function (key, value) {
        _p[key] = value;
    };
      
    /**
     * Constructs Reddit API request
     *
     * @param String action
     *
     * @return Parse.Cloud.httpRequest (extends Promise)
     *
     * @NOTE:  Access Token must be set
     * @NOTE:  If User Agent is not set - defaults to 'Reddit-PCC-Module by rycharlind'
     */
    var api = function (action) {
        return Parse.Cloud.httpRequest({
            method: "GET",
            url: _p.oauth_endpoint + action + '.json',
            headers: {
                'User-Agent': (_p.user_agent != null) ? _p.user_agent : 'Reddit-PCC-Module by rycharlind',
                'Authorization':'Bearer ' + _p.access_token
            },
            success: function(httpResponse) {
                console.log("HTTP Response: " + httpResponse.text);
            },
            error: function(httpResponse) {
                console.log("HTTP Error: " + httpResponse.status);
            }
        });
    };


      
    return {
        get: get,
        set: set,
        authUrl: authUrl,
        requestAccessToken: requestAccessToken,
        refreshAccessToken: refreshAccessToken,
        api: api
    };
  
};
  
exports.Reddit = Reddit;