;(function () {
    Tab = function (ops) {
        this.ops = {
            con: ".tab-con",    //控制块class
            conbox: ".tab-conbox",  //切换内容区class
            autoRun: false,   //是否开启内容区域自动切换
            autoRunTime: 3,   //非必须，默认3秒自动切换区域(单位：秒)    注：autoRun为true才可启用
            defaultIdx: 1     //非必须，如无配置，默认显示高亮第一个控制块、显示第一个内容区域(最低数值1)
        }

        //扩展对象配置参数
        $.extend(this.ops, ops);

        //获取目标
        this.con = $(ops.con);
        this.conbox = $(ops.conbox);

        //初始化
        this.init();
    }

    Tab.prototype = {
        /*
         * 初始化
         * */
        init: function () {
            var ops = this.ops;

            //启动默认显示
            this.defaultToggle(ops.defaultIdx - 1);

            //是否开启内容区域自动切换
            if (ops.autoRun) {
                this.start();
            }

            this.tabEvent();
        },
        /*
         * 指定切换
         * */
        tabEvent: function () {
            var ops = this.ops,
                con = this.con,
                conLi = con.find("li");

            conLi.click(function () {
                var idx = $(this).index();

                $(this)
                    .addClass("on").siblings().removeClass("on")
                    .parents(ops.con).siblings(ops.conbox).children("div").eq(idx)
                    .addClass("on").siblings().removeClass("on");
            });
        },
        /*
         * 公共切换方法
         * */
        defaultToggle: function (i) {
            var con = this.con,
                conLi = con.find("li"),
                conbox = this.conbox,
                conboxDiv = conbox.children("div");

            function commonToggle(obj) {
                obj.eq(i).addClass("on").siblings().removeClass("on");
            }
            commonToggle(conLi);
            commonToggle(conboxDiv);
        },
        /*
         * 自动切换内容区
         * */
        start: function () {
            var ops = this.ops,
                con = this.con,
                conbox = this.conbox,
                conLi = con.find("li"),
                conLiLen = conLi.length,
                _this = this,
                timer = null,
                runTime = ops.autoRunTime * 1000;

            //开启自动切换
            timer = setInterval(startRun, runTime);

            //鼠标进入切换区域则关闭自动切换
            function closeAutoRun(el) {
                var element = $(el);

                element.mouseenter(function () {
                    clearInterval(timer);
                }).mouseleave(function () {
                    timer = setInterval(startRun, runTime);
                });
            }
            closeAutoRun(con);
            closeAutoRun(conbox);

            //自动切换方法
            function startRun() {
                var idx = con.find("li.on").index();

                idx++;

                if (idx > conLiLen - 1) {
                    idx = 0;
                }

                _this.defaultToggle(idx);
            }
        }
    }

    window.Tab = Tab;
})();