/**
 * Created by cmdv on 16/06/15.
 */

'use strict';

import Rx from 'rx';
import $ from 'jquery';

var dw, dh, rw, rh, lx, ly, w2, h2, padding;

var $target = $('.hoverzoom'),
  $showZoom = $('.showzoom'),
  w1 = $target.width(),
  h1 = $target.height(),
  $flyout = $('<div class="hoverzoom-flyout" />'),
  $link = $target.find('a'),
  $image = $target.find('img'),
  parentDiv = $('.thumbnail'),
  link = $link.attr('href'),
  zoomed = {},

// setting up Observable
  mouseEnter = Rx.Observable.fromEvent($target, 'mouseenter'),
  mouseLeave = Rx.Observable.fromEvent($target, 'mouseleave'),
  mouseMove = Rx.Observable.fromEvent($target, 'mousemove'),
  targetClick = Rx.Observable.fromEvent($target, 'click');

(function letsGo() {

  var zoom = document.createElement("img");

  zoom.style.position = 'absolute';
  zoom.src = link;

  $showZoom.append($flyout);
  $flyout.append(zoom);

  zoomed = $('.hoverzoom-flyout').find('img');

  $flyout.css({width: w1, height: h1});

})();

// prevent default clicks
var preventDefault = targetClick.subscribe((e) => {
  e.preventDefault();
});

// make sure $flyout is on DOM
var _onEnter = mouseEnter.filter(() => $($flyout).length == 1).
  map((e) => {

    e.stopPropagation();

  w1 = $target.width();
  h1 = $target.height();
  w2 = $flyout.width();
  h2 = $flyout.height();
  dw = zoomed.width() - w2;
  dh = zoomed.height() - h2;
  rw = dw / w1;
  rh = dh / h1;
  padding = parentDiv.outerWidth();

  $flyout.css({opacity: 1, left: padding, top: -20, width: w1, height: h1});

}).filter(()=> zoomed.width() != 0);

var enterSubscribe = _onEnter.subscribe();

var _onMove = mouseMove.map((e) => {
  lx = e.pageX || lx;
  ly = e.pageY || ly;

  var offset = $target.offset(),
    pt = ly - offset.top,
    pl = lx - offset.left,
    xt = Math.ceil(pt * rh),
    xl = Math.ceil(pl * rw),
    top = xt * -1,
    left = xl * -1;

  return {top, left}

});

var moveSubscribe = _onMove.subscribe((a) => zoomed.css({top: a.top, left: a.left}) );

// hide flyout
mouseLeave.subscribe(() => $flyout.css({opacity: 0}));