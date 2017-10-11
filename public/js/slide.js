(function ($) {
    $.fn.loadImages = function () {
        var images = this[0].getElementsByTagName("img");

        for (var i = 0, len = images.length; i < len; i++) {
            var el = images[i];
            var img_src = el.getAttribute("data-img-src") ? el.getAttribute("data-img-src") : el.getAttribute("img_src");
            if (img_src != null) {
                el.setAttribute("src", img_src);
            }
        }
    };
    $.fn.yicheFoucs = function (options) {

        //插件的默认值属性
        var defaults = {
            focusSlide: true,
            //滑动效果，默认开启
            slideSpeed: 600,
            //默认切换滑动速度
            autoPlay: true,
            //自动播放，默认开启。
            autoSpeed: 6000,
            //默认自动轮播速度
            focusStraight: false,
            //直接切换效果，默认关闭
            fadeIn: false,
            //淡入淡出效果，默认关闭
            focusSlideMore: false,
            //多个div滑动效果。默认滚动1个div的距离
            nDiv: 1 //默认多个div滑动距离是1
        };
        var init = 0;
        //合并用户自定义属性，默认属性
        var options = $.extend(defaults, options);
        this.each(function () {
            var $focus_box = $(this);
            ////////////////赋值//////////////
            var focus_box_bg = $focus_box.find(".slide-box-bg");
            var focus_box_big = $focus_box.find(".slide-box-big");
            var focus_box_big_div = focus_box_big.children("li");
            //每一个div的宽度
            var focus_box_big_div_width = focus_box_big_div.first().outerWidth(true);

            var focus_box_big_div_width_more = focus_box_big_div_width * options.nDiv;
            //获取显示面积
            var fwidth = focus_box_bg.width();

            //获取焦点图个数
            var len = focus_box_big_div.length;
            //var len = len/options.nDiv;
            //如果只有一帧，不执行后面的计算。
            if (len <= 1) {
                return false;
            }
            //计算出外围绝对定位div的宽度。因为左右各复制了2倍div，
            focus_box_big.css("width", focus_box_big_div_width * (len * 3));
            //索引 默认0
            var index = 0;
            //定义变量
            var timer;
            //向后复制所有div
            var clonetolast = focus_box_big_div.clone();
            //向前复制所有div
            var clonetofirst = focus_box_big_div.clone();

            clonetolast.insertAfter(focus_box_big.children().last());
            clonetofirst.insertBefore(focus_box_big.children().first());

            for (i = 0; i < clonetofirst.length; i++) {
                $(clonetofirst[i]).css("margin-left", -focus_box_big_div_width * (clonetofirst.length - i) + "px");
            }
            var focusExtId = Math.ceil(Math.random() * 100000);
            //字符串
            var inserthtml = "<ul class='focus-dot' id='focus-dot-" + focusExtId + "'>";
            //循环添加li
            for (var i = 0; i < len; i++) {
                inserthtml += "<li>" + (i + 1) + "</li>";
            }
            //添加后面的部分
            inserthtml += "</ul><a href='javascript:;' class='arrow-left-lg focus-button focus-left' id='focus-left-" + focusExtId + "' >上一张</a><a href='javascript:;' class='arrow-right-lg focus-button focus-right' id='focus-right-" + focusExtId + "'>下一张</a>";
            //插入到指定的div后面
            focus_box_bg.after(inserthtml);

            var focus_dot = $focus_box.find("#focus-dot-" + focusExtId);
            var focus_dot_li = focus_dot.children("li");

            var focus_left = $("#focus-left-" + focusExtId, $focus_box),
                focus_right = $("#focus-right-" + focusExtId, $focus_box);


            //如果屏幕小 就改变按钮位置
            if ($(window).width() < 1120) {
                focus_left.css("left", 0);
                focus_right.css("right", 0);
            }

            //计算dot ul的位置，使其居中。（设为参数）
            //左外边距的纸等于 显示宽度减去ul的宽度除以2
            var marginl = (fwidth - focus_dot.width()) / 2;
            focus_dot.css("margin-left", marginl);

            //多个div切换滑动方法
            function showPicsMore(cyindex, dotindex) {
                if (init == 0) {
                    focus_box_big.loadImages();

                    init = 1;
                }
                //当前left值。就是滚动到的left值。参数乘以N个div的值
                var nowLeft = -cyindex * focus_box_big_div_width_more;

                //停止所有动画，left值变为现在的nowleft
                focus_box_big.stop().animate({
                        "left": nowLeft
                    },
                    options.slideSpeed,
                    //callback left复位
                    function () {
                        focus_box_big.css("left", -dotindex * focus_box_big_div_width_more);
                    });

                focus_dot_li.removeClass("current").eq(dotindex).addClass("current");
            }

            //================滑动切换=============//
            //滑动向前递减翻页
            var sliedPre = function () {

                index -= 1;
                if (index == -1) {
                    //index到-1 前一个，滚动索引-1，dot索引正常 到最后dot一个
                    showPicsMore(-1, Math.floor(len / options.nDiv) - 1);
                    //索引为 最后
                    index = len / options.nDiv - 1;
                } else {
                    //显示
                    showPicsMore(index, index);
                }
            }

            focus_dot_li.mouseover(function () {
                index = $(this).index();
                showPicsMore(index, index);
            }).eq(0).trigger("mouseover");

            //滑动向后累加翻页
            var slideNext = function () {

                //index计算
                //索引加一 变为下一个
                index += 1;

                //如果索引是最后一个，滚动到索引最后，dot回到0 dot第一个
                if (index == len / options.nDiv) {
                    showPicsMore(len / options.nDiv, 0);
                    index = 0;
                } else {
                    //显示
                    showPicsMore(index, index);
                }
            }

            //上一页按钮
            focus_left.click(function () {
                sliedPre();
                //a链接
                return false;
            });
            //下一页按钮
            focus_right.click(function () {

                slideNext();
                //a链接
                return false;
            });

            //鼠标滑上焦点图时停止自动播放，滑出时开始自动播放
            if (options.autoPlay) {
                $focus_box.hover(function () {
                        clearInterval(timer);
                    },
                    function () {
                        timer = setInterval(function () {
                                slideNext();
                            },
                            options.autoSpeed); //播放的间隔
                    }).trigger("mouseleave"); //默认上来$(".focus_box")触发了mouseleave
            }
        });
    };
})(jQuery);