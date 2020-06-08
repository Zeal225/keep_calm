/**
 * Created by Dell on 22/05/2018.
 */
function _$(selector, createElement = false) {
    if (createElement) {
        return document.createElement(selector);
    }

    let elements = document.querySelectorAll(selector);

    if (elements.length !== 0) {
        return (elements.length === 1) ? elements[0] : elements;
    }
    return null;
}

function msg(exp) {
    console.log(exp);
}

let utils = {
    getRdm: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    toArray: function (obj) {
        if (typeof obj === "object") {
            let r = [];
            for (let prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    r.push(obj[prop]);
                }
            }
            return r;
        }
    },
    reduce: function (tab) {
        let concat = tab[0].concat(tab[1]);
        let l = concat.length;
        return concat.reduce(
            (sum, val, index) => sum + val * Math.pow(2, (l - index - 1)), 0
        );
    },
    toDec: function (a, tabCol) {
        for (let i = 0, r, d = parseInt(a); i < 4; i++) {
            r = d % 2;
            tabCol.unshift(r);
            d = Math.floor(d / 2);
        }
    },
    toRGB: function (color) {
        if (typeof color === "string") {
            let co = {
                0: 0,
                1: 1,
                2: 2,
                3: 3,
                4: 4,
                5: 5,
                6: 6,
                7: 7,
                8: 8,
                9: 9,
                a: 10,
                b: 11,
                c: 12,
                d: 13,
                e: 14,
                f: 15
            };
            let tabR = [[], []];
            let tabG = [[], []];
            let tabB = [[], []];
            let r = color.substr(1, 2);
            let g = color.substr(3, 2);
            let b = color.substr(5, 2);
            utils.toDec(co[r.substr(0, 1)], tabR[0]);
            utils.toDec(co[r.substr(1, 1)], tabR[1]);
            utils.toDec(co[g.substr(0, 1)], tabG[0]);
            utils.toDec(co[g.substr(1, 1)], tabG[1]);
            utils.toDec(co[b.substr(0, 1)], tabB[0]);
            utils.toDec(co[b.substr(1, 1)], tabB[1]);
            return [
                utils.reduce(tabR),
                utils.reduce(tabG),
                utils.reduce(tabB),
            ];
        }
    }
};

let canvas = _$("#kc-canvas");
let ctx = canvas.getContext("2d");
let canWidth = canvas.offsetWidth;
let canHeight = canvas.offsetHeight;

let canIcWidth = 80;
let canIcHeight = 80;

let urlIcon = "C:/xampp/htdocs/laurent_project/keep_calm/images/icones/";
let urlBgImages = "/images/bg/";

let currentIconRGB = [0, 0, 0];
let currentIconSrc = urlIcon + "icon1.png";
let currentBgImageSrcOrBgColor = "#dc09a1";
let isBgCanvasImage = false;

let textControls = _$(".text-control");

let texts = {};
let typeTextSize = {
    large: 50,
    moyen: 30
};

let dataUrl;
let contLink = _$(".kc-download-link-container");

function createImageInPHP(imageUrl) {
    $.ajax({
        url: 'generate-image',
        data: {
            'canvas-data-url': imageUrl
        },
        method: 'post',
        success:function (data) {
            contLink.innerHTML = data;
        }
    });
}

function textInit(textControls) {
    for (let i = 0, posY = 140, input; input = textControls[i]; i++) {
        let attr = input.getAttribute("data-text");
        texts[attr] = {};
        texts[attr]["text"] = input.value;
        texts[attr]["fontSize"] = (i % 2) ? 30 : 50;
        texts[attr]["color"] = "#ffffff";
        texts[attr]["y"] = posY + i * 55;
    }
}

textInit(textControls);

function update() {
    contLink.innerHTML = "";
    ctx.clearRect(0, 0, canWidth, canHeight);
    let srcIc = changeIconColor(currentIconRGB[0], currentIconRGB[1], currentIconRGB[2]);
    drawBg(currentBgImageSrcOrBgColor, srcIc, texts, isBgCanvasImage);
}

function changeIconColor(r = 0, g = 0, b = 0) {
    let icCan = _$("canvas", true);
    icCan.width = canIcWidth;
    icCan.height = canIcHeight;

    let ctx = icCan.getContext("2d");

    let img = _$("img", true);
    img.src = currentIconSrc;

    ctx.drawImage(img, 0, 0);

    let idata = ctx.getImageData(0, 0, canIcWidth, canIcHeight);
    let data = idata.data;

    for (let i = 0, l = data.length; i < l; i += 4) {
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        ctx.putImageData(idata, 0, 0);
    }

    return icCan.toDataURL();
}

