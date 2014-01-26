;(function($){
    //全局函数
    var $ld = $("#loading");
    var $msg = $("#msg");
    //var _api = "http://caster2014.herokuapp.com/";
    var _api = "http://127.0.0.1:3000/";
    var _d = new Date();
    var _year = _d.getFullYear();
    var _month = _d.getMonth()+1;
    var _day = _d.getDate();
    var _week = _d.getDay();
    var _today = _year+"-"+_month+"-"+_day;
    var _ls = window.localStorage;
    //页面切换
    $(".page-link").live("tap", function() {
        var $s = $(this);
        var p = $s.data("pg");
        if (p) {
            changePage(p);
            switch(p) {
                case "home":
                    var api = _api+"api/venues";
                    var $dom = $("#home .ll ul");
                    if (!$dom.html()) {
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            url: api,
                            beforeSend: function() {
                                goLoading(200, "数据加载中，请稍候…");
                            },
                            success: function(data) {
                                endLoading(100);
                                var htm = "";
                                var d = data.venues;
                                var len = d.length;
                                var i;
                                for (i=0; i<len; i++) {
                                    var venue = d[i].venue;
                                    htm += '<li class="page-link" data-pg="subjects" data-id="'+venue.id+'" data-date="'+_today+'"><div><img src="'+venue.img_url+'" /><span>'+venue.name+'</span></div></li>';
                                }
                                $dom.html(htm);
                            },
                            error: function() {
                                showError("数据加载错误！",false,true);
                            }
                        });
                    }
                    $(".nav .n-k").addClass("active").siblings().removeClass("active");
                break;
                case "subjects":
                    var id = $s.data("id");
                    var today = $s.data("date");
                    var api = _api+"api/lessons?venue_id="+id+"&lessondate="+today;
                    if (id) {
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            url: api,
                            beforeSend: function() {
                                goLoading(200, "正在加载课程，请稍候…");
                            },
                            success: function(data) {
                                endLoading(100);
                                var i,j,k,z;
                                var week1 = "";
                                var week2 = "";
                                var list1 = "";
                                var list2 = "";
                                var week = new Array("日", "一", "二", "三", "四", "五", "六");
                                for (i=0; i<7; i++) {
                                    var d = data.lessons[i];
                                    week1 += '<li class="';
                                    if (i==0) {
                                        week1 += 'sj-sunday';
                                    }
                                    if (i == _week) {
                                        week1 += ' cur';
                                    }
                                    week1 += '"><span>'+week[i]+'</span></li>';
                                    list1 += '<ul';
                                    if (i == _week) {
                                        list1 += ' class="show"';
                                    }
                                    list1 += '>';
                                    var lesson = d.lessons;
                                    var ll = lesson.length;
                                    for (k=0; k<ll; k++) {
                                        list1 += '<li>';
                                        list1 += '<div class="sj-l-time">'+lesson[k].starting_time+' - '+lesson[k].ending_time+'</div>';
                                        list1 += '<div class="sj-l-img page-link" data-pg="subject" data-parent="'+id+'" data-id="'+lesson[k].id+'"><img src="'+lesson[k].teacher.img_url+'" /></div>';
                                        list1 += '<div class="sj-l-btn">';
                                        if (lesson[k].state=="预订"){
                                            list1 += '<span class="sj-btn sj-o page-link" data-pg="seat" data-lesson="'+lesson[k].name+'" data-time="'+lesson[k].starting_time+'至'+lesson[k].ending_time+'" data-room="'+lesson[k].room.name+'" data-parent="'+id+'" data-id="'+lesson[k].id+'">'+lesson[k].state+'</span>';
                                        } else {
                                            list1 += '<span class="sj-btn sj-f">'+lesson[k].state+'</span>';
                                        }
                                        list1 += '</div>';
                                        list1 += '<div class="sj-l-info page-link" data-pg="subject" data-parent="'+id+'" data-id="'+lesson[k].course.id+'">';
                                        list1 += '<h3>'+lesson[k].name+'</h3>';
                                        list1 += '<span class="sj-p">'+lesson[k].room.name+'</span>';
                                        list1 += '<span class="sj-t">'+lesson[k].teacher.name+'</span>';
                                        list1 += '</div>';
                                        list1 += '</li>';
                                    }
                                    list1 += '</ul>';
                                }
                                for (j=0; j<7; j++) {
                                    var d = data.lessons[j+7];
                                    week2 += '<li class="';
                                    if (j == 0) {
                                        week2 += 'sj-sunday';
                                    }
                                    if (j == 1) {
                                        week2 += ' cur';
                                    }
                                    week2 += '"><span>'+week[j]+'</span></li>';
                                    list2 += '<ul';
                                    if (j == 1) {
                                        list2 += ' class="show"';
                                    }
                                    list2 += '>';
                                    var lesson = d.lessons;
                                    var ll = lesson.length;
                                    for (z=0; z<ll; z++) {
                                        list2 += '<li>';
                                        list2 += '<div class="sj-l-time">'+lesson[z].starting_time+' - '+lesson[z].ending_time+'</div>';
                                        list2 += '<div class="sj-l-img page-link" data-pg="subject" data-parent="'+id+'" data-id="'+lesson[z].id+'"><img src="'+lesson[z].teacher.img_url+'" /></div>';
                                        list2 += '<div class="sj-l-btn">';
                                        if (lesson[z].state=="预订"){
                                            list2 += '<span class="sj-btn sj-o page-link" data-pg="seat" data-lesson="'+lesson[z].name+'" data-time="'+lesson[z].starting_time+'至'+lesson[z].ending_time+'" data-room="'+lesson[z].room.name+'" data-parent="'+id+'" data-id="'+lesson[z].id+'">'+lesson[z].state+'</span>';
                                        } else {
                                            list2 += '<span class="sj-btn sj-f">'+lesson[z].state+'</span>';
                                        }
                                        list2 += '</div>';
                                        list2 += '<div class="sj-l-info page-link" data-pg="subject" data-parent="'+id+'" data-id="'+lesson[z].course.id+'">';
                                        list2 += '<h3>'+lesson[z].name+'</h3>';
                                        list2 += '<span class="sj-p">'+lesson[z].room.name+'</span>';
                                        list2 += '<span class="sj-t">'+lesson[z].teacher.name+'</span>';
                                        list2 += '</div>';
                                        list2 += '</li>';
                                    }
                                    list2 += '</ul>';
                                }
                                var $week1 = $(".sj-tabs").first();
                                var $week2 = $(".sj-tabs").last();
                                $week1.children(".sj-weeks").children("ul").html(week1);
                                $week1.children(".sj-list").html(list1);
                                $week2.children(".sj-weeks").children("ul").html(week2);
                                $week2.children(".sj-list").html(list2);
                            },
                            error: function() {
                                showError("数据加载错误！",false,true);
                            }
                        });
                    }
                    $(".nav .n-k").addClass("active").siblings().removeClass("active");
                break;
                case "subject":
                    var id = $s.data("id");
                    var parent = $s.data("parent");
                    var api = _api+"api/lessons/"+id;
                    if (id) {
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            url: api,
                            beforeSend: function() {
                                goLoading(200, "正在加载，请稍候…");
                            },
                            success: function(data) {
                                endLoading(100);
                                var d = data.lesson;
                                var htm = "";
                                htm += '<h3 class="sj-title">'+d.course.name+'</h3>';
                                htm += '<div class="sj-meta">';
                                htm += '<span class="sj-meta-time">'+d.starting_time+' 至 '+d.ending_time+'</span>';
                                htm += '<span class="sj-meta-local">'+d.room.name+'</span>';
                                htm += '</div>';
                                htm += '<div class="sj-teacher">';
                                htm += '<div class="sj-teacher-info page-link" data-pg="teacher" data-parent="'+id+'" data-id="'+d.teacher.id+'">';
                                htm += '<img src="'+d.teacher.img_url+'" />';
                                htm += '<p>'+d.teacher.description+'</p>';
                                htm += '</div>';
                                htm += '<div class="sj-teacher-meta">';
                                htm += '<span class="sj-teacher-name">'+d.teacher.name+'</span>';
                                htm += '<span class="sj-teacher-go"></span>';
                                htm += '<span class="sj-teacher-t">本节课程为代课老师</span>';
                                htm += '</div>';
                                htm += '</div>';
                                htm += '<div class="sj-info">';
                                htm += '<h3>课程介绍</h3>';
                                htm += '<div class="sj-info-txt">'+d.course.description+'</div>';
                                htm += '<div class="sj-info-more">查询所有课程</div>';
                                htm += '<div class="sj-seat">';
                                htm += '<span class="y-btn sj-seat-select">选择座位</span>';
                                htm += '</div>';
                                $("#subject>.sj").html(htm);
                            },
                            error: function() {
                                showError("数据加载错误！",false,true);
                            }
                        });
                        var $back = $("#subject_hd>.back");
                        $back.addClass("page-link");
                        $back.attr({"data-id":parent, "data-pg":"subjects", "data-date":_today});
                    }
                break;
                case "seat":
                    checkUser();
                    var id = $s.data("id");
                    var parent = $s.data("parent");
                    var lesson = $s.data("lesson");
                    var tm = $s.data("time");
                    var room = $s.data("room");
                    var api = _api+"api/lesson_seats?lesson_id="+id;
                    if (id) {
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            url: api,
                            beforeSend: function() {
                                goLoading(200, "正在加载座位信息…");
                            },
                            success: function(data) {
                                endLoading(100);
                                //var d = data[0].lesson_seat;
                                
                            },
                            error: function() {
                                showError("数据加载错误！",false,true);
                            }
                        });
                    }
                    $(".seat>.sj-title").html(lesson);
                    $(".seat>.sj-meta>.sj-meta-time").html(tm);
                    $(".seat>.sj-meta>.sj-meta-local").html(room);
                    $(".seats-submit>span").attr("data-id",id);
                    var $back = $("#seat_hd>.back");
                    $back.addClass("page-link");
                    $back.attr({"data-id":parent, "data-pg":"subjects", "data-date":_today});
                break;
                case "orders":
                    checkUser();
                    var api = _api+"api/orders?user_id="+_ls.user_id;
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: api,
                        beforeSend: function() {
                            goLoading(200, "正在加载订单，请稍候…");
                        },
                        success: function(data) {
                            endLoading(100);
                            var htm = "";
                            var l = data.length;
                            var i;
                            for(i=0; i<l; i++) {
                                htm += '<li class="page-link" data-pg="order" data-id="'+data[i].id+'"><span class="item-l-arrow"></span>'+data[i].name+'</li>';
                            }
                            $("#orders>.item-list").html(htm);
                        },
                        error: function() {
                            showError("数据加载错误！",false,true);
                        }
                    });
                break;
                case "order":
                    var id = $s.data("id");
                    var api = _api+"api/orders/"+id;
                    if (id) {
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            url: api,
                            beforeSend: function() {
                                goLoading(200, "正在加载订单…");
                            },
                            success: function(data) {
                                endLoading(100);
                            },
                            error: function() {
                                showError("数据加载错误！",false,true);
                            }
                        });
                    }
                break;
                case "teachers":
                    var api = _api+"api/teachers";
                    var $dom = $("#teachers .t");
                    var n = new Array("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z");
                    var nl = n.length;
                    if (!$dom.html()) {
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            url: api,
                            beforeSend: function() {
                                goLoading(200, "数据加载中，请稍候…");
                            },
                            success: function(data) {
                                endLoading(100);
                                var htm = "";
                                var len = data.length;;
                                var i,j;
                                for (i=0; i<nl; i++) {
                                    var lower_n = n[i].toLowerCase();
                                    htm += '<h3 id="t_'+lower_n+'">'+n[i]+'</h3>';
                                    htm += '<ul class="t-l">';
                                        for (j=0; j<len; j++) {
                                            var teacher = data[j].teacher;
                                            if (teacher.first_letter==n[i]) {
                                                htm += '<li class="page-link" data-pg="teacher" data-id="'+teacher.id+'"><img src="'+teacher.img_url+'" alt="'+teacher.name+'"><span>'+teacher.name+'</span></li>';
                                            }
                                        }
                                    htm += '</ul>';
                                }
                                $dom.html(htm);
                                $(".t-l").each(function() {
                                    var $s = $(this);
                                    if (!$s.html()) {
                                        $s.prev("h3").remove();
                                        $s.remove();
                                    }
                                });
                            },
                            error: function() {
                                showError("数据加载错误！",false,true);
                            }
                        });
                    }
                    $(".nav .n-t").addClass("active").siblings().removeClass("active");
                break;
                case "teacher":
                    var id = $s.data("id");
                    var parent = $s.data("parent");
                    var api = _api+"api/teachers/"+id;
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: api,
                        beforeSend: function() {
                            goLoading(200, "数据加载中，请稍候…");
                        },
                        success: function(data) {
                            endLoading(100);
                            var teacher = data.teacher;
                            var htm ="";
                            htm += '<div class="t-img"><img src="'+teacher.img_url+'" /></div>';
                            htm += '<div class="t-name">'+teacher.name+'</div>';
                            htm += '<div class="t-txt">'+teacher.description+'</div>';
                            $("#teacher").html(htm);
                        },
                        error: function() {
                            showError("数据加载错误！",false,true);
                        }
                    });
                    var $back = $("#teacher_hd>.back");
                    if (parent) {
                        $back.attr({"data-id":parent, "data-pg":"subject"});
                    } else {
                        $back.attr("data-pg", "teachers");
                        $back.removeAttr("data-id");
                    }
                break;
                case "setting":
                    $(".nav .n-s").addClass("active").siblings().removeClass("active");
                break;
                case "mine":
                    checkUser();
                break;
                case "news":
                    $(".nav .n-n").addClass("active").siblings().removeClass("active");
                break;
                case "cloth":
                    $(".nav .n-c").addClass("active").siblings().removeClass("active");
                break;
            }
        }
    });
    //课程本周/下周切换
    $(".sj-op li").live("tap", function() {
        var $s = $(this);
        $s.addClass("cur").siblings().removeClass("cur");
        $("#subjects .sj-tabs").eq($s.index()).removeClass("hide").siblings().addClass("hide");
    });
    //每日课程切换
    $(".sj-weeks>ul>li").live("tap", function() {
        var $s = $(this);
        var n = $s.index();
        $s.addClass("cur").siblings().removeClass("cur");
        $s.parent().parent().siblings(".sj-list").children("ul").eq(n).addClass("show").siblings().removeClass("show");
    });
    //弹出框控制
    $(".msg-btn").live("tap", function() {
        $msg.fadeOut(100);
    });
    //初始化
    $(".n-k").trigger("tap");
    //用户登录
    $(".login-submit").live("tap", function() {
        var username = $(".log-in #username").val();
        var password = $(".log-in #password").val();
        if (!username||!password) {
            showError("用户名密码不允许为空！",false,false);
        } else {
            var api = _api+"api/tokens";
            $.ajax({
                type: "POST",
                url: api,
                data: "email="+username+"&password="+password,
                beforeSend: function() {
                    goLoading(200, "正在登录，请稍候…");
                },
                success: function(data) {
                    endLoading(100);
                    if (data.state == "ok") {
                        _ls.setItem("user_token", data.token);
                        _ls.setItem("user_email", data.user.email);
                        _ls.setItem("user_id", data.user.id);
                        _ls.setItem("user_name", data.user.username);
                        $(".n-k").trigger("tap");
                    } else {
                        showError("用户名或密码错误！",false,false);
                    }
                },
                error :function() {
                    showError("数据加载出错！",false,true);
                }
            });
        }
    });
    //用户注销
    $(".logout").live("tap", function() {
        if (confirm("确定注销当前登录账户？")) {
            _ls.clear();
            $(".n-s").trigger("tap");
        } else {
            return false;
        }
    });
    //检查用户登录
    function checkUser() {
        var token = _ls.user_token;
        var state;
        if (token) {
            var api = _api+"api/tokens/"+token;
            $.ajax({
                type: "GET",
                dataType: "json",
                url: api,
                beforeSend: function() {
                    goLoading(200, "正在检查您的登录状态…");
                },
                success: function(data) {
                    endLoading(100);
                    if(data.state == "ok") {
                    } else {
                        showError("请您先登录！",".login-btn",false);
                    }
                },
                error: function() {
                    showError("数据加载出错！",false,true);
                }
            });
        } else {
            showError("请您先登录！",".login-btn",true);
        }
    }
    //页面切换后的样式变化
    function changePage(pg) {
        $("#"+pg).removeClass("hide").siblings(".pg").addClass("hide");
        $("#"+pg+"_hd").removeClass("hide").siblings().addClass("hide");
    }
    //进入加载
    function goLoading(speed, txt) {
        $ld.find(".ld-txt").text(txt);
        $ld.fadeIn(speed);
    }
    //加载结束
    function endLoading(speed) {
        $ld.fadeOut(speed);
    }
    //错误提示
    function showError(msg, e, endloading) {
        $msg.find(".msg-txt").children("span").text(msg);
        $msg.fadeIn(100);
        if (e) {
            $(e).trigger("tap");
        }
        if (endloading) {
            endLoading(100);
        }
        return false;
    }
})(Zepto)