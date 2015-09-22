var CSStypes = {
    normal: '',
    'class': '.',
    id: '#',
    media: '@'
}

dharma.CSS = {
    normal: '',
    'class': '.',
    id: '#',
    media: '@'
}

function get_browser_info() {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE ', version: (tem[1] || '') };
    }

    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) { return { name: 'Opera', version: tem[1] }; }
    }

    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
}

function getBrowserPrefix() {
    var styles = window.getComputedStyle(document.documentElement, '');

    var pre = (Array.prototype.slice
      .call(styles)
      .join('')
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1];

    var dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

    return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1)
    };
};

function createEnginePrefixBase(name, rules, list, valuePrefix) {
    var result = '';
    for (var i = 0; i < list.length; i++) {
        if (valuePrefix) {
            result += '; ' + list[i] + name + ': ' + rules;
        }
        else {
            result += '; ' + name + ': ' + list[i] + rules;
        }
    }

    return result;
}

function createEnginePrefix(name, rules) {
    var mozilla = '-moz-';
    var opera = '-o-';
    var chrome = '-webkit-';
    var microsoft = '-ms-';

    if (name == 'animation') {
        return createEnginePrefixBase(name, rules, [mozilla, chrome]);
    }
    else if (name == 'animation-play-state') {
        return createEnginePrefixBase(name, rules, [mozilla, chrome]);
    }
    else if (name == 'transform') {
        return createEnginePrefixBase(name, rules, [microsoft, mozilla, chrome, opera]);
    }
    else if (name == 'transition') {
        return createEnginePrefixBase(name, rules, [mozilla, chrome, opera]);
    }
    else if (name == 'transition-delay') {
        return createEnginePrefixBase(name, rules, [mozilla, chrome, opera]);
    }
    else if (name == 'transition-duration') {
        return createEnginePrefixBase(name, rules, [mozilla, chrome, opera]);
    }
    else if (name == 'transition-property') {
        return createEnginePrefixBase(name, rules, [mozilla, chrome, opera]);
    }
    else if (name == 'transition-timing-function') {
        return createEnginePrefixBase(name, rules, [mozilla, chrome, opera]);
    }
    else if (name == 'flex-flow') {
        return createEnginePrefixBase(name, rules, [mozilla, chrome]);
    }
    else if (name == 'display' && rules == 'flex') {
        return createEnginePrefixBase(name, rules, [chrome], true);
    }
    else
        return '';
}

function getCSSRules(cssRules) {
    var rules = '';
    var separator = '';

    Object.getOwnPropertyNames(cssRules).forEach(function (name, index, array) {
        lr = cssRules[name];
        rules += separator + name + ': ' + lr;
        rules += createEnginePrefix(name, lr);
        separator = '; ';
    })

    return rules;
}

dharma.CSS.createCSSAnimation = function(animation) {
    var steps = '';
    for (var i = 0; i < animation.steps.length; i++) {
        steps += animation.steps[i].value + '% { ' + getCSSRules(animation.steps[i].rules) + '; } ';
    }

    var engine = getBrowserPrefix();
    console.log(engine.dom);
    if (engine.dom == 'WebKit') {
        var name = '@-webkit-keyframes ' + animation.name;
        createCSSSelectorBase(name, steps);
    }
    else if (engine.dom == 'Moz') {
        name = '@-moz-keyframes ' + animation.name;
        createCSSSelectorBase(name, steps);
    }
    else {
        var name = '@keyframes ' + animation.name;
        createCSSSelectorBase(name, steps);
    }
}

function createCSSAnimation(animation) {
    var steps = '';
    for (var i = 0; i < animation.steps.length; i++) {
        steps += animation.steps[i].value + '% { ' + getCSSRules(animation.steps[i].rules) + '; } ';
    }

    var engine = getBrowserPrefix();
    console.log(engine.dom);
    if (engine.dom == 'WebKit') {
        var name = '@-webkit-keyframes ' + animation.name;
        createCSSSelectorBase(name, steps);
    }
    else if (engine.dom == 'Moz') {
        name = '@-moz-keyframes ' + animation.name;
        createCSSSelectorBase(name, steps);
    }
    else {
        var name = '@keyframes ' + animation.name;
        createCSSSelectorBase(name, steps);
    }
}