function drawIcon(src) {
    let img = new Image();
    img.addEventListener("load", function () {
        let x = Math.floor((canWidth - canIcWidth) / 2);
        let y = 10;
        ctx.drawImage(this, x, y);
        dataUrl = canvas.toDataURL();
    });
    img.src = src;
}

function drawBg(bgSrcOrBgColor, srcIcon, texts, isBgImage = false) {
    if (!isBgImage) {
        ctx.fillStyle = bgSrcOrBgColor;
        ctx.fillRect(0, 0, canWidth, canHeight);
        drawIcon(srcIcon);
        groupWriteText(texts);
    } else {
        let img = new Image();
        img.addEventListener("load", function () {
            ctx.drawImage(this, 0, 0);
            drawIcon(srcIcon);
            groupWriteText(texts);
        });
        img.src = bgSrcOrBgColor;
    }
}

function writeText(text, y, fontSize, fontColor = "#ffffff") {
    ctx.fillStyle = fontColor;
    let width;
    do {
        ctx.font = fontSize + "px Arial";
        width = Math.floor(ctx.measureText(text).width);
        fontSize -= .1;
    } while (width > canWidth);

    ctx.fillText(text, (canWidth - width) / 2, y);
}

function groupWriteText(texts) {
    for (let text in texts) {
        if (texts.hasOwnProperty(text)) {
            writeText(texts[text].text, texts[text].y, texts[text].fontSize, texts[text].color);
        }
    }
}


function chooseBgImageOrIcon(src, isBgImage = false, nb) {
    let imgContainerContent = _$(".kc-images-content");
    imgContainerContent.innerHTML = "";
    for (let i = 1; i < nb; i++) {

        let div = _$("div", true);
        let img = _$("img", true);
        img.src = src + i + (isBgImage ? ".jpg" : ".png");

        div.addEventListener("click", function (e) {
            if (isBgImage) {
                currentBgImageSrcOrBgColor = src + i + ".jpg";
                isBgCanvasImage = true;
            } else {
                currentIconSrc = src + i + ".png";
            }

            _$(".kc-images-container").classList.add("close");

            update();
        });

        div.appendChild(img);
        imgContainerContent.appendChild(div);
    }
}

function textUpdateAction(e) {
    let $this = e.currentTarget;
    texts[$this.getAttribute("data-text")][this.getAttribute("type")] = $this.value;
    update();
}

function textUpdate(elems) {
    Array.prototype.map.call(elems, function (elem) {
        elem.addEventListener("change", textUpdateAction);
    });
}

drawBg(currentBgImageSrcOrBgColor, currentIconSrc, texts, isBgCanvasImage);

_$("#icon-color").addEventListener("change", function (e) {
    currentIconRGB = utils.toRGB(e.currentTarget.value);
    update();
});

textUpdate(textControls);
textUpdate(_$(".text-color"));

_$("#choose-bg-image").addEventListener("click", function (e) {
    e.preventDefault();
    chooseBgImageOrIcon(urlBgImages+"bg", true, 9);
    _$(".kc-images-container").classList.remove("close");
});

_$("#choose-icon").addEventListener("click", function (e) {
    e.preventDefault();
    chooseBgImageOrIcon(urlIcon+"icon", false, 14);
    _$(".kc-images-container").classList.remove("close");
});

_$("#change-bg-color").addEventListener("change", function (e) {
    currentBgImageSrcOrBgColor = e.currentTarget.value;
    isBgCanvasImage = false;
    update();
});

Array.prototype.map.call(_$(".text-size"), function (elem) {
    elem.addEventListener("click", function (e) {
        e.preventDefault();
        let type = this.getAttribute("data-size");
        texts[this.getAttribute("data-text")]["fontSize"] = typeTextSize[type];
        if (type === "large") {
            this.setAttribute("data-size", "moyen");
            this.textContent = "Moyen";
        } else {
            this.setAttribute("data-size", "large");
            this.textContent = "Large";
        }
        update();
    });
});

_$("#kc-generate").addEventListener("click",function (e) {
    e.preventDefault();
    createImageInPHP(dataUrl);
});