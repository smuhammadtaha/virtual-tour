if (!Object['hasOwnProperty']('values')) {
  Object['values'] = function (c) {
    return Object['keys'](c)['map'](function (d) {
      return c[d];
    });
  };
}
if (!String['prototype']['startsWith']) {
  String['prototype']['startsWith'] = function (e, f) {
    f = f || 0x0;
    return this['indexOf'](e, f) === f;
  };
}
TDV['EventDispatcher'] = function () {
  this['_handlers'] = {};
};
TDV['EventDispatcher']['prototype']['bind'] = function (g, h) {
  if (!(g in this['_handlers'])) this['_handlers'][g] = [];
  this['_handlers'][g]['push'](h);
};
TDV['EventDispatcher']['prototype']['unbind'] = function (i, j) {
  if (i in this['_handlers']) {
    var k = this['_handlers'][i]['indexOf'](j);
    if (k != -0x1) this['_handlers'][i]['splice'](k, 0x1);
  }
};
TDV['EventDispatcher']['prototype']['createNewEvent'] = function (l) {
  if (typeof Event === 'function') return new Event(l);
  var m = document['createEvent']('Event');
  m['initEvent'](l, !![], !![]);
  return m;
};
TDV['EventDispatcher']['prototype']['dispatchEvent'] = function (n) {
  if (n['type'] in this['_handlers']) {
    var o = this['_handlers'][n['type']];
    for (var p = 0x0; p < o['length']; ++p) {
      o[p]['call'](window, n);
      if (n['defaultPrevented']) break;
    }
  }
};
TDV['Tour'] = function (q, r) {
  TDV['EventDispatcher']['call'](this);
  this['player'] = undefined;
  this['_settings'] = q;
  this['_devicesUrl'] = r;
  this['_playersPlayingTmp'] = [];
  this['_isInitialized'] = ![];
  this['_isPaused'] = ![];
  this['_isRemoteSession'] = ![];
  this['_orientation'] = undefined;
  this['_lockedOrientation'] = undefined;
  this['_device'] = undefined;
  Object['defineProperty'](this, 'isInitialized', {
    'get': function () {
      return this['_isInitialized'];
    }
  });
  Object['defineProperty'](this, 'isPaused', {
    'get': function () {
      return this['_isPaused'];
    }
  });
  this['_setupRemote']();
};
TDV['Tour']['DEVICE_GENERAL'] = 'general';
TDV['Tour']['DEVICE_MOBILE'] = 'mobile';
TDV['Tour']['DEVICE_IPAD'] = 'ipad';
TDV['Tour']['DEVICE_VR'] = 'vr';
TDV['Tour']['EVENT_TOUR_INITIALIZED'] = 'tourInitialized';
TDV['Tour']['EVENT_TOUR_LOADED'] = 'tourLoaded';
TDV['Tour']['EVENT_TOUR_ENDED'] = 'tourEnded';
TDV['Tour']['prototype'] = new TDV['EventDispatcher']();
TDV['Tour']['prototype']['dispose'] = function () {
  if (!this['player']) return;
  if (this['_onHashChange']) {
    window['removeEventListener']('hashchange', this['_onHashChange']);
    this['_onHashChange'] = undefined;
  }
  if (this['_onKeyUp']) {
    document['removeEventListener']('keyup', this['_onKeyUp']);
    this['_onKeyUp'] = undefined;
  }
  if (this['_onBeforeUnload']) {
    window['removeEventListener']('beforeunload', this['_onBeforeUnload']);
    this['_onBeforeUnload'] = undefined;
  }
  var s = this['_getRootPlayer']();
  if (s !== undefined) {
    s['stopTextToSpeech']();
  }
  this['player']['delete']();
  this['player'] = undefined;
  this['_isInitialized'] = ![];
  window['currentGlobalAudios'] = undefined;
  window['pauseGlobalAudiosState'] = undefined;
  window['currentPanoramasWithCameraChanged'] = undefined;
  window['overlaysDispatched'] = undefined;
};
TDV['Tour']['prototype']['load'] = function () {
  if (this['player']) return;
  var t = function (v) {
    if (v['name'] == 'begin') {
      var w = v['data']['source']['get']('camera');
      if (w && w['get']('initialSequence') && w['get']('initialSequence')['get']('movements')['length'] > 0x0) return;
    }
    if (v['sourceClassName'] == 'MediaAudio' || this['_isInitialized']) return;
    this['_isInitialized'] = !![];
    u['unbind']('preloadMediaShow', t, this, !![]);
    u['unbindOnObjectsOf']('PlayListItem', 'begin', t, this, !![]);
    u['unbind']('stateChange', t, this, !![]);
    if (this['_isPaused']) this['pause']();
    window['parent']['postMessage'](TDV['Tour']['EVENT_TOUR_LOADED'], '*');
    this['dispatchEvent'](this['createNewEvent'](TDV['Tour']['EVENT_TOUR_LOADED']));
  };
  this['_setup']();
  this['_settings']['set'](TDV['PlayerSettings']['SCRIPT_URL'], this['_currentScriptUrl']);
  var u = this['player'] = TDV['PlayerAPI']['create'](this['_settings']);
  u['bind']('preloadMediaShow', t, this, !![]);
  u['bind']('stateChange', t, this, !![]);
  u['bindOnObjectsOf']('PlayListItem', 'begin', t, this, !![]);
  u['bindOnObject']('rootPlayer', 'start', function (x) {
    var y = x['data']['source'];
    y['get']('data')['tour'] = this;
    var z = window['navigator']['language'] || window['navigator']['userLanguage'] || 'en';
    var A = y['get']('data')['locales'] || {};
    var B = y['get']('data')['defaultLocale'] || z;
    var C = this['locManager'] = new TDV['Tour']['LocaleManager'](y, A, B, this['_settings']['get'](TDV['PlayerSettings']['QUERY_STRING_PARAMETERS']));
    y['get']('data')['localeManager'] = C;
    var D = function () {
      var O = y['get']('data');
      if (!('updateText' in O)) {
        O['updateText'] = function (S) {
          var T = S[0x0]['split']('.');
          if (T['length'] == 0x2) {
            var U = C['trans']['apply'](C, S);
            var V = S[0x1] || y;
            if (typeof V == 'string') {
              var W = V['split']('.');
              V = y[W['shift']()];
              for (var X = 0x0; X < W['length'] - 0x1; ++X) {
                if (V != undefined) V = 'get' in V ? V['get'](W[X]) : V[W[X]];
              }
              if (V != undefined) {
                var Y = W[W['length'] - 0x1];
                if (Array['isArray'](V)) {
                  for (var Z = 0x0; Z < V['length']; ++Z) {
                    this['setValue'](V[Z], Y, U);
                  }
                } else this['setValue'](V, Y, U);
              }
            } else {
              V = V[T[0x0]];
              this['setValue'](V, T[0x1], U);
            }
          }
        }['bind'](y);
      }
      var P = O['translateObjs'];
      var Q = O['updateText'];
      var R = function () {
        for (var a0 in P) {
          Q(P[a0]);
        }
      };
      R();
      R();
    };
    this['locManager']['bind'](TDV['Tour']['LocaleManager']['EVENT_LOCALE_CHANGED'], D['bind'](this));
    var E = this['_getParams'](location['search']['substr'](0x1));
    E = y['mixObject'](E, this['_getParams'](location['hash']['substr'](0x1)));
    var F = E['language'];
    if (!F || !this['locManager']['hasLocale'](E['language'])) {
      if (y['get']('data')['forceDefaultLocale']) F = B;
      else F = z;
    }
    this['setLocale'](F);
    var G = y['getByClassName']('HotspotPanoramaOverlay');
    for (var I = 0x0, J = G['length']; I < J; ++I) {
      var K = G[I];
      var L = K['get']('data');
      if (!L) K['set']('data', L = {});
      L['defaultEnabledValue'] = K['get']('enabled');
    }
    this['_setMediaFromURL'](E);
    this['_updateParams'](E, ![]);
    if (this['isMobile']() && typeof this['_devicesUrl'][this['_device']] == 'object') {
      var M = function () {
        if (!y['isCardboardViewMode']() && this['_getOrientation']() != this['_orientation']) {
          this['reload']();
          return !![];
        }
        return ![];
      };
      if (M['call'](this)) return;
      var N = y['getByClassName']('PanoramaPlayer');
      for (var I = 0x0; I < N['length']; ++I) {
        N[I]['bind']('viewModeChange', M, this);
      }
      y['bind']('orientationChange', M, this);
    }
    this['_onHashChange'] = function () {
      var a1 = this['_getParams'](location['hash']['substr'](0x1));
      this['_setMediaFromURL'](a1, ![]);
      this['_updateParams'](a1, !![]);
    }['bind'](this);
    this['_onKeyUp'] = function (a2) {
      if (a2['ctrlKey'] && a2['shiftKey'] && a2['key']['toLowerCase']() == 'u') {
        this['updateDeepLink']();
        y['copyToClipboard'](location['href']);
      }
    }['bind'](this);
    this['_onBeforeUnload'] = function (a3) {
      y['stopTextToSpeech']();
    };
    window['addEventListener']('hashchange', this['_onHashChange']);
    window['addEventListener']('beforeunload', this['_onBeforeUnload']);
    document['addEventListener']('keyup', this['_onKeyUp']);
    y['bind']('tourEnded', function () {
      this['dispatchEvent'](this['createNewEvent'](TDV['Tour']['EVENT_TOUR_ENDED']));
    }, this, !![]);
    y['bind']('mute_changed', function () {
      if (this['get']('mute')) this['stopTextToSpeech']();
    }, y, !![]);
    this['dispatchEvent'](this['createNewEvent'](TDV['Tour']['EVENT_TOUR_INITIALIZED']));
  }, this, !![]);
  window['addEventListener']('message', function (a4) {
    var a5 = a4['data'];
    if (a5 == 'pauseTour') a5 = 'pause';
    else if (a5 == 'resumeTour') a5 = 'resume';
    else return;
    this[a5]['apply'](this);
  }['bind'](this));
};
TDV['Tour']['prototype']['pause'] = function () {
  this['_isPaused'] = !![];
  if (!this['_isInitialized']) return;
  var a6 = function (af) {
    var ag = af['source'];
    if (!this['_isPaused']) ag['unbind']('stateChange', a6, this);
    else if (ag['get']('state') == 'playing') {
      ag['pause']();
    }
  };
  var a7 = this['player']['getByClassName']('PlayList');
  for (var a8 = 0x0, a9 = a7['length']; a8 < a9; a8++) {
    var aa = a7[a8];
    var ab = aa['get']('selectedIndex');
    if (ab != -0x1) {
      var ac = aa['get']('items')[ab];
      var ad = ac['get']('player');
      if (ad && ad['pause']) {
        if (ad['get']('state') != 'playing') ad['bind']('stateChange', a6, this);
        else ad['pause']();
        this['_playersPlayingTmp']['push'](ad);
      }
    }
  }
  var ae = this['_getRootPlayer']();
  ae['pauseGlobalAudios']();
  ae['quizPauseTimer']();
};
TDV['Tour']['prototype']['resume'] = function () {
  this['_isPaused'] = ![];
  if (!this['_isInitialized']) return;
  while (this['_playersPlayingTmp']['length']) {
    var ah = this['_playersPlayingTmp']['pop']();
    ah['play']();
  }
  var ai = this['_getRootPlayer']();
  ai['resumeGlobalAudios']();
  ai['quizResumeTimer']();
};
TDV['Tour']['prototype']['reload'] = function () {
  this['_orientation'] = this['_getOrientation']();
  this['updateDeepLink']();
  this['dispose']();
  this['load']();
};
TDV['Tour']['prototype']['setMediaByIndex'] = function (aj) {
  var ak = this['_getRootPlayer']();
  if (ak !== undefined) {
    return ak['setMainMediaByIndex'](aj);
  }
};
TDV['Tour']['prototype']['setMediaByName'] = function (al) {
  var am = this['_getRootPlayer']();
  if (am !== undefined) {
    return am['setMainMediaByName'](al);
  }
};
TDV['Tour']['prototype']['triggerOverlayByName'] = function (an, ao, ap) {
  var aq = this['_getRootPlayer']();
  if (!ap) ap = 'click';
  if (aq !== undefined && ap) {
    var ar = aq['getPanoramaOverlayByName'](an, ao);
    if (ar) {
      aq['triggerOverlay'](ar, ap);
    }
  }
};
TDV['Tour']['prototype']['focusOverlayByName'] = function (as, at) {
  var au = this['_getRootPlayer']();
  if (au !== undefined) {
    var av = au['getPanoramaOverlayByName'](as['get']('media'), at);
    if (av) {
      var aw = av['get']('class');
      var ax = aw == 'VideoPanoramaOverlay' || aw == 'QuadVideoPanoramaOverlay' ? av : av['get']('items')[0x0];
      var ay, az;
      aw = ax['get']('class');
      if (aw == 'QuadVideoPanoramaOverlay' || aw == 'QuadHotspotPanoramaOverlayImage') {
        var aA = ax['get']('vertices');
        var aB = 0x0,
          aC = aA['length'];
        ay = 0x0;
        az = 0x0;
        while (aB < aC) {
          var aD = aA[aB++];
          var aE = aD['get']('yaw');
          if (aE < 0x0) aE += 0x168;
          ay += aE;
          az += aD['get']('pitch');
        }
        ay /= 0x4;
        az /= 0x4;
        if (ay > 0xb4) ay -= 0x168;
      } else {
        ay = ax['get']('yaw');
        az = ax['get']('pitch');
      }
      var aF = au['getPlayListWithItem'](as);
      if (aF) {
        var aG = function () {
          au['setPanoramaCameraWithSpot'](aF, as, ay, az);
        };
        if (!this['_isInitialized']) {
          var aH = function () {
            as['unbind']('begin', aH, this);
            aG();
          };
          as['bind']('begin', aH, this);
        } else {
          aG();
        }
      }
    }
  }
};
TDV['Tour']['prototype']['setComponentsVisibilityByTags'] = function (aI, aJ, aK) {
  var aL = this['_getRootPlayer']();
  if (aL !== undefined) {
    var aM = aL['getComponentsByTags'](aI, aK);
    for (var aN = 0x0, aO = aM['length']; aN < aO; ++aN) {
      aM[aN]['set']('visible', aJ);
    }
  }
};
TDV['Tour']['prototype']['setOverlaysVisibilityByTags'] = function (aP, aQ, aR) {
  var aS = this['_getRootPlayer']();
  if (aS !== undefined) {
    var aT = aS['getOverlaysByTags'](aP, aR);
    aS['setOverlaysVisibility'](aT, aQ);
  }
};
TDV['Tour']['prototype']['setOverlaysVisibilityByName'] = function (aU, aV) {
  var aW = this['_getRootPlayer']();
  if (aW !== undefined) {
    var aX = aW['getActiveMediaWithViewer'](aW['getMainViewer']());
    var aY = [];
    for (var aZ = 0x0, b0 = aU['length']; aZ < b0; ++aZ) {
      var b1 = aW['getPanoramaOverlayByName'](aX, aU[aZ]);
      if (b1) aY['push'](b1);
    }
    aW['setOverlaysVisibility'](aY, aV);
  }
};
TDV['Tour']['prototype']['updateDeepLink'] = function () {
  var b2 = this['_getRootPlayer']();
  if (b2 !== undefined) {
    b2['updateDeepLink'](!![], !![], !![]);
  }
};
TDV['Tour']['prototype']['setLocale'] = function (b3) {
  var b4 = this['_getRootPlayer']();
  if (b4 !== undefined && this['locManager'] !== undefined) {
    this['locManager']['setLocale'](b3);
  }
};
TDV['Tour']['prototype']['getLocale'] = function () {
  var b5 = this['_getRootPlayer']();
  return b5 !== undefined && this['locManager'] !== undefined ? this['locManager']['currentLocaleID'] : undefined;
};
TDV['Tour']['prototype']['isMobile'] = function () {
  return TDV['PlayerAPI']['mobile'];
};
TDV['Tour']['prototype']['isIPhone'] = function () {
  return TDV['PlayerAPI']['device'] == TDV['PlayerAPI']['DEVICE_IPHONE'];
};
TDV['Tour']['prototype']['isIPad'] = function () {
  return TDV['PlayerAPI']['device'] == TDV['PlayerAPI']['DEVICE_IPAD'];
};
TDV['Tour']['prototype']['isIOS'] = function () {
  return this['isIPad']() || this['isIPhone']();
};
TDV['Tour']['prototype']['isMobileApp'] = function () {
  return navigator['userAgent']['indexOf']('App/TDV') != -0x1;
};
TDV['Tour']['prototype']['getNotchValue'] = function () {
  var b6 = document['documentElement'];
  b6['style']['setProperty']('--notch-top', 'env(safe-area-inset-top)');
  b6['style']['setProperty']('--notch-right', 'env(safe-area-inset-right)');
  b6['style']['setProperty']('--notch-bottom', 'env(safe-area-inset-bottom)');
  b6['style']['setProperty']('--notch-left', 'env(safe-area-inset-left)');
  var b7 = window['getComputedStyle'](b6);
  return parseInt(b7['getPropertyValue']('--notch-top') || '0', 0xa) || parseInt(b7['getPropertyValue']('--notch-right') || '0', 0xa) || parseInt(b7['getPropertyValue']('--notch-bottom') || '0', 0xa) || parseInt(b7['getPropertyValue']('--notch-left') || '0', 0xa);
};
TDV['Tour']['prototype']['hasNotch'] = function () {
  return this['getNotchValue']() > 0x0;
};
TDV['Tour']['prototype']['_getOrientation'] = function () {
  var b8 = this['_getRootPlayer']();
  if (b8) {
    return b8['get']('orientation');
  } else if (this['_lockedOrientation']) {
    return this['_lockedOrientation'];
  } else {
    return TDV['PlayerAPI']['getOrientation']();
  }
};
TDV['Tour']['prototype']['_getParams'] = function (b9) {
  var ba = {};
  b9['split']('&')['forEach'](function (bb) {
    var bc = bb['split']('=')[0x0],
      bd = decodeURIComponent(bb['split']('=')[0x1]);
    ba[bc['toLowerCase']()] = bd;
  });
  return ba;
};
TDV['Tour']['prototype']['_getRootPlayer'] = function () {
  return this['player'] !== undefined ? this['player']['getById']('rootPlayer') : undefined;
};
TDV['Tour']['prototype']['_setup'] = function () {
  if (!this['_orientation']) this['_orientation'] = this['_getOrientation']();
  this['_device'] = this['_getDevice']();
  this['_currentScriptUrl'] = this['_getScriptUrl']();
  if (this['isMobile']()) {
    var be = document['getElementById']('metaViewport');
    if (be) {
      var bf = this['_devicesUrl'][this['_device']];
      var bg = 0x1;
      if (typeof bf == 'object' && this['_orientation'] in bf && this['_orientation'] == TDV['PlayerAPI']['ORIENTATION_LANDSCAPE'] || this['_device'] == TDV['Tour']['DEVICE_GENERAL']) {
        bg = be['getAttribute']('data-tdv-general-scale') || 0.5;
      }
      var bh = be['getAttribute']('content');
      bh = bh['replace'](/initial-scale=(\d+(\.\d+)?)/, function (bi, bj) {
        return 'initial-scale=' + bg;
      });
      be['setAttribute']('content', bh);
    }
  }
};
TDV['Tour']['prototype']['_getScriptUrl'] = function () {
  var bk = this['_devicesUrl'][this['_device']];
  if (typeof bk == 'object') {
    if (this['_orientation'] in bk) {
      bk = bk[this['_orientation']];
    }
  }
  return bk;
};
TDV['Tour']['prototype']['_getDevice'] = function () {
  var bl = TDV['Tour']['DEVICE_GENERAL'];
  if (!this['_isRemoteSession'] && this['isMobile']()) {
    if (this['isIPad']() && TDV['Tour']['DEVICE_IPAD'] in this['_devicesUrl']) bl = TDV['Tour']['DEVICE_IPAD'];
    else if (TDV['Tour']['DEVICE_MOBILE'] in this['_devicesUrl']) bl = TDV['Tour']['DEVICE_MOBILE'];
  }
  return bl;
};
TDV['Tour']['prototype']['_setMediaFromURL'] = function (bm) {
  var bn = this['_getRootPlayer']();
  var bo = bn['getActivePlayerWithViewer'](bn['getMainViewer']());
  var bp = bo ? bn['getMediaFromPlayer'](bo) : undefined;
  var bq = undefined;
  if ('media' in bm) {
    var br = bm['media'];
    var bs = Number(br);
    bq = isNaN(bs) ? this['setMediaByName'](br) : this['setMediaByIndex'](bs - 0x1);
  } else if ('media-index' in bm) {
    bq = this['setMediaByIndex'](parseInt(bm['media-index']) - 0x1);
  } else if ('media-name' in bm) {
    bq = this['setMediaByName'](bm['media-name']);
  }
  if (bq == undefined) {
    bq = this['setMediaByIndex'](0x0);
  }
  if (bq != undefined) {
    var bt = bq['get']('player');
    var bu = function () {
      if ('trigger-overlay-name' in bm) {
        this['triggerOverlayByName'](bq['get']('media'), bm['trigger-overlay-name'], bm['trigger-overlay-event']);
      }
      if ('focus-overlay-name' in bm) {
        this['focusOverlayByName'](bq, bm['focus-overlay-name']);
      } else if ('yaw' in bm || 'pitch' in bm) {
        var by = parseFloat(bm['yaw']) || undefined;
        var bz = parseFloat(bm['pitch']) || undefined;
        var bA = bn['getPlayListWithItem'](bq);
        if (bA) bn['setPanoramaCameraWithSpot'](bA, bq, by, bz);
      }
    }['bind'](this);
    if (bt) {
      var bv = bt['get']('viewerArea') == bn['getMainViewer']();
      var bw = bn['getMediaFromPlayer'](bt);
      if (bv && bp == bq['get']('media') || !bv && bw == bq['get']('media')) {
        bu();
        return bq != undefined;
      }
    }
    var bx = function () {
      bq['unbind']('begin', bx, this);
      bu();
    };
    bq['bind']('begin', bx, bn);
  }
  return bq != undefined;
};
TDV['Tour']['prototype']['_setupRemote'] = function () {
  if (this['isMobile']() && TDV['Remote'] != undefined) {
    var bB = function () {
      var bC = undefined;
      var bD = function () {
        var bG = this['_getRootPlayer']();
        bC = bG['get']('lockedOrientation');
        bG['set']('lockedOrientation', this['_lockedOrientation']);
      }['bind'](this);
      this['_isRemoteSession'] = !![];
      this['_lockedOrientation'] = TDV['PlayerAPI']['ORIENTATION_LANDSCAPE'];
      if (this['_device'] != TDV['Tour']['DEVICE_GENERAL']) {
        var bE = function () {
          bD();
          this['unbind'](TDV['Tour']['EVENT_TOUR_INITIALIZED'], bE);
        }['bind'](this);
        this['bind'](TDV['Tour']['EVENT_TOUR_INITIALIZED'], bE);
        this['reload']();
      } else {
        bD();
      }
      var bF = function () {
        this['_isRemoteSession'] = ![];
        this['_getRootPlayer']()['set']('lockedOrientation', bC);
        TDV['Remote']['unbind'](TDV['Remote']['EVENT_CALL_END'], bF);
        var bH = this['_getScriptUrl']();
        if (this['_currentScriptUrl'] != bH) this['reload']();
      }['bind'](this);
      TDV['Remote']['bind'](TDV['Remote']['EVENT_CALL_END'], bF);
    }['bind'](this);
    TDV['Remote']['bind'](TDV['Remote']['EVENT_CALL_BEGIN'], bB);
  }
};
TDV['Tour']['prototype']['_updateParams'] = function (bI, bJ) {
  if (bJ && 'language' in bI) {
    var bK = bI['language'];
    if (this['locManager']['hasLocale'](bK)) {
      this['setLocale'](bK);
    }
  }
  var bL = function (bM, bN, bO) {
    var bP = bN['split'](',');
    for (var bQ = 0x0, bR = bP['length']; bQ < bR; ++bQ) {
      bM['call'](this, bP[bQ]['split']('+'), bO, 'and');
    }
  };
  if ('hide-components-tags' in bI || 'hct' in bI) bL['call'](this, this['setComponentsVisibilityByTags'], bI['hide-components-tags'] || bI['hct'], ![]);
  if ('show-components-tags' in bI || 'sct' in bI) bL['call'](this, this['setComponentsVisibilityByTags'], bI['show-components-tags'] || bI['sct'], !![]);
  if ('hide-overlays-tags' in bI || 'hot' in bI) bL['call'](this, this['setOverlaysVisibilityByTags'], bI['hide-overlays-tags'] || bI['hot'], ![]);
  if ('show-overlays-tags' in bI || 'sot' in bI) bL['call'](this, this['setOverlaysVisibilityByTags'], bI['show-overlays-tags'] || bI['sot'], !![]);
  if ('hide-overlays-names' in bI || 'hon' in bI) this['setOverlaysVisibilityByName'](decodeURIComponent(bI['hide-overlays-names'] || bI['hon'])['split'](','), ![]);
  if ('show-overlays-names' in bI || 'son' in bI) this['setOverlaysVisibilityByName'](decodeURIComponent(bI['show-overlays-names'] || bI['son'])['split'](','), !![]);
};
TDV['Tour']['LocaleManager'] = function (bS, bT, bU, bV) {
  TDV['EventDispatcher']['call'](this);
  this['rootPlayer'] = bS;
  this['locales'] = {};
  this['defaultLocale'] = bU;
  this['queryParam'] = bV;
  this['currentLocaleMap'] = {};
  this['currentLocaleID'] = undefined;
  for (var bW in bT) {
    this['registerLocale'](bW, bT[bW]);
  }
};
TDV['Tour']['LocaleManager']['EVENT_LOCALE_CHANGED'] = 'localeChanged';
TDV['Tour']['LocaleManager']['prototype'] = new TDV['EventDispatcher']();
TDV['Tour']['LocaleManager']['prototype']['registerLocale'] = function (bX, bY) {
  var bZ = [bX, bX['split']('-')[0x0]];
  for (var c0 = 0x0; c0 < bZ['length']; ++c0) {
    bX = bZ[c0];
    if (!(bX in this['locales'])) {
      this['locales'][bX] = bY;
    }
  }
};
TDV['Tour']['LocaleManager']['prototype']['unregisterLocale'] = function (c1) {
  delete this['locales'][c1];
  if (c1 == this['currentLocaleID']) {
    this['setLocale'](this['defaultLocale']);
  }
};
TDV['Tour']['LocaleManager']['prototype']['hasLocale'] = function (c2) {
  return c2 in this['locales'];
};
TDV['Tour']['LocaleManager']['prototype']['setLocale'] = function (c3) {
  var c4 = undefined;
  var c5 = c3['split']('-')[0x0];
  var c6 = [c3, c5];
  for (var c7 = 0x0; c7 < c6['length']; ++c7) {
    var c9 = c6[c7];
    if (c9 in this['locales']) {
      c4 = c9;
      break;
    }
  }
  if (c4 === undefined) {
    for (var c9 in this['locales']) {
      if (c9['indexOf'](c5) == 0x0) {
        c4 = c9;
        break;
      }
    }
  }
  if (c4 === undefined) {
    c4 = this['defaultLocale'];
  }
  var ca = this['locales'][c4];
  if (ca !== undefined && this['currentLocaleID'] != c4) {
    this['currentLocaleID'] = c4;
    var cb = this;
    if (typeof ca == 'string') {
      var cc = new XMLHttpRequest();
      cc['onreadystatechange'] = function () {
        if (cc['readyState'] == 0x4) {
          if (cc['status'] == 0xc8) {
            cb['locales'][c4] = cb['currentLocaleMap'] = cb['_parsePropertiesContent'](cc['responseText']);
            cb['dispatchEvent'](cb['createNewEvent'](TDV['Tour']['LocaleManager']['EVENT_LOCALE_CHANGED']));
          } else {
            throw ca + '\x20can\x27t\x20be\x20loaded';
          }
        }
      };
      var cd = ca;
      if (this['queryParam']) cd += (cd['indexOf']('?') == -0x1 ? '?' : '&') + this['queryParam'];
      cc['open']('GET', cd);
      cc['send']();
    } else {
      this['currentLocaleMap'] = ca;
      this['dispatchEvent'](this['createNewEvent'](TDV['Tour']['LocaleManager']['EVENT_LOCALE_CHANGED']));
    }
  }
};
TDV['Tour']['LocaleManager']['prototype']['trans'] = function (ce) {
  var cf = this['currentLocaleMap'][ce];
  if (cf && arguments['length'] > 0x2) {
    var cg = typeof arguments[0x2] == 'object' ? arguments[0x2] : undefined;
    var ch = arguments;

    function ci(cj) {
      return /^\d+$/['test'](cj);
    }
    cf = cf['replace'](/\{\{([\w\.]+)\}\}/g, function (ck, cl) {
      if (ci(cl)) cl = ch[parseInt(cl) + 0x1];
      else if (cg !== undefined) cl = cg[cl];
      if (typeof cl == 'string') cl = this['currentLocaleMap'][cl] || cl;
      else if (typeof cl == 'function') cl = cl['call'](this['rootPlayer']);
      return cl !== undefined ? cl : '';
    }['bind'](this));
  }
  return cf;
};
TDV['Tour']['LocaleManager']['prototype']['_parsePropertiesContent'] = function (cm) {
  cm = cm['replace'](/(^|\n)#[^\n]*/g, '');
  var cn = {};
  var co = cm['split']('\x0a');
  for (var cp = 0x0, cq = co['length']; cp < cq; ++cp) {
    var cr = co[cp]['trim']();
    if (cr['length'] == 0x0) {
      continue;
    }
    var cs = cr['indexOf']('=');
    if (cs == -0x1) {
      console['error']('Locale\x20parser:\x20Invalid\x20line\x20' + cp);
      continue;
    }
    var ct = cr['substr'](0x0, cs)['trim']();
    var cu = cr['substr'](cs + 0x1)['trim']();
    var cv;
    while ((cv = cu['lastIndexOf']('\x5c')) != -0x1 && cv == cu['length'] - 0x1 && ++cp < cq) {
      cu = cu['substr'](0x0, cu['length'] - 0x2);
      cr = co[cp];
      if (cr['length'] == 0x0) break;
      cu += '\x0a' + cr;
      cu = cu['trim']();
    }
    cn[ct] = cu;
  }
  return cn;
};
TDV['Tour']['HistoryData'] = function (cw) {
  this['playList'] = cw;
  this['list'] = [];
  this['pointer'] = -0x1;
};
TDV['Tour']['HistoryData']['prototype']['add'] = function (cx) {
  if (this['pointer'] < this['list']['length'] && this['list'][this['pointer']] == cx) {
    return;
  } ++this['pointer'];
  this['list']['splice'](this['pointer'], this['list']['length'] - this['pointer'], cx);
};
TDV['Tour']['HistoryData']['prototype']['back'] = function () {
  if (!this['canBack']()) return;
  this['playList']['set']('selectedIndex', this['list'][--this['pointer']]);
};
TDV['Tour']['HistoryData']['prototype']['forward'] = function () {
  if (!this['canForward']()) return;
  this['playList']['set']('selectedIndex', this['list'][++this['pointer']]);
};
TDV['Tour']['HistoryData']['prototype']['canBack'] = function () {
  return this['pointer'] > 0x0;
};
TDV['Tour']['HistoryData']['prototype']['canForward'] = function () {
  return this['pointer'] >= 0x0 && this['pointer'] < this['list']['length'] - 0x1;
};
TDV['Tour']['Script'] = function () { };
TDV['Tour']['Script']['assignObjRecursively'] = function (cy, cz) {
  for (var cA in cy) {
    var cB = cy[cA];
    if (typeof cB == 'object' && cB !== null) this['assignObjRecursively'](cy[cA], cz[cA] || (cz[cA] = {}));
    else cz[cA] = cB;
  }
  return cz;
};
TDV['Tour']['Script']['autotriggerAtStart'] = function (cC, cD, cE) {
  var cF = function (cG) {
    cD();
    if (cE == !![]) cC['unbind']('change', cF, this);
  };
  cC['bind']('change', cF, this);
};
TDV['Tour']['Script']['changeBackgroundWhilePlay'] = function (cH, cI, cJ) {
  var cK = function () {
    cL['unbind']('stop', cK, this);
    if (cJ == cN['get']('backgroundColor') && cQ == cN['get']('backgroundColorRatios')) {
      cN['set']('backgroundColor', cO);
      cN['set']('backgroundColorRatios', cP);
    }
  };
  var cL = cH['get']('items')[cI];
  var cM = cL['get']('player');
  var cN = cM['get']('viewerArea');
  var cO = cN['get']('backgroundColor');
  var cP = cN['get']('backgroundColorRatios');
  var cQ = [0x0];
  if (cJ != cO || cQ != cP) {
    cN['set']('backgroundColor', cJ);
    cN['set']('backgroundColorRatios', cQ);
    cL['bind']('stop', cK, this);
  }
};
TDV['Tour']['Script']['changeOpacityWhilePlay'] = function (cR, cS, cT) {
  var cU = function () {
    cV['unbind']('stop', cU, this);
    if (cY == cX['get']('backgroundOpacity')) {
      cX['set']('opacity', cY);
    }
  };
  var cV = cR['get']('items')[cS];
  var cW = cV['get']('player');
  var cX = cW['get']('viewerArea');
  var cY = cX['get']('backgroundOpacity');
  if (cT != cY) {
    cX['set']('backgroundOpacity', cT);
    cV['bind']('stop', cU, this);
  }
};
TDV['Tour']['Script']['changePlayListWithSameSpot'] = function (cZ, d0) {
  var d1 = cZ['get']('selectedIndex');
  if (d1 >= 0x0 && d0 >= 0x0 && d1 != d0) {
    var d2 = cZ['get']('items')[d1];
    var d3 = cZ['get']('items')[d0];
    var d4 = d2['get']('player');
    var d5 = d3['get']('player');
    if ((d4['get']('class') == 'PanoramaPlayer' || d4['get']('class') == 'Video360Player') && (d5['get']('class') == 'PanoramaPlayer' || d5['get']('class') == 'Video360Player')) {
      var d6 = this['cloneCamera'](d3['get']('camera'));
      this['setCameraSameSpotAsMedia'](d6, d2['get']('media'));
      var d7 = d6['get']('initialPosition');
      if (d7['get']('yaw') == undefined || d7['get']('pitch') == undefined || d7['get']('hfov') == undefined) return;
      this['startPanoramaWithCamera'](d3['get']('media'), d6);
    }
  }
};
TDV['Tour']['Script']['clone'] = function (d8, d9) {
  var da = this['rootPlayer']['createInstance'](d8['get']('class'));
  var db = d8['get']('id');
  if (db) {
    var dc = db + '_' + Math['random']()['toString'](0x24)['substring'](0x2, 0xf);
    da['set']('id', dc);
    this[dc] = da;
  }
  for (var dd = 0x0; dd < d9['length']; ++dd) {
    var de = d9[dd];
    var df = d8['get'](de);
    if (df != null) da['set'](de, df);
  }
  return da;
};
TDV['Tour']['Script']['cloneBindings'] = function (dg, dh, di) {
  var dj = dg['getBindings'](di);
  for (var dk = 0x0; dk < dj['length']; ++dk) {
    var dl = dj[dk];
    if (typeof dl == 'string') dl = new Function('event', dl);
    dh['bind'](di, dl, this);
  }
};
TDV['Tour']['Script']['cloneCamera'] = function (dm) {
  var dn = this['clone'](dm, ['manualRotationSpeed', 'manualZoomSpeed', 'automaticRotationSpeed', 'automaticZoomSpeed', 'timeToIdle', 'sequences', 'draggingFactor', 'hoverFactor']);
  var dp = ['initialSequence', 'idleSequence'];
  for (var dq = 0x0; dq < dp['length']; ++dq) {
    var dr = dp[dq];
    var ds = dm['get'](dr);
    if (ds) {
      var dt = this['clone'](ds, ['mandatory', 'repeat', 'restartMovementOnUserInteraction', 'restartMovementDelay']);
      dn['set'](dr, dt);
      var du = ds['get']('movements');
      var dv = [];
      var dw = ['easing', 'duration', 'hfovSpeed', 'pitchSpeed', 'yawSpeed', 'path', 'stereographicFactorSpeed', 'targetYaw', 'targetPitch', 'targetHfov', 'targetStereographicFactor', 'hfovDelta', 'pitchDelta', 'yawDelta'];
      for (var dx = 0x0; dx < du['length']; ++dx) {
        var dy = du[dx];
        var dz = this['clone'](dy, dw);
        var dA = dy['getBindings']('end');
        if (dA['length'] > 0x0) {
          for (var dB = 0x0; dB < dA['length']; ++dB) {
            var dC = dA[dB];
            if (typeof dC == 'string') {
              dC = dC['replace'](dm['get']('id'), dn['get']('id'));
              dC = new Function('event', dC);
              dz['bind']('end', dC, this);
            }
          }
        }
        dv['push'](dz);
      }
      dt['set']('movements', dv);
    }
  }
  return dn;
};
TDV['Tour']['Script']['copyObjRecursively'] = function (dD) {
  var dE = {};
  for (var dF in dD) {
    var dG = dD[dF];
    if (typeof dG == 'object' && dG !== null) dE[dF] = this['copyObjRecursively'](dD[dF]);
    else dE[dF] = dG;
  }
  return dE;
};
TDV['Tour']['Script']['copyToClipboard'] = function (dH) {
  if (navigator['clipboard']) {
    navigator['clipboard']['writeText'](dH);
  } else {
    var dI = document['createElement']('textarea');
    dI['value'] = dH;
    dI['style']['position'] = 'fixed';
    document['body']['appendChild'](dI);
    dI['focus']();
    dI['select']();
    try {
      document['execCommand']('copy');
    } catch (dJ) { }
    document['body']['removeChild'](dI);
  }
};
TDV['Tour']['Script']['executeFunctionWhenChange'] = function (dK, dL, dM, dN) {
  var dO = undefined;
  var dP = function (dS) {
    if (dS['data']['previousSelectedIndex'] == dL) {
      if (dN) dN['call'](this);
      if (dM && dO) dO['unbind']('end', dM, this);
      dK['unbind']('change', dP, this);
    }
  };
  if (dM) {
    var dQ = dK['get']('items')[dL];
    if (dQ['get']('class') == 'PanoramaPlayListItem') {
      var dR = dQ['get']('camera');
      if (dR != undefined) dO = dR['get']('initialSequence');
      if (dO == undefined) dO = dR['get']('idleSequence');
    } else {
      dO = dQ['get']('media');
    }
    if (dO) {
      dO['bind']('end', dM, this);
    }
  }
  dK['bind']('change', dP, this);
};
TDV['Tour']['Script']['executeJS'] = function (dT) {
  try {
    eval(dT);
  } catch (dU) {
    console['log']('Javascript\x20error:\x20' + dU);
    console['log']('\x20\x20\x20code:\x20' + dT);
  }
};
TDV['Tour']['Script']['fixTogglePlayPauseButton'] = function (dV) {
  var dW = dV['get']('buttonPlayPause');
  if (typeof dW !== 'undefined' && dV['get']('state') == 'playing') {
    if (!Array['isArray'](dW)) dW = [dW];
    for (var dX = 0x0; dX < dW['length']; ++dX) dW[dX]['set']('pressed', !![]);
  }
};
TDV['Tour']['Script']['getActiveMediaWithViewer'] = function (dY) {
  var dZ = this['getActivePlayerWithViewer'](dY);
  if (dZ == undefined) {
    return undefined;
  }
  return this['getMediaFromPlayer'](dZ);
};
TDV['Tour']['Script']['getActivePlayerWithViewer'] = function (e0) {
  var e1 = this['getCurrentPlayers']();
  var e2 = e1['length'];
  while (e2-- > 0x0) {
    var e3 = e1[e2];
    if (e3['get']('viewerArea') == e0) {
      var e4 = e3['get']('class');
      if (e4 == 'PanoramaPlayer' && (e3['get']('panorama') != undefined || e3['get']('video') != undefined) || (e4 == 'VideoPlayer' || e4 == 'Video360Player') && e3['get']('video') != undefined || e4 == 'PhotoAlbumPlayer' && e3['get']('photoAlbum') != undefined || e4 == 'MapPlayer' && e3['get']('map') != undefined) return e3;
    }
  }
  return undefined;
};
TDV['Tour']['Script']['getCurrentPlayerWithMedia'] = function (e5) {
  var e6 = undefined;
  var e7 = undefined;
  switch (e5['get']('class')) {
    case 'Panorama':
    case 'LivePanorama':
    case 'HDRPanorama':
      e6 = 'PanoramaPlayer';
      e7 = 'panorama';
      break;
    case 'Video360':
      e6 = 'PanoramaPlayer';
      e7 = 'video';
      break;
    case 'PhotoAlbum':
      e6 = 'PhotoAlbumPlayer';
      e7 = 'photoAlbum';
      break;
    case 'Map':
      e6 = 'MapPlayer';
      e7 = 'map';
      break;
    case 'Video':
      e6 = 'VideoPlayer';
      e7 = 'video';
      break;
  };
  if (e6 != undefined) {
    var e8 = this['getByClassName'](e6);
    for (var e9 = 0x0; e9 < e8['length']; ++e9) {
      var ea = e8[e9];
      if (ea['get'](e7) == e5) {
        return ea;
      }
    }
  } else {
    return undefined;
  }
};
TDV['Tour']['Script']['getCurrentPlayers'] = function () {
  var eb = this['getByClassName']('PanoramaPlayer');
  eb = eb['concat'](this['getByClassName']('VideoPlayer'));
  eb = eb['concat'](this['getByClassName']('Video360Player'));
  eb = eb['concat'](this['getByClassName']('PhotoAlbumPlayer'));
  eb = eb['concat'](this['getByClassName']('MapPlayer'));
  return eb;
};
TDV['Tour']['Script']['getGlobalAudio'] = function (ec) {
  var ed = window['currentGlobalAudios'];
  if (ed != undefined && ec['get']('id') in ed) {
    ec = ed[ec['get']('id')]['audio'];
  }
  return ec;
};
TDV['Tour']['Script']['getMediaByName'] = function (ee) {
  var ef = this['getByClassName']('Media');
  for (var eg = 0x0, eh = ef['length']; eg < eh; ++eg) {
    var ei = ef[eg];
    var ej = ei['get']('data');
    if (ej && ej['label'] == ee) {
      return ei;
    }
  }
  return undefined;
};
TDV['Tour']['Script']['getMediaByTags'] = function (ek, el) {
  return this['_getObjectsByTags'](ek, ['Media'], 'tags2Media', el);
};
TDV['Tour']['Script']['getAudioByTags'] = function (em, en) {
  return this['_getObjectsByTags'](em, ['Audio'], 'tags2Media', en);
};
TDV['Tour']['Script']['getOverlaysByTags'] = function (eo, ep) {
  return this['_getObjectsByTags'](eo, ['HotspotPanoramaOverlay', 'HotspotMapOverlay', 'VideoPanoramaOverlay', 'QuadVideoPanoramaOverlay', 'FramePanoramaOverlay', 'QuadFramePanoramaOverlay'], 'tags2Overlays', ep);
};
TDV['Tour']['Script']['getOverlaysByGroupname'] = function (eq) {
  var er = this['get']('data');
  var es = 'groupname2Overlays';
  var et = er[es];
  if (!et) {
    var eu = ['HotspotPanoramaOverlay', 'VideoPanoramaOverlay', 'QuadVideoPanoramaOverlay', 'FramePanoramaOverlay', 'QuadFramePanoramaOverlay'];
    er[es] = et = {};
    for (var ev = 0x0; ev < eu['length']; ++ev) {
      var ew = eu[ev];
      var ex = this['getByClassName'](ew);
      for (var ey = 0x0, ez = ex['length']; ey < ez; ++ey) {
        var eA = ex[ey];
        var eB = eA['get']('data');
        if (eB && eB['group']) {
          var eC = et[eB['group']];
          if (!eC) et[eB['group']] = eC = [];
          eC['push'](eA);
        }
      }
    }
  }
  return et[eq] || [];
};
TDV['Tour']['Script']['getRootOverlay'] = function (eD) {
  var eE = eD['get']('class');
  var eF = eE['indexOf']('HotspotPanoramaOverlayArea') != -0x1;
  var eG = eE['indexOf']('HotspotPanoramaOverlayImage') != -0x1;
  if (eF || eG) {
    var eH = this['get']('data');
    var eI = 'overlays';
    var eJ = eH[eI];
    if (!eJ) {
      var eK = ['HotspotPanoramaOverlay'];
      eJ = [];
      for (var eL = 0x0; eL < eK['length']; ++eL) {
        var eM = eK[eL];
        eJ = eJ['concat'](this['getByClassName'](eM));
      }
      eH[eI] = eJ;
    }
    var eN = eF ? 'areas' : 'items';
    for (var eO = 0x0, eP = eJ['length']; eO < eP; ++eO) {
      var eQ = eJ[eO];
      var eR = eQ['get'](eN);
      if (eR) {
        for (var eS = 0x0; eS < eR['length']; ++eS) {
          if (eR[eS] == eD) return eQ;
        }
      }
    }
  }
  return eD;
};
TDV['Tour']['Script']['initOverlayGroupRotationOnClick'] = function (eT) {
  var eU = this['getOverlaysByGroupname'](eT);
  if (eU['length'] > 0x1) {
    eU['sort'](function (f1, f2) {
      var f3 = f1['get']('data')['groupIndex'];
      var f4 = f2['get']('data')['groupIndex'];
      return f3 - f4;
    });
    for (var eV = 0x0, eW = eU['length']; eV < eW; ++eV) {
      var eX = eU[eV];
      var eY = eU[(eV + 0x1) % eW];
      var eZ = eX['get']('class');
      var f0 = eX;
      if (eZ == 'HotspotPanoramaOverlay') {
        f0 = eX['get']('areas')[0x0];
      }
      f0['bind']('click', function (f5, f6) {
        this['setOverlaysVisibility']([f5], ![]);
        this['setOverlaysVisibility']([f6], !![]);
      }['bind'](this, eX, eY), this);
    }
  }
};
TDV['Tour']['Script']['getComponentsByTags'] = function (f7, f8) {
  return this['_getObjectsByTags'](f7, ['UIComponent'], 'tags2Components', f8);
};
TDV['Tour']['Script']['_getObjectsByTags'] = function (f9, fa, fb, fc) {
  var fd = this['get']('data');
  var fe = fd[fb];
  if (!fe) {
    fd[fb] = fe = {};
    for (var ff = 0x0; ff < fa['length']; ++ff) {
      var fg = fa[ff];
      var fh = this['getByClassName'](fg);
      for (var fj = 0x0, fl = fh['length']; fj < fl; ++fj) {
        var fn = fh[fj];
        var fo = fn['get']('data');
        if (fo && fo['tags']) {
          var fp = fo['tags'];
          for (var fs = 0x0, ft = fp['length']; fs < ft; ++fs) {
            var fu = fp[fs];
            if (fu in fe) fe[fu]['push'](fn);
            else fe[fu] = [fn];
          }
        }
      }
    }
  }
  var fv = undefined;
  fc = fc || 'and';
  for (var fj = 0x0, fl = f9['length']; fj < fl; ++fj) {
    var fw = fe[f9[fj]];
    if (!fw) continue;
    if (!fv) fv = fw['concat']();
    else {
      if (fc == 'and') {
        for (var fs = fv['length'] - 0x1; fs >= 0x0; --fs) {
          if (fw['indexOf'](fv[fs]) == -0x1) fv['splice'](fs, 0x1);
        }
      } else if (fc == 'or') {
        for (var fs = fw['length'] - 0x1; fs >= 0x0; --fs) {
          var fn = fw[fs];
          if (fv['indexOf'](fn) == -0x1) fv['push'](fn);
        }
      }
    }
  }
  return fv || [];
};
TDV['Tour']['Script']['getComponentByName'] = function (fx) {
  var fy = this['getByClassName']('UIComponent');
  for (var fz = 0x0, fA = fy['length']; fz < fA; ++fz) {
    var fB = fy[fz];
    var fC = fB['get']('data');
    if (fC != undefined && fC['name'] == fx) {
      return fB;
    }
  }
  return undefined;
};
TDV['Tour']['Script']['getMainViewer'] = function () {
  var fD = 'MainViewer';
  return this[fD] || this[fD + '_mobile'];
};
TDV['Tour']['Script']['getMediaFromPlayer'] = function (fE) {
  switch (fE['get']('class')) {
    case 'PanoramaPlayer':
      return fE['get']('panorama') || fE['get']('video');
    case 'VideoPlayer':
    case 'Video360Player':
      return fE['get']('video');
    case 'PhotoAlbumPlayer':
      return fE['get']('photoAlbum');
    case 'MapPlayer':
      return fE['get']('map');
  }
};
TDV['Tour']['Script']['getMediaWidth'] = function (fF) {
  switch (fF['get']('class')) {
    case 'Video360':
      var fG = fF['get']('video');
      if (fG instanceof Array) {
        var fH = 0x0;
        for (var fI = 0x0; fI < fG['length']; fI++) {
          var fJ = fG[fI];
          if (fJ['get']('width') > fH) fH = fJ['get']('width');
        }
        return fH;
      } else {
        return fJ['get']('width');
      }
    default:
      return fF['get']('width');
  }
};
TDV['Tour']['Script']['getMediaHeight'] = function (fK) {
  switch (fK['get']('class')) {
    case 'Video360':
      var fL = fK['get']('video');
      if (fL instanceof Array) {
        var fM = 0x0;
        for (var fN = 0x0; fN < fL['length']; fN++) {
          var fO = fL[fN];
          if (fO['get']('height') > fM) fM = fO['get']('height');
        }
        return fM;
      } else {
        return fO['get']('height');
      }
    default:
      return fK['get']('height');
  }
};
TDV['Tour']['Script']['getOverlays'] = function (fP) {
  switch (fP['get']('class')) {
    case 'LivePanorama':
    case 'HDRPanorama':
    case 'Panorama':
      var fQ = fP['get']('overlays')['concat']() || [];
      var fR = fP['get']('frames');
      for (var fS = 0x0; fS < fR['length']; ++fS) {
        fQ = fQ['concat'](fR[fS]['get']('overlays') || []);
      }
      return fQ;
    case 'Video360':
    case 'Map':
      return fP['get']('overlays') || [];
    default:
      return [];
  }
};
TDV['Tour']['Script']['getPanoramaOverlayByName'] = function (fT, fU) {
  var fV = this['getOverlays'](fT);
  for (var fW = 0x0, fX = fV['length']; fW < fX; ++fW) {
    var fY = fV[fW];
    var fZ = fY['get']('data');
    if (fZ != undefined && fZ['label'] == fU) {
      return fY;
    }
  }
  return undefined;
};
TDV['Tour']['Script']['getPanoramaOverlaysByTags'] = function (g0, g1, g2) {
  var g3 = [];
  var g4 = this['getOverlays'](g0);
  var g5 = this['getOverlaysByTags'](g1, g2);
  for (var g6 = 0x0, g7 = g4['length']; g6 < g7; ++g6) {
    var g8 = g4[g6];
    if (g5['indexOf'](g8) != -0x1) g3['push'](g8);
  }
  return g3;
};
TDV['Tour']['Script']['getPixels'] = function (g9) {
  var gb = /((\+|-)?d+(.d*)?)(px|vw|vh|vmin|vmax)?/i['exec'](g9);
  if (gb == undefined) {
    return 0x0;
  }
  var gc = parseFloat(gb[0x1]);
  var gd = gb[0x4];
  var ge = this['rootPlayer']['get']('actualWidth') / 0x64;
  var gf = this['rootPlayer']['get']('actualHeight') / 0x64;
  switch (gd) {
    case 'vw':
      return gc * ge;
    case 'vh':
      return gc * gf;
    case 'vmin':
      return gc * Math['min'](ge, gf);
    case 'vmax':
      return gc * Math['max'](ge, gf);
    default:
      return gc;
  }
};
TDV['Tour']['Script']['getPlayListsWithMedia'] = function (gg, gh) {
  var gi = [];
  var gj = this['getByClassName']('PlayList');
  for (var gk = 0x0, gl = gj['length']; gk < gl; ++gk) {
    var gm = gj[gk];
    if (gh && gm['get']('selectedIndex') == -0x1) continue;
    var gn = this['getPlayListItemByMedia'](gm, gg);
    if (gn != undefined && gn['get']('player') != undefined) gi['push'](gm);
  }
  return gi;
};
TDV['Tour']['Script']['_getPlayListsWithViewer'] = function (go) {
  var gp = this['getByClassName']('PlayList');
  var gq = function (gs) {
    var gt = gs['get']('items');
    for (var gu = gt['length'] - 0x1; gu >= 0x0; --gu) {
      var gv = gt[gu];
      var gw = gv['get']('player');
      if (gw !== undefined && gw['get']('viewerArea') == go) return !![];
    }
    return ![];
  };
  for (var gr = gp['length'] - 0x1; gr >= 0x0; --gr) {
    if (!gq(gp[gr])) gp['splice'](gr, 0x1);
  }
  return gp;
};
TDV['Tour']['Script']['getPlayListWithItem'] = function (gx) {
  var gy = this['getByClassName']('PlayList');
  for (var gz = gy['length'] - 0x1; gz >= 0x0; --gz) {
    var gA = gy[gz];
    var gB = gA['get']('items');
    for (var gC = gB['length'] - 0x1; gC >= 0x0; --gC) {
      var gD = gB[gC];
      if (gD == gx) return gA;
    }
  }
  return undefined;
};
TDV['Tour']['Script']['getFirstPlayListWithMedia'] = function (gE, gF) {
  var gG = this['getPlayListsWithMedia'](gE, gF);
  return gG['length'] > 0x0 ? gG[0x0] : undefined;
};
TDV['Tour']['Script']['getPlayListItemByMedia'] = function (gH, gI) {
  var gJ = gH['get']('items');
  for (var gK = 0x0, gL = gJ['length']; gK < gL; ++gK) {
    var gM = gJ[gK];
    if (gM['get']('media') == gI) return gM;
  }
  return undefined;
};
TDV['Tour']['Script']['getPlayListItemIndexByMedia'] = function (gN, gO) {
  var gP = this['getPlayListItemByMedia'](gN, gO);
  return gP ? gN['get']('items')['indexOf'](gP) : -0x1;
};
TDV['Tour']['Script']['getPlayListItems'] = function (gQ, gR) {
  var gS = function () {
    switch (gQ['get']('class')) {
      case 'Panorama':
      case 'LivePanorama':
      case 'HDRPanorama':
        return 'PanoramaPlayListItem';
      case 'Video360':
        return 'Video360PlayListItem';
      case 'PhotoAlbum':
        return 'PhotoAlbumPlayListItem';
      case 'Map':
        return 'MapPlayListItem';
      case 'Video':
        return 'VideoPlayListItem';
    }
  }();
  if (gS != undefined) {
    var gT = this['getByClassName'](gS);
    for (var gU = gT['length'] - 0x1; gU >= 0x0; --gU) {
      var gV = gT[gU];
      if (gV['get']('media') != gQ || gR != undefined && gV['get']('player') != gR) {
        gT['splice'](gU, 0x1);
      }
    }
    return gT;
  } else {
    return [];
  }
};
TDV['Tour']['Script']['historyGoBack'] = function (gW) {
  var gX = this['get']('data')['history'][gW['get']('id')];
  if (gX != undefined) {
    gX['back']();
  }
};
TDV['Tour']['Script']['historyGoForward'] = function (gY) {
  var gZ = this['get']('data')['history'][gY['get']('id')];
  if (gZ != undefined) {
    gZ['forward']();
  }
};
TDV['Tour']['Script']['init'] = function () {
  var h0 = this['get']('data')['history'];
  var h1 = function (ha) {
    var hb = ha['source'];
    var hc = hb['get']('selectedIndex');
    if (hc < 0x0) return;
    var hd = hb['get']('id');
    if (!h0['hasOwnProperty'](hd)) h0[hd] = new TDV['Tour']['HistoryData'](hb);
    h0[hd]['add'](hc);
  };
  var h2 = this['getByClassName']('PlayList');
  for (var h4 = 0x0, h5 = h2['length']; h4 < h5; ++h4) {
    var h6 = h2[h4];
    h6['bind']('change', h1, this);
  }
  if (this['getMainViewer']()['get']('translationTransitionEnabled')) {
    var h7 = this['getByClassName']('ThumbnailList');
    h7 = h7['concat'](this['getByClassName']('ThumbnailGrid'));
    h7 = h7['concat'](this['getByClassName']('DropDown'));

    function he(hf) {
      var hg = hf['source']['get']('playList');
      var hh = hg['get']('selectedIndex');
      if (hh >= 0x0) {
        this['skip3DTransitionOnce'](hg['get']('items')[hh]['get']('player'));
      }
    }
    for (var h4 = 0x0, h8 = h7['length']; h4 < h8; ++h4) {
      var h9 = h7[h4];
      h9['bind']('change', he, this);
    }
  }
};
TDV['Tour']['Script']['sendAnalyticsData'] = function (gP, gQ, gR, gS) {
  if (window['dataLayer']) {
    window['dataLayer']['push']({
      'event': gQ,
      'label': gR,
      'category': gP
    });
  }
  if (!this['get']('data')['tour']['player']['cookiesEnabled']) return;
  if (window['ga']) {
    window['ga']('send', 'event', gP, gQ, gR);
  }
  if (window['gtag']) {
    window['gtag']('event', gQ, {
      'category': gP,
      'label': gR
    });
  }
  if (gP) {
    if (gP == 'Hotspot') {
      onHotspotClicked(gS);
    } else if (gP == 'Media' && gR) {
      console.log(gR);
    }
  }
};
TDV['Tour']['Script']['initAnalytics'] = function () {
  var hl = this['getByClassName']('Panorama');
  hl = hl['concat'](this['getByClassName']('Video360'));
  hl = hl['concat'](this['getByClassName']('Map'));
  for (var ho = 0x0, hr = hl['length']; ho < hr; ++ho) {
    var hs = hl[ho];
    var hu = hs['get']('data');
    var hv = hu ? hu['label'] : '';
    var hw = this['getOverlays'](hs);
    for (var hx = 0x0, hy = hw['length']; hx < hy; ++hx) {
      var hz = hw[hx];
      var hA = hz['get']('data') != undefined ? hv + '\x20-\x20' + hz['get']('data')['label'] : hv;
      switch (hz['get']('class')) {
        case 'FlatHotspotPanoramaOverlay':
        case 'HotspotPanoramaOverlay':
        case 'HotspotMapOverlay':
        case 'AreaHotspotMapOverlay':
          var hB = hz['get']('areas');
          for (var hC = 0x0; hC < hB['length']; ++hC) {
            hB[hC]['bind']('click', this['sendAnalyticsData']['bind'](this, 'Hotspot', 'click', hA, hz), this, ![]);
          }
          break;
        case 'CeilingCapPanoramaOverlay':
        case 'TripodCapPanoramaOverlay':
          hz['bind']('click', this['sendAnalyticsData']['bind'](this, 'Cap', 'click', hA), this, ![]);
          break;
        case 'QuadVideoPanoramaOverlay':
        case 'VideoPanoramaOverlay':
          hz['bind']('click', this['sendAnalyticsData']['bind'](this, 'Hotspot', 'click', hA), this, ![]);
          hz['bind']('start', this['sendAnalyticsData']['bind'](this, 'Hotspot', 'start', hA), this, ![]);
          break;
        case 'QuadFramePanoramaOverlay':
        case 'FramePanoramaOverlay':
          hz['bind']('click', this['sendAnalyticsData']['bind'](this, 'Hotspot', 'click', hA), this, ![]);
          break;
      }
    }
  }
  var hD = this['getByClassName']('UIComponent');
  for (var ho = 0x0, hr = hD['length']; ho < hr; ++ho) {
    var hE = hD[ho];
    var hF = hE['getBindings']('click');
    if (hF['length'] > 0x0) {
      var hG = hE['get']('data')['name'];
      hE['bind']('click', this['sendAnalyticsData']['bind'](this, 'Skin', 'click', hG), this, ![]);
    }
  }
  var hH = this['getByClassName']('PlayListItem');
  var hI = {};
  for (var ho = 0x0, hr = hH['length']; ho < hr; ++ho) {
    var hJ = hH[ho];
    var hl = hJ['get']('media');
    if (!(hl['get']('id') in hI)) {
      var hu = hl['get']('data');
      hJ['bind']('begin', this['sendAnalyticsData']['bind'](this, 'Media', 'play', hu ? hu['label'] : undefined), this, ![]);
      hI[hl['get']('id')] = hJ;
    }
  }
  if (TDV['Remote'] != undefined) {
    var hK = undefined;
    TDV['Remote']['bind'](TDV['Remote']['EVENT_CALL_BEGIN'], function (hL) {
      hK = Date['now']();
      this['sendAnalyticsData']('Live\x20Guided\x20Tour', 'Start\x20Call', 'Guest:\x20' + hL);
    }['bind'](this));
    TDV['Remote']['bind'](TDV['Remote']['EVENT_CALL_END'], function (hM) {
      var hN = new Date();
      hN['setTime'](Date['now']() - hK);
      this['sendAnalyticsData']('Live\x20Guided\x20Tour', 'End\x20Call', 'Guest:\x20' + hM + '\x20Duration:\x20' + hN['toUTCString']()['split']('\x20')[0x4]);
    }['bind'](this));
  }
};
TDV['Tour']['Script']['initQuiz'] = function (hP, hQ, hR) {
  var hS = {
    "timeout": {
      "veil": {
        "backgroundColor": "#000000",
        "backgroundOpacity": 0.3
      },
      "window": {
        "shadowOpacity": 0.3,
        "shadowVerticalLength": 0,
        "paddingLeft": 80,
        "shadowHorizontalLength": 0,
        "paddingBottom": 55,
        "paddingRight": 80,
        "backgroundColor": "#ffffff",
        "paddingTop": 45,
        "title": {
          "fontFamily": "Arial",
          "textAlign": "center",
          "fontColor": "#000000",
          "paddingBottom": 20,
          "fontSize": 40,
          "fontWeight": "bold"
        },
        "buttonsContainer": {
          "width": "100%",
          "horizontalAlign": "center",
          "gap": 10
        },
        "icon": {
          "height": 72,
          "width": 62,
          "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAABGCAYAAAB/h5zrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABhRJREFUeNrsW41y2jgQliVjGxMuhDR37/92l2uvhVIcjGtzuLO6aBRpdyVb9G4azWiABKH99n9XcibSj9V13geu6a7z7+scUhAkbwB6GbFmAVP8X0H/58Y76HfQ76DfQYeOLmLNGKq+pyIouxFzS3jNkZg9MucrvB8B96mIyW8EumV858L8XlLQC5DKqGqHSDX9WeMe6G+BdpZ6jwseDZsfIC0MBa6M7KqEzwr5/hlUu4P3MYzeXGdtfG6uc0eBtgGLQOAjqAo2nppKjnuejBkK2Ak8YwI2ifgTcVYrAJxi9ED80VOIrGH6xr/A8wDAvhBXwmZFYjtVsM8KgB8cAsOG1oCdCgCsw0pjMOAeprqhk8qA0bUV2jKGlo04lQLin5iJioJNxu9+uIF0qcSqhtcugPmLDNA//UppaA5c6lIW7RB+WtjHlYQooCUHOqqUKXJmqMrjzMA7cDinyLZPCV2XembMu8yykTmAn8GztjPa7grmVOmPIavJHBvontYooW0AEwYoGJqEIesh0HnuwPEWgKcTDm93MWz8An+rmNL9BK+pxgUYOjBp6g3QZ9PEFMHZLaP8HAn5bDApRHJ5hL13ILUlQZs0BPJmY994ZJSee1cVwxg1xPkV0HAKXD+Az6CAly5HKhGiCoaEj4wMSCIpofB4ZwkES0LinAOBe66kt8SGI/e+EJs9Qa5cA4FmJ6QytGgk+ptF0++gBePaF8R0BvjtmpFFdhjomviRnmHDo5TujFxAAvFmJ0UazsaU1p3hqDLY50zQY7akfBp3xDona0YYGBg2R33eIZHABQobB2DUApF2rcOpLekK1GqKHWtQujBpIX5zvXtvrD0ExP2OoF3q38oRB+PjKHc0ExKVmLW67PVhKLR9K4sTG4KQF8//1mCLF5GmXy3h97cgzbPHxHpC2j8cmrQ4gQ2fWq8AdAVEqZnBrsGbr+GzEnjvHOvhLW31LikOIZ7aLlf7GcDGFhlHRGMLG3RBxGVM7Ssmp+cAO0Am6BtUdVfmzMZaSzDk2WhIxNTOykhkqMLmM7FHTzRF8pyRgwtG9dQHqPRoDr8ZRPVMP7BnhkvBBZ0TMXeuCy+1w94UA8Au0GwwASw4B3jfGeUhR60lSNjWjoJwSntPo0MKf+MfZRBH0lg+q3vl48Z/EcALq8b9hEhf5+StpxgqjAzyo6fhQBbaMb2nylrPabS7HGPjcIwfEedZMJ0vCTrGZvsQlbL+X3pSX453PgY4WFS9Y1LHBkq/JdTDFGidOkqQ1h8Om+bk23tDC3z5Q8YBHfudY0AY0d3SjeEElaNg4IxTgClFSVoazmrq0N1M+9zpGNlrw6KK18xyZqG+EPM17/UBuz48THGtA5P0kDOzmIoAvQHn1CIdkSlZnB3ajkj+LQnQZ8n0hBVBTG20ZGqRZtRWORtD649wKZlFhUK4l4V4zgljQHpu3O5PZyclVMzzcffFsMsO6a5MHQfwBWfEhBSR1jYuqWwJ9XgWCW/yzTA2hKSf7R6ZzlmXRPjiHsHovtYCGBVy1lVBcZJDOOWsXQi8x3fWOUXuCCdYfatPHDjhyzzrLiG95MbYrQFeMSMC9ZxII5BC48BQIcnkPOZR9QMtFZEBcrLGFWHLPQW6IexWWXUxp9vSeACvxNsOamslLN8YzKWkfOCkaxfCoS0YHv8E9nhyaE9lVVqtxehGvF7j6Bg1fUaEqT0HdCdeL7BivS6sNWzeanDF9tqIuQeHs6Kcn76OQan/m1I1I36Uc6kOSwkphxXbQeXecDy4fBQmyYvg3e8ojIIkJCxdIkKZjiAPgnel80toCaYXSkEf+eTi9a5mqmcvJIC9Y6S6A/TgLjGgtZNRjH6U7qKUERUUJ8l5YPbE9L30XsS0VQJTPFfIakT8jcEF7LcU/MYl6yJ+aEUUCtwMX/oRBd+TOKVRMJQi/PST/chFTBlI3aD/GaOD0MQyqZiz5DPMStzuuS4qZO5CTCib6GA2It0zG5x2016EX7ybRVK3eobDtF3deo7q0M6pnqnBTwabsp+lxOsFODUDUDP0zTJSOyIFGqCfwssFfd+zN8Jbkmcv/xFgALaVsLLFsFFBAAAAAElFTkSuQmCC"
        },
        "button": {
          "fontFamily": "Arial",
          "verticalAlign": "middle",
          "backgroundColor": "#009fe3",
          "fontColor": "#ffffff",
          "paddingBottom": 12,
          "paddingTop": 12,
          "paddingRight": 25,
          "paddingLeft": 25,
          "fontSize": 15,
          "horizontalAlign": "center",
          "fontWeight": "bold"
        },
        "shadow": true,
        "shadowBlurRadius": 4,
        "shadowColor": "#000000",
        "shadowSpread": 4,
        "horizontalAlign": "center",
        "gap": 15
      }
    },
    "score": {
      "veil": {
        "backgroundColor": "#000000",
        "backgroundOpacity": 0.3
      },
      "window": {
        "shadowOpacity": 0.3,
        "maxWidth": 1500,
        "paddingLeft": 20,
        "paddingTop": 20,
        "description": {
          "fontFamily": "Arial",
          "textAlign": "center",
          "fontColor": "#000000",
          "paddingBottom": 15,
          "paddingRight": 100,
          "paddingLeft": 100,
          "fontSize": 16,
          "fontWeight": "normal",
          "paddingTop": 15
        },
        "paddingBottom": 20,
        "calification": {
          "fontFamily": "Arial",
          "width": "100%",
          "verticalAlign": "middle",
          "textAlign": "center",
          "fontColor": "#009fe3",
          "paddingBottom": 10,
          "paddingRight": 100,
          "paddingLeft": 100,
          "fontSize": 30,
          "fontWeight": "bold",
          "paddingTop": 15
        },
        "paddingRight": 20,
        "shadowVerticalLength": 0,
        "backgroundColor": "#ffffff",
        "title": {
          "fontFamily": "Arial",
          "textAlign": "center",
          "fontColor": "#000000",
          "paddingBottom": 15,
          "fontSize": 50,
          "fontWeight": "bold",
          "paddingTop": 50
        },
        "timeContainer": {
          "width": "100%",
          "verticalAlign": "middle",
          "paddingTop": 10,
          "paddingBottom": 15,
          "paddingRight": 100,
          "paddingLeft": 100,
          "horizontalAlign": "center",
          "gap": 5
        },
        "stats": {
          "borderRadius": 75,
          "borderSize": 1,
          "layout": "vertical",
          "mainValue": {
            "fontFamily": "Arial",
            "fontSize": 40,
            "fontColor": "#000000",
            "fontWeight": "bold"
          },
          "height": 150,
          "minWidth": 150,
          "secondaryValue": {
            "fontFamily": "Arial",
            "fontSize": 20,
            "fontColor": "#000000",
            "fontWeight": "bold"
          },
          "label": {
            "fontFamily": "Arial",
            "fontSize": 15,
            "fontColor": "#000000",
            "fontWeight": "normal"
          },
          "verticalAlign": "middle",
          "horizontalAlign": "center",
          "borderColor": "#009fe3",
          "gap": 0,
          "title": {
            "fontFamily": "Arial",
            "fontColor": "#000000",
            "paddingRight": 5,
            "paddingLeft": 5,
            "fontSize": 20,
            "fontWeight": "normal",
            "paddingTop": 10
          }
        },
        "buttonsContainer": {
          "width": "100%",
          "verticalAlign": "middle",
          "horizontalAlign": "center",
          "button": {
            "fontFamily": "Arial",
            "verticalAlign": "middle",
            "backgroundColor": "#009fe3",
            "fontColor": "#ffffff",
            "paddingBottom": 12,
            "paddingTop": 12,
            "paddingRight": 25,
            "paddingLeft": 25,
            "fontSize": 15,
            "horizontalAlign": "center",
            "fontWeight": "bold"
          },
          "paddingBottom": 50,
          "paddingRight": 100,
          "paddingLeft": 100,
          "paddingTop": 35,
          "gap": 8
        },
        "statsContainer": {
          "verticalAlign": "middle",
          "paddingTop": 15,
          "paddingBottom": 15,
          "paddingRight": 100,
          "paddingLeft": 100,
          "horizontalAlign": "center",
          "overflow": "scroll",
          "gap": 20,
          "contentOpaque": true
        },
        "content": {
          "horizontalAlign": "center",
          "width": "100%"
        },
        "minWidth": 500,
        "shadow": true,
        "closeButton": {
          "iconWidth": 18,
          "iconColor": "#ffffff",
          "iconHeight": 18,
          "height": 45,
          "width": 45,
          "backgroundColor": "#009fe3",
          "iconLineWidth": 2
        },
        "shadowBlurRadius": 4,
        "shadowColor": "#000000",
        "shadowSpread": 4,
        "horizontalAlign": "center",
        "shadowHorizontalLength": 0
      }
    },
    "question": {
      "veil": {
        "backgroundColor": "#000000",
        "backgroundOpacity": 0.3
      },
      "window": {
        "bodyContainer": {
          "layout": "horizontal",
          "width": "100%",
          "paddingBottom": 30,
          "height": "100%",
          "paddingRight": 30,
          "paddingLeft": 30,
          "gap": 35
        },
        "borderRadius": 5,
        "mediaContainer": {
          "height": "100%",
          "width": "70%",
          "buttonNext": {
            "height": 37,
            "width": 25,
            "iconURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAlCAMAAACAj7KHAAAAA3NCSVQICAjb4U/gAAAAS1BMVEX///8AAAAAAAAAAAAAAACVlZWLi4uDg4MAAAC8vLx8fHx5eXl2dnZ0dHRxcXHDw8PAwMBra2tjY2PY2NiLi4v7+/v5+fn////7+/sWSBTRAAAAGXRSTlMAESIzRFVVVVVmZmZmZmZ3d3d3mZnu7v//nfgMagAAAAlwSFlzAAAK6wAACusBgosNWgAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDYvMjkvMTUTtAt+AAAAjElEQVQokbXTyRaAIAgFUJHmeTL7/y9Naie+Toti2T0R4suYH4qI0HNKGpGV0iYwuoLFlEzeu0YT2dqH2jtFZHN3UR9T6FamKQi3O6Q+STL2O4r6WR4QcTZfdIQjR6NzttxUaKk2Eb/qdql34HfgbPA8eAdwb3jXD/eD7xTnAGcH5g1n9CHXBv8Ln9UJhXMPrAhUbYMAAAAASUVORK5CYII="
          },
          "buttonPrevious": {
            "height": 37,
            "width": 25,
            "iconURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAlCAMAAACAj7KHAAAAA3NCSVQICAjb4U/gAAAAS1BMVEX///8AAAAAAAAAAAAAAACVlZWLi4uDg4MAAAC8vLx8fHx5eXl2dnZ0dHRxcXHDw8PAwMBra2tjY2PY2NiLi4v7+/v5+fn////7+/sWSBTRAAAAGXRSTlMAESIzRFVVVVVmZmZmZmZ3d3d3mZnu7v//nfgMagAAAAlwSFlzAAAK6wAACusBgosNWgAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDYvMjkvMTUTtAt+AAAAkElEQVQokbXSyRaDIAwFUALOQ7W2iP//pQK6CGheF55mmXuYwlPqn0VEUp/uzPd0qAuFvqnsdKEInXVuziTCsDpfraYcxgi25MKh5rsxWHvDhMMIIJWf8EpAeei2CO/CJK8kXR2w5ED6E8B9m0zkNegc8W7ye8AM5LmBWYP/AX8KcgCyA/IGMqrkXJ92239aO3W4D6yL2ECSAAAAAElFTkSuQmCC"
          },
          "viewerArea": {
            "playbackBarHeadBorderRadius": 7,
            "backgroundOpacity": 1,
            "playbackBarHeadHeight": 14,
            "backgroundColor": "#e6e6e6",
            "playbackBarHeadShadowSpread": 2,
            "playbackBarProgressOpacity": 0.5,
            "playbackBarHeadShadowHorizontalLength": 0,
            "playbackBarHeadWidth": 14,
            "playbackBarHeadShadowColor": "#000000",
            "playbackBarBorderRadius": 0,
            "playbackBarHeadBorderSize": 3,
            "playbackBarHeadShadow": true,
            "playbackBarHeadBorderColor": "#ffffff",
            "playbackBarHeadShadowVerticalLength": 0,
            "playbackBarBackgroundOpacity": 0.5,
            "playbackBarBackgroundColor": "#000000",
            "playbackBarRight": 0,
            "playbackBarBorderSize": 0,
            "playbackBarHeadShadowBlurRadius": 2,
            "playbackBarHeight": 6,
            "playbackBarProgressBackgroundColor": "#3399ff",
            "playbackBarHeadShadowOpacity": 0.3,
            "playbackBarHeadOpacity": 1,
            "playbackBarHeadBackgroundColor": "#cccccc",
            "playbackBarLeft": 0,
            "playbackBarBottom": 5
          }
        },
        "backgroundOpacity": 1,
        "height": "60%",
        "shadowBlurRadius": 4,
        "backgroundColor": "#ffffff",
        "width": "60%",
        "buttonsContainer": {
          "verticalAlign": "bottom",
          "horizontalAlign": "right",
          "button": {
            "fontFamily": "Arial",
            "verticalAlign": "middle",
            "borderRadius": 3,
            "fontWeight": "bold",
            "paddingBottom": 10,
            "backgroundOpacity": 0.7,
            "paddingRight": 25,
            "backgroundColor": "#000000",
            "paddingTop": 10,
            "fontColor": "#ffffff",
            "paddingLeft": 25,
            "fontSize": 18,
            "horizontalAlign": "center"
          }
        },
        "shadowHorizontalLength": 0,
        "shadowColor": "#000000",
        "shadowSpread": 4,
        "paddingTop": 20,
        "shadowOpacity": 0.3,
        "paddingLeft": 20,
        "horizontalAlign": "center",
        "paddingBottom": 20,
        "paddingRight": 20,
        "title": {
          "fontFamily": "Arial",
          "textAlign": "center",
          "fontColor": "#000000",
          "paddingBottom": 40,
          "paddingRight": 50,
          "paddingLeft": 50,
          "fontSize": 20,
          "fontWeight": "bold",
          "paddingTop": 25
        },
        "option": {
          "text": {
            "fontFamily": "Arial",
            "textAlign": "left",
            "fontColor": "#404040",
            "verticalAlign": "middle",
            "fontSize": 18,
            "paddingTop": 9,
            "selected": {
              "fontFamily": "Arial",
              "fontSize": 18,
              "fontColor": "#000000",
              "paddingTop": 9,
              "textAlign": "left"
            }
          },
          "label": {
            "fontFamily": "Arial",
            "incorrect": {
              "fontFamily": "Arial",
              "borderRadius": 19,
              "fontWeight": "bold",
              "backgroundOpacity": 1,
              "height": 38,
              "backgroundColor": "#ed1c24",
              "pressedBackgroundOpacity": 1,
              "fontColor": "#ffffff",
              "width": 38,
              "verticalAlign": "middle",
              "fontSize": 18,
              "horizontalAlign": "center"
            },
            "borderRadius": 19,
            "fontWeight": "bold",
            "backgroundOpacity": 0.2,
            "height": 38,
            "backgroundColor": "#000000",
            "correct": {
              "fontFamily": "Arial",
              "borderRadius": 19,
              "fontWeight": "bold",
              "backgroundOpacity": 1,
              "height": 38,
              "backgroundColor": "#39b54a",
              "pressedBackgroundOpacity": 1,
              "fontColor": "#ffffff",
              "width": 38,
              "verticalAlign": "middle",
              "fontSize": 18,
              "horizontalAlign": "center"
            },
            "pressedBackgroundOpacity": 1,
            "fontColor": "#ffffff",
            "width": 38,
            "verticalAlign": "middle",
            "fontSize": 18,
            "horizontalAlign": "center"
          },
          "gap": 10
        },
        "minWidth": 500,
        "shadow": true,
        "closeButton": {
          "iconWidth": 18,
          "iconColor": "#FFFFFF",
          "iconHeight": 18,
          "height": 45,
          "width": 45,
          "backgroundColor": "#009FE3",
          "iconLineWidth": 2
        },
        "shadowVerticalLength": 0,
        "optionsContainer": {
          "height": "100%",
          "width": "30%",
          "overflow": "scroll",
          "gap": 10,
          "contentOpaque": true
        }
      }
    }
  };
  hP['theme'] = 'theme' in hP ? this['mixObject'](hS, hP['theme']) : hS;
  var hT = hP['data'] && hP['data']['titlesScale'] ? hP['data']['titlesScale'] : 0x1;
  var hU = hP['data'] && hP['data']['bodyScale'] ? hP['data']['bodyScale'] : 0x1;
  if (hP['player']['get']('isMobile')) {
    var hV = this['mixObject'](hP['theme'], {
      'question': {
        'window': {
          'width': '100%',
          'height': '100%',
          'minWidth': undefined,
          'backgroundOpacity': 0x1,
          'borderRadius': 0x0,
          'paddingLeft': 0x0,
          'paddingRight': 0x0,
          'paddingBottom': 0x0,
          'paddingTop': 0x0,
          'verticalAlign': 'middle',
          'title': {
            'paddingBottom': 0x19,
            'paddingTop': 0x19
          },
          'bodyContainer': {
            'layout': 'vertical',
            'horizontalAlign': 'center',
            'paddingLeft': 0x0,
            'paddingRight': 0x0,
            'gap': 0x14
          },
          'mediaContainer': {
            'width': '100%',
            'height': '45%'
          },
          'optionsContainer': {
            'width': '100%',
            'height': '55%',
            'paddingLeft': 0x14,
            'paddingRight': 0x14
          }
        }
      },
      'score': {
        'window': {
          'description': {
            'paddingLeft': 0xa,
            'paddingRight': 0xa
          },
          'calification': {
            'fontSize': 0x14 * hU,
            'paddingLeft': 0xa,
            'paddingRight': 0xa
          }
        }
      }
    });
    hP['theme'] = hV;
  }
  var hW = this['get']('data');
  var hX = document['getElementById']('metaViewport');
  var hY = hX ? /initial-scale=(\d+(\.\d+)?)/['exec'](hX['getAttribute']('content')) : undefined;
  var hZ = hY ? hY[0x1] : 0x1;
  hW['scorePortraitConfig'] = {
    'theme': {
      'window': {
        'minWidth': 0xfa / hZ,
        'maxHeight': 0x258 / hZ,
        'content': {
          'height': '100%'
        },
        'statsContainer': {
          'layout': 'vertical',
          'horizontalAlign': 'center',
          'maxHeight': 0x258,
          'paddingLeft': 0x0,
          'paddingRight': 0x0,
          'width': '100%',
          'height': '100%'
        },
        'buttonsContainer': {
          'paddingLeft': 0xa,
          'paddingRight': 0xa,
          'button': {
            'paddingLeft': 0xf,
            'paddingRight': 0xf
          }
        }
      }
    }
  };
  hW['scoreLandscapeConfig'] = {
    'theme': {
      'window': {
        'title': {
          'fontSize': 0x1e * hT,
          'paddingTop': 0xa
        },
        'stats': {
          'height': 0x64
        },
        'buttonsContainer': {
          'paddingBottom': 0x14,
          'paddingTop': 0xa
        },
        'description': {
          'paddingBottom': 0x5,
          'paddingTop': 0x5
        }
      }
    }
  };
  var i0 = new TDV['Quiz'](hP);
  i0['setMaxListeners'](0x32);
  if (hR === !![]) {
    i0['bind'](TDV['Quiz']['EVENT_PROPERTIES_CHANGE'], function () {
      if ((i0['get'](TDV['Quiz']['PROPERTY']['QUESTIONS_ANSWERED']) + i0['get'](TDV['Quiz']['PROPERTY']['ITEMS_FOUND'])) / (i0['get'](TDV['Quiz']['PROPERTY']['QUESTION_COUNT']) + i0['get'](TDV['Quiz']['PROPERTY']['ITEM_COUNT'])) == 0x1) i0['finish']();
    }['bind'](this));
  }
  if (hQ === !![]) {
    i0['start']();
  }
  hW['quiz'] = i0;
  hW['quizConfig'] = hP;
};
TDV['Tour']['Script']['getQuizTotalObjectiveProperty'] = function (i1) {
  var i2 = this['get']('data')['quiz'];
  var i3 = this['get']('data')['quizConfig'];
  var i4 = i3['objectives'];
  var i5 = 0x0;
  for (var i6 = 0x0, i7 = i4['length']; i6 < i7; ++i6) {
    var i8 = i4[i6];
    i5 += i2['getObjective'](i8['id'], i1);
  }
  return i5;
};
TDV['Tour']['Script']['_initSplitViewer'] = function (i9) {
  function ia() {
    var iy = i9['get']('actualWidth');
    io['get']('children')[0x0]['set']('width', iy);
    ip['get']('children')[0x0]['set']('width', iy);
    var iz = is['get']('left');
    var iA = typeof iz == 'string' ? ib(iz) : iz;
    iA += is['get']('actualWidth') * 0.5;
    io['set']('width', ic(iA));
    ip['set']('width', ic(iy - iA));
  }

  function ib(iB) {
    return parseFloat(iB['replace']('%', '')) / 0x64 * i9['get']('actualWidth');
  }

  function ic(iC) {
    return iC / i9['get']('actualWidth') * 0x64 + '%';
  }

  function ie(iD) {
    ig(iD['source']);
  }

  function ig(iE) {
    var iF = iE == iu ? it : iu;
    if (iv && iE != iv || !iE || !iF) return;
    var iG = iF['get']('camera')['get']('initialPosition')['get']('yaw') - iE['get']('camera')['get']('initialPosition')['get']('yaw');
    iF['setPosition'](iE['get']('yaw') + iG, iE['get']('pitch'), iE['get']('roll'), iE['get']('hfov'));
  }

  function ih(iH) {
    iv = iH['source'];
  }

  function ii(iI) {
    ij(iI['source']);
  }

  function ij(iJ) {
    var iK = iJ['get']('viewerArea');
    if (iK == iq) {
      if (it) {
        it['get']('camera')['set']('hoverFactor', iw);
      }
      it = iJ;
      iv = it;
      if (it) {
        iw = it['get']('camera')['get']('hoverFactor');
        it['get']('camera')['set']('hoverFactor', 0x0);
      }
    } else if (iK == ir) {
      if (iu) {
        iu['get']('camera')['set']('hoverFactor', ix);
      }
      iu = iJ;
      iv = it;
      if (iu) {
        ix = iu['get']('camera')['get']('hoverFactor');
        iu['get']('camera')['set']('hoverFactor', 0x0);
      }
    }
    ig(iJ);
  }

  function ik(iL) {
    var iM = this['getCurrentPlayers']();
    var iN = iM['length'];
    while (iN-- > 0x0) {
      var iP = iM[iN];
      if (iP['get']('viewerArea') != iL) {
        iM['splice'](iN, 0x1);
      }
    }
    for (iN = 0x0; iN < iM['length']; ++iN) {
      var iP = iM[iN];
      iP['bind']('preloadMediaShow', ii, this);
      iP['bind']('cameraPositionChange', ie, this);
      iP['bind']('userInteractionStart', ih, this);
      if (iP['get']('panorama')) ij(iP);
    }
    return iM;
  }

  function il(iQ) {
    ij(this['getActivePlayerWithViewer'](iQ['source']));
    ig(iv);
  }
  var im = i9['get']('children');
  var io = im[0x0];
  var ip = im[0x1];
  var iq = io['get']('children')[0x0];
  var ir = ip['get']('children')[0x0];
  var is = im[0x2];
  var it, iu, iv;
  var iw, ix;
  ik['call'](this, iq);
  ik['call'](this, ir);
  iq['bind']('mouseDown', il, this);
  ir['bind']('mouseDown', il, this);
  i9['bind']('resize', function () {
    is['set']('left', (i9['get']('actualWidth') - is['get']('actualWidth')) * 0.5);
    ia();
  }, this);
  is['bind']('mouseDown', function (iR) {
    var iS = iR['pageX'];
    var iT = function (iU) {
      var iV = iU['pageX'];
      var iW = iS - iV;
      var iX = i9['get']('actualWidth');
      var iY = is['get']('left');
      var iZ = (typeof iY == 'string' ? ib(iY) : iY) - iW;
      if (iZ < 0x0) {
        iV -= iZ;
        iZ = 0x0;
      } else if (iZ + is['get']('actualWidth') >= iX) {
        iV -= iZ - (iX - is['get']('actualWidth'));
        iZ = iX - is['get']('actualWidth');
      }
      is['set']('left', iZ);
      ia();
      iS = iV;
    };
    this['bind']('mouseMove', iT, this);
    this['bind']('mouseUp', function () {
      this['unbind']('mouseMove', iT, this);
    }, this);
  }, this);
  ia();
};
TDV['Tour']['Script']['_initTwinsViewer'] = function (j0) {
  function j1() {
    var jm = j0['get']('actualWidth');
    jc['get']('children')[0x0]['set']('width', jm);
    jd['get']('children')[0x0]['set']('width', jm);
    var jn = jg['get']('left');
    var jo = typeof jn == 'string' ? j2(jn) : jn;
    jo += jg['get']('actualWidth') * 0.5;
    jc['set']('width', j3(jo));
    jd['set']('width', j3(jm - jo));
  }

  function j2(jp) {
    return parseFloat(jp['replace']('%', '')) / 0x64 * j0['get']('actualWidth');
  }

  function j3(jq) {
    return jq / j0['get']('actualWidth') * 0x64 + '%';
  }

  function j4(jr) {
    j5(jr['source']);
  }

  function j5(js) {
    var jt = js == ji ? jh : ji;
    if (jj && js != jj || !js || !jt) return;
    var ju = jt['get']('camera')['get']('initialPosition')['get']('yaw') - js['get']('camera')['get']('initialPosition')['get']('yaw');
    jt['setPosition'](js['get']('yaw') + ju, js['get']('pitch'), js['get']('roll'), js['get']('hfov'));
  }

  function j6(jv) {
    jj = jv['source'];
  }

  function j7(jw) {
    j8(jw['source']);
  }

  function j8(jx) {
    var jy = jx['get']('viewerArea');
    if (jy == je) {
      if (jh) {
        jh['get']('camera')['set']('hoverFactor', jk);
      }
      jh = jx;
      jj = jh;
      if (jh) {
        jk = jh['get']('camera')['get']('hoverFactor');
        jh['get']('camera')['set']('hoverFactor', 0x0);
      }
    } else if (jy == jf) {
      if (ji) {
        ji['get']('camera')['set']('hoverFactor', jl);
      }
      ji = jx;
      jj = jh;
      if (ji) {
        jl = ji['get']('camera')['get']('hoverFactor');
        ji['get']('camera')['set']('hoverFactor', 0x0);
      }
    }
    j5(jx);
  }

  function j9(jz) {
    var jA = this['getCurrentPlayers']();
    var jB = jA['length'];
    while (jB-- > 0x0) {
      var jD = jA[jB];
      if (jD['get']('viewerArea') != jz) {
        jA['splice'](jB, 0x1);
      }
    }
    for (jB = 0x0; jB < jA['length']; ++jB) {
      var jD = jA[jB];
      jD['bind']('preloadMediaShow', j7, this);
      jD['bind']('cameraPositionChange', j4, this);
      jD['bind']('userInteractionStart', j6, this);
      if (jD['get']('panorama')) j8(jD);
    }
    return jA;
  }

  function ja(jE) {
    j8(this['getActivePlayerWithViewer'](jE['source']));
    j5(jj);
  }
  var jb = j0['get']('children');
  var jc = jb[0x0];
  var jd = jb[0x1];
  var je = jc['get']('children')[0x0];
  var jf = jd['get']('children')[0x0];
  var jg = jb[0x2];
  var jh, ji, jj;
  var jk, jl;
  j9['call'](this, je);
  j9['call'](this, jf);
  je['bind']('mouseDown', ja, this);
  jf['bind']('mouseDown', ja, this);
  j0['bind']('resize', function () {
    jg['set']('left', (j0['get']('actualWidth') - jg['get']('actualWidth')) * 0.5);
    j1();
  }, this);
  j1();
};
TDV['Tour']['Script']['isCardboardViewMode'] = function () {
  var jF = this['getByClassName']('PanoramaPlayer');
  return jF['length'] > 0x0 && jF[0x0]['get']('viewMode') == 'cardboard';
};
TDV['Tour']['Script']['isPanorama'] = function (jG) {
  return ['Panorama', 'HDRPanorama', 'LivePanorama', 'Video360', 'VideoPanorama']['indexOf'](jG['get']('class')) != -0x1;
};
TDV['Tour']['Script']['keepCompVisible'] = function (jH, jI) {
  var jJ = 'keepVisibility_' + jH['get']('id');
  var jK = this['getKey'](jJ);
  if (jK == undefined && jI) {
    this['registerKey'](jJ, jI);
  } else if (jK != undefined && !jI) {
    this['unregisterKey'](jJ);
  }
};
TDV['Tour']['Script']['_initItemWithComps'] = function (jL, jM, jN, jO, jP, jQ, jR, jS) {
  var jT = jL['get']('items')[jM];
  var jU = jT['get']('media');
  var jV = jU['get']('loop') == undefined || jU['get']('loop');
  var jW = jS > 0x0;
  var jX = this['rootPlayer'];
  var jY = function (k6) {
    var k7 = jQ ? jQ['get']('class') : undefined;
    var k8 = undefined;
    switch (k7) {
      case 'FadeInEffect':
      case 'FadeOutEffect':
        k8 = jX['createInstance'](k6 ? 'FadeInEffect' : 'FadeOutEffect');
        break;
      case 'SlideInEffect':
      case 'SlideOutEffect':
        k8 = jX['createInstance'](k6 ? 'SlideInEffect' : 'SlideOutEffect');
        break;
    }
    if (k8) {
      k8['set']('duration', jQ['get']('duration'));
      k8['set']('easing', jQ['get']('easing'));
      if (k7['indexOf']('Slide') != -0x1) k8['set'](k6 ? 'from' : 'to', jQ['get'](jQ['get']('class') == 'SlideInEffect' ? 'from' : 'to'));
    }
    return k8;
  };
  var jZ = function () {
    for (var k9 = 0x0, ka = jN['length']; k9 < ka; ++k9) {
      var kb = jN[k9];
      if (jS > 0x0) {
        this['setComponentVisibility'](kb, !jP, 0x0, jY(!jP));
      } else {
        var kc = 'visibility_' + kb['get']('id');
        if (this['existsKey'](kc)) {
          if (this['getKey'](kc)) this['setComponentVisibility'](kb, !![], 0x0, jY(!![]));
          else this['setComponentVisibility'](kb, ![], 0x0, jY(![]));
          this['unregisterKey'](kc);
        }
      }
    }
    jT['unbind']('end', jZ, this);
    if (!jV) jU['unbind']('end', jZ, this);
  };
  var k0 = function () {
    jT['unbind']('stop', k0, this, !![]);
    jT['unbind']('stop', k0, this);
    jT['unbind']('begin', k0, this, !![]);
    jT['unbind']('begin', k0, this);
    for (var kd = 0x0, ke = jN['length']; kd < ke; ++kd) {
      this['keepCompVisible'](jN[kd], ![]);
    }
  };
  var k1 = function (kf, kg, kh) {
    var ki = function () {
      var kj = function (kn, ko, kp) {
        jX['setComponentVisibility'](kn, ko, kg, kp, ko ? 'showEffect' : 'hideEffect', ![]);
        if (kh > 0x0) {
          var kq = kg + kh + (kp != undefined ? kp['get']('duration') : 0x0);
          jX['setComponentVisibility'](kn, !ko, kq, jY(!ko), ko ? 'hideEffect' : 'showEffect', !![]);
        }
      };
      for (var kk = 0x0, kl = jN['length']; kk < kl; ++kk) {
        var km = jN[kk];
        if (jP == 'toggle') {
          if (!km['get']('visible')) kj(km, !![], jY(!![]));
          else kj(km, ![], jY(![]));
        } else {
          kj(km, jP, jY(jP));
        }
      }
      jT['unbind'](kf, ki, this);
      if (kf == 'end' && !jV) jU['unbind'](kf, ki, this);
    };
    jT['bind'](kf, ki, this);
    if (kf == 'end' && !jV) jU['bind'](kf, ki, this);
  };
  if (jO == 'begin') {
    for (var k2 = 0x0, k3 = jN['length']; k2 < k3; ++k2) {
      var k4 = jN[k2];
      this['keepCompVisible'](k4, !![]);
      if (jW) {
        var k5 = 'visibility_' + k4['get']('id');
        this['registerKey'](k5, k4['get']('visible'));
      }
    }
    jT['bind']('stop', k0, this, !![]);
    jT['bind']('stop', k0, this);
    jT['bind']('begin', k0, this, !![]);
    jT['bind']('begin', k0, this);
    if (jW) {
      jT['bind']('end', jZ, this);
      if (!jV) jU['bind']('end', jZ, this);
    }
  } else if (jO == 'end' && jS > 0x0) {
    k1('begin', jS, 0x0);
    jS = 0x0;
  }
  if (jO != undefined) k1(jO, jR, jS);
};
TDV['Tour']['Script']['loadFromCurrentMediaPlayList'] = function (kr, ks, kt) {
  var ku = kr['get']('selectedIndex');
  var kv = kr['get']('items')['length'];
  var kw = (ku + ks) % kv;
  while (kw < 0x0) {
    kw = kv + kw;
  }
  if (ku != kw) {
    if (kt) {
      var kx = kr['get']('items')[kw];
      this['skip3DTransitionOnce'](kx['get']('player'));
    }
    kr['set']('selectedIndex', kw);
  }
};
TDV['Tour']['Script']['mixObject'] = function (ky, kz) {
  return this['assignObjRecursively'](kz, this['copyObjRecursively'](ky));
};
TDV['Tour']['Script']['downloadFile'] = function (kA) {
  if ((navigator['userAgent']['toLowerCase']()['indexOf']('chrome') > -0x1 || navigator['userAgent']['toLowerCase']()['indexOf']('safari') > -0x1) && !/(iP)/g['test'](navigator['userAgent'])) {
    var kB = document['createElement']('a');
    kB['href'] = kA;
    kB['setAttribute']('target', '_blank');
    if (kB['download'] !== undefined) {
      var kC = kA['substring'](kA['lastIndexOf']('/') + 0x1, kA['length']);
      kB['download'] = kC;
    }
    if (document['createEvent']) {
      var kD = document['createEvent']('MouseEvents');
      kD['initEvent']('click', !![], !![]);
      kB['dispatchEvent'](kD);
      return;
    }
  }
  window['open'](kA, '_blank');
};
TDV['Tour']['Script']['openLink'] = function (kE, kF) {
  if (!kE || kE == location['href']) {
    return;
  }
  if (!kF) kF = '_blank';
  if (kF == '_top' || kF == '_self') {
    this['updateDeepLink'](!![], !![], !![]);
  }
  var kG = window && window['process'] && window['process']['versions'] && window['process']['versions']['electron'] || navigator && navigator['userAgent'] && navigator['userAgent']['indexOf']('Electron') >= 0x0;
  if (kG && kF == '_blank') {
    if (kE['startsWith']('files/')) {
      kE = '/' + kE;
    }
    if (kE['startsWith']('//')) {
      kE = 'https:' + kE;
    } else if (kE['startsWith']('/')) {
      var kH = window['location']['href']['split']('/');
      kH['pop']();
      kE = kH['join']('/') + kE;
    }
    var kI = kE['split']('.')['pop']()['toLowerCase']();
    if ((['pdf', 'zip', 'xls', 'xlsx']['indexOf'](kI) == -0x1 || kE['startsWith']('file://')) && window['hasOwnProperty']('require')) {
      var kJ = window['require']('electron')['shell'];
      kJ['openExternal'](kE);
    } else {
      window['open'](kE, kF);
    }
  } else if (kG && (kF == '_top' || kF == '_self')) {
    window['location'] = kE;
  } else {
    var kK = this['get']('data')['tour'];
    if (kK['isMobileApp']() && kK['isIOS']()) kE = 'blank:' + kE;
    var kL = window['open'](kE, kF);
    kL['focus']();
  }
};
TDV['Tour']['Script']['pauseCurrentPlayers'] = function (kM) {
  var kN = this['getCurrentPlayers']();
  var kO = kN['length'];
  while (kO-- > 0x0) {
    var kP = kN[kO];
    if (kP['get']('state') == 'playing' || kP['get']('data') && kP['get']('data')['playing'] || kP['get']('viewerArea') && kP['get']('viewerArea')['get']('id') == this['getMainViewer']() || kP['get']('camera') && kP['get']('camera')['get']('idleSequence') && kP['get']('camera')['get']('timeToIdle') > 0x0 && kP['get']('state') == 'playing') {
      var kQ = this['getMediaFromPlayer'](kP);
      if (kM && kQ && kQ['get']('class') != 'Video360' && 'pauseCamera' in kP) {
        kP['pauseCamera']();
      } else {
        kP['pause']();
      }
    } else {
      kN['splice'](kO, 0x1);
    }
  }
  return kN;
};
TDV['Tour']['Script']['pauseGlobalAudiosWhilePlayItem'] = function (kR, kS, kT) {
  var kU = function () {
    if (kR['get']('selectedIndex') != kS) {
      this['resumeGlobalAudios']();
    }
  };
  this['pauseGlobalAudios'](kT, !![]);
  this['executeFunctionWhenChange'](kR, kS, kU, kU);
};
TDV['Tour']['Script']['pauseGlobalAudios'] = function (kV, kW) {
  this['stopTextToSpeech']();
  if (window['pausedAudiosLIFO'] == undefined) window['pausedAudiosLIFO'] = [];
  var kX = this['getByClassName']('VideoPanoramaOverlay');
  kX = kX['concat'](this['getByClassName']('QuadVideoPanoramaOverlay'));
  for (var kZ = kX['length'] - 0x1; kZ >= 0x0; --kZ) {
    var l0 = kX[kZ];
    if (l0['get']('video')['get']('hasAudio') == ![]) kX['splice'](kZ, 0x1);
  }
  var l1 = this['getByClassName']('Audio')['concat'](kX);
  var l2 = {};
  if (window['currentGlobalAudios'] != undefined) l1 = l1['concat'](Object['values'](window['currentGlobalAudios'])['map'](function (l6) {
    if (!l6['allowResume']) l2[l6['audio']['get']('id')] = l6['audio'];
    return l6['audio'];
  }));
  var l3 = [];
  for (var kZ = 0x0, l4 = l1['length']; kZ < l4; ++kZ) {
    var l5 = l1[kZ];
    if (l5 && l5['get']('state') == 'playing' && (kV == undefined || kV['indexOf'](l5) == -0x1)) {
      if (l5['get']('id') in l2) {
        l5['stop']();
      } else {
        l5['pause']();
        l3['push'](l5);
      }
    }
  }
  if (kW || l3['length'] > 0x0) window['pausedAudiosLIFO']['push'](l3);
  return l3;
};
TDV['Tour']['Script']['resumeGlobalAudios'] = function () {
  if (window['pausedAudiosLIFO'] == undefined) return;
  if (window['resumeAudiosBlocked']) {
    if (window['pausedAudiosLIFO']['length'] > 0x1) {
      window['pausedAudiosLIFO'][window['pausedAudiosLIFO']['length'] - 0x2] = window['pausedAudiosLIFO'][window['pausedAudiosLIFO']['length'] - 0x2]['concat'](window['pausedAudiosLIFO'][window['pausedAudiosLIFO']['length'] - 0x1]);
      window['pausedAudiosLIFO']['splice'](window['pausedAudiosLIFO']['length'] - 0x1, 0x1);
    }
    return;
  }
  var l7 = window['pausedAudiosLIFO']['pop']();
  if (!l7) return;
  for (var l8 = 0x0, l9 = l7['length']; l8 < l9; ++l8) {
    var la = l7[l8];
    if (la['get']('state') == 'paused') la['play']();
  }
};
TDV['Tour']['Script']['pauseGlobalAudio'] = function (lb) {
  var lc = window['currentGlobalAudios'];
  if (lc) {
    var ld = lc[lb['get']('id')];
    if (ld) lb = ld['audio'];
  }
  if (lb['get']('state') == 'playing') lb['pause']();
};
TDV['Tour']['Script']['playAudioList'] = function (le, lf) {
  if (le['length'] == 0x0) return;
  if (le['length'] == 0x1 && lf) {
    var lg = le[0x0];
    lg['set']('loop', !![]);
    this['playGlobalAudio'](lg, !![], null, !![]);
  } else {
    var lh = -0x1;
    var li;
    var lj = this['playGlobalAudio'];
    var lk = function () {
      if (++lh >= le['length']) {
        if (!lf) return;
        lh = 0x0;
      }
      li = le[lh];
      lj(li, !![], lk, !![]);
    };
    lk();
  }
};
TDV['Tour']['Script']['playGlobalAudioWhilePlayActiveMedia'] = function (ll, lm, ln, lo) {
  var lp = this['getActiveMediaWithViewer'](this['getMainViewer']());
  var lq = this['getFirstPlayListWithMedia'](lp, !![]);
  var lr = this['getPlayListItemByMedia'](lq, lp);
  var ls = lq['get']('items')['indexOf'](lr);
  return this['playGlobalAudioWhilePlay'](lq, ls, ll, lm, ln, lo);
};
TDV['Tour']['Script']['playGlobalAudioWhilePlay'] = function (lt, lu, lv, lw, lx, ly) {
  var lz = function (lI) {
    if (lI['data']['previousSelectedIndex'] == lu) {
      this['stopGlobalAudio'](lv);
      if (lD) {
        var lJ = lC['get']('media');
        var lK = lJ['get']('audios');
        lK['splice'](lK['indexOf'](lv), 0x1);
        lJ['set']('audios', lK);
      }
      lt['unbind']('change', lz, this);
      if (lx) lx();
    }
  };
  var lB = window['currentGlobalAudios'];
  if (lB && lv['get']('id') in lB) {
    lv = lB[lv['get']('id')]['audio'];
    if (lv['get']('state') != 'playing') {
      lv['play']();
    }
    return lv;
  }
  lt['bind']('change', lz, this);
  var lC = lt['get']('items')[lu];
  var lD = lC['get']('class') == 'PanoramaPlayListItem';
  if (lD) {
    var lE = lC['get']('media');
    var lB = (lE['get']('audios') || [])['slice']();
    if (lv['get']('class') == 'MediaAudio') {
      var lF = this['rootPlayer']['createInstance']('PanoramaAudio');
      lF['set']('autoplay', ![]);
      lF['set']('audio', lv['get']('audio'));
      lF['set']('loop', lv['get']('loop'));
      lF['set']('id', lv['get']('id'));
      this['cloneBindings'](lv, lF, 'end');
      this['cloneBindings'](lv, lF, 'stateChange');
      lv = lF;
    }
    lB['push'](lv);
    lE['set']('audios', lB);
  }
  var lG = this['playGlobalAudio'](lv, lw, function () {
    lt['unbind']('change', lz, this);
    if (lx) lx['call'](this);
  });
  if (ly === !![]) {
    var lH = function () {
      if (lG['get']('state') == 'playing') {
        this['pauseGlobalAudios']([lG], !![]);
      } else if (lG['get']('state') == 'stopped') {
        this['resumeGlobalAudios']();
        lG['unbind']('stateChange', lH, this);
      }
    };
    lG['bind']('stateChange', lH, this);
  }
  return lG;
};
TDV['Tour']['Script']['playGlobalAudio'] = function (lL, lM, lN, lO) {
  var lP = function () {
    lL['unbind']('end', lP, this);
    this['stopGlobalAudio'](lL);
    if (lN) lN['call'](this);
  };
  lL = this['getGlobalAudio'](lL);
  var lQ = window['currentGlobalAudios'];
  if (!lQ) {
    lQ = window['currentGlobalAudios'] = {};
  }
  lQ[lL['get']('id')] = {
    'audio': lL,
    'asBackground': lO || ![],
    'allowResume': lM
  };
  if (lL['get']('state') == 'playing') {
    return lL;
  }
  if (!lL['get']('loop')) {
    lL['bind']('end', lP, this);
  }
  lL['play']();
  return lL;
};
TDV['Tour']['Script']['restartTourWithoutInteraction'] = function (lR) {
  var lS = -0x1;
  this['bind']('userInteraction', lT, this);
  lT();

  function lT() {
    if (lS != -0x1) clearTimeout(lS);
    lS = setTimeout(function () {
      location['reload']();
    }, lR * 0x3e8);
  }
};
TDV['Tour']['Script']['resumePlayers'] = function (lU, lV) {
  for (var lW = 0x0; lW < lU['length']; ++lW) {
    var lX = lU[lW];
    var lY = this['getMediaFromPlayer'](lX);
    if (!lY) continue;
    if (lV && lY['get']('class') != 'Video360' && 'pauseCamera' in lX) {
      lX['resumeCamera']();
    } else if (lX['get']('state') != 'playing') {
      var lZ = lX['get']('data');
      if (!lZ) {
        lZ = {};
        lX['set']('data', lZ);
      }
      lZ['playing'] = !![];
      var m0 = function () {
        if (lX['get']('state') == 'playing') {
          delete lZ['playing'];
          lX['unbind']('stateChange', m0, this);
        }
      };
      lX['bind']('stateChange', m0, this);
      lX['play']();
    }
  }
};
TDV['Tour']['Script']['stopGlobalAudios'] = function (m1) {
  var m2 = window['currentGlobalAudios'];
  var m3 = this;
  if (m2) {
    Object['keys'](m2)['forEach'](function (m4) {
      var m5 = m2[m4];
      if (!m1 || m1 && !m5['asBackground']) {
        m3['stopGlobalAudio'](m5['audio']);
      }
    });
  }
};
TDV['Tour']['Script']['stopGlobalAudio'] = function (m6) {
  var m7 = window['currentGlobalAudios'];
  if (m7) {
    var m8 = m7[m6['get']('id')];
    if (m8) {
      m6 = m8['audio'];
      delete m7[m6['get']('id')];
      if (Object['keys'](m7)['length'] == 0x0) {
        window['currentGlobalAudios'] = undefined;
      }
    }
  }
  if (m6) m6['stop']();
};
TDV['Tour']['Script']['setCameraSameSpotAsMedia'] = function (m9, ma) {
  var mb = this['getCurrentPlayerWithMedia'](ma);
  if (mb != undefined) {
    var mc = m9['get']('initialPosition');
    mc['set']('yaw', mb['get']('yaw'));
    mc['set']('pitch', mb['get']('pitch'));
    mc['set']('hfov', mb['get']('hfov'));
  }
};
TDV['Tour']['Script']['setComponentVisibility'] = function (md, me, mf, mg, mh, mi) {
  var mj = this['getKey']('keepVisibility_' + md['get']('id'));
  if (mj) return;
  this['unregisterKey']('visibility_' + md['get']('id'));
  var mk = function () {
    if (mh) {
      md['set'](mh, mg);
    }
    md['set']('visible', me);
    if (md['get']('class') == 'ViewerArea') {
      try {
        if (me) md['restart']();
        else if (md['get']('playbackState') == 'playing') md['pause']();
      } catch (mp) { };
    }
  };
  var ml = 'effectTimeout_' + md['get']('id');
  if (!mi && window['hasOwnProperty'](ml)) {
    var mn = window[ml];
    if (mn instanceof Array) {
      for (var mo = 0x0; mo < mn['length']; mo++) {
        clearTimeout(mn[mo]);
      }
    } else {
      clearTimeout(mn);
    }
    delete window[ml];
  } else if (me == md['get']('visible') && !mi) return;
  if (mf && mf > 0x0) {
    var mn = setTimeout(function () {
      if (window[ml] instanceof Array) {
        var mq = window[ml];
        var mr = mq['indexOf'](mn);
        mq['splice'](mr, 0x1);
        if (mq['length'] == 0x0) {
          delete window[ml];
        }
      } else {
        delete window[ml];
      }
      mk();
    }, mf);
    if (window['hasOwnProperty'](ml)) {
      window[ml] = [window[ml], mn];
    } else {
      window[ml] = mn;
    }
  } else {
    mk();
  }
};
TDV['Tour']['Script']['setDirectionalPanoramaAudio'] = function (ms, mt, mu, mv) {
  ms['set']('yaw', mt);
  ms['set']('pitch', mu);
  ms['set']('maximumAngle', mv);
};
TDV['Tour']['Script']['setLocale'] = function (mw) {
  this['stopTextToSpeech']();
  var mx = this['get']('data')['localeManager'];
  if (mx) this['get']('data')['localeManager']['setLocale'](mw);
  else {
    this['get']('data')['defaultLocale'] = mw;
    this['get']('data')['forceDefaultLocale'] = !![];
  }
};
TDV['Tour']['Script']['setEndToItemIndex'] = function (my, mz, mA) {
  var mB = function () {
    if (my['get']('selectedIndex') == mz) {
      var mC = my['get']('items')[mA];
      this['skip3DTransitionOnce'](mC['get']('player'));
      my['set']('selectedIndex', mA);
    }
  };
  this['executeFunctionWhenChange'](my, mz, mB);
};
TDV['Tour']['Script']['setMapLocation'] = function (mD, mE) {
  var mF = function () {
    mD['unbind']('stop', mF, this);
    mG['set']('mapPlayer', null);
  };
  mD['bind']('stop', mF, this);
  var mG = mD['get']('player');
  mG['set']('mapPlayer', mE);
};
TDV['Tour']['Script']['setMainMediaByIndex'] = function (mH) {
  var mI = undefined;
  if (mH >= 0x0 && mH < this['mainPlayList']['get']('items')['length']) {
    this['mainPlayList']['set']('selectedIndex', mH);
    mI = this['mainPlayList']['get']('items')[mH];
  }
  return mI;
};
TDV['Tour']['Script']['setMainMediaByName'] = function (mJ) {
  var mK = this['getMainViewer']();
  var mL = this['_getPlayListsWithViewer'](mK);
  for (var mM = 0x0, mN = mL['length']; mM < mN; ++mM) {
    var mO = mL[mM];
    var mP = mO['get']('items');
    for (var mQ = 0x0, mR = mP['length']; mQ < mR; ++mQ) {
      var mS = mP[mQ];
      var mT = mS['get']('media')['get']('data');
      if (mT !== undefined && mT['label'] == mJ && mS['get']('player')['get']('viewerArea') == mK) {
        mO['set']('selectedIndex', mQ);
        return mS;
      }
    }
  }
};
TDV['Tour']['Script']['executeAudioAction'] = function (mU, mV, mW, mX, mY, mZ) {
  if (mU['length'] == 0x0) return;
  var n0, n1;
  var n2 = this['getMainViewer']();
  if (mW && !(mW === !![])) {
    var n3 = this['getPlayListsWithMedia'](mW);
    for (var n4 = 0x0; n4 < n3['length']; ++n4) {
      var n5 = n3[n4];
      var n7 = this['getPlayListItemByMedia'](n5, mW);
      if (n7 && n7['get']('player') && n7['get']('player')['get']('viewerArea') == n2) {
        n0 = n5;
        n1 = n0['get']('items')['indexOf'](n7);
        break;
      }
    }
    if (!n0 && n3['length'] > 0x0) {
      n0 = n3[0x0];
      n1 = this['getPlayListItemIndexByMedia'](n0, mW);
    }
    if (!n0) mW = !![];
  }
  if (mW === !![]) {
    var n8 = this['getActiveMediaWithViewer'](n2);
    if (n8) {
      n0 = this['getFirstPlayListWithMedia'](n8, !![]);
      var n7 = this['getPlayListItemByMedia'](n0, n8);
      n1 = n0['get']('items')['indexOf'](n7);
    } else {
      mW = null;
    }
  }
  var n9 = [];
  var na = function () {
    var ni = n9['concat']();
    var nj = ![];
    var nk = function (nn) {
      var no = nn['source']['get']('state');
      if (no == 'playing') {
        if (!nj) {
          nj = !![];
          this['pauseGlobalAudios'](n9, !![]);
        }
      } else if (no == 'stopped') {
        ni['splice'](ni['indexOf'](nn['source']), 0x1);
        if (ni['length'] == 0x0) {
          this['resumeGlobalAudios']();
        }
        nn['source']['unbind']('stateChange', nk, this);
      }
    }['bind'](this);
    for (var nl = 0x0, nm = n9['length']; nl < nm; ++nl) {
      n9[nl]['bind']('stateChange', nk, this);
    }
  }['bind'](this);
  var nb = function () {
    for (var np = 0x0, nq = mU['length']; np < nq; ++np) {
      var nr = mU[np];
      n9['push'](this['playGlobalAudio'](nr, mX));
    }
    if (mY) na();
  }['bind'](this);
  var nc = function () {
    for (var ns = 0x0, nt = mU['length']; ns < nt; ++ns) {
      var nu = mU[ns];
      n9['push'](this['playGlobalAudioWhilePlay'](n0, n1, nu, mX));
    }
    if (mY) na();
  }['bind'](this);
  var nd = function () {
    for (var nv = 0x0, nw = mU['length']; nv < nw; ++nv) {
      this['pauseGlobalAudio'](mU[nv]);
    }
  }['bind'](this);
  var ne = function () {
    for (var nx = 0x0, ny = mU['length']; nx < ny; ++nx) {
      this['stopGlobalAudio'](mU[nx]);
    }
  }['bind'](this);
  var nf = function () {
    for (var nz = 0x0, nA = mU['length']; nz < nA; ++nz) {
      if (this['getGlobalAudio'](mU[nz])['get']('state') == 'playing') return !![];
    }
    return ![];
  }['bind'](this);
  if (mV == 'playPause' || mV == 'playStop') {
    if (nf()) {
      if (mV == 'playPause') {
        nd();
      } else if (mV == 'playStop') {
        ne();
      }
    } else {
      if (mY) {
        if (mV == 'playStop') {
          this['stopGlobalAudios'](!![]);
        }
      }
      if (n0) {
        nc();
      } else {
        nb();
      }
    }
  } else if (mV == 'play') {
    if (n0 || mW === !![]) {
      if (mZ) {
        var ng = n0 ? n0['get']('items')[n1]['get']('player') : this['getActivePlayerWithViewer'](this['getMainViewer']());
        if (ng && ng['pauseCamera']) {
          var nh = mU['concat']();
          endCallback = function (nB) {
            nh['splice'](nh['indexOf'](nB), 0x1);
            if (nh['length'] == 0x0) ng['resumeCamera']();
          }['bind'](this);
          ng['pauseCamera']();
        }
      }
      nc();
    } else {
      nb();
    }
  } else if (mV == 'stop') {
    ne();
  } else if (mV == 'pause') {
    nd();
  }
};
TDV['Tour']['Script']['executeAudioActionByTags'] = function (nC, nD, nE, nF, nG, nH, nI) {
  var nJ = this['getAudioByTags'](nC, nD);
  this['executeAudioAction'](nJ, nE, nF, nG, nH, nI);
};
TDV['Tour']['Script']['setMediaBehaviour'] = function (nK, nL, nM, nN) {
  var nO = this;
  var nP = function (oc) {
    if (oc['data']['state'] == 'stopped' && nN) {
      nT['call'](this, !![]);
    }
  };
  var nQ = function () {
    nZ['unbind']('begin', nQ, nO);
    var od = nZ['get']('media');
    if (od['get']('class') != 'Panorama' || od['get']('camera') != undefined && od['get']('camera')['get']('initialSequence') != undefined) {
      o0['bind']('stateChange', nP, nO);
    }
  };
  var nR = function () {
    var oe = nW['get']('selectedIndex');
    if (oe != -0x1) {
      nY = oe;
      nT['call'](this, ![]);
    }
  };
  var nS = function () {
    nT['call'](this, ![]);
  };
  var nT = function (of) {
    if (!nW) return;
    var og = nZ['get']('media');
    if ((og['get']('class') == 'Video360' || og['get']('class') == 'Video') && og['get']('loop') == !![] && !of) return;
    nK['set']('selectedIndex', -0x1);
    if (o7 && o6 != -0x1) {
      if (o7) {
        if (o6 > 0x0 && o7['get']('movements')[o6 - 0x1]['get']('class') == 'TargetPanoramaCameraMovement') {
          var oh = o8['get']('initialPosition');
          var oi = oh['get']('yaw');
          var oj = oh['get']('pitch');
          var ok = oh['get']('hfov');
          var ol = o7['get']('movements')[o6 - 0x1];
          var om = ol['get']('targetYaw');
          var on = ol['get']('targetPitch');
          var oo = ol['get']('targetHfov');
          if (om !== undefined) oh['set']('yaw', om);
          if (on !== undefined) oh['set']('pitch', on);
          if (oo !== undefined) oh['set']('hfov', oo);
          var op = function (os) {
            oh['set']('yaw', oi);
            oh['set']('pitch', oj);
            oh['set']('hfov', ok);
            o2['unbind']('end', op, this);
          };
          o2['bind']('end', op, this);
        }
        o7['set']('movementIndex', o6);
      }
    }
    if (o0) {
      nZ['unbind']('begin', nQ, this);
      o0['unbind']('stateChange', nP, this);
      for (var oq = 0x0; oq < o9['length']; ++oq) {
        o9[oq]['unbind']('click', nS, this);
      }
    }
    if (o5) {
      var or = this['getMediaFromPlayer'](o0);
      if ((nW == this['mainPlayList'] || nW['get']('items')['length'] > 0x1) && (or == undefined || or == nZ['get']('media'))) {
        nW['set']('selectedIndex', nY);
      }
      if (nK != nW) nW['unbind']('change', nR, this);
    } else {
      o3['set']('visible', o4);
    }
    nW = undefined;
  };
  if (!nM) {
    var nU = nK['get']('selectedIndex');
    var nV = nU != -0x1 ? nK['get']('items')[nK['get']('selectedIndex')]['get']('player') : this['getActivePlayerWithViewer'](this['getMainViewer']());
    if (nV) {
      nM = this['getMediaFromPlayer'](nV);
    }
  }
  var nW = undefined;
  if (nM) {
    var nX = this['getPlayListsWithMedia'](nM, !![]);
    if (nX['indexOf'](nK) != -0x1) {
      nW = nK;
    } else if (nX['indexOf'](this['mainPlayList']) != -0x1) {
      nW = this['mainPlayList'];
    } else if (nX['length'] > 0x0) {
      nW = nX[0x0];
    }
  }
  if (!nW) {
    nK['set']('selectedIndex', nL);
    return;
  }
  var nY = nW['get']('selectedIndex');
  var nZ = nK['get']('items')[nL];
  var o0 = nZ['get']('player');
  var o1 = this['getMediaFromPlayer'](o0);
  if (nK['get']('selectedIndex') == nL && o1 == nZ['get']('media') || nY == -0x1) {
    return;
  }
  if (nK['get']('selectedIndex') == nL && o1 != nZ['get']('media')) nK['set']('selectedIndex', -0x1);
  var o2 = nW['get']('items')[nY];
  var o3 = o0['get']('viewerArea');
  var o4 = o3['get']('visible');
  var o5 = o3 == o2['get']('player')['get']('viewerArea');
  if (o5) {
    if (nK != nW) {
      nW['set']('selectedIndex', -0x1);
      nW['bind']('change', nR, this);
    }
  } else {
    o3['set']('visible', !![]);
  }
  var o6 = -0x1;
  var o7 = undefined;
  var o8 = o2['get']('camera');
  if (o8) {
    o7 = o8['get']('initialSequence');
    if (o7) {
      o6 = o7['get']('movementIndex');
    }
  }
  nK['set']('selectedIndex', nL);
  var o9 = [];
  var oa = function (ot) {
    var ou = o0['get'](ot);
    if (ou == undefined) return;
    if (Array['isArray'](ou)) o9 = o9['concat'](ou);
    else o9['push'](ou);
  };
  oa('buttonStop');
  for (var ob = 0x0; ob < o9['length']; ++ob) {
    o9[ob]['bind']('click', nS, this);
  }
  nZ['bind']('begin', nQ, nO);
  this['executeFunctionWhenChange'](nK, nL, nN ? nS : undefined);
};
TDV['Tour']['Script']['setOverlayBehaviour'] = function (ov, ow, ox, oy) {
  var oz = function () {
    switch (ox) {
      case 'triggerClick':
        this['triggerOverlay'](ov, 'click');
        break;
      case 'stop':
      case 'play':
      case 'pause':
        ov[ox]();
        break;
      case 'togglePlayPause':
      case 'togglePlayStop':
        if (ov['get']('state') == 'playing') ov[ox == 'togglePlayPause' ? 'pause' : 'stop']();
        else ov['play']();
        break;
    }
    if (oy) {
      if (window['overlaysDispatched'] == undefined) window['overlaysDispatched'] = {};
      var oE = ov['get']('id');
      window['overlaysDispatched'][oE] = !![];
      setTimeout(function () {
        delete window['overlaysDispatched'][oE];
      }, 0x3e8);
    }
  };
  if (oy && window['overlaysDispatched'] != undefined && ov['get']('id') in window['overlaysDispatched']) return;
  var oA = this['getFirstPlayListWithMedia'](ow, !![]);
  if (oA != undefined) {
    var oB = this['getPlayListItemByMedia'](oA, ow);
    var oC = oB['get']('player');
    if (oA['get']('items')['indexOf'](oB) != oA['get']('selectedIndex') || this['isPanorama'](oB['get']('media')) && oC['get']('rendererPanorama') != oB['get']('media')) {
      var oD = function (oF) {
        oB['unbind']('begin', oD, this);
        oz['call'](this);
      };
      oB['bind']('begin', oD, this);
      return;
    }
  }
  oz['call'](this);
};
TDV['Tour']['Script']['setOverlaysVisibility'] = function (oG, oH, oI) {
  var oJ = 'overlayEffects';
  var oK = undefined;
  var oL = this['getKey'](oJ);
  if (!oL) {
    oL = {};
    this['registerKey'](oJ, oL);
  }
  for (var oM = 0x0, oN = oG['length']; oM < oN; ++oM) {
    var oO = oG[oM];
    if (oI && oI > 0x0) {
      oL[oO['get']('id')] = setTimeout(oP['bind'](this, oO), oI);
    } else {
      oP['call'](this, oO);
    }
  }

  function oP(oQ) {
    var oR = oQ['get']('id');
    var oS = oL[oR];
    if (oS) {
      clearTimeout(oS);
      delete oS[oR];
    }
    var oT = oH == 'toggle' ? !oQ['get']('enabled') : oH;
    oQ['set']('enabled', oT);
    var oV = oQ['get']('data');
    if (oT && oV && 'group' in oV) {
      var oW = this['getOverlaysByGroupname'](oV['group']);
      for (var oX = 0x0, oY = oW['length']; oX < oY; ++oX) {
        var p0 = oW[oX];
        if (p0 != oQ) p0['set']('enabled', !oT);
      }
    }
    if (!oK) oK = this['getByClassName']('AdjacentPanorama');
    for (var p1 = 0x0, p2 = oK['length']; p1 < p2; ++p1) {
      var p3 = oK[p1];
      var oV = p3['get']('data');
      if (!oV) continue;
      var p0 = this[oV['overlayID']];
      if (p0 && p0 == oQ) {
        p3['set']('enabledInSurfaceSelection', p0['get']('enabled'));
      }
    }
  }
};
TDV['Tour']['Script']['setOverlaysVisibilityByTags'] = function (p4, p5, p6, p7, p8) {
  var p9 = p6 ? this['getPanoramaOverlaysByTags'](p6, p4, p7) : this['getOverlaysByTags'](p4, p7);
  this['setOverlaysVisibility'](p9, p5, p8);
};
TDV['Tour']['Script']['setComponentsVisibilityByTags'] = function (pa, pb, pc, pd, pe) {
  var pf = this['getComponentsByTags'](pa, pe);
  for (var pg = 0x0, ph = pf['length']; pg < ph; ++pg) {
    var pi = pf[pg];
    if (pb == 'toggle') pi['get']('visible') ? pd(pi) : pc(pi);
    else pb ? pc(pi) : pd(pi);
  }
};
TDV['Tour']['Script']['setPanoramaCameraWithCurrentSpot'] = function (pj, pk) {
  var pl = this['getActiveMediaWithViewer'](pk || this['getMainViewer']());
  if (pl != undefined && (pl['get']('class')['indexOf']('Panorama') != -0x1 || pl['get']('class') == 'Video360')) {
    var pm = pj['get']('media');
    var pn = this['cloneCamera'](pj['get']('camera'));
    this['setCameraSameSpotAsMedia'](pn, pl);
    this['startPanoramaWithCamera'](pm, pn);
  }
};
TDV['Tour']['Script']['setPanoramaCameraWithSpot'] = function (po, pp, pq, pr, ps) {
  var pt = po['get']('selectedIndex');
  var pu = po['get']('items');
  var pv = pp['get']('player');
  if (pu[pt] == pp || pv['get']('rendererPanorama') == pp['get']('media')) {
    if (pq === undefined) pq = pv['get']('yaw');
    if (pr === undefined) pr = pv['get']('pitch');
    if (ps === undefined) ps = pv['get']('hfov');
    pv['moveTo'](pq, pr, pv['get']('roll'), ps);
  } else {
    var pw = pp['get']('media');
    var px = this['cloneCamera'](pp['get']('camera'));
    var py = px['get']('initialPosition');
    if (pq !== undefined) py['set']('yaw', pq);
    if (pr !== undefined) py['set']('pitch', pr);
    if (ps !== undefined) py['set']('hfov', ps);
    this['startPanoramaWithCamera'](pw, px);
  }
};
TDV['Tour']['Script']['setSurfaceSelectionHotspotMode'] = function (pz) {
  var pA = this['getByClassName']('HotspotPanoramaOverlay');
  var pB = this['getByClassName']('PanoramaPlayer');
  var pC = pz == 'hotspotEnabled';
  var pD = pz == 'circleEnabled';
  var pE = !!pz;
  pA['forEach'](function (pF) {
    var pG = pF['get']('data');
    if (pG && pG['hasPanoramaAction'] == !![]) pF['set']('enabledInSurfaceSelection', pC);
  });
  pB['forEach'](function (pH) {
    pH['set']('adjacentPanoramaPositionsEnabled', pD);
    pH['set']('surfaceSelectionEnabled', pE);
  });
  this['get']('data')['surfaceSelectionHotspotMode'] = pz;
};
TDV['Tour']['Script']['setValue'] = function (pI, pJ, pK) {
  try {
    if ('set' in pI) pI['set'](pJ, pK);
    else pI[pJ] = pK;
  } catch (pL) { }
};
TDV['Tour']['Script']['setStartTimeVideo'] = function (pM, pN) {
  var pO = this['getPlayListItems'](pM);
  var pP = [];
  var pQ = function () {
    for (var pU = 0x0; pU < pO['length']; ++pU) {
      var pV = pO[pU];
      pV['set']('startTime', pP[pU]);
      pV['unbind']('stop', pQ, this);
    }
  };
  for (var pR = 0x0; pR < pO['length']; ++pR) {
    var pS = pO[pR];
    var pT = pS['get']('player');
    if (!pT) continue;
    if (pT['get']('video') == pM && pT['get']('state') == 'playing') {
      pT['seek'](pN);
    } else {
      pP['push'](pS['get']('startTime'));
      pS['set']('startTime', pN);
      pS['bind']('stop', pQ, this);
    }
  }
};
TDV['Tour']['Script']['setStartTimeVideoSync'] = function (pW, pX) {
  if (pW && pX) this['setStartTimeVideo'](pW, pX['get']('currentTime'));
};
TDV['Tour']['Script']['skip3DTransitionOnce'] = function (pY) {
  if (pY && pY['get']('class') == 'PanoramaPlayer') {
    var pZ = pY['get']('viewerArea');
    if (pZ && pZ['get']('translationTransitionEnabled') == !![]) {
      var q0 = function () {
        pY['unbind']('preloadMediaShow', q0, this);
        pZ['set']('translationTransitionEnabled', !![]);
      };
      pZ['set']('translationTransitionEnabled', ![]);
      pY['bind']('preloadMediaShow', q0, this);
    }
  }
};
TDV['Tour']['Script']['shareSocial'] = function (q1, q2, q3, q4, q5, q6) {
  if (q2 == undefined) {
    q2 = location['href']['split'](location['search'] || location['hash'] || /[?#]/)[0x0];
  }
  if (q3) {
    q2 += this['updateDeepLink'](q4, q5, ![]);
  }
  q2 = function (q8) {
    switch (q8) {
      case 'email':
        return 'mailto:?body=' + encodeURIComponent(q2);
      case 'facebook':
        var q9 = q2['indexOf']('?') != -0x1;
        q2 = q2['replace']('#', '?');
        if (q9) {
          var qa = q2['lastIndexOf']('?');
          q2 = q2['substring'](0x0, qa) + '&' + q2['substring'](qa + 0x1);
        }
        return 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(q2);
      case 'linkedin':
        return 'https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(q2);
      case 'pinterest':
        return 'https://pinterest.com/pin/create/button/?url=' + q2;
      case 'telegram':
        return 'https://t.me/share/url?url=' + q2;
      case 'twitter':
        return 'https://twitter.com/intent/tweet?source=webclient&url=' + q2;
      case 'whatsapp':
        return 'https://api.whatsapp.com/send/?text=' + encodeURIComponent(q2);
      default:
        return q2;
    }
  }(q1);
  if (q6) {
    for (var q7 in q6) {
      q2 += '&' + q7 + '=' + q6[q7];
    }
  }
  if (q1 == 'clipboard') this['copyToClipboard'](q2);
  else this['openLink'](q2, '_blank');
};
TDV['Tour']['Script']['showComponentsWhileMouseOver'] = function (qb, qc, qd, qe) {
  var qf = function (qj) {
    for (var qk = 0x0, ql = qc['length']; qk < ql; qk++) {
      var qm = qc[qk];
      if (!qe || qe(qm, qj)) qm['set']('visible', qj);
    }
  };
  if (this['get']('isMobile')) {
    qf['call'](this, !![]);
  } else {
    var qg = -0x1;
    var qh = function () {
      qf['call'](this, !![]);
      if (qg >= 0x0) clearTimeout(qg);
      qb['bind']('rollOut', qi, this);
    };
    var qi = function () {
      var qn = function () {
        qf['call'](this, ![]);
      };
      qb['unbind']('rollOut', qi, this);
      qg = setTimeout(qn['bind'](this), qd);
    };
    qb['bind']('rollOver', qh, this);
  }
};
TDV['Tour']['Script']['showPopupMedia'] = function (qo, qp, qq, qr, qs, qt) {
  var qu = this;
  var qv = function () {
    window['resumeAudiosBlocked'] = ![];
    qq['set']('selectedIndex', -0x1);
    qu['getMainViewer']()['set']('toolTipEnabled', !![]);
    this['resumePlayers'](qA, !![]);
    if (qz) {
      this['unbind']('resize', qx, this);
    }
    qo['unbind']('close', qv, this);
  };
  var qw = function () {
    qo['hide']();
  };
  var qx = function () {
    var qB = function (qS) {
      return qo['get'](qS) || 0x0;
    };
    var qC = qu['get']('actualWidth');
    var qD = qu['get']('actualHeight');
    var qE = qu['getMediaWidth'](qp);
    var qF = qu['getMediaHeight'](qp);
    var qG = parseFloat(qr) / 0x64;
    var qH = parseFloat(qs) / 0x64;
    var qI = qG * qC;
    var qJ = qH * qD;
    var qK = qB('footerHeight');
    var qL = qB('headerHeight');
    if (!qL) {
      var qM = qB('closeButtonIconHeight') + qB('closeButtonPaddingTop') + qB('closeButtonPaddingBottom');
      var qN = qu['getPixels'](qB('titleFontSize')) + qB('titlePaddingTop') + qB('titlePaddingBottom');
      qL = qM > qN ? qM : qN;
      qL += qB('headerPaddingTop') + qB('headerPaddingBottom');
    }
    var qO = qI - qB('bodyPaddingLeft') - qB('bodyPaddingRight') - qB('paddingLeft') - qB('paddingRight');
    var qP = qJ - qL - qK - qB('bodyPaddingTop') - qB('bodyPaddingBottom') - qB('paddingTop') - qB('paddingBottom');
    var qQ = qO / qP;
    var qR = qE / qF;
    if (qQ > qR) {
      qI = qP * qR + qB('bodyPaddingLeft') + qB('bodyPaddingRight') + qB('paddingLeft') + qB('paddingRight');
    } else {
      qJ = qO / qR + qL + qK + qB('bodyPaddingTop') + qB('bodyPaddingBottom') + qB('paddingTop') + qB('paddingBottom');
    }
    if (qI > qC * qG) {
      qI = qC * qG;
    }
    if (qJ > qD * qH) {
      qJ = qD * qH;
    }
    qo['set']('width', qI);
    qo['set']('height', qJ);
    qo['set']('x', (qC - qB('actualWidth')) * 0.5);
    qo['set']('y', (qD - qB('actualHeight')) * 0.5);
  };
  if (qt) {
    this['executeFunctionWhenChange'](qq, 0x0, qw);
  }
  var qy = qp['get']('class');
  var qz = qy == 'Video' || qy == 'Video360';
  qq['set']('selectedIndex', 0x0);
  if (qz) {
    this['bind']('resize', qx, this);
    qx();
    qq['get']('items')[0x0]['get']('player')['play']();
  } else {
    qo['set']('width', qr);
    qo['set']('height', qs);
  }
  window['resumeAudiosBlocked'] = !![];
  this['getMainViewer']()['set']('toolTipEnabled', ![]);
  var qA = this['pauseCurrentPlayers'](!![]);
  qo['bind']('close', qv, this);
  qo['show'](this, !![]);
};
TDV['Tour']['Script']['showPopupImage'] = function (qT, qU, qV, qW, qX, qY, qZ, r0, r1, r2, r3, r4) {
  var r5 = ![];
  var r6 = function () {
    rn['unbind']('loaded', r9, this);
    rd['call'](this);
  };
  var r7 = function () {
    rn['unbind']('click', r7, this);
    if (rr != undefined) {
      clearTimeout(rr);
    }
  };
  var r8 = function () {
    setTimeout(rh, 0x0);
  };
  var r9 = function () {
    this['unbind']('click', r6, this);
    rm['set']('visible', !![]);
    rh();
    ro['set']('visible', !![]);
    rn['unbind']('loaded', r9, this);
    rn['bind']('resize', r8, this);
    rr = setTimeout(ra['bind'](this), 0xc8);
  };
  var ra = function () {
    rr = undefined;
    if (r0) {
      rn['bind']('click', r7, this);
      rc['call'](this);
    }
    rn['bind']('userInteractionStart', ri, this);
    rn['bind']('userInteractionEnd', rj, this);
    rn['bind']('backgroundClick', rd, this);
    if (qU) {
      rn['bind']('click', rf, this);
      rn['set']('imageCursor', 'hand');
    }
    ro['bind']('click', rd, this);
    if (r3) r3['call'](this);
  };
  var rb = function () {
    if (r0 && rr) {
      clearTimeout(rr);
      rr = undefined;
    }
  };
  var rc = function () {
    if (r0) {
      rb();
      rr = setTimeout(rd['bind'](this), r0);
    }
  };
  var rd = function () {
    this['getMainViewer']()['set']('toolTipEnabled', !![]);
    r5 = !![];
    if (rr) clearTimeout(rr);
    if (rs) clearTimeout(rs);
    if (r0) r7();
    if (r4) r4['call'](this);
    rn['set']('visible', ![]);
    if (qY && qY['get']('duration') > 0x0) {
      qY['bind']('end', re, this);
    } else {
      rn['set']('image', null);
    }
    ro['set']('visible', ![]);
    rm['set']('visible', ![]);
    this['unbind']('click', r6, this);
    rn['unbind']('backgroundClick', rd, this);
    rn['unbind']('userInteractionStart', ri, this);
    rn['unbind']('userInteractionEnd', rj, this, !![]);
    rn['unbind']('resize', r8, this);
    if (qU) {
      rn['unbind']('click', rf, this);
      rn['set']('cursor', 'default');
    }
    ro['unbind']('click', rd, this);
    this['resumePlayers'](rq, r1 == null || r2);
    if (r2) {
      this['resumeGlobalAudios']();
    }
    if (r1) {
      this['stopGlobalAudio'](r1);
    }
  };
  var re = function () {
    rn['set']('image', null);
    qY['unbind']('end', re, this);
  };
  var rf = function () {
    rn['set']('image', rg() ? qT : qU);
  };
  var rg = function () {
    return rn['get']('image') == qU;
  };
  var rh = function () {
    var rt = rn['get']('actualWidth') - rn['get']('imageLeft') - rn['get']('imageWidth') + 0xa;
    var ru = rn['get']('imageTop') + 0xa;
    if (rt < 0xa) rt = 0xa;
    if (ru < 0xa) ru = 0xa;
    ro['set']('right', rt);
    ro['set']('top', ru);
  };
  var ri = function () {
    rb();
    if (rs) {
      clearTimeout(rs);
      rs = undefined;
    } else {
      ro['set']('visible', ![]);
    }
  };
  var rj = function () {
    rc['call'](this);
    if (!r5) {
      rs = setTimeout(rk, 0x12c);
    }
  };
  var rk = function () {
    rs = undefined;
    ro['set']('visible', !![]);
    rh();
  };
  var rl = function (rv) {
    var rw = rv['get']('data');
    if (rw && 'extraLevels' in rw) {
      var rx = this['rootPlayer']['createInstance'](rv['get']('class'));
      var ry = rw['extraLevels'];
      for (var rz = 0x0; rz < ry['length']; rz++) {
        var rA = ry[rz];
        if (typeof rA == 'string') ry[rz] = this[rA['replace']('this.', '')];
      }
      rx['set']('levels', rv['get']('levels')['concat'](ry));
      rv = rx;
    }
    return rv;
  };
  this['getMainViewer']()['set']('toolTipEnabled', ![]);
  var rm = this['veilPopupPanorama'];
  var rn = this['zoomImagePopupPanorama'];
  var ro = this['closeButtonPopupPanorama'];
  if (qZ) {
    for (var rp in qZ) {
      ro['set'](rp, qZ[rp]);
    }
  }
  var rq = this['pauseCurrentPlayers'](r1 == null || !r2);
  if (r2) {
    this['pauseGlobalAudios'](null, !![]);
  }
  if (r1) {
    this['playGlobalAudio'](r1, !![]);
  }
  var rr = undefined;
  var rs = undefined;
  qT = rl['call'](this, qT);
  if (qU) qU = rl['call'](this, qU);
  rn['bind']('loaded', r9, this);
  setTimeout(function () {
    this['bind']('click', r6, this, ![]);
  }['bind'](this), 0x0);
  rn['set']('image', qT);
  rn['set']('customWidth', qV);
  rn['set']('customHeight', qW);
  rn['set']('showEffect', qX);
  rn['set']('hideEffect', qY);
  rn['set']('visible', !![]);
  return rn;
};
TDV['Tour']['Script']['showPopupPanoramaOverlay'] = function (rB, rC, rD, rE, rF, rG, rH, rI) {
  var rJ = this['isCardboardViewMode']();
  if (rB['get']('visible') || !rJ && this['zoomImagePopupPanorama']['get']('visible')) return;
  this['getMainViewer']()['set']('toolTipEnabled', ![]);
  if (!rJ) {
    var rK = this['zoomImagePopupPanorama'];
    var rL = rB['get']('showDuration');
    var rM = rB['get']('hideDuration');
    var rO = this['pauseCurrentPlayers'](rG == null || !rH);
    var rP = rB['get']('popupMaxWidth');
    var rQ = rB['get']('popupMaxHeight');
    var rR = function () {
      var rV = function () {
        if (!this['isCardboardViewMode']()) rB['set']('visible', ![]);
      };
      rB['unbind']('showEnd', rR, this);
      rB['set']('showDuration', 0x1);
      rB['set']('hideDuration', 0x1);
      this['showPopupImage'](rD, rE, rB['get']('popupMaxWidth'), rB['get']('popupMaxHeight'), null, null, rC, rF, rG, rH, rV, rS);
    };
    var rS = function () {
      var rW = function () {
        rB['unbind']('hideEnd', rW, this);
        if (rI) rI();
      };
      var rX = function () {
        rB['unbind']('showEnd', rX, this);
        rB['bind']('hideEnd', rW, this, !![]);
        rB['set']('visible', ![]);
        rB['set']('showDuration', rL);
        rB['set']('popupMaxWidth', rP);
        rB['set']('popupMaxHeight', rQ);
      };
      this['resumePlayers'](rO, rG == null || !rH);
      var rY = rK['get']('imageWidth');
      var rZ = rK['get']('imageHeight');
      rB['bind']('showEnd', rX, this, !![]);
      rB['set']('showDuration', 0x1);
      rB['set']('hideDuration', rM);
      rB['set']('popupMaxWidth', rY);
      rB['set']('popupMaxHeight', rZ);
      if (rB['get']('visible')) rX();
      else rB['set']('visible', !![]);
      this['getMainViewer']()['set']('toolTipEnabled', !![]);
      if (rI) rI();
    };
    rB['bind']('showEnd', rR, this, !![]);
  } else {
    var rT = function () {
      this['resumePlayers'](rO, rG == null || rH);
      if (rH) {
        this['resumeGlobalAudios']();
      }
      if (rG) {
        this['stopGlobalAudio'](rG);
      }
      if (rE) {
        rB['set']('image', rD);
        rB['unbind']('click', rU, this);
      }
      rB['unbind']('hideEnd', rT, this);
      this['getMainViewer']()['set']('toolTipEnabled', !![]);
      if (rI) rI();
    };
    var rU = function () {
      rB['set']('image', rB['get']('image') == rD ? rE : rD);
    };
    var rO = this['pauseCurrentPlayers'](rG == null || !rH);
    if (rH) {
      this['pauseGlobalAudios'](null, !![]);
    }
    if (rG) {
      this['playGlobalAudio'](rG, !![]);
    }
    if (rE) rB['bind']('click', rU, this);
    rB['bind']('hideEnd', rT, this, !![]);
  }
  rB['set']('visible', !![]);
};
TDV['Tour']['Script']['showPopupPanoramaVideoOverlay'] = function (s0, s1, s2, s3, s4) {
  var s5 = ![];
  var s6 = function () {
    s0['unbind']('showEnd', s6);
    sa['bind']('click', s8, this);
    s9();
    sa['set']('visible', !![]);
  }['bind'](this);
  var s7 = function () {
    s5 = !![];
    if (!s0['get']('loop')) s8();
  }['bind'](this);
  var s8 = function () {
    window['resumeAudiosBlocked'] = ![];
    this['getMainViewer']()['set']('toolTipEnabled', !![]);
    s0['set']('visible', ![]);
    sa['set']('visible', ![]);
    sa['unbind']('click', s8, this);
    s0['unbind']('end', s7, this);
    s0['unbind']('hideEnd', s8, this, !![]);
    this['resumePlayers'](sc, !![]);
    if (s2) {
      this['resumeGlobalAudios']();
    }
    if (s3) s3();
    if (s4 && s5) s4();
  }['bind'](this);
  var s9 = function () {
    var sd = 0xa;
    var se = 0xa;
    sa['set']('right', sd);
    sa['set']('top', se);
  }['bind'](this);
  this['getMainViewer']()['set']('toolTipEnabled', ![]);
  var sa = this['closeButtonPopupPanorama'];
  if (s1) {
    for (var sb in s1) {
      sa['set'](sb, s1[sb]);
    }
  }
  window['resumeAudiosBlocked'] = !![];
  var sc = this['pauseCurrentPlayers'](!![]);
  if (s2) {
    this['pauseGlobalAudios']();
  }
  s0['bind']('end', s7, this, !![]);
  s0['bind']('showEnd', s6, this, !![]);
  s0['bind']('hideEnd', s8, this, !![]);
  s0['set']('visible', !![]);
};
TDV['Tour']['Script']['showWindow'] = function (sf, sg, sh) {
  if (sf['get']('visible') == !![]) {
    return;
  }
  var si = function () {
    this['getMainViewer']()['set']('toolTipEnabled', !![]);
    if (sh) {
      this['resumeGlobalAudios']();
    }
    sj();
    this['resumePlayers'](sm, !sh);
    sf['unbind']('close', si, this);
  };
  var sj = function () {
    sf['unbind']('click', sj, this);
    if (sk != undefined) {
      clearTimeout(sk);
    }
  };
  var sk = undefined;
  if (sg) {
    var sl = function () {
      sf['hide']();
    };
    sf['bind']('click', sj, this);
    sk = setTimeout(sl, sg);
  }
  this['getMainViewer']()['set']('toolTipEnabled', ![]);
  if (sh) {
    this['pauseGlobalAudios'](null, !![]);
  }
  var sm = this['pauseCurrentPlayers'](!sh);
  sf['bind']('close', si, this);
  sf['show'](this, !![]);
};
TDV['Tour']['Script']['startPanoramaWithCamera'] = function (sn, so) {
  var sp = this['getByClassName']('PlayList');
  if (sp['length'] == 0x0) return;
  var sq = window['currentPanoramasWithCameraChanged'] == undefined || !(sn['get']('id') in window['currentPanoramasWithCameraChanged']);
  var sr = [];
  for (var st = 0x0, su = sp['length']; st < su; ++st) {
    var sv = sp[st];
    var sw = sv['get']('items');
    for (var sx = 0x0, sy = sw['length']; sx < sy; ++sx) {
      var sA = sw[sx];
      if (sA['get']('media') == sn && (sA['get']('class') == 'PanoramaPlayListItem' || sA['get']('class') == 'Video360PlayListItem')) {
        if (sq) {
          sr['push']({
            'camera': sA['get']('camera'),
            'item': sA
          });
        }
        sA['set']('camera', so);
      }
    }
  }
  if (sr['length'] > 0x0) {
    if (window['currentPanoramasWithCameraChanged'] == undefined) {
      window['currentPanoramasWithCameraChanged'] = {};
    }
    var sB = sn['get']('id');
    window['currentPanoramasWithCameraChanged'][sB] = sr;
    var sC = function () {
      if (sB in window['currentPanoramasWithCameraChanged']) {
        delete window['currentPanoramasWithCameraChanged'][sB];
      }
      for (var sE = 0x0; sE < sr['length']; sE++) {
        sr[sE]['item']['set']('camera', sr[sE]['camera']);
        sr[sE]['item']['unbind']('end', sC, this);
      }
    };
    for (var st = 0x0; st < sr['length']; st++) {
      var sD = sr[st];
      var sA = sD['item'];
      this['skip3DTransitionOnce'](sA['get']('player'));
      sA['bind']('end', sC, this);
    }
  }
};
TDV['Tour']['Script']['stopAndGoCamera'] = function (sF, sG) {
  var sH = sF['get']('initialSequence');
  sH['pause']();
  var sI = function () {
    sH['play']();
  };
  setTimeout(sI, sG);
};
TDV['Tour']['Script']['syncPlaylists'] = function (sJ) {
  var sK = function (sS, sT) {
    for (var sU = 0x0, sV = sJ['length']; sU < sV; ++sU) {
      var sW = sJ[sU];
      if (sW != sT) {
        var sX = sW['get']('items');
        for (var sY = 0x0, sZ = sX['length']; sY < sZ; ++sY) {
          if (sX[sY]['get']('media') == sS) {
            if (sW['get']('selectedIndex') != sY) {
              sW['set']('selectedIndex', sY);
            }
            break;
          }
        }
      }
    }
  };
  var sL = function (t0) {
    var t1 = t0['source'];
    var t2 = t1['get']('selectedIndex');
    if (t2 < 0x0) return;
    var t3 = t1['get']('items')[t2]['get']('media');
    sK(t3, t1);
  };
  var sM = function (t4) {
    var t5 = t4['source']['get']('panoramaMapLocation');
    if (t5) {
      var t6 = t5['get']('map');
      sK(t6);
    }
  };
  for (var sO = 0x0, sQ = sJ['length']; sO < sQ; ++sO) {
    sJ[sO]['bind']('change', sL, this);
  }
  var sR = this['getByClassName']('MapPlayer');
  for (var sO = 0x0, sQ = sR['length']; sO < sQ; ++sO) {
    sR[sO]['bind']('panoramaMapLocation_change', sM, this);
  }
};
TDV['Tour']['Script']['translate'] = function (t7) {
  return this['get']('data')['localeManager']['trans'](t7);
};
TDV['Tour']['Script']['triggerOverlay'] = function (t8, t9) {
  if (t8['get']('areas') != undefined) {
    var ta = t8['get']('areas');
    for (var tb = 0x0; tb < ta['length']; ++tb) {
      ta[tb]['trigger'](t9);
    }
  } else {
    t8['trigger'](t9);
  }
};
TDV['Tour']['Script']['updateDeepLink'] = function (tc, td, te) {
  var tf = this['mainPlayList']['get']('selectedIndex');
  var tg;
  var th;
  if (tf >= 0x0) {
    tg = '#media=' + (tf + 0x1);
    th = this['mainPlayList']['get']('items')[tf]['get']('media');
  } else {
    th = this['getActiveMediaWithViewer'](this['getMainViewer']());
    if (th != undefined) {
      var tj = th['get']('data');
      if (tj) {
        tg = '#media-name=' + tj['label'];
      }
    }
  }
  if (th) {
    if (tc) {
      var tk = this['getActivePlayerWithViewer'](this['getMainViewer']());
      if (tk && tk['get']('class') == 'PanoramaPlayer') {
        var tl = tk['get']('yaw');
        var tm = tk['get']('pitch');
        if (!isNaN(tl) && !isNaN(tm)) tg += '&yaw=' + tl['toFixed'](0x2) + '&pitch=' + tm['toFixed'](0x2);
      }
    }
    if (td) {
      var tn = this['getOverlays'](th);
      var to = [];
      var tp = [];
      for (var tq = 0x0, tr = tn['length']; tq < tr; ++tq) {
        var ts = tn[tq];
        var tt = ts['get']('enabled');
        var tj = ts['get']('data');
        if (tt === undefined || !tj || !tj['label']) continue;
        var tu = encodeURIComponent(tj['label']);
        var tv = tj['group'];
        if (tt != tj['defaultEnabledValue']) {
          if (tt) {
            to['push'](tu);
          } else if (!tv) {
            tp['push'](tu);
          }
        }
      }
      if (to['length'] > 0x0) tg += '&son=' + to['join'](',');
      if (tp['length'] > 0x0) tg += '&hon=' + tp['join'](',');
    }
  }
  if (tg && te === !![]) {
    location['hash'] = tg;
  }
  return tg;
};
TDV['Tour']['Script']['updateMediaLabelFromPlayList'] = function (tw, tx, ty) {
  var tz = function () {
    var tB = tw['get']('selectedIndex');
    if (tB >= 0x0) {
      var tC = function () {
        tF['unbind']('begin', tC);
        tD(tB);
      };
      var tD = function (tG) {
        var tH = tF['get']('media');
        var tI = tH['get']('data');
        var tJ = tI !== undefined ? tI['description'] : undefined;
        tE(tJ);
      };
      var tE = function (tK) {
        if (tK !== undefined) {
          tx['set']('html', '<div\x20style=\x22text-align:left\x22><SPAN\x20STYLE=\x22color:#FFFFFF;font-size:12px;font-family:Verdana\x22><span\x20color=\x22white\x22\x20font-family=\x22Verdana\x22\x20font-size=\x2212px\x22>' + tK + '</SPAN></div>');
        } else {
          tx['set']('html', '');
        }
        var tL = tx['get']('html');
        tx['set']('visible', tL !== undefined && tL);
      };
      var tF = tw['get']('items')[tB];
      if (tx['get']('html')) {
        tE('Loading...');
        tF['bind']('begin', tC);
      } else {
        tD(tB);
      }
    }
  };
  var tA = function () {
    tx['set']('html', undefined);
    tw['unbind']('change', tz, this);
    ty['unbind']('stop', tA, this);
  };
  if (ty) {
    ty['bind']('stop', tA, this);
  }
  tw['bind']('change', tz, this);
  tz();
};
TDV['Tour']['Script']['updateVideoCues'] = function (tM, tN) {
  var tO = tM['get']('items')[tN];
  var tP = tO['get']('media');
  if (tP['get']('cues')['length'] == 0x0) return;
  var tQ = tO['get']('player');
  var tR = [];
  var tS = function () {
    if (tM['get']('selectedIndex') != tN) {
      tP['unbind']('cueChange', tT, this);
      tM['unbind']('change', tS, this);
    }
  };
  var tT = function (tU) {
    var tV = tU['data']['activeCues'];
    for (var tW = 0x0, tX = tR['length']; tW < tX; ++tW) {
      var tY = tR[tW];
      if (tV['indexOf'](tY) == -0x1 && (tY['get']('startTime') > tQ['get']('currentTime') || tY['get']('endTime') < tQ['get']('currentTime') + 0.5)) {
        tY['trigger']('end');
      }
    }
    tR = tV;
  };
  tP['bind']('cueChange', tT, this);
  tM['bind']('change', tS, this);
};
TDV['Tour']['Script']['visibleComponentsIfPlayerFlagEnabled'] = function (tZ, u0) {
  var u1 = this['get'](u0);
  for (var u2 in tZ) {
    tZ[u2]['set']('visible', u1);
  }
};
TDV['Tour']['Script']['quizStart'] = function () {
  var u3 = this['get']('data')['quiz'];
  return u3 ? u3['start']() : undefined;
};
TDV['Tour']['Script']['quizFinish'] = function () {
  var u4 = this['get']('data')['quiz'];
  return u4 ? u4['finish']() : undefined;
};
TDV['Tour']['Script']['quizPauseTimer'] = function () {
  var u5 = this['get']('data')['quiz'];
  return u5 ? u5['pauseTimer']() : undefined;
};
TDV['Tour']['Script']['quizResumeTimer'] = function () {
  var u6 = this['get']('data')['quiz'];
  return u6 ? u6['continueTimer']() : undefined;
};
TDV['Tour']['Script']['quizSetItemFound'] = function (u7) {
  var u8 = this['get']('data')['quiz'];
  if (u8) u8['setItemFound'](u7);
};
TDV['Tour']['Script']['quizShowQuestion'] = function (u9) {
  var ua = this['get']('data');
  var ub = ua['quiz'];
  var uc;
  if (ub) {
    var ud = this['pauseCurrentPlayers'](!![]);
    var ue = this[u9];
    var uf;
    if (!ue['media']) {
      uf = this['get']('isMobile') ? {
        'theme': {
          'window': {
            'height': undefined,
            'maxHeight': this['get']('actualHeight'),
            'optionsContainer': {
              'height': '100%'
            }
          }
        }
      } : {
        'theme': {
          'window': {
            'width': '40%',
            'height': undefined,
            'maxHeight': 0x2bc,
            'optionsContainer': {
              'width': '100%'
            }
          }
        }
      };
    } else if (this['get']('isMobile') && this['get']('orientation') == 'landscape') {
      uf = {
        'theme': {
          'window': {
            'bodyContainer': {
              'layout': 'horizontal',
              'paddingLeft': 0x1e,
              'paddingRight': 0x1e
            },
            'mediaContainer': {
              'width': '60%',
              'height': '100%'
            },
            'buttonsContainer': {
              'paddingLeft': 0x14,
              'paddingRight': 0x14
            },
            'optionsContainer': {
              'width': '40%',
              'height': '100%',
              'paddingLeft': 0x0,
              'paddingRight': 0x0
            }
          }
        }
      };
    }
    if (this['get']('isMobile') && this['get']('orientation') == 'landscape') {
      var ug = this['get']('data')['tour']['getNotchValue']();
      if (ug > 0x0) {
        uf = this['mixObject'](uf || {}, {
          'theme': {
            'window': {
              'width': undefined,
              'left': ug,
              'right': ug
            }
          }
        });
      }
    }
    var uh = this['get']('data')['textToSpeechConfig']['speechOnQuizQuestion'] && !!ue['title'];
    if (uh) this['textToSpeech'](ue['title'], u9);
    uc = ub['showQuestion'](u9, uf);
    uc['then'](function (ui) {
      if (uh) this['stopTextToSpeech']();
      this['resumePlayers'](ud, !![]);
    }['bind'](this));
  }
  return uc;
};
TDV['Tour']['Script']['quizShowScore'] = function (uj) {
  var uk = this['get']('data');
  var ul = uk['quiz'];
  if (ul) {
    if (this['get']('isMobile')) {
      uj = uj || {};
      uj = this['mixObject'](uj, uk[this['get']('orientation') == 'portrait' ? 'scorePortraitConfig' : 'scoreLandscapeConfig']);
    }
    return ul['showScore'](uj);
  }
};
TDV['Tour']['Script']['quizShowTimeout'] = function (um, un) {
  var uo = this['get']('data');
  var up = uo['quiz'];
  if (up) {
    if (this['get']('isMobile')) {
      un = un || {};
      un = this['mixObject'](un, uo[this['get']('orientation') == 'portrait' ? 'scorePortraitConfig' : 'scoreLandscapeConfig']);
    }
    up['showTimeout'](um, un);
  }
};
TDV['Tour']['Script']['stopTextToSpeech'] = function (uq) {
  if (window['speechSynthesis'] && (uq == undefined || this['t2sLastID'] == uq)) {
    var ur = window['speechSynthesis'];
    if (ur['speaking']) {
      ur['cancel']();
    }
    this['t2sLastID'] = undefined;
  }
};
TDV['Tour']['Script']['textToSpeech'] = function (us, ut, uu) {
  if (this['get']('mute')) {
    return;
  }
  var uv = this['get']('data');
  var uw = uv['disableTTS'] || ![];
  if (uw) return;
  if (ut != undefined && this['t2sLastID'] != ut || ut == undefined) {
    uu = uu || 0x0;
    if (this['t2sLastID'] && uu > this['t2sLastPriority']) {
      return;
    }
    var ux = uv['tour'];
    var uy = uv['textToSpeechConfig'];
    var uz = uv['localeManager']['currentLocaleID'];
    if (window['speechSynthesis']) {
      var uA = window['speechSynthesis'];
      if (uA['speaking']) {
        uA['cancel']();
      }
      var uB = new SpeechSynthesisUtterance(us);
      if (uz) uB['lang'] = uz;
      var uC;
      if (uy) {
        uB['volume'] = uy['volume'];
        uB['pitch'] = uy['pitch'];
        uB['rate'] = uy['rate'];
        if (uy['stopBackgroundAudio']) this['pauseGlobalAudios'](null, !![]);
      }
      uB['onend'] = function () {
        this['t2sLastID'] = null;
        if (uC) clearInterval(uC);
        if (uy['stopBackgroundAudio']) this['resumeGlobalAudios']();
      }['bind'](this);
      if (navigator['userAgent']['indexOf']('Chrome') != -0x1 && !this['get']('isMobile')) {
        uC = setInterval(function () {
          uA['pause']();
          uA['resume']();
        }, 0xbb8);
      }
      uA['speak'](uB);
      this['t2sLastPriority'] = uu;
      this['t2sLastID'] = ut;
    } else if (ux['isMobileApp']()) {
      if (!ux['isIOS']()) {
        var uD = function (uE, uF) {
          var uG = {
            'command': 'tts',
            'type': uE
          };
          if (uF) uG = this['mixObject'](uG, uF);
          android['sendJSON'](JSON['stringify'](uG));
        }['bind'](this);
        android['onTTSEnd'] = function () {
          this['t2sLastID'] = null;
          if (uy['stopBackgroundAudio']) this['resumeGlobalAudios']();
          android['onTTSEnd'] = undefined;
        }['bind'](this);
        uD('stop');
        if (uy) {
          uD('init', {
            'volume': uy['volume'],
            'pitch': uy['pitch'],
            'rate': uy['rate'],
            'language': uz
          });
          if (uy['stopBackgroundAudio']) this['pauseGlobalAudios'](null, !![]);
        }
        uD('play', {
          'text': us,
          'androidCallback': 'onTTSEnd'
        });
      } else {
        console['error']('Text\x20to\x20Speech\x20isn\x27t\x20supported\x20on\x20this\x20browser');
      }
    } else {
      console['error']('Text\x20to\x20Speech\x20isn\x27t\x20supported\x20on\x20this\x20browser');
    }
  }
};
TDV['Tour']['Script']['textToSpeechComponent'] = function (uH) {
  var uI = uH['get']('class');
  var uJ;
  if (uI == 'HTMLText') {
    var uK = uH['get']('html');
    if (uK) {
      uJ = this['htmlToPlainText'](uK, {
        'linkProcess': function (uL, uM) {
          return uM;
        }
      });
    }
  } else if (uI == 'BaseButton') {
    uJ = uH['get']('label');
  } else if (uI == 'Label') {
    uJ = uH['get']('text');
  }
  if (uJ) {
    this['textToSpeech'](uJ, uH['get']('id'));
  }
};
TDV['Tour']['Script']['_initTTSTooltips'] = function () {
  function uN(uP) {
    var uQ = uP['source'];
    this['textToSpeech'](uQ['get']('toolTip'), uQ['get']('id'), 0x1);
  }

  function uO(uR) {
    var uS = uR['source'];
    this['stopTextToSpeech'](uS['get']('id'));
  }
  setTimeout(function () {
    var uT = this['getByClassName']('UIComponent');
    for (var uU = 0x0, uV = uT['length']; uU < uV; ++uU) {
      var uW = uT[uU];
      var uX = uW['get']('toolTip');
      if (!!uX || uW['get']('class') == 'ViewerArea') {
        uW['bind']('toolTipShow', uN, this);
        uW['bind']('toolTipHide', uO, this);
      }
    }
  }['bind'](this), 0x0);
};
TDV['Tour']['Script']['takeScreenshot'] = function (uY) {
  var uZ = this['getActivePlayerWithViewer'](uY);
  if (uZ && uZ['get']('class') == 'PanoramaPlayer') uZ['saveScreenshot']();
};
TDV['Tour']['Script']['htmlToPlainText'] = function htmlToPlainText(v0, v1) {
  var v2 = function (vg, vh) {
    var vi = '';
    for (var vj = 0x0; vj < vh; vj += 0x1) {
      vi += vg;
    }
    return vi;
  };
  var v3 = null;
  var v4 = null;
  var v5 = 'underline';
  var v6 = 'indention';
  var v7 = '-';
  var v8 = 0x3;
  var v9 = '-';
  var va = ![];
  if (!!v1) {
    if (typeof v1['linkProcess'] === 'function') {
      v3 = v1['linkProcess'];
    }
    if (typeof v1['imgProcess'] === 'function') {
      v4 = v1['imgProcess'];
    }
    if (!!v1['headingStyle']) {
      v5 = v1['headingStyle'];
    }
    if (!!v1['listStyle']) {
      v6 = v1['listStyle'];
    }
    if (!!v1['uIndentionChar']) {
      v7 = v1['uIndentionChar'];
    }
    if (!!v1['listIndentionTabs']) {
      v8 = v1['listIndentionTabs'];
    }
    if (!!v1['oIndentionChar']) {
      v9 = v1['oIndentionChar'];
    }
    if (!!v1['keepNbsps']) {
      va = v1['keepNbsps'];
    }
  }
  var vb = v2(v7, v8);
  var vc = String(v0)['replace'](/\n|\r/g, '\x20');
  const vd = vc['match'](/<\/body>/i);
  if (vd) {
    vc = vc['substring'](0x0, vd['index']);
  }
  const ve = vc['match'](/<body[^>]*>/i);
  if (ve) {
    vc = vc['substring'](ve['index'] + ve[0x0]['length'], vc['length']);
  }
  vc = vc['replace'](/<(script|style)( [^>]*)*>((?!<\/\1( [^>]*)*>).)*<\/\1>/gi, '');
  vc = vc['replace'](/<(\/)?((?!h[1-6]( [^>]*)*>)(?!img( [^>]*)*>)(?!a( [^>]*)*>)(?!ul( [^>]*)*>)(?!ol( [^>]*)*>)(?!li( [^>]*)*>)(?!p( [^>]*)*>)(?!div( [^>]*)*>)(?!td( [^>]*)*>)(?!br( [^>]*)*>)[^>\/])[^<>]*>/gi, '');
  vc = vc['replace'](/<img([^>]*)>/gi, function (vk, vl) {
    var vm = '';
    var vn = '';
    var vo = /src="([^"]*)"/i['exec'](vl);
    var vp = /alt="([^"]*)"/i['exec'](vl);
    if (vo !== null) {
      vm = vo[0x1];
    }
    if (vp !== null) {
      vn = vp[0x1];
    }
    if (typeof v4 === 'function') {
      return v4(vm, vn);
    }
    if (vn === '') {
      return '![image]\x20(' + vm + ')';
    }
    return '![' + vn + ']\x20(' + vm + ')';
  });

  function vf() {
    return function (vq, vr, vs, vt) {
      var vu = 0x0;
      if (vs && /start="([0-9]+)"/i['test'](vs)) {
        vu = /start="([0-9]+)"/i['exec'](vs)[0x1] - 0x1;
      }
      var vv = '<p>' + vt['replace'](/<li[^>]*>(((?!<li[^>]*>)(?!<\/li>).)*)<\/li>/gi, function (vw, vx) {
        var vy = 0x0;
        var vz = vx['replace'](/(^|(<br \/>))(?!<p>)/gi, function () {
          if (vr === 'o' && vy === 0x0) {
            vu += 0x1;
            vy += 0x1;
            return '<br\x20/>' + vu + v2(v9, v8 - String(vu)['length']);
          }
          return '<br\x20/>' + vb;
        });
        return vz;
      }) + '</p>';
      return vv;
    };
  }
  if (v6 === 'linebreak') {
    vc = vc['replace'](/<\/?ul[^>]*>|<\/?ol[^>]*>|<\/?li[^>]*>/gi, '\x0a');
  } else if (v6 === 'indention') {
    while (/<(o|u)l[^>]*>(.*)<\/\1l>/gi['test'](vc)) {
      vc = vc['replace'](/<(o|u)l([^>]*)>(((?!<(o|u)l[^>]*>)(?!<\/(o|u)l>).)*)<\/\1l>/gi, vf());
    }
  }
  if (v5 === 'linebreak') {
    vc = vc['replace'](/<h([1-6])[^>]*>([^<]*)<\/h\1>/gi, '\x0a$2\x0a');
  } else if (v5 === 'underline') {
    vc = vc['replace'](/<h1[^>]*>(((?!<\/h1>).)*)<\/h1>/gi, function (vA, vB) {
      return '\x0a&nbsp;\x0a' + vB + '\x0a' + v2('=', vB['length']) + '\x0a&nbsp;\x0a';
    });
    vc = vc['replace'](/<h2[^>]*>(((?!<\/h2>).)*)<\/h2>/gi, function (vC, vD) {
      return '\x0a&nbsp;\x0a' + vD + '\x0a' + v2('-', vD['length']) + '\x0a&nbsp;\x0a';
    });
    vc = vc['replace'](/<h([3-6])[^>]*>(((?!<\/h\1>).)*)<\/h\1>/gi, function (vE, vF, vG) {
      return '\x0a&nbsp;\x0a' + vG + '\x0a&nbsp;\x0a';
    });
  } else if (v5 === 'hashify') {
    vc = vc['replace'](/<h([1-6])[^>]*>([^<]*)<\/h\1>/gi, function (vH, vI, vJ) {
      return '\x0a&nbsp;\x0a' + v2('#', vI) + '\x20' + vJ + '\x0a&nbsp;\x0a';
    });
  }
  vc = vc['replace'](/<br( [^>]*)*>|<p( [^>]*)*>|<\/p( [^>]*)*>|<div( [^>]*)*>|<\/div( [^>]*)*>|<td( [^>]*)*>|<\/td( [^>]*)*>/gi, '\x0a');
  vc = vc['replace'](/<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a[^>]*>/gi, function (vK, vL, vM) {
    if (typeof v3 === 'function') {
      return v3(vL, vM);
    }
    return '\x20[' + vM + ']\x20(' + vL + ')\x20';
  });
  vc = vc['replace'](/\n[ \t\f]*/gi, '\x0a');
  vc = vc['replace'](/\n\n+/gi, '\x0a');
  if (va) {
    vc = vc['replace'](/( |\t)+/gi, '\x20');
    vc = vc['replace'](/&nbsp;/gi, '\x20');
  } else {
    vc = vc['replace'](/( |&nbsp;|\t)+/gi, '\x20');
  }
  vc = vc['replace'](/\n +/gi, '\x0a');
  vc = vc['replace'](/^ +/gi, '');
  while (vc['indexOf']('\x0a') === 0x0) {
    vc = vc['substring'](0x1);
  }
  if (vc['length'] === 0x0 || vc['lastIndexOf']('\x0a') !== vc['length'] - 0x1) {
    vc += '\x0a';
  }
  return vc;
};
TDV['Tour']['Script']['openEmbeddedPDF'] = function (vN, vO) {
  var vP = !!window['MSInputMethodContext'] && !!document['documentMode'];
  if (vP) {
    this['openLink'](vO, '_blank');
    return;
  }
  var vQ = vN['get']('class');
  var vR = !new RegExp('^(?:[a-z]+:)?//', 'i')['test'](vO);
  if (vR && vQ == 'WebFrame') {
    var vS = location['origin'] + location['pathname'];
    vN['set']('url', 'lib/pdfjs/web/viewer.html?file=' + encodeURIComponent(vS['substring'](0x0, vS['lastIndexOf']('/')) + '/' + vO));
  } else {
    var vT = location['origin'] == new URL(vO)['origin'];
    var vU = '<iframe\x20\x20id=\x27googleViewer\x27\x20src=\x27https://docs.google.com/viewer?url=[url]&embedded=true\x27\x20width=\x27100%\x27\x20height=\x27100%\x27\x20frameborder=\x270\x27>' + '<p>This\x20browser\x20does\x20not\x20support\x20inline\x20PDFs.\x20Please\x20download\x20the\x20PDF\x20to\x20view\x20it:\x20<a\x20href=\x27[url]\x27>Download\x20PDF</a></p>' + '</iframe>';
    var vV = /^((?!chrome|android|crios|ipad|iphone).)*safari/i['test'](navigator['userAgent']);
    var vW = '<div\x20id=\x22content\x22\x20style=\x22width:100%;height:100%;position:absolute;left:0;top:0;\x22></div>' + '<script\x20type=\x22text/javascript\x22>' + '!function(root,factory){\x22function\x22==typeof\x20define&&define.amd?define([],factory):\x22object\x22==typeof\x20module&&module.exports?module.exports=factory():root.PDFObject=factory()}(this,function(){\x22use\x20strict\x22;if(void\x200===window||void\x200===window.navigator||void\x200===window.navigator.userAgent||void\x200===window.navigator.mimeTypes)return!1;let\x20nav=window.navigator,ua=window.navigator.userAgent,isIE=\x22ActiveXObject\x22in\x20window,isModernBrowser=void\x200!==window.Promise,supportsPdfMimeType=void\x200!==nav.mimeTypes[\x22application/pdf\x22],isMobileDevice=void\x200!==nav.platform&&\x22MacIntel\x22===nav.platform&&void\x200!==nav.maxTouchPoints&&nav.maxTouchPoints>1||/Mobi|Tablet|Android|iPad|iPhone/.test(ua),isSafariDesktop=!isMobileDevice&&void\x200!==nav.vendor&&/Apple/.test(nav.vendor)&&/Safari/.test(ua),isFirefoxWithPDFJS=!(isMobileDevice||!/irefox/.test(ua))&&parseInt(ua.split(\x22rv:\x22)[1].split(\x22.\x22)[0],10)>18,createAXO=function(type){var\x20ax;try{ax=new\x20ActiveXObject(type)}catch(e){ax=null}return\x20ax},supportsPDFs=!isMobileDevice&&(isFirefoxWithPDFJS||supportsPdfMimeType||isIE&&!(!createAXO(\x22AcroPDF.PDF\x22)&&!createAXO(\x22PDF.PdfCtrl\x22))),embedError=function(msg,suppressConsole){return\x20suppressConsole||console.log(\x22[PDFObject]\x20\x22+msg),!1},emptyNodeContents=function(node){for(;node.firstChild;)node.removeChild(node.firstChild)},generatePDFJSMarkup=function(targetNode,url,pdfOpenFragment,PDFJS_URL,id,omitInlineStyles){emptyNodeContents(targetNode);let\x20fullURL=PDFJS_URL+\x22?file=\x22+encodeURIComponent(url)+pdfOpenFragment,div=document.createElement(\x22div\x22),iframe=document.createElement(\x22iframe\x22);return\x20iframe.src=fullURL,iframe.className=\x22pdfobject\x22,iframe.type=\x22application/pdf\x22,iframe.frameborder=\x220\x22,id&&(iframe.id=id),omitInlineStyles||(div.style.cssText=\x22position:\x20absolute;\x20top:\x200;\x20right:\x200;\x20bottom:\x200;\x20left:\x200;\x22,iframe.style.cssText=\x22border:\x20none;\x20width:\x20100%;\x20height:\x20100%;\x22,/*targetNode.style.position=\x22relative\x22,*/targetNode.style.overflow=\x22auto\x22),div.appendChild(iframe),targetNode.appendChild(div),targetNode.classList.add(\x22pdfobject-container\x22),targetNode.getElementsByTagName(\x22iframe\x22)[0]},embed=function(url,targetSelector,options){let\x20selector=targetSelector||!1,opt=options||{},id=\x22string\x22==typeof\x20opt.id?opt.id:\x22\x22,page=opt.page||!1,pdfOpenParams=opt.pdfOpenParams||{},fallbackLink=opt.fallbackLink||!0,width=opt.width||\x22100%\x22,height=opt.height||\x22100%\x22,assumptionMode=\x22boolean\x22!=typeof\x20opt.assumptionMode||opt.assumptionMode,forcePDFJS=\x22boolean\x22==typeof\x20opt.forcePDFJS&&opt.forcePDFJS,supportRedirect=\x22boolean\x22==typeof\x20opt.supportRedirect&&opt.supportRedirect,omitInlineStyles=\x22boolean\x22==typeof\x20opt.omitInlineStyles&&opt.omitInlineStyles,suppressConsole=\x22boolean\x22==typeof\x20opt.suppressConsole&&opt.suppressConsole,forceIframe=\x22boolean\x22==typeof\x20opt.forceIframe&&opt.forceIframe,PDFJS_URL=opt.PDFJS_URL||!1,targetNode=function(targetSelector){let\x20targetNode=document.body;return\x22string\x22==typeof\x20targetSelector?targetNode=document.querySelector(targetSelector):void\x200!==window.jQuery&&targetSelector\x20instanceof\x20jQuery&&targetSelector.length?targetNode=targetSelector.get(0):void\x200!==targetSelector.nodeType&&1===targetSelector.nodeType&&(targetNode=targetSelector),targetNode}(selector),fallbackHTML=\x22\x22,pdfOpenFragment=\x22\x22;if(\x22string\x22!=typeof\x20url)return\x20embedError(\x22URL\x20is\x20not\x20valid\x22,suppressConsole);if(!targetNode)return\x20embedError(\x22Target\x20element\x20cannot\x20be\x20determined\x22,suppressConsole);if(page&&(pdfOpenParams.page=page),pdfOpenFragment=function(pdfParams){let\x20prop,string=\x22\x22;if(pdfParams){for(prop\x20in\x20pdfParams)pdfParams.hasOwnProperty(prop)&&(string+=encodeURIComponent(prop)+\x22=\x22+encodeURIComponent(pdfParams[prop])+\x22&\x22);string&&(string=(string=\x22#\x22+string).slice(0,string.length-1))}return\x20string}(pdfOpenParams),forcePDFJS&&PDFJS_URL)return\x20generatePDFJSMarkup(targetNode,url,pdfOpenFragment,PDFJS_URL,id,omitInlineStyles);if(supportsPDFs||assumptionMode&&isModernBrowser&&!isMobileDevice){return\x20function(embedType,targetNode,targetSelector,url,pdfOpenFragment,width,height,id,omitInlineStyles){emptyNodeContents(targetNode);let\x20embed=document.createElement(embedType);if(embed.src=url+pdfOpenFragment,embed.className=\x22pdfobject\x22,embed.type=\x22application/pdf\x22,id&&(embed.id=id),!omitInlineStyles){let\x20style=\x22embed\x22===embedType?\x22overflow:\x20auto;\x22:\x22border:\x20none;\x22;targetSelector&&targetSelector!==document.body?style+=\x22width:\x20\x22+width+\x22;\x20height:\x20\x22+height+\x22;\x22:style+=\x22position:\x20absolute;\x20top:\x200;\x20right:\x200;\x20bottom:\x200;\x20left:\x200;\x20width:\x20100%;\x20height:\x20100%;\x22,embed.style.cssText=style}return\x20targetNode.classList.add(\x22pdfobject-container\x22),targetNode.appendChild(embed),targetNode.getElementsByTagName(embedType)[0]}(forceIframe||supportRedirect&&isSafariDesktop?\x22iframe\x22:\x22embed\x22,targetNode,targetSelector,url,pdfOpenFragment,width,height,id,omitInlineStyles)}return\x20PDFJS_URL?generatePDFJSMarkup(targetNode,url,pdfOpenFragment,PDFJS_URL,id,omitInlineStyles):(fallbackLink&&(fallbackHTML=\x22string\x22==typeof\x20fallbackLink?fallbackLink:\x22<p>This\x20browser\x20does\x20not\x20support\x20inline\x20PDFs.\x20Please\x20download\x20the\x20PDF\x20to\x20view\x20it:\x20<a\x20href=\x27[url]\x27>Download\x20PDF</a></p>\x22,targetNode.innerHTML=fallbackHTML.replace(/\x5c[url\x5c]/g,url)),embedError(\x22This\x20browser\x20does\x20not\x20support\x20embedded\x20PDFs\x22,suppressConsole))};return{embed:function(a,b,c){return\x20embed(a,b,c)},pdfobjectversion:\x222.2.3\x22,supportsPDFs:supportsPDFs}});' + 'if\x20(typeof\x20module\x20===\x20\x22object\x22\x20&&\x20module.exports)\x20{' + 'this.PDFObject\x20=\x20module.exports;' + '}' + 'PDFObject.embed(\x22' + vO + '\x22,\x20\x22#content\x22,\x20{' + (vT ? '\x22PDFJS_URL\x22:\x20\x22' + new URL('lib/pdfjs/web/viewer.html', document['baseURI'])['href'] + '\x22,\x20' : '') + '\x22fallbackLink\x22:\x20\x22' + vU + '\x22,' + '\x22forcePDFJS\x22:\x20' + vV + '});' + 'if(!PDFObject.supportsPDFs\x20&&\x20!' + vT + '){' + '\x20var\x20iframeTimerId;' + '\x20function\x20startTimer(){' + '\x20\x20\x20\x20iframeTimerId\x20=\x20window.setTimeout(checkIframeLoaded,\x202000);' + '\x20}' + '\x20function\x20checkIframeLoaded(){\x20\x20' + '\x20\x20\x20\x20var\x20iframe\x20=\x20document.getElementById(\x22googleViewer\x22);' + '\x20\x20\x20\x20iframe.src\x20=\x20iframe.src;' + '\x20\x20\x20\x20iframeTimerId\x20=\x20window.setTimeout(checkIframeLoaded,\x202000);' + '\x20}' + '\x20document.getElementById(\x22googleViewer\x22).addEventListener(\x22load\x22,\x20function(){' + '\x20\x20\x20clearInterval(iframeTimerId);\x20' + '\x20});' + '\x20startTimer();' + '}' + '</script>';
    if (vQ == 'WebFrame') {
      vN['set']('url', 'data:text/html;charset=utf-8,' + encodeURIComponent('<!DOCTYPE\x20html>' + '<html>' + '<head></head>' + '<body\x20style=\x22height:100%;width:100%;overflow:hidden;margin:0px;background-color:rgb(82,\x2086,\x2089);\x22>' + vW + '</body>' + '</html>'));
    } else if (vQ == 'HTML') {
      vN['set']('content', 'data:text/html;charset=utf-8,' + encodeURIComponent(vW));
    }
  }
};
TDV['Tour']['Script']['getKey'] = function (vX) {
  return window[vX];
};
TDV['Tour']['Script']['registerKey'] = function (vY, vZ) {
  window[vY] = vZ;
};
TDV['Tour']['Script']['unregisterKey'] = function (w0) {
  delete window[w0];
};
TDV['Tour']['Script']['existsKey'] = function (w1) {
  return w1 in window;
};
//# sourceMappingURL=script_v2022.1.30.js.map
//Generated with v2022.1.30, Fri Oct 21 2022