dharma.CSS.createCSSRule = function(style, type) {
    if (style.name) {
        var name = type + style.name;

        if (style.base) {
            var selector = name;
            var cssRules = getCSSRules(style.base);
            createCSSSelectorBase(selector, cssRules);
        }

        if (style.hover) {
            var selector = name + ':hover';
            var cssRules = getCSSRules(style.hover);
            createCSSSelectorBase(selector, cssRules);
        }

        if (style.before) {
            var selector = name + ':before';
            var cssRules = getCSSRules(style.before);
            createCSSSelectorBase(selector, cssRules);
        }

        if (style.after) {
            var selector = name + ':after';
            var cssRules = getCSSRules(style.after);
            createCSSSelectorBase(selector, cssRules);
        }

        if (style.link) {
            var selector = name + ':link';
            var cssRules = getCSSRules(style.link);
            createCSSSelectorBase(selector, cssRules);
        }

        if (style.visited) {
            var selector = name + ':visited';
            var cssRules = getCSSRules(style.visited);
            createCSSSelectorBase(selector, cssRules);
        }

        if (style.last) {
            var selector = name + ':last-of-type';
            var cssRules = getCSSRules(style.last);
            createCSSSelectorBase(selector, cssRules);
        }
    }
}

function createCSSRule(style, type) {
    if (style.name) {
        var name = type + style.name;

        if (style.base) {
            var selector = name;
            var cssRules = getCSSRules(style.base);
            createCSSSelectorBase(selector, cssRules);
        }

        if (style.hover) {
            var selector = name + ':hover';
            var cssRules = getCSSRules(style.hover);
            createCSSSelectorBase(selector, cssRules);
        }

        if (style.before) {
            var selector = name + ':before';
            var cssRules = getCSSRules(style.before);
            createCSSSelectorBase(selector, cssRules);
        }

        if (style.after) {
            var selector = name + ':after';
            var cssRules = getCSSRules(style.after);
            createCSSSelectorBase(selector, cssRules);
        }

        if (style.link) {
            var selector = name + ':link';
            var cssRules = getCSSRules(style.link);
            createCSSSelectorBase(selector, cssRules);
        }

        if (style.visited) {
            var selector = name + ':visited';
            var cssRules = getCSSRules(style.visited);
            createCSSSelectorBase(selector, cssRules);
        }

        if (style.last) {
            var selector = name + ':last-of-type';
            var cssRules = getCSSRules(style.last);
            createCSSSelectorBase(selector, cssRules);
        }
    }
}

function createCSSSelectorBase(selector, style) {

    if (!document.styleSheets) {
        return;
    }

    if (document.getElementsByTagName("head").length == 0) {
        return;
    }

    var stylesheet;
    var mediaType;
    if (document.styleSheets.length > 0) {
        for (i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].disabled) {
                continue;
            }
            var media = document.styleSheets[i].media;
            mediaType = typeof media;

            if (mediaType == "string") {
                if (media == "" || (media.indexOf("screen") != -1)) {
                    styleSheet = document.styleSheets[i];
                }
            } else if (mediaType == "object") {
                if (media.mediaText == "" || (media.mediaText.indexOf("screen") != -1)) {
                    styleSheet = document.styleSheets[i];
                }
            }

            if (typeof styleSheet != "undefined") {
                break;
            }
        }
    }

    if (typeof styleSheet == "undefined") {
        var styleSheetElement = document.createElement("style");
        styleSheetElement.type = "text/css";

        document.getElementsByTagName("head")[0].appendChild(styleSheetElement);

        for (i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].disabled) {
                continue;
            }
            styleSheet = document.styleSheets[i];
        }

        var media = styleSheet.media;
        mediaType = typeof media;
    }

    if (mediaType == "string") {
        for (i = 0; i < styleSheet.rules.length; i++) {
            if (styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                styleSheet.rules[i].style.cssText = style;
                return;
            }
        }

        styleSheet.addRule(selector, style);
    } else if (mediaType == "object") {
        var styleSheetLength = (styleSheet.cssRules) ? styleSheet.cssRules.length : 0;
        for (i = 0; i < styleSheetLength; i++) {
            if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                styleSheet.cssRules[i].style.cssText = style;
                return;
            }
        }

        styleSheet.insertRule(selector + "{" + style + "}", styleSheetLength);
    }
}