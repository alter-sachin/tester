(function(){var e,t,n,i;$(document).ready(function(){return $("a.edit-line-item").click(i),$("a.cancel-line-item").click(i),$("a.save-line-item").click(function(){var t,n,i;return i=$(this),t=i.data("line-item-id"),n=parseInt(i.parents("tr").find("input.line_item_quantity").val()),toggleItemEdit(),e(t,n),!1}),$("a.delete-line-item").click(function(){var e,n;if(confirm(Spree.translations.are_you_sure_delete))return e=$(this),n=e.data("line-item-id"),toggleItemEdit(),t(n)})}),i=function(){var e;return e=$(this),e.parent().find("a.edit-line-item").toggle(),e.parent().find("a.cancel-line-item").toggle(),e.parent().find("a.save-line-item").toggle(),e.parent().find("a.delete-line-item").toggle(),e.parents("tr").find("td.line-item-qty-show").toggle(),e.parents("tr").find("td.line-item-qty-edit").toggle(),!1},n=function(e){var t;return t=Spree.routes.orders_api+"/"+order_number+"/line_items/"+e+".json"},e=function(e,t){var i;return i=n(e),$.ajax({type:"PUT",url:Spree.url(i),data:{line_item:{quantity:t},token:Spree.api_key}}).done(function(){return window.Spree.advanceOrder()})},t=function(e){var t;return t=n(e),$.ajax({type:"DELETE",url:Spree.url(t),data:{token:Spree.api_key}}).done(function(){return $("#line-item-"+e).remove(),0===$(".line-items tr.line-item").length&&$(".line-items").remove(),window.Spree.advanceOrder()})}}).call(this);