;(function(){
   Slide = function (ops) {
       this.ops = {
           el: null,    //传入容器选择器
           loop: false,   //是否循环展示
           creatIdx: false, //是否生成索引块
           autoRun: false,   //是否自动切换
           autoRunTime: null    //自动运行的时间
       }
       
       //获取外层容器
       this.wrap = $(el);
       
   };
    
    Slide.prototype = {
        
    };
    
    window.Slide = Slide;
})();