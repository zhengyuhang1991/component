;(function () {
    MSlide = function (ops) {
        //  配置默认参数
        this.ops = {
            el: null,      //  目标对象
            createIdx: true,    //  是否生成索引块
            autoPlay: true,     //  是否自动播放
            autoPlayTime: 3     //  自动播放间隔
        };

        //  扩展默认参数
        $.extend(this.ops, ops);

        var el = this.ops.el,
            _this = this;

        //  获取目标DOM
        this.MSlide = $(el);
        this.list = $(el).find(".MSlide-list");

        //  初始化
        this.init();
    };

    MSlide.prototype = {
        /*
         * 初始化
         * */
        init: function () {
            var ops = this.ops;

            //  根据扩展参数来执行对应方法
            if (ops.createIdx) {
                this.createIdx();
            }

            /*if (ops.autoPlay) {
                this.autoPlay();
            }*/

            //  开始滑动
            this.start();
        },
        /*
         * 开始滑动
         * */
        start: function () {
            var ops = this.ops,
                el = this.MSlide,
                list = this.list,
                len = list.find("li").length,
                width = list.width(),
                _this = this,
                idx = 0,        //  索引值
                timer = null,   //  定时器
                autoPlayTime = ops.autoPlayTime * 1000;   //  切换间隔时间


            //开始滑动事件
            var startEvent = function(ev) {
                _this.startX = _this.backPlace(ev); //触摸坐标
                _this.offsetX = 0;                  //滑动距离
            }
            //正在滑动事件
            var moveEvent = function (ev) {
                ev.preventDefault();

                _this.offsetX = _this.backPlace(ev) - _this.startX;

                _this.setTransition();      //滑动时清除过渡时间

                _this.setValue(idx, _this.offsetX);
            }
            //滑动结束事件
            var endEvent = function () {
                var border = width / 5;

                if (_this.offsetX > border) {
                    idx--;
                } else if (_this.offsetX < -border) {
                    idx++;
                }

                if (idx < 0) {
                    idx = 0;
                } else if (idx > len - 1) {
                    idx = len - 1;
                }

                _this.setTransition(.3);      //滑动结束时添加过渡时间
                _this.setValue(idx);
            }

            el.on("touchstart", startEvent)
                .on("touchmove", moveEvent)
                .on("touchend", endEvent);
        },
        /*
         * 生成索引块
         * */
        createIdx: function () {
            var MSlide = this.MSlide,
                list = this.list,
                len = list.find("li").length,
                idxBox = $('<div class="MSlide-idx"></div>'),
                idxBoxUl = $('<ul></ul>'),
                html = "";

            for (var i = 0; i < len; i++) {
                html += "<li></li>";
            }

            idxBoxUl.append(html);
            idxBox.append(idxBoxUl);
            MSlide.append(idxBox);

            idxBox.find("li:first-child").addClass("on");
        },
        /*
        * 动画过渡设置
        * */
        setTransition: function (time) {
            var list = this.list,
                t = time || 0;

            list.css({
                transition: t + "s, ease",
                webkitTransition: t + "s, ease"
            });
        },
        /*
        * 返回坐标
        * */
        backPlace: function (ev) {
            var x = ev.touches[0].pageX;

            return x;
        },
        /*
        * 设置滑动值并高亮索引块
        * */
        setValue: function (idx, val) {
            var ops = this.ops,
                MSlide = this.MSlide,
                list = this.list,
                width = list.width();

            if (val) {
                list.css({
                    transform: "translate3d(" + ((-idx * width) + val) + "px, 0, 0)",
                    webkitTransform: "translate3d(" + (-idx * width) + val + "px, 0, 0)"
                });
            } else {
                list.css({
                    transform: "translate3d(" + (-idx * width) + "px, 0, 0)",
                    webkitTransform: "translate3d(" + (-idx * width) + "px, 0, 0)"
                });
            }

            if (ops.createIdx) {
                MSlide.find(".MSlide-idx li").removeClass("on")
                    .eq(idx).addClass("on");
            }
        },
    };

    //  注册MSlide到window对象上
    window.MSlide = MSlide;
})();