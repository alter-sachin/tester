"use strict";var set_taxon_select=function(e){function t(e){return Select2.util.escapeMarkup(e.pretty_name)}$(e).length>0&&$(e).select2({placeholder:Spree.translations.taxon_placeholder,multiple:!0,initSelection:function(e,t){var n=Spree.url(Spree.routes.taxons_search,{ids:e.val(),without_children:!0,token:Spree.api_key});return $.getJSON(n,null,function(e){return t(e.taxons)})},ajax:{url:Spree.routes.taxons_search,datatype:"json",data:function(e,t){return{per_page:50,page:t,without_children:!0,q:{name_cont:e},token:Spree.api_key}},results:function(e,t){var n=t<e.pages;return{results:e.taxons,more:n}}},formatResult:t,formatSelection:t})};$(document).ready(function(){set_taxon_select("#product_taxon_ids")});