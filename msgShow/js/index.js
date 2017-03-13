;(function () {
    var msgShow = function (ops) {
        //  默认参数配置
        this.ops = {
            tips: null,
            btns: null,
            delay: null
        }
        //  扩展默认参数
        if (ops && $.isPlainObject(ops)) {
            $.extend(this.ops, ops);
        } else {
            this.isOps = true;
        }

        //  获取结构
        this.body = $('body');
        this.popup = $('<div class="popup-msg">');
        this.popupBox = $('<div class="popup-msg-box">');
        this.tips = $('<div class="popup-tips">');
        this.btnsBox = $('<div class="popup-msg-btns">');

        // 初始化
        this.init();
    };

    msgShow.prototype = {
        /*
        * 初始化
        * */
        init: function () {
            var _this = this,
                ops = this.ops,
                popup = this.popup,
                popupBox = this.popupBox,
                tips = this.tips,
                btnsBox = this.btnsBox;

            if (this.isOps) {
                popupBox.append(tips.text("你好吗？"));
                popup.append(popupBox);
                this.body.append(popup);
            } else {
                //  提示信息
                if (ops.tips) {
                    popupBox.append(tips.text(ops.tips));
                }

                //  按钮组
                if (ops.btns) {
                    this.createBtns(btnsBox, ops.btns);
                    /**/
                    popupBox.append(btnsBox);
                }

                //  延迟执行
                if (ops.delay && ops.delay != 0) {
                    setTimeout(function () {
                       _this.closePopup();
                    }, ops.delay);
                }

                popup.append(popupBox);
                this.body.append(popup);
            }
        },
        /*
        * 创建按钮组
        * */
        createBtns: function (btnsBox, btns) {
            var _this = this;

            $(btns).each(function (i) {
                var txt = this.txt ? this.txt : "按钮" + i,
                    cls = this.class ? this.class : "",
                    fn = this.callback ? this.callback : null,
                    btn = $('<a class=' + cls + ' href="javascript:;">' + txt + '</a>');

                btnsBox.append(btn);

                if (fn) {
                    btn.tap(function () {
                        var isClose = fn();
                        if (isClose != false) {
                            _this.closePopup();
                        }
                    });
                } else {
                    btn.tap(function () {
                        _this.closePopup();
                    });
                }
            });
        },
        /*
        * 关闭该弹窗
        * */
        closePopup: function () {
            this.popup.remove();
        }
    };

    window.msgShow = msgShow;
})();