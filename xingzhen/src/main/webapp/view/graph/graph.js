$.ajaxSetup({
    beforeSend:showLoading,
    complete:hideLoading
});
// require(['src/graph.js'],function(graph){
//     var groupid = $("#mapSvgFrame",parent.document).attr("groupid");
//     graph.showList(groupid,"pgroupid");
//
// });
require(['src/graphLayout.js'],function(graphLayout){
    var groupid = $("#mapSvgFrame",parent.document).attr("groupid");
    graphLayout.showList(groupid,"pgroupid");

});