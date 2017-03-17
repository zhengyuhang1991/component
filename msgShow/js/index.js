//  弹窗组件
;(function () {
    MsgBox = function(ops) {
        //  配置默认参数
        this.ops = {
            width: null,
            loading: false,
            icon: null,
            iconCls: null,
            msg: null,
            btns: null,
            delay: null,
            delayCallback: null
        };

        //  扩展默认参数
        if (ops && $.isPlainObject(ops)) {
            $.extend(this.ops, ops);
        } else {
            this.isOps = true;
        }

        //  获取目标DOM
        this.body = $('body');
        this.msgbox = $('<div class="popup msgbox">');
        this.container = $('<div class="msgbox-container">');
        this.icon = $('<div class="msgbox-container-icon iconfont">');
        this.tips = $('<h2 class="msgbox-container-tips">');
        this.btnsBox = $('<div class="msgbox-container-btns">');

        //  生成DOM
        this.createDOM();
    }

    //  设置默认层级且多窗口时叠加
    MsgBox.zIndex = 999;

    MsgBox.prototype = {
        /*
         * 生成DOM
         * */
        createDOM: function () {
            var _this = this,
                ops = this.ops,
                body = this.body,
                msgbox = this.msgbox,
                container = this.container,
                icon = this.icon,
                tips = this.tips,
                btnsBox = this.btnsBox;

            //  自增层级，保证下次弹窗层级高于上次弹窗层级
            MsgBox.zIndex++;
            msgbox.css("zIndex", MsgBox.zIndex);

            if (this.isOps) {
                container.append(icon.html("&#xe86b;").addClass("animate"));
                msgbox.append(container.css("width", "auto"));
                body.append(msgbox);
            } else {
                //  弹窗宽度
                if (ops.width) {
                    container.css("width", ops.width);
                }

                //  是否执行loading动画
                if (ops.loading) {
                    icon.addClass("animate");
                }

                //  图标状态
                if (ops.icon) {
                    container.append(icon.html(ops.icon));
                }

                //  图标增加class
                if (ops.iconCls) {
                    icon.addClass(ops.iconCls);
                }

                //  文字信息
                if (ops.msg) {
                    container.append(tips.text(ops.msg));
                }

                //  定制按钮组
                if (ops.btns) {
                    this.createBtn(btnsBox, ops.btns);
                    container.append(btnsBox);
                }

                //  延迟关闭
                if (ops.delay) {
                    setTimeout(function () {
                        _this.close();

                        //  如果有回调函数则执行
                        ops.delayCallback && ops.delayCallback();
                    }, ops.delay * 1000)
                }

                msgbox.append(container);
                body.append(msgbox);
            }
        },
        /*
         * 生成按钮
         * */
        createBtn: function (box, btns) {
            var _this = this;

            $(btns).each(function (i) {
                var test = this.test ? this.test : "按钮" + ++i,
                    cls = this.cls ? this.cls : "",
                    callback = this.callback ? this.callback : null,
                    btn = $('<a class="' + cls + '" href="javascript:;">' + test + '</a>');

                //  绑定事件
                btn.tap(function () {
                    var isClose = callback && callback();

                    //  绑定事件不返回 false ，则默认关闭该弹窗
                    if (isClose != false) {
                        _this.close();
                    }
                });

                //  按钮生成
                _this.btnsBox.append(btn);
            });
        },
        /*
         * 移除窗口
         * */
        close: function () {
            this.msgbox.remove();
        }
    }

    //  注册MsgBox到window对象上
    window.MsgBox = MsgBox;
})();