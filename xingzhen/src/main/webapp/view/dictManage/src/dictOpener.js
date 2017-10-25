/**
 * Created by Miya on 2017/8/22.
 */
define(['underscore',
    'text!/view/dictManage/tpl/dictOpenerAdd.html',
    '../dat/dictManage.js'],function(_,dictOpenerAddTpl,dictManageAjax){
    return {
        openChooseDict:function (obj,dictVal,title) {
            _selfDict = this;
            var dictVal = obj.attr("dict-value");
            var title = obj.attr("title");
            
            window.newwin=$open('#dict-block',{width:400,height:300,top:100, title:'选择'+title});
            _selfDict.getDictListByParentKey(dictVal);
            var opener = $(".panel #dict-block");
            opener.find("#dict-wrap").attr('dictVal',dictVal);
            opener.find("#dict-wrap").off("click").on("click","div",function(){
                var input = obj.prev();//页面上需要填入的input
                input.val($(this).find("span").text());
                opener.$close();
            });

            $("#add-dict-btn").off("click").on('click',function(){
                $open('#addReason-block',{width:400,height:330,top:100, title:'新增'+title});
                $(".addReason-container").empty().html(_.template(dictOpenerAddTpl));

                var addReasonForm = $('#add-reason-form');
                dictManageAjax.getDictListByParentKey({key:dictVal},function(r) {
                    if (r.flag == 1) {
                        addReasonForm.find("#value").val("");
                        addReasonForm.find("#remarkReason").val("");
                        addReasonForm.find("#key").val(r.data.length+1);
                        if(dictVal == "YCSY"){
                            addReasonForm.find("#sort").val(r.data.length);
                        }else {
                            addReasonForm.find("#sort").val(r.data.length+1);
                        }
                    }
                });
                $("#save-reason-btn").off("click").on('click',function(){
                    addReasonForm.find('.validate').validatebox();
                    if(addReasonForm.find('.validatebox-invalid').length>0){
                        return false;
                    }
                    var param = addReasonForm.serializeObject();
                    $.extend(param, {
                        root: dictVal,
                        parentKey: dictVal,
                        remark: $.trim($("#remarkReason").val()),
                        dicLevel:1
                    });
                    dictManageAjax.addDict(param, function (r) {
                        if (r.flag == 1) {
                            toast('保存成功！', 600, function () {
                                $('#addReason-block').$close();
                                _selfDict.getDictListByParentKey(dictVal);
                            }).ok();
                        } else {
                            toast(r.msg, 600).err()
                        }
                    });
                });

                $("#cancel-reason-btn").off("click").on('click',function(){
                    $('#addReason-block').$close();
                });
            });
        },
        getDictListByParentKey: function (key) {
            _selfDict = this;
            dictManageAjax.getDictListByParentKey({key:key},function(r) {
                if (r.flag == 1) {
                    var target = $("#dict-wrap");
                    var tpl='';
                    $.each(r.data, function (i, o) {
                        tpl+='<div><u><span val="'+o.key+'">'+o.value+'</span><a class="delete-for icon-remove-btn" style="float: right" id="'+o.id+'" dictValue="'+o.value+'"  title="删除"></a></div></u>';
                    });
                    target.html(tpl);
                    
                    $("#dict-wrap .delete-for").off("click").on('click',function(){
                		var id=$(this).attr('id');
                		var val=$(this).attr('dictValue');
                		var parentkey = $("#dict-wrap").attr('dictVal');
                		$confirm('确认删除【'+val+'】字典？',function(bol) {
                			if(bol){
                				dictManageAjax.delDictById(id,parentkey,function(r){
                					 if (r.flag == 1) {
                						 _selfDict.getDictListByParentKey($("#dict-wrap").attr('dictVal'));
                					 }else{
                						 toast(r.msg, 600).err()
                					 }
                				});
                			}
                		});
                	});
                }
            });
        },
        openUserChoosePort:function (obj) {
            _selfDict = this;
            var title = obj.attr("title");
            window.newwin=$open('#dict-block',{width:400,height:300,top:100, title:'选择'+title});
            _selfDict.getUserPortList();
            var opener = $(".panel #dict-block");
            opener.find("#dict-wrap").off("click").on("click",".item-value",function(){
                var input = obj.prev();//页面上需要填入的input
                input.val($(this).find("span").text());
                if($("#jsrLxfs").length > 0){
                    $("#jsrLxfs").val($(this).find("span").attr("phone"));
                }
                opener.$close();
            });

        },
        getUserPortList:function () {
            _selfDict = this;
            var tpl='';
            var target = $("#dict-wrap");
            $post(top.servicePath + '/sys/user/getUserInfoListByOrgId',{orgId: top.orgId},function(r) {
                if (r.flag == 1) {
                    $.each(r.data, function (i, o) {
                        tpl+='<div class="item-value"><u><span val="'+o.userId+'" phone="'+o.phone+'">'+o.userName+","+o.orgName+'</span></div></u>';
                    });
                    target.html(tpl);
                }
            },true);

            // $('body').on('click','.scub-ztree-search .icon-seek',function () {//点击搜索按钮
            //     // seekTreeData();
            // }).on('keyup','#scub-seek',function () {//输入触发搜索
            //     $post(top.servicePath + '/sys/user/getUserInfoListByOrgId',{userName: $.trim($("#scub-seek").val())},function(r) {
            //         if (r.flag == 1) {
            //             $.each(r.data, function (i, o) {
            //                 tpl+='<div class="item-value"><u><span val="'+o.userId+'" phone="'+o.phone+'">'+o.userName+","+o.orgName+'</span></div></u>';
            //             });
            //             target.html(tpl);
            //         }
            //     },true);
            // });
        },

        openUnitChoosePort:function (obj) {
            _selfDict = this;
            var title = obj.attr("title");
            window.newwin=$open('#dict-block',{width:400,height:300,top:100, title:'选择'+title});
            _selfDict.getUnitPortList();
            var opener = $(".panel #dict-block");
            opener.find("#dict-wrap").off("click").on("click",".item-value",function(){
                var input = obj.prev();//页面上需要填入的input
                input.val($(this).find("span").text());
                opener.$close();
            });

        },
        getUnitPortList:function () {
            _selfDict = this;
            $post(top.servicePath + '/sys/org/getOrgTreeList',{},function(r) {
                if (r.flag == 1) {
                    var target = $("#dict-wrap");
                    var tpl='';
                    $.each(r.data, function (i, o) {
                        tpl+='<div class="item-value"><u><span val="'+o.orgId+'">'+o.orgName+'</span></div></u>';
                    });
                    target.html(tpl);
                }
            },true);
        },
        // openChoosePort:function (obj,portAddress) {
        //     _selfDict = this;
        //     var title = obj.attr("title");
        //     window.newwin=$open('#dict-block',{width:400,height:300,top:100, title:'选择'+title});
        //     _selfDict.getPortList(portAddress);
        //     var opener = $(".panel #dict-block");
        //     opener.find("#dict-wrap").attr('dictVal',dictVal);
        //     opener.find("#dict-wrap").off("click").on("click","div",function(){
        //         var input = obj.prev();//页面上需要填入的input
        //         input.val($(this).find("span").text());
        //         opener.$close();
        //     });
        //
        // },
        // getPortList:function (portAddress) {
        //     _selfDict = this;
        //     $post(portAddress,{orgId: top.orgId},function(response) {
        //         callback(response);
        //     },true);
        // },
        closeOpenerDiv: function () {
            _selfDict = this;
            $(".panel.window").each(function (i,e) {
                if(!$(e).is(":visible")){
                    $(e).remove();
                }
            });
        }
    }
});