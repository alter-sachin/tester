(function(){Spree.fetch_account=function(){return $.ajax({url:Spree.pathFor("account_link"),success:function(c){return $(c).insertBefore("li#search-bar")}})}}).call(this);