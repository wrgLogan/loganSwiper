var Swiper = (function() {
    // 私有变量
    var WINDOW_WIDTH = $(window).width();
    var originalX = null;
    var originalTime = null;
    var nowX = null;
    var endTime = null;
    var moveX = 0;

    var Swiper = function(el) {
        this.container = $(el);
        this.slideItems = this.container.find('.swiper-item');
        this.slideIndex = 0;
        this.pagis = $('.swiper-pagination').find('.pagi');
        this.lock = false;
        this.init();
    }

    Swiper.prototype.init = function() {
        var swiper = this;
        var container = swiper.container;
        var slideItems = swiper.slideItems;
        var ITEMS_NUM = slideItems.length;
        
        // 容器宽度 == item个数 * 页面宽
        container.css("width", ITEMS_NUM * WINDOW_WIDTH);

        swiper.onTouch();
    }

    Swiper.prototype.slideTo = function(pageIndex) {
        var swiper = this;
        var slideItems = swiper.slideItems;
        var ITEMS_NUM = slideItems.length;
        var container = swiper.container;
        swiper.lock = true;

        if (pageIndex > ITEMS_NUM - 1) {
            var pageIndex = ITEMS_NUM - 1;
        };

        if (pageIndex < 0) {
            var pageIndex = 0;
        };

        container.css({
            "transition": "transform .3s ease-out"
        });

        setTimeout(function() {
            container.css({
                "transform": "translate3d(" + (- pageIndex * WINDOW_WIDTH) + "px,0,0)"
            });

            setTimeout(function() {
                container.css({
                    "transition": "none"
                });

                swiper.lock = false;
            }, 300)
        }, 10);

        slideItems.each(function() {
            $(this).removeClass("active");
        });

        swiper.pagis.each(function() {
            $(this).removeClass("active");
        })

        slideItems.eq(pageIndex).addClass("active");
        swiper.pagis.eq(pageIndex).addClass("active");
        swiper.slideIndex = pageIndex;
    }

    Swiper.prototype.onTouch = function() {
        var swiper = this;
        var container = swiper.container;
        var slideItems = swiper.slideItems;
        var ITEMS_NUM = slideItems.length;
        
        // 按下
        container.on('touchstart', function(evt) {
            
            if (swiper.lock) return;

            var touch = evt.originalEvent.targetTouches[0];
            originalX = touch.clientX;
            originalTime = Date.now();

            container.css({
                "transition": "transform 100ms ease-out"
            });
        });

        // 移动
        container.on('touchmove', function(evt) {

            if (swiper.lock) return;
            if (!originalX) return;
            
            var touch = evt.originalEvent.targetTouches[0];
            var slideIndex = swiper.slideIndex;

            nowX = touch.clientX;
            var offsetX = nowX - originalX;

            if ((slideIndex == swiper.slideItems.length - 1 && offsetX < 0) || (slideIndex == 0 && offsetX >0)) {
                offsetX = offsetX / 3;
            };

            moveX = (- slideIndex * WINDOW_WIDTH + offsetX);

            container.css({
                transform: "translate3d(" + moveX + "px,0,0)"
            });
            
        });

        // 松开
        container.on('touchend', function(evt) {
            
            endTime = Date.now();

            if (swiper.lock) return;
            if (!nowX) return;

            if (endTime - originalTime < 300) {
                console.log((nowX - originalX)/(endTime - originalTime));
                if ((nowX - originalX)/(endTime - originalTime) < -0.25) {
                    swiper.slideTo(swiper.slideIndex + 1);
                } else if ((nowX - originalX)/(endTime - originalTime) > 0.25) {
                    swiper.slideTo(swiper.slideIndex - 1);
                } else {
                    swiper.slideTo(swiper.slideIndex);
                }
            } else {
                if ((nowX - originalX) < -(WINDOW_WIDTH/3)) {
                    swiper.slideTo(swiper.slideIndex + 1);
                } else if ((nowX - originalX) > (WINDOW_WIDTH/3)) {
                    swiper.slideTo(swiper.slideIndex - 1);
                } else {
                    swiper.slideTo(swiper.slideIndex);
                }
            }

            
            endTime = null;
            originalTime = null;
            originalX = null;
            nowX = null;
            moveX = 0;
        });
    };

    return Swiper;
})()