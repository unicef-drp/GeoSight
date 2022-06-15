let csrfmiddlewaretoken;

$(document).ready(function () {
    csrfmiddlewaretoken = $('input[name ="csrfmiddlewaretoken"]').val();
});

String.prototype.replaceAll = function (search, replacement) {
    let target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}

String.prototype.capitalize = function () {
    let target = this;
    return (target.charAt(0).toUpperCase() + target.slice(1)).replaceAll('_', ' ');
}

String.prototype.splitOnce = function (char) {
    var i = this.indexOf(char);
    if (i !== -1) {
        return [this.slice(0, i), this.slice(i + 1)];
    }
    return [this.slice(0)];
}


/**
 * Fuction before ajax
 */
function beforeAjaxSend(xhr) {
    xhr.setRequestHeader('X-CSRFToken', csrfmiddlewaretoken);
}

/**
 * Clone object
 */
function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    let temp = obj.constructor(); // give temp the original obj's constructor
    for (let key in obj) {
        temp[key] = cloneObject(obj[key]);
    }

    return temp;
}


/**
 * Copy to clipboard
 */
function copyToClipboard(elmt) {
    navigator.clipboard.writeText(window.location.host + $(elmt).data('url'));
}

/**
 * Takes a raw CSV string and converts it to a JavaScript object.
 * @param {string} string The raw CSV string.
 * @param {string[]} headers An optional array of headers to use. If none are
 * given, they are pulled from the file.
 * @param {string} quoteChar A character to use as the encapsulating character.
 * @param {string} delimiter A character to use between columns.
 * @returns {object[]} An array of JavaScript objects containing headers as keys
 * and row entries as values.
 */
const csvToJson = (string, headers, quoteChar = '"', delimiter = ',') => {
    const regex = new RegExp(`\\s*(${quoteChar})?(.*?)\\1\\s*(?:${delimiter}|$)`, 'gs');
    const match = string => [...string.matchAll(regex)].map(match => match[2])
        .filter((_, i, a) => i < a.length - 1); // cut off blank match at end

    const lines = string.split('\n');
    const heads = headers || match(lines.splice(0, 1)[0]);

    return lines.map(line => match(line).reduce((acc, cur, i) => ({
        ...acc,
        [heads[i] || `extra_${i}`]: (cur.length > 0) ? (Number(cur) || cur) : null
    }), {}));
}


function compareObjects(object1, object2, key) {
    const obj1 = object1['properties'][key].toUpperCase()
    const obj2 = object2['properties'][key].toUpperCase()

    if (obj1 < obj2) {
        return -1
    }
    if (obj1 > obj2) {
        return 1
    }
    return 0
}

function sortArrayOfDict(arr, key) {
    arr.sort((arr1, arr2) => {
        return compareObjects(arr1, arr2, key)
    })
}

function extractedDate(date) {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    })
    const day = date.getUTCDate().toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    })
    return [day, month, year]
}

function dateToYYYYMMDD(date) {
    const dates = extractedDate(date)
    return `${dates[2]}-${dates[1]}-${dates[0]}`
}

function dateToDDMMYYY(date) {
    const dates = extractedDate(date)
    return `${dates[0]}-${dates[1]}-${dates[2]}`
}

function distinct(value, index, self) {
    return self.indexOf(value) === index;
}

//----------------------------------------------------------
// COOKIE MANAGEMEND
//----------------------------------------------------------
/**
 * Get cookie
 */
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 * Return cookie in list and unique
 */
function getCookieInList(name) {
    let cookie = [];
    if (getCookie(name)) {
        cookie = getCookie(name).split(',');
        cookie = cookie.filter(distinct)
    }
    return cookie;
}


/**
 * Set cookie
 */
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}


/**
 * Append cookie with using comma separator
 */
function appendCookie(name, value) {
    let cookie = getCookie(name);
    let cookieData = []
    if (cookie) {
        cookieData = cookie.split(',');
    }
    cookieData.push(value);
    cookieData = cookieData.filter(distinct);
    setCookie(name, cookieData.join(','));
}

/**
 * Append cookie with using comma separator
 */
function removeCookie(name, value) {
    let cookie = getCookie(name);
    let cookieData = []
    if (cookie) {
        cookieData = cookie.split(',');
    }
    cookieData = cookieData.filter(e => e !== ('' + value));
    setCookie(name, cookieData.join(','));
}

function extension(filename) {
    var re = /(?:\.([^.]+))?$/;
    return re.exec(filename)[1];
}

String.prototype.fuzzy = function (s) {
    var hay = this.toLowerCase(), i = 0, n = -1, l;
    s = s.toLowerCase();
    for (; l = s[i++];) if (!~(n = hay.indexOf(l, n + 1))) return false;
    return true;
};

function returnMostOccurring(arr) {
    const obj = {};
    arr.forEach(item => {
        if (!obj[item]) obj[item] = 1;
        else obj[item]++;
    })

    const res = Object.entries(obj).sort((a, b) => b[1] - a[1]);
    return res.shift();
}

function triggerEventToDetail(id, name) {
    event.trigger(evt.INDICATOR_TO_DETAIL, id, name)
}

// ---------------------------------
// COPY TO CLIPBOARD ELEMENT
// ---------------------------------
function changeToCopyToClipboard($elm) {
    $elm.html(`<span class="copy-to-clipboard" onclick="copyToClipboard(this)"><span class="the-text">${$elm.html()}</span> <span class="copy-to-clipboard-indicator">Copy</span</span>`)
}

function copyToClipboard(element) {
    const $indicator = $(element).find('.copy-to-clipboard-indicator');
    if ($indicator.hasClass('copied')) {
        return
    }
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).find('.the-text').text().trim()).select();
    document.execCommand("copy");
    $temp.remove();

    $indicator.addClass('copied');
    $indicator.html('Copied');
    $indicator.animate({ opacity: 0 }, 500, function () {
        $indicator.removeClass('copied');
        $indicator.html('Copy');
        $indicator.css('opacity', 1)
    });
}

function numberWithCommas(x, decimalNum = 2) {
    if (x === null) {
        return '';
    } else if (isNaN(x)) {
        return x;
    } else {
        let numFloat = parseFloat(x);
        if (!isNaN(numFloat)) {
            x = numFloat;
        } else {
            return x
        }
        if (typeof x !== 'number') {
            return x
        }
        x = x.toFixed(decimalNum)
        let number = x.split('.')[0];
        let decimal = x.split('.')[1];
        let string = number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (decimal && parseInt(decimal)) {
            string += '.' + decimal.replace(/[0]+$/, '');
        }
        return string;
    }
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function changeToSelect(elm) {
    const attr = [];
    $.each(elm.attributes, function () {
        attr.push(`${elm.name}='${elm.value}'`);
    });
    $(elm).replaceWith(`<select ${attr.join(' ')}></select>`);
}