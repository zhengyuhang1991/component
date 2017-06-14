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

        var el = this.ops.el;

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

            //  创建索引块
            if (ops.createIdx) {
                this.createIdx();
            }

            //  创建循环展示DOM
            this.createLoopDom();

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

            this.setValue(idx);

            //开始滑动事件
            var startEvent = function(ev) {
                _this.startX = _this.backPlace(ev); //触摸坐标
                _this.offsetX = 0;                  //滑动距离

                if (ops.autoPlay) {
                    clearInterval(timer);
                }
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

                _this.setTransition();

                if (_this.offsetX > border) {
                    idx--;

                    if (idx < 0) {
                        idx = len - 2;
                        _this.setValue(idx, _this.offsetX);

                        idx--;
                    }
                } else if (_this.offsetX < -border) {
                    idx++;

                    if (idx >= len - 2) {
                        idx = -1;
                        _this.setValue(idx, _this.offsetX);

                        idx++;
                    }
                }

                _this.setValue(idx);
                _this.setTransition(.3);      //滑动结束时添加过渡时间

                if (ops.autoPlay) {
                    timer = setInterval(autoPlay, autoPlayTime);
                }
            }

            el.on("touchstart", startEvent)
                .on("touchmove", moveEvent)
                .on("touchend", endEvent);

            if (ops.autoPlay) {
                timer = setInterval(autoPlay, autoPlayTime);
            }

            /*
             * 自动轮播展示
             * */
            function autoPlay() {
                if (idx >= len - 3) {
                    idx = -1;
                    _this.setTransition();
                    _this.setValue(idx);

                    idx++;
                } else {
                    idx++;
                }

                _this.setValue(idx);
                _this.setTransition(.3);        //添加过渡时间
            }
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
            var x;

            if (ev.originalEvent) {
                x = ev.originalEvent.targetTouches[0].pageX;
            } else {
                x = ev.touches[0].pageX;
            }

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

            idx++;

            if (val) {
                list.css({
                    transform: "translate3d(" + ((-idx * width) + val) + "px, 0, 0)",
                    webkitTransform: "translate3d(" + ((-idx * width) + val) + "px, 0, 0)"
                });
            } else {
                list.css({
                    transform: "translate3d(" + (-idx * width) + "px, 0, 0)",
                    webkitTransform: "translate3d(" + (-idx * width) + "px, 0, 0)"
                });
            }

            if (ops.createIdx) {
                MSlide.find(".MSlide-idx li").removeClass("on")
                    .eq(idx - 1).addClass("on");
            }
        },
        /*
         * 生成无缝展示DOM
         * */
        createLoopDom: function () {
            var list = this.list,
                ul = list.children("ul"),
                firstLi = ul.find("li:first-child").clone(),
                lastLi = ul.find("li:last-child").clone();

            ul.append(firstLi)
                .prepend(lastLi);
        }
    };

    //  注册MSlide到window对象上
    window.MSlide = MSlide;
})();