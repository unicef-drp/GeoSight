'use strict';

import i18n from "i18next";

/**
 * Getting cookie function
 * @param cname
 * @returns {string}
 */
export function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
 * Set a cookie function *
 * @param cname
 * @param cvalue
 * @param exdays
 */
export function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}


/**
 * return translation of message
 * mostly for checking if the sentences has incorrect character
 *
 * @param sentence : string
 */
export function translate(sentence) {
  if (sentence === undefined) {
    return sentence
  }

  sentence = sentence.replace('https://', '')
  // split with ':'
  const newSentences = sentence.split(':').map(val => {
    const cleanSentence = val.replace(/ +(?= )/g, '')
    return i18n.t(cleanSentence.trim())
  })
  return newSentences.join(': ')
}

/**
 * Delays the execution in x milliseconds.
 *
 * @param {int} millis Milliseconds
 */
export function delay(millis) {
  return new Promise(resolve => {
    setTimeout(resolve, millis);
  });
}


/**
 * Return number with commas
 */
export function numberWithCommas(x, decimalNum = 2) {
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

/**
 * Capitalize a string
 * @param target
 * @returns {string}
 */
export function capitalize (target) {
  return (target.charAt(0).toUpperCase() + target.slice(1)).replaceAll('_', ' ');
}