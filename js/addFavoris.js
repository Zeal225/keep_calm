/**
 * Created by Dell on 22/05/2018.
 */
jQuery(function() {
    $ = jQuery;
    var lang = $("html").attr("lang"),
        dialTitle = "";

    if (lang == "fr-FR") {
        press = "Presser";
        content = "pour ajouter cette page à vos favoris";
        dialTitle = "Ajout aux favoris";
    } else {
        press = "Press";
        content = "to bookmark this page";
        dialTitle = "Add to favorites";
    }
    var ajs_tpl = $('<div class="couverture-dial">'+
        '<div class="dial-container">'+
        '<header class="dial-header"><h3>'+dialTitle+'</h3></header>'+
        '<div class="dial-content">'+press +' ' + '<strong>'+(/Mac/i.test(navigator.userAgent) ? 'Cmd' : 'Ctrl') + '+D'+ ' </strong>'+content+'.'+'</div>'+
        '<div class="dial-btn"><button>Ok</button></div>'+
        '</div>'+
        '<script>$(".couverture-dial button").click(function(e){$(".couverture-dial").remove();});</script>'+
        '</div>');

    $('#addFavoris').click(function (e) {
        /*if (navigator.userAgent.match(/(android|iphone|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)) {
         alert('mobile');
         } else {
         alert('none');
         }*/
        e.preventDefault();
        if(navigator.userAgent.includes('Mobile')){
            return false;
        }

        var bookmarkURL = window.location.href;
        var bookmarkTitle = document.title;

        if ('addToHomescreen' in window && window.addToHomescreen.isCompatible) {
            // Mobile browsers
            addToHomescreen({autostart: false, startDelay: 0}).show(true);
        } else if (window.sidebar && window.sidebar.addPanel) {
            // Firefox version < 23
            window.sidebar.addPanel(bookmarkTitle, bookmarkURL, '');
        } else if ((window.sidebar && /Firefox/i.test(navigator.userAgent)) || (window.opera && window.print)) {
            // Firefox version >= 23 and Opera Hotlist
            $(this).attr({
                href: bookmarkURL,
                title: bookmarkTitle,
                rel: 'sidebar'
            }).off(e);
            return true;
        } else if (window.external && ('AddFavorite' in window.external)) {
            // IE Favorite
            window.external.AddFavorite(bookmarkURL, bookmarkTitle);
        } else {
            // Other browsers (mainly WebKit - Chrome/Safari)
            $('body').append(ajs_tpl);
        }

        return false;
    });

    //$("#main-header").remove();

    function msg(exp) {
        console.log(exp);
    }

    var monObj = monObj || {
            variables: {
                btn: $('#ajs_tooltip_appear'),
                blocMentionsLegales: $('#mentions-legales'),
                btnClose: $('.ajs_close')
            },
            openToolTip:function(){
                var $this = this.variables;
                $this.btn.click(function(e){
                    e.preventDefault();
                    $this.blocMentionsLegales.addClass('is_appear');
                    $('body').css('overflow-y','hidden');
                });
            },
            closeToolTip:function(){
                var $this = this.variables;
                $this.btnClose.click(function(e){
                    $this.blocMentionsLegales.removeClass('is_appear');
                    $('body').css('overflow-y','scroll');
                });
            },

            init: function() {
                this.openToolTip();
                this.closeToolTip();
            }
        };

    monObj.init();

    $(".ue-regulation-accept.btn").on("click",function (e) {
        $(".ue-regulation-box").remove();
    })

});

