var request = require('request'),
  jsdom = require("jsdom")
  
request({uri: 'http://www.spotrac.com/top-salaries/mlb/total/atlanta-braves/'}, function(err, response, body){
  var self = this;
  self.items = new Array();//I feel like I want to save my results in an array
  
  jsdom.env("http://espn.go.com/mlb/team/salaries/_/name/wsh/washington-nationals", ['http://code.jquery.com/jquery-1.7.1.min.js'], function(errors, window){
    for (var i = 1; i < 26; i++) {
      var base = window.$('.mod-content tr').eq(i)//.text()
      //console.log(base)
      
      for (var p = 1; p<2;p++) {
        var name = window.$('td', base).eq(p).text();
        var dollar = window.$('td', base).eq(p + 1).text().replace(/,/g, "");
        console.log('"' + name + '" : { "position" : "", "salary"  : ' + dollar + ' },')
      }
    }  

  })
});