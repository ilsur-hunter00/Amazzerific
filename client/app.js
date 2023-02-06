var main = function () {
    "use strict";
    $("body button").on("click", function () {
        var tag = $("body input").val();
        console.log(tag);
        var url = "https://api.flickr.com/services/feeds/photos_public.gne?" +
            "tags=" + tag + "&format=json&jsoncallback=?";
        $.getJSON(url, function (flickrResponse) {
            var items = flickrResponse.items;
            var displayImages = function (imgIndex) {
                var $img = $("<img>").hide();
                //Устанавливаем атрибут
                $img.attr("src", items[imgIndex].media.m);
                $("body .photos").empty();
                $("body .photos").append($img);
                $img.fadeIn();
                setTimeout(function () {
                    imgIndex++;
                    displayImages(imgIndex);
                }, 2000);
            }
            displayImages(0);
        });
    });


}
$(document).ready(main);
