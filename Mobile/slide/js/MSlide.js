;(function () {
    MSlide = function (ops) {
        //  配置默认参数
        this.ops = {
            createIdx: true,    //  是否生成索引块
            autoPlay: true,     //  是否自动播放
            autoPlayTime: 3     //  自动播放时间
        };

        //  扩展默认参数
        $.extend(this.ops, ops);

        //  获取目标DOM
        this.MSlide = $(".MSlide");
        this.list = $(".MSlide").find(".MSlide-list");

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
        },
        /*
         * 生成索引块
         * */
        createIdx: function () {
            var MSlide = this.MSlide,
                list = this.list,
                len = list.find("li").length,
                idxBox = $('<div class="MSlide-idx"></div>'),
                idxBoxUl = $('<ul></ul>');
                html = "";

            for (var i = 0; i < len; i++) {
                html += "<li></li>";
            }

            idxBoxUl.append(html);
            idxBox.append(idxBoxUl);
            MSlide.append(idxBox);

            idxBox.find("li:first-child").addClass("on");
        }
    };

    //  注册MSlide到window对象上
    window.MSlide = MSlide;
})();