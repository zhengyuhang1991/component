;(function () {
    Slide = function (ops) {
        this.ops = {
            el: null,    //传入外层容器选择器
            creatIdx: false, //是否生成索引块
            autoRun: false,   //是否自动切换
            autoRunTime: 3,    //每次自动运行间隔时间(单位:秒)
            transitionTime: .5    //动画过渡时间(单位:秒)
            //loop: false   //是否循环展示
        }

        //扩展对象参数
        $.extend(this.ops, ops);

        //获取容器
        this.wrap = $(ops.el);
        this.list = this.wrap.find('.slide-list');
        this.prev = this.wrap.find('.slide-prev');
        this.next = this.wrap.find('.slide-next');
        this.slideBox = this.wrap.find('.slide-box');
        this.idxBox = $('<div class="slide-idx">');

        //初始化
        this.init();
    };

    Slide.index = 0; //定时器索引值

    Slide.prototype = {
        /*
         * 初始化
         * */
        init: function () {
            var ops = this.ops,
                wrap = this.wrap,
                slideBox = this.slideBox,
                listHeight = this.list.height();

            //设定关键属性
            wrap.css({
                position: "relative",
                height: listHeight
            });
            slideBox.css({
                position: "absolute",
                left: 0
            });

            //是否生成索引块
            if (ops.creatIdx) {
                this.creatIdxList();
            }

            //是否自动切换
            if (ops.autoRun) {
                this.start();
            }
        },
        /*
         * 生成索引块
         * */
        creatIdxList: function () {
            var wrap = this.wrap,
                idxBox = this.idxBox,
                list = this.list,
                len = list.find('li').length,
                idxUl = $('<ul></ul>'),
                idxHtml = "";

            for (var i = 0; i < len; i++) {
                idxHtml += '<li></li>';
            }
            idxUl.append(idxHtml);
            idxBox.append(idxUl)
                .find("li").eq(0).addClass("on");
            wrap.append(idxBox);
        },
        /*
         * 开启自动切换
         * */
        start: function () {
            var _this = this,
                ops = this.ops,
                wrap = this.wrap,
                idxBox = this.idxBox,
                prev = this.prev,
                next = this.next,
                list = this.list,
                slideBox = this.slideBox,
                len = list.find('li').length,
                li = slideBox.find('li'),
                idx = Slide.index,
                timer = null, //设定定时器;

            //执行自动切换
            timer = setInterval(slideGo, ops.autoRunTime * 1000);

            //增加过渡动画
            this.transitionSet();

            //移入清除自动切换,移出时增加自动切换
            wrap.mouseenter(function () {
                clearInterval(timer);
            }).mouseleave(function () {
                timer = setInterval(slideGo, ops.autoRunTime * 1000);
            });

            //索引块点击切换至对应板块
            $(idxBox).on("click", "li", function () {
                idx = $(this).index();

                _this.runFix(idx);
            });

            //左右切换事件
            prev.click(function () {
                idx--;

                if (idx < 0) {
                    idx = len - 1;
                }
                _this.runFix(idx);
            });
            next.click(function () {
                idx++;

                if (idx > len - 1) {
                    idx = 0;
                }
                _this.runFix(idx);
            });

            function slideGo() {
                if (idx == len - 1) {
                    idx = 0;
                } else {
                    idx++;
                }
                _this.runFix(idx);
            }
        },
        /*
         * 板块滑动 && 修正索引值
         * */
        runFix: function (i) {
            var wrap = this.wrap,
                slideBox = this.slideBox,
                idxBox = this.idxBox,
                idxLi = idxBox.find('li'),
                wrapWidth = wrap.width();

            slideBox.css("left", -(i * wrapWidth) + "px");

            idxLi.removeClass("on")
                .eq(i).addClass("on");
        },
        /*
         * 滑动过渡时间
         * */
        transitionSet: function (time) {
            var ops = this.ops,
                slideBox = this.slideBox;

            if (time) {
                slideBox.css({
                    webkitTransition: time + "s",
                    transition: time + "s"
                });
            } else {
                slideBox.css({
                    webkitTransition: ops.transitionTime + "s",
                    transition: ops.transitionTime + "s"
                });
            }
        }
    };

    window.Slide = Slide;
})();