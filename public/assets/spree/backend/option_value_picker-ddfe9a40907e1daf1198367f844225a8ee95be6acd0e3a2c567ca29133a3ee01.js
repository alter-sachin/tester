$.fn.optionValueAutocomplete=function(e){"use strict";e=e||{};var t="undefined"==typeof e.multiple||e.multiple,n=e.productSelect;this.select2({minimumInputLength:3,multiple:t,initSelection:function(e,n){$.get(Spree.routes.option_value_search,{ids:e.val().split(","),token:Spree.api_key},function(e){n(t?e:e[0])})},ajax:{url:Spree.routes.option_value_search,datatype:"json",data:function(e){var t="undefined"!=typeof n?$(n).select2("val"):null;return{q:{name_cont:e,variants_product_id_eq:t},token:Spree.api_key}},results:function(e){return{results:e}}},formatResult:function(e){return e.name},formatSelection:function(e){return e.name}})};