if (!Object["hasOwnProperty"]("values")) {
  Object["values"] = function (c) {
    return Object["keys"](c)["map"](function (d) {
      return c[d];
    });
  };
}
if (!String["prototype"]["startsWith"]) {
  String["prototype"]["startsWith"] = function (e, f) {
    f = f || 0x0;
    return this["indexOf"](e, f) === f;
  };
}
TDV["EventDispatcher"] = function () {
  this["_handlers"] = {};
};
TDV["EventDispatcher"]["prototype"]["bind"] = function (g, h) {
  if (!(g in this["_handlers"])) this["_handlers"][g] = [];
  this["_handlers"][g]["push"](h);
};
TDV["EventDispatcher"]["prototype"]["unbind"] = function (i, j) {
  if (i in this["_handlers"]) {
    var k = this["_handlers"][i]["indexOf"](j);
    if (k != -0x1) this["_handlers"][i]["splice"](k, 0x1);
  }
};
TDV["EventDispatcher"]["prototype"]["createNewEvent"] = function (l) {
  if (typeof Event === "function") return new Event(l);
  var m = document["createEvent"]("Event");
  m["initEvent"](l, !![], !![]);
  return m;
};
TDV["EventDispatcher"]["prototype"]["dispatchEvent"] = function (n) {
  if (n["type"] in this["_handlers"]) {
    var o = this["_handlers"][n["type"]];
    for (var p = 0x0; p < o["length"]; ++p) {
      o[p]["call"](window, n);
      if (n["defaultPrevented"]) break;
    }
  }
};
TDV["Tour"] = function (q, r) {
  TDV["EventDispatcher"]["call"](this);
  this["player"] = undefined;
  this["_settings"] = q;
  this["_devicesUrl"] = r;
  this["_playersPlayingTmp"] = [];
  this["_isInitialized"] = ![];
  this["_isPaused"] = ![];
  this["_isRemoteSession"] = ![];
  this["_orientation"] = undefined;
  this["_lockedOrientation"] = undefined;
  this["_device"] = undefined;
  Object["defineProperty"](this, "isInitialized", {
    get: function () {
      return this["_isInitialized"];
    },
  });
  Object["defineProperty"](this, "isPaused", {
    get: function () {
      return this["_isPaused"];
    },
  });
  this["_setupRemote"]();
};
TDV["Tour"]["DEVICE_GENERAL"] = "general";
TDV["Tour"]["DEVICE_MOBILE"] = "mobile";
TDV["Tour"]["DEVICE_IPAD"] = "ipad";
TDV["Tour"]["DEVICE_VR"] = "vr";
TDV["Tour"]["EVENT_TOUR_INITIALIZED"] = "tourInitialized";
TDV["Tour"]["EVENT_TOUR_LOADED"] = "tourLoaded";
TDV["Tour"]["EVENT_TOUR_ENDED"] = "tourEnded";
TDV["Tour"]["prototype"] = new TDV["EventDispatcher"]();
TDV["Tour"]["prototype"]["dispose"] = function () {
  if (!this["player"]) return;
  if (this["_onHashChange"]) {
    window["removeEventListener"]("hashchange", this["_onHashChange"]);
    this["_onHashChange"] = undefined;
  }
  if (this["_onKeyUp"]) {
    document["removeEventListener"]("keyup", this["_onKeyUp"]);
    this["_onKeyUp"] = undefined;
  }
  if (this["_onBeforeUnload"]) {
    window["removeEventListener"]("beforeunload", this["_onBeforeUnload"]);
    this["_onBeforeUnload"] = undefined;
  }
  var s = this["_getRootPlayer"]();
  if (s !== undefined) {
    s["stopTextToSpeech"]();
    s["stopGlobalAudios"]();
  }
  this["player"]["delete"]();
  this["player"] = undefined;
  this["_isInitialized"] = ![];
  window["currentGlobalAudios"] = undefined;
  window["pauseGlobalAudiosState"] = undefined;
  window["currentPanoramasWithCameraChanged"] = undefined;
  window["overlaysDispatched"] = undefined;
};
TDV["Tour"]["prototype"]["load"] = function () {
  if (this["player"]) return;
  var t = function (v) {
    if (v["name"] == "begin") {
      var w = v["data"]["source"]["get"]("camera");
      if (
        w &&
        w["get"]("initialSequence") &&
        w["get"]("initialSequence")["get"]("movements")["length"] > 0x0
      )
        return;
    }
    if (v["sourceClassName"] == "MediaAudio" || this["_isInitialized"]) return;
    this["_isInitialized"] = !![];
    u["unbind"]("preloadMediaShow", t, this, !![]);
    u["unbindOnObjectsOf"]("PlayListItem", "begin", t, this, !![]);
    u["unbind"]("stateChange", t, this, !![]);
    if (this["_isPaused"]) this["pause"]();
    window["parent"]["postMessage"](TDV["Tour"]["EVENT_TOUR_LOADED"], "*");
    this["dispatchEvent"](
      this["createNewEvent"](TDV["Tour"]["EVENT_TOUR_LOADED"])
    );
  };
  this["_setup"]();
  this["_settings"]["set"](
    TDV["PlayerSettings"]["SCRIPT_URL"],
    this["_currentScriptUrl"]
  );
  var u = (this["player"] = TDV["PlayerAPI"]["create"](this["_settings"]));
  u["bind"]("preloadMediaShow", t, this, !![]);
  u["bind"]("stateChange", t, this, !![]);
  u["bindOnObjectsOf"]("PlayListItem", "begin", t, this, !![]);
  u["bindOnObject"](
    "rootPlayer",
    "start",
    function (x) {
      var y = x["data"]["source"];
      y["get"]("data")["tour"] = this;
      var z =
        window["navigator"]["language"] ||
        window["navigator"]["userLanguage"] ||
        "en";
      var A = y["get"]("data")["locales"] || {};
      var B = y["get"]("data")["defaultLocale"] || z;
      var C = (this["locManager"] = new TDV["Tour"]["LocaleManager"](
        y,
        A,
        B,
        this["_settings"]["get"](
          TDV["PlayerSettings"]["QUERY_STRING_PARAMETERS"]
        )
      ));
      y["get"]("data")["localeManager"] = C;
      var D = function () {
        var O = y["get"]("data");
        if (!("updateText" in O)) {
          O["updateText"] = function (S) {
            var T = S[0x0]["split"](".");
            if (T["length"] == 0x2) {
              var U = C["trans"]["apply"](C, S);
              var V = S[0x1] || y;
              if (typeof V == "string") {
                var W = V["split"](".");
                V = y[W["shift"]()];
                for (var X = 0x0; X < W["length"] - 0x1; ++X) {
                  if (V != undefined) V = "get" in V ? V["get"](W[X]) : V[W[X]];
                }
                if (V != undefined) {
                  var Y = W[W["length"] - 0x1];
                  if (Array["isArray"](V)) {
                    for (var Z = 0x0; Z < V["length"]; ++Z) {
                      this["setValue"](V[Z], Y, U);
                    }
                  } else this["setValue"](V, Y, U);
                }
              } else {
                V = V[T[0x0]];
                this["setValue"](V, T[0x1], U);
              }
            }
          }["bind"](y);
        }
        var P = O["translateObjs"];
        var Q = O["updateText"];
        var R = function () {
          for (var a0 in P) {
            Q(P[a0]);
          }
        };
        R();
        R();
      };
      this["locManager"]["bind"](
        TDV["Tour"]["LocaleManager"]["EVENT_LOCALE_CHANGED"],
        D["bind"](this)
      );
      var E = this["_getParams"](location["search"]["substr"](0x1));
      E = y["mixObject"](
        E,
        this["_getParams"](location["hash"]["substr"](0x1))
      );
      var F = E["language"];
      if (!F || !this["locManager"]["hasLocale"](E["language"])) {
        if (y["get"]("data")["forceDefaultLocale"]) F = B;
        else F = z;
      }
      this["setLocale"](F);
      var G = y["getByClassName"]("HotspotPanoramaOverlay");
      for (var I = 0x0, J = G["length"]; I < J; ++I) {
        var K = G[I];
        var L = K["get"]("data");
        if (!L) K["set"]("data", (L = {}));
        L["defaultEnabledValue"] = K["get"]("enabled");
      }
      this["_setMediaFromURL"](E);
      this["_updateParams"](E, ![]);
      if (
        this["isMobile"]() &&
        typeof this["_devicesUrl"][this["_device"]] == "object"
      ) {
        var M = function () {
          if (
            !y["isCardboardViewMode"]() &&
            this["_getOrientation"]() != this["_orientation"]
          ) {
            this["reload"](!![]);
            return !![];
          }
          return ![];
        };
        if (M["call"](this)) return;
        var N = y["getByClassName"]("PanoramaPlayer");
        for (var I = 0x0; I < N["length"]; ++I) {
          N[I]["bind"]("viewModeChange", M, this);
        }
        y["bind"]("orientationChange", M, this);
      }
      this["_onHashChange"] = function () {
        var a1 = this["_getParams"](location["hash"]["substr"](0x1));
        this["_setMediaFromURL"](a1, ![]);
        this["_updateParams"](a1, !![]);
      }["bind"](this);
      this["_onKeyUp"] = function (a2) {
        if (
          a2["ctrlKey"] &&
          a2["shiftKey"] &&
          a2["key"]["toLowerCase"]() == "u"
        ) {
          this["updateDeepLink"]();
          y["copyToClipboard"](location["href"]);
        }
      }["bind"](this);
      this["_onBeforeUnload"] = function (a3) {
        y["stopTextToSpeech"]();
      };
      window["addEventListener"]("hashchange", this["_onHashChange"]);
      window["addEventListener"]("beforeunload", this["_onBeforeUnload"]);
      document["addEventListener"]("keyup", this["_onKeyUp"]);
      y["bind"](
        "tourEnded",
        function () {
          this["dispatchEvent"](
            this["createNewEvent"](TDV["Tour"]["EVENT_TOUR_ENDED"])
          );
        },
        this,
        !![]
      );
      y["bind"](
        "mute_changed",
        function () {
          if (this["get"]("mute")) this["stopTextToSpeech"]();
        },
        y,
        !![]
      );
      this["dispatchEvent"](
        this["createNewEvent"](TDV["Tour"]["EVENT_TOUR_INITIALIZED"])
      );
    },
    this,
    !![]
  );
  window["addEventListener"](
    "message",
    function (a4) {
      var a5 = a4["data"];
      if (a5 == "pauseTour") a5 = "pause";
      else if (a5 == "resumeTour") a5 = "resume";
      else return;
      this[a5]["apply"](this);
    }["bind"](this)
  );
};
TDV["Tour"]["prototype"]["pause"] = function () {
  this["_isPaused"] = !![];
  if (!this["_isInitialized"]) return;
  var a6 = function (af) {
    var ag = af["source"];
    if (!this["_isPaused"]) ag["unbind"]("stateChange", a6, this);
    else if (ag["get"]("state") == "playing") {
      ag["pause"]();
    }
  };
  var a7 = this["player"]["getByClassName"]("PlayList");
  for (var a8 = 0x0, a9 = a7["length"]; a8 < a9; a8++) {
    var aa = a7[a8];
    var ab = aa["get"]("selectedIndex");
    if (ab != -0x1) {
      var ac = aa["get"]("items")[ab];
      var ad = ac["get"]("player");
      if (ad && ad["pause"]) {
        if (ad["get"]("state") != "playing")
          ad["bind"]("stateChange", a6, this);
        else ad["pause"]();
        this["_playersPlayingTmp"]["push"](ad);
      }
    }
  }
  var ae = this["_getRootPlayer"]();
  ae["pauseGlobalAudios"]();
  ae["quizPauseTimer"]();
};
TDV["Tour"]["prototype"]["resume"] = function () {
  this["_isPaused"] = ![];
  if (!this["_isInitialized"]) return;
  while (this["_playersPlayingTmp"]["length"]) {
    var ah = this["_playersPlayingTmp"]["pop"]();
    ah["play"]();
  }
  var ai = this["_getRootPlayer"]();
  ai["resumeGlobalAudios"]();
  ai["quizResumeTimer"]();
};
TDV["Tour"]["prototype"]["reload"] = function (aj) {
  this["_orientation"] = this["_getOrientation"]();
  if (aj) this["updateDeepLink"]();
  this["dispose"]();
  this["load"]();
};
TDV["Tour"]["prototype"]["setMediaByIndex"] = function (ak) {
  var al = this["_getRootPlayer"]();
  if (al !== undefined) {
    return al["setMainMediaByIndex"](ak);
  }
};
TDV["Tour"]["prototype"]["setMediaByName"] = function (am) {
  var an = this["_getRootPlayer"]();
  if (an !== undefined) {
    return an["setMainMediaByName"](am);
  }
};
TDV["Tour"]["prototype"]["triggerOverlayByName"] = function (ao, ap, aq) {
  var ar = this["_getRootPlayer"]();
  if (!aq) aq = "click";
  if (ar !== undefined && aq) {
    var as = ar["getPanoramaOverlayByName"](ao, ap);
    if (as) {
      ar["triggerOverlay"](as, aq);
    }
  }
};
TDV["Tour"]["prototype"]["focusOverlayByName"] = function (at, au) {
  var av = this["_getRootPlayer"]();
  if (av !== undefined) {
    var aw = av["getPanoramaOverlayByName"](at["get"]("media"), au);
    if (aw) {
      var ax = aw["get"]("class");
      var ay =
        ax == "VideoPanoramaOverlay" || ax == "QuadVideoPanoramaOverlay"
          ? aw
          : aw["get"]("items")[0x0];
      var az, aA;
      ax = ay["get"]("class");
      if (
        ax == "QuadVideoPanoramaOverlay" ||
        ax == "QuadHotspotPanoramaOverlayImage"
      ) {
        var aB = ay["get"]("vertices");
        var aC = 0x0,
          aD = aB["length"];
        az = 0x0;
        aA = 0x0;
        while (aC < aD) {
          var aE = aB[aC++];
          var aF = aE["get"]("yaw");
          if (aF < 0x0) aF += 0x168;
          az += aF;
          aA += aE["get"]("pitch");
        }
        az /= 0x4;
        aA /= 0x4;
        if (az > 0xb4) az -= 0x168;
      } else {
        az = ay["get"]("yaw");
        aA = ay["get"]("pitch");
      }
      var aG = av["getPlayListWithItem"](at);
      if (aG) {
        var aH = function () {
          av["setPanoramaCameraWithSpot"](aG, at, az, aA);
        };
        if (!this["_isInitialized"]) {
          var aI = function () {
            at["unbind"]("begin", aI, this);
            aH();
          };
          at["bind"]("begin", aI, this);
        } else {
          aH();
        }
      }
    }
  }
};
TDV["Tour"]["prototype"]["setComponentsVisibilityByTags"] = function (
  aJ,
  aK,
  aL
) {
  var aM = this["_getRootPlayer"]();
  if (aM !== undefined) {
    var aN = aM["getComponentsByTags"](aJ, aL);
    for (var aO = 0x0, aP = aN["length"]; aO < aP; ++aO) {
      aN[aO]["set"]("visible", aK);
    }
  }
};
TDV["Tour"]["prototype"]["setOverlaysVisibilityByTags"] = function (
  aQ,
  aR,
  aS
) {
  var aT = this["_getRootPlayer"]();
  if (aT !== undefined) {
    var aU = aT["getOverlaysByTags"](aQ, aS);
    aT["setOverlaysVisibility"](aU, aR);
  }
};
TDV["Tour"]["prototype"]["setOverlaysVisibilityByName"] = function (aV, aW) {
  var aX = this["_getRootPlayer"]();
  if (aX !== undefined) {
    var aY = aX["getActiveMediaWithViewer"](aX["getMainViewer"]());
    var aZ = [];
    for (var b0 = 0x0, b1 = aV["length"]; b0 < b1; ++b0) {
      var b2 = aX["getPanoramaOverlayByName"](aY, aV[b0]);
      if (b2) aZ["push"](b2);
    }
    aX["setOverlaysVisibility"](aZ, aW);
  }
};
TDV["Tour"]["prototype"]["updateDeepLink"] = function () {
  var b3 = this["_getRootPlayer"]();
  if (b3 !== undefined) {
    b3["updateDeepLink"](!![], !![], !![]);
  }
};
TDV["Tour"]["prototype"]["setLocale"] = function (b4) {
  var b5 = this["_getRootPlayer"]();
  if (b5 !== undefined && this["locManager"] !== undefined) {
    this["locManager"]["setLocale"](b4);
  }
};
TDV["Tour"]["prototype"]["getLocale"] = function () {
  var b6 = this["_getRootPlayer"]();
  return b6 !== undefined && this["locManager"] !== undefined
    ? this["locManager"]["currentLocaleID"]
    : undefined;
};
TDV["Tour"]["prototype"]["isMobile"] = function () {
  return TDV["PlayerAPI"]["mobile"];
};
TDV["Tour"]["prototype"]["isIPhone"] = function () {
  return TDV["PlayerAPI"]["device"] == TDV["PlayerAPI"]["DEVICE_IPHONE"];
};
TDV["Tour"]["prototype"]["isIPad"] = function () {
  return TDV["PlayerAPI"]["device"] == TDV["PlayerAPI"]["DEVICE_IPAD"];
};
TDV["Tour"]["prototype"]["isIOS"] = function () {
  return this["isIPad"]() || this["isIPhone"]();
};
TDV["Tour"]["prototype"]["isMobileApp"] = function () {
  return navigator["userAgent"]["indexOf"]("App/TDV") != -0x1;
};
TDV["Tour"]["prototype"]["getNotchValue"] = function () {
  var b7 = document["documentElement"];
  b7["style"]["setProperty"]("--notch-top", "env(safe-area-inset-top)");
  b7["style"]["setProperty"]("--notch-right", "env(safe-area-inset-right)");
  b7["style"]["setProperty"]("--notch-bottom", "env(safe-area-inset-bottom)");
  b7["style"]["setProperty"]("--notch-left", "env(safe-area-inset-left)");
  var b8 = window["getComputedStyle"](b7);
  return (
    parseInt(b8["getPropertyValue"]("--notch-top") || "0", 0xa) ||
    parseInt(b8["getPropertyValue"]("--notch-right") || "0", 0xa) ||
    parseInt(b8["getPropertyValue"]("--notch-bottom") || "0", 0xa) ||
    parseInt(b8["getPropertyValue"]("--notch-left") || "0", 0xa)
  );
};
TDV["Tour"]["prototype"]["hasNotch"] = function () {
  return this["getNotchValue"]() > 0x0;
};
TDV["Tour"]["prototype"]["_getOrientation"] = function () {
  var b9 = this["_getRootPlayer"]();
  if (b9) {
    return b9["get"]("orientation");
  } else if (this["_lockedOrientation"]) {
    return this["_lockedOrientation"];
  } else {
    return TDV["PlayerAPI"]["getOrientation"]();
  }
};
TDV["Tour"]["prototype"]["_getParams"] = function (ba) {
  var bb = {};
  ba["split"]("&")["forEach"](function (bc) {
    var bd = bc["split"]("=")[0x0],
      be = decodeURIComponent(bc["split"]("=")[0x1]);
    bb[bd["toLowerCase"]()] = be;
  });
  return bb;
};
TDV["Tour"]["prototype"]["_getRootPlayer"] = function () {
  return this["player"] !== undefined
    ? this["player"]["getById"]("rootPlayer")
    : undefined;
};
TDV["Tour"]["prototype"]["_setup"] = function () {
  if (!this["_orientation"]) this["_orientation"] = this["_getOrientation"]();
  this["_device"] = this["_getDevice"]();
  this["_currentScriptUrl"] = this["_getScriptUrl"]();
  if (this["isMobile"]()) {
    var bf = document["getElementById"]("metaViewport");
    if (bf) {
      var bg = this["_devicesUrl"][this["_device"]];
      var bh = 0x1;
      if (
        (typeof bg == "object" &&
          this["_orientation"] in bg &&
          this["_orientation"] == TDV["PlayerAPI"]["ORIENTATION_LANDSCAPE"]) ||
        this["_device"] == TDV["Tour"]["DEVICE_GENERAL"]
      ) {
        bh = bf["getAttribute"]("data-tdv-general-scale") || 0.5;
      }
      var bi = bf["getAttribute"]("content");
      bi = bi["replace"](/initial-scale=(\d+(\.\d+)?)/, function (bj, bk) {
        return "initial-scale=" + bh;
      });
      bf["setAttribute"]("content", bi);
    }
  }
};
TDV["Tour"]["prototype"]["_getScriptUrl"] = function () {
  var bl = this["_devicesUrl"][this["_device"]];
  if (typeof bl == "object") {
    if (this["_orientation"] in bl) {
      bl = bl[this["_orientation"]];
    }
  }
  return bl;
};
TDV["Tour"]["prototype"]["_getDevice"] = function () {
  var bm = TDV["Tour"]["DEVICE_GENERAL"];
  if (!this["_isRemoteSession"] && this["isMobile"]()) {
    if (this["isIPad"]() && TDV["Tour"]["DEVICE_IPAD"] in this["_devicesUrl"])
      bm = TDV["Tour"]["DEVICE_IPAD"];
    else if (TDV["Tour"]["DEVICE_MOBILE"] in this["_devicesUrl"])
      bm = TDV["Tour"]["DEVICE_MOBILE"];
  }
  return bm;
};
TDV["Tour"]["prototype"]["_setMediaFromURL"] = function (bn) {
  var bo = this["_getRootPlayer"]();
  var bp = bo["getActivePlayerWithViewer"](bo["getMainViewer"]());
  var bq = bp ? bo["getMediaFromPlayer"](bp) : undefined;
  var br = undefined;
  if ("media" in bn) {
    var bs = bn["media"];
    var bt = Number(bs);
    br = isNaN(bt)
      ? this["setMediaByName"](bs)
      : this["setMediaByIndex"](bt - 0x1);
  } else if ("media-index" in bn) {
    br = this["setMediaByIndex"](parseInt(bn["media-index"]) - 0x1);
  } else if ("media-name" in bn) {
    br = this["setMediaByName"](bn["media-name"]);
  }
  if (br == undefined) {
    br = this["setMediaByIndex"](0x0);
  }
  if (br != undefined) {
    var bu = br["get"]("player");
    var bv = function () {
      if ("trigger-overlay-name" in bn) {
        this["triggerOverlayByName"](
          br["get"]("media"),
          bn["trigger-overlay-name"],
          bn["trigger-overlay-event"]
        );
      }
      if ("focus-overlay-name" in bn) {
        this["focusOverlayByName"](br, bn["focus-overlay-name"]);
      } else if ("yaw" in bn || "pitch" in bn) {
        var bz = parseFloat(bn["yaw"]) || undefined;
        var bA = parseFloat(bn["pitch"]) || undefined;
        var bB = bo["getPlayListWithItem"](br);
        if (bB) bo["setPanoramaCameraWithSpot"](bB, br, bz, bA);
      }
    }["bind"](this);
    if (bu) {
      var bw = bu["get"]("viewerArea") == bo["getMainViewer"]();
      var bx = bo["getMediaFromPlayer"](bu);
      if (
        (bw && bq == br["get"]("media")) ||
        (!bw && bx == br["get"]("media"))
      ) {
        bv();
        return br != undefined;
      }
    }
    var by = function () {
      br["unbind"]("begin", by, this);
      bv();
    };
    br["bind"]("begin", by, bo);
  }
  return br != undefined;
};
TDV["Tour"]["prototype"]["_setupRemote"] = function () {
  if (this["isMobile"]() && TDV["Remote"] != undefined) {
    var bC = function () {
      var bD = undefined;
      var bE = function () {
        var bH = this["_getRootPlayer"]();
        bD = bH["get"]("lockedOrientation");
        bH["set"]("lockedOrientation", this["_lockedOrientation"]);
      }["bind"](this);
      this["_isRemoteSession"] = !![];
      this["_lockedOrientation"] = TDV["PlayerAPI"]["ORIENTATION_LANDSCAPE"];
      if (this["_device"] != TDV["Tour"]["DEVICE_GENERAL"]) {
        var bF = function () {
          bE();
          this["unbind"](TDV["Tour"]["EVENT_TOUR_INITIALIZED"], bF);
        }["bind"](this);
        this["bind"](TDV["Tour"]["EVENT_TOUR_INITIALIZED"], bF);
        this["reload"](!![]);
      } else {
        bE();
      }
      var bG = function () {
        this["_isRemoteSession"] = ![];
        this["_getRootPlayer"]()["set"]("lockedOrientation", bD);
        TDV["Remote"]["unbind"](TDV["Remote"]["EVENT_CALL_END"], bG);
        var bI = this["_getScriptUrl"]();
        if (this["_currentScriptUrl"] != bI) this["reload"](!![]);
      }["bind"](this);
      TDV["Remote"]["bind"](TDV["Remote"]["EVENT_CALL_END"], bG);
    }["bind"](this);
    TDV["Remote"]["bind"](TDV["Remote"]["EVENT_CALL_BEGIN"], bC);
  }
};
TDV["Tour"]["prototype"]["_updateParams"] = function (bJ, bK) {
  if (bK && "language" in bJ) {
    var bL = bJ["language"];
    if (this["locManager"]["hasLocale"](bL)) {
      this["setLocale"](bL);
    }
  }
  var bM = function (bN, bO, bP) {
    var bQ = bO["split"](",");
    for (var bR = 0x0, bS = bQ["length"]; bR < bS; ++bR) {
      bN["call"](this, bQ[bR]["split"]("+"), bP, "and");
    }
  };
  if ("hide-components-tags" in bJ || "hct" in bJ)
    bM["call"](
      this,
      this["setComponentsVisibilityByTags"],
      bJ["hide-components-tags"] || bJ["hct"],
      ![]
    );
  if ("show-components-tags" in bJ || "sct" in bJ)
    bM["call"](
      this,
      this["setComponentsVisibilityByTags"],
      bJ["show-components-tags"] || bJ["sct"],
      !![]
    );
  if ("hide-overlays-tags" in bJ || "hot" in bJ)
    bM["call"](
      this,
      this["setOverlaysVisibilityByTags"],
      bJ["hide-overlays-tags"] || bJ["hot"],
      ![]
    );
  if ("show-overlays-tags" in bJ || "sot" in bJ)
    bM["call"](
      this,
      this["setOverlaysVisibilityByTags"],
      bJ["show-overlays-tags"] || bJ["sot"],
      !![]
    );
  if ("hide-overlays-names" in bJ || "hon" in bJ)
    this["setOverlaysVisibilityByName"](
      decodeURIComponent(bJ["hide-overlays-names"] || bJ["hon"])["split"](","),
      ![]
    );
  if ("show-overlays-names" in bJ || "son" in bJ)
    this["setOverlaysVisibilityByName"](
      decodeURIComponent(bJ["show-overlays-names"] || bJ["son"])["split"](","),
      !![]
    );
};
TDV["Tour"]["LocaleManager"] = function (bT, bU, bV, bW) {
  TDV["EventDispatcher"]["call"](this);
  this["rootPlayer"] = bT;
  this["locales"] = {};
  this["defaultLocale"] = bV;
  this["queryParam"] = bW;
  this["currentLocaleMap"] = {};
  this["currentLocaleID"] = undefined;
  for (var bX in bU) {
    this["registerLocale"](bX, bU[bX]);
  }
};
TDV["Tour"]["LocaleManager"]["EVENT_LOCALE_CHANGED"] = "localeChanged";
TDV["Tour"]["LocaleManager"]["prototype"] = new TDV["EventDispatcher"]();
TDV["Tour"]["LocaleManager"]["prototype"]["registerLocale"] = function (
  bY,
  bZ
) {
  var c0 = [bY, bY["split"]("-")[0x0]];
  for (var c1 = 0x0; c1 < c0["length"]; ++c1) {
    bY = c0[c1];
    if (!(bY in this["locales"])) {
      this["locales"][bY] = bZ;
    }
  }
};
TDV["Tour"]["LocaleManager"]["prototype"]["unregisterLocale"] = function (c2) {
  delete this["locales"][c2];
  if (c2 == this["currentLocaleID"]) {
    this["setLocale"](this["defaultLocale"]);
  }
};
TDV["Tour"]["LocaleManager"]["prototype"]["hasLocale"] = function (c3) {
  return c3 in this["locales"];
};
TDV["Tour"]["LocaleManager"]["prototype"]["setLocale"] = function (c4) {
  var c5 = undefined;
  var c6 = c4["split"]("-")[0x0];
  var c7 = [c4, c6];
  for (var c8 = 0x0; c8 < c7["length"]; ++c8) {
    var ca = c7[c8];
    if (ca in this["locales"]) {
      c5 = ca;
      break;
    }
  }
  if (c5 === undefined) {
    for (var ca in this["locales"]) {
      if (ca["indexOf"](c6) == 0x0) {
        c5 = ca;
        break;
      }
    }
  }
  if (c5 === undefined) {
    c5 = this["defaultLocale"];
  }
  var cb = this["locales"][c5];
  if (cb !== undefined && this["currentLocaleID"] != c5) {
    this["currentLocaleID"] = c5;
    var cc = this;
    if (typeof cb == "string") {
      var cd = new XMLHttpRequest();
      cd["onreadystatechange"] = function () {
        if (cd["readyState"] == 0x4) {
          if (cd["status"] == 0xc8) {
            cc["locales"][c5] = cc["currentLocaleMap"] = cc[
              "_parsePropertiesContent"
            ](cd["responseText"]);
            cc["dispatchEvent"](
              cc["createNewEvent"](
                TDV["Tour"]["LocaleManager"]["EVENT_LOCALE_CHANGED"]
              )
            );
          } else {
            throw cb + "\x20can\x27t\x20be\x20loaded";
          }
        }
      };
      var ce = cb;
      if (this["queryParam"])
        ce += (ce["indexOf"]("?") == -0x1 ? "?" : "&") + this["queryParam"];
      cd["open"]("GET", ce);
      cd["send"]();
    } else {
      this["currentLocaleMap"] = cb;
      this["dispatchEvent"](
        this["createNewEvent"](
          TDV["Tour"]["LocaleManager"]["EVENT_LOCALE_CHANGED"]
        )
      );
    }
  }
};
TDV["Tour"]["LocaleManager"]["prototype"]["trans"] = function (cf) {
  var cg = this["currentLocaleMap"][cf];
  if (cg && arguments["length"] > 0x2) {
    var ch = typeof arguments[0x2] == "object" ? arguments[0x2] : undefined;
    var ci = arguments;
    function cj(ck) {
      return /^\d+$/["test"](ck);
    }
    cg = cg["replace"](
      /\{\{([\w\.]+)\}\}/g,
      function (cl, cm) {
        if (cj(cm)) cm = ci[parseInt(cm) + 0x1];
        else if (ch !== undefined) cm = ch[cm];
        if (typeof cm == "string") cm = this["currentLocaleMap"][cm] || cm;
        else if (typeof cm == "function") cm = cm["call"](this["rootPlayer"]);
        return cm !== undefined ? cm : "";
      }["bind"](this)
    );
  }
  return cg;
};
TDV["Tour"]["LocaleManager"]["prototype"]["_parsePropertiesContent"] =
  function (cn) {
    cn = cn["replace"](/(^|\n)#[^\n]*/g, "");
    var co = {};
    var cp = cn["split"]("\x0a");
    for (var cq = 0x0, cr = cp["length"]; cq < cr; ++cq) {
      var cs = cp[cq]["trim"]();
      if (cs["length"] == 0x0) {
        continue;
      }
      var ct = cs["indexOf"]("=");
      if (ct == -0x1) {
        console["error"]("Locale\x20parser:\x20Invalid\x20line\x20" + cq);
        continue;
      }
      var cu = cs["substr"](0x0, ct)["trim"]();
      var cv = cs["substr"](ct + 0x1)["trim"]();
      var cw;
      while (
        (cw = cv["lastIndexOf"]("\x5c")) != -0x1 &&
        cw == cv["length"] - 0x1 &&
        ++cq < cr
      ) {
        cv = cv["substr"](0x0, cv["length"] - 0x2);
        cs = cp[cq];
        if (cs["length"] == 0x0) break;
        cv += "\x0a" + cs;
        cv = cv["trim"]();
      }
      co[cu] = cv;
    }
    return co;
  };
TDV["Tour"]["HistoryData"] = function (cx) {
  this["playList"] = cx;
  this["list"] = [];
  this["pointer"] = -0x1;
};
TDV["Tour"]["HistoryData"]["prototype"]["add"] = function (cy) {
  if (
    this["pointer"] < this["list"]["length"] &&
    this["list"][this["pointer"]] == cy
  ) {
    return;
  }
  ++this["pointer"];
  this["list"]["splice"](
    this["pointer"],
    this["list"]["length"] - this["pointer"],
    cy
  );
};
TDV["Tour"]["HistoryData"]["prototype"]["back"] = function () {
  if (!this["canBack"]()) return;
  this["playList"]["set"]("selectedIndex", this["list"][--this["pointer"]]);
};
TDV["Tour"]["HistoryData"]["prototype"]["forward"] = function () {
  if (!this["canForward"]()) return;
  this["playList"]["set"]("selectedIndex", this["list"][++this["pointer"]]);
};
TDV["Tour"]["HistoryData"]["prototype"]["canBack"] = function () {
  return this["pointer"] > 0x0;
};
TDV["Tour"]["HistoryData"]["prototype"]["canForward"] = function () {
  return (
    this["pointer"] >= 0x0 && this["pointer"] < this["list"]["length"] - 0x1
  );
};
TDV["Tour"]["Script"] = function () { };
TDV["Tour"]["Script"]["assignObjRecursively"] = function (cz, cA) {
  for (var cB in cz) {
    var cC = cz[cB];
    if (typeof cC == "object" && cC !== null)
      this["assignObjRecursively"](cz[cB], cA[cB] || (cA[cB] = {}));
    else cA[cB] = cC;
  }
  return cA;
};
TDV["Tour"]["Script"]["autotriggerAtStart"] = function (cD, cE, cF) {
  var cG = function (cH) {
    cE();
    if (cF == !![]) cD["unbind"]("change", cG, this);
  };
  cD["bind"]("change", cG, this);
};
TDV["Tour"]["Script"]["changeBackgroundWhilePlay"] = function (cI, cJ, cK) {
  var cL = function () {
    cM["unbind"]("stop", cL, this);
    if (
      cK == cO["get"]("backgroundColor") &&
      cR == cO["get"]("backgroundColorRatios")
    ) {
      cO["set"]("backgroundColor", cP);
      cO["set"]("backgroundColorRatios", cQ);
    }
  };
  var cM = cI["get"]("items")[cJ];
  var cN = cM["get"]("player");
  var cO = cN["get"]("viewerArea");
  var cP = cO["get"]("backgroundColor");
  var cQ = cO["get"]("backgroundColorRatios");
  var cR = [0x0];
  if (cK != cP || cR != cQ) {
    cO["set"]("backgroundColor", cK);
    cO["set"]("backgroundColorRatios", cR);
    cM["bind"]("stop", cL, this);
  }
};
TDV["Tour"]["Script"]["changeOpacityWhilePlay"] = function (cS, cT, cU) {
  var cV = function () {
    cW["unbind"]("stop", cV, this);
    if (cZ == cY["get"]("backgroundOpacity")) {
      cY["set"]("opacity", cZ);
    }
  };
  var cW = cS["get"]("items")[cT];
  var cX = cW["get"]("player");
  var cY = cX["get"]("viewerArea");
  var cZ = cY["get"]("backgroundOpacity");
  if (cU != cZ) {
    cY["set"]("backgroundOpacity", cU);
    cW["bind"]("stop", cV, this);
  }
};
TDV["Tour"]["Script"]["changePlayListWithSameSpot"] = function (d0, d1) {
  var d2 = d0["get"]("selectedIndex");
  if (d2 >= 0x0 && d1 >= 0x0 && d2 != d1) {
    var d3 = d0["get"]("items")[d2];
    var d4 = d0["get"]("items")[d1];
    var d5 = d3["get"]("player");
    var d6 = d4["get"]("player");
    if (
      (d5["get"]("class") == "PanoramaPlayer" ||
        d5["get"]("class") == "Video360Player") &&
      (d6["get"]("class") == "PanoramaPlayer" ||
        d6["get"]("class") == "Video360Player")
    ) {
      var d7 = this["cloneCamera"](d4["get"]("camera"));
      this["setCameraSameSpotAsMedia"](d7, d3["get"]("media"));
      var d8 = d7["get"]("initialPosition");
      if (
        d8["get"]("yaw") == undefined ||
        d8["get"]("pitch") == undefined ||
        d8["get"]("hfov") == undefined
      )
        return;
      this["startPanoramaWithCamera"](d4["get"]("media"), d7);
    }
  }
};
TDV["Tour"]["Script"]["clone"] = function (d9, da) {
  var db = this["rootPlayer"]["createInstance"](d9["get"]("class"));
  var dc = d9["get"]("id");
  if (dc) {
    var dd =
      dc + "_" + Math["random"]()["toString"](0x24)["substring"](0x2, 0xf);
    db["set"]("id", dd);
    this[dd] = db;
  }
  for (var de = 0x0; de < da["length"]; ++de) {
    var df = da[de];
    var dg = d9["get"](df);
    if (dg != null) db["set"](df, dg);
  }
  return db;
};
TDV["Tour"]["Script"]["cloneBindings"] = function (dh, di, dj) {
  var dk = dh["getBindings"](dj);
  for (var dl = 0x0; dl < dk["length"]; ++dl) {
    var dm = dk[dl];
    if (typeof dm == "string") dm = new Function("event", dm);
    di["bind"](dj, dm, this);
  }
};
TDV["Tour"]["Script"]["cloneCamera"] = function (dn) {
  var dp = this["clone"](dn, [
    "manualRotationSpeed",
    "manualZoomSpeed",
    "automaticRotationSpeed",
    "automaticZoomSpeed",
    "timeToIdle",
    "sequences",
    "draggingFactor",
    "hoverFactor",
  ]);
  var dq = ["initialSequence", "idleSequence"];
  for (var dr = 0x0; dr < dq["length"]; ++dr) {
    var ds = dq[dr];
    var dt = dn["get"](ds);
    if (dt) {
      var du = this["clone"](dt, [
        "mandatory",
        "repeat",
        "restartMovementOnUserInteraction",
        "restartMovementDelay",
      ]);
      dp["set"](ds, du);
      var dv = dt["get"]("movements");
      var dw = [];
      var dx = [
        "easing",
        "duration",
        "hfovSpeed",
        "pitchSpeed",
        "yawSpeed",
        "path",
        "stereographicFactorSpeed",
        "targetYaw",
        "targetPitch",
        "targetHfov",
        "targetStereographicFactor",
        "hfovDelta",
        "pitchDelta",
        "yawDelta",
      ];
      for (var dy = 0x0; dy < dv["length"]; ++dy) {
        var dz = dv[dy];
        var dA = this["clone"](dz, dx);
        var dB = dz["getBindings"]("end");
        if (dB["length"] > 0x0) {
          for (var dC = 0x0; dC < dB["length"]; ++dC) {
            var dD = dB[dC];
            if (typeof dD == "string") {
              dD = dD["replace"](dn["get"]("id"), dp["get"]("id"));
              dD = new Function("event", dD);
              dA["bind"]("end", dD, this);
            }
          }
        }
        dw["push"](dA);
      }
      du["set"]("movements", dw);
    }
  }
  return dp;
};
TDV["Tour"]["Script"]["copyObjRecursively"] = function (dE) {
  var dF = {};
  for (var dG in dE) {
    var dH = dE[dG];
    if (typeof dH == "object" && dH !== null)
      dF[dG] = this["copyObjRecursively"](dE[dG]);
    else dF[dG] = dH;
  }
  return dF;
};
TDV["Tour"]["Script"]["copyToClipboard"] = function (dI) {
  if (navigator["clipboard"]) {
    navigator["clipboard"]["writeText"](dI);
  } else {
    var dJ = document["createElement"]("textarea");
    dJ["value"] = dI;
    dJ["style"]["position"] = "fixed";
    document["body"]["appendChild"](dJ);
    dJ["focus"]();
    dJ["select"]();
    try {
      document["execCommand"]("copy");
    } catch (dK) { }
    document["body"]["removeChild"](dJ);
  }
};
TDV["Tour"]["Script"]["executeFunctionWhenChange"] = function (dL, dM, dN, dO) {
  var dP = undefined;
  var dQ = function (dT) {
    if (dT["data"]["previousSelectedIndex"] == dM) {
      if (dO) dO["call"](this);
      if (dN && dP) dP["unbind"]("end", dN, this);
      dL["unbind"]("change", dQ, this);
    }
  };
  if (dN) {
    var dR = dL["get"]("items")[dM];
    if (dR["get"]("class") == "PanoramaPlayListItem") {
      var dS = dR["get"]("camera");
      if (dS != undefined) dP = dS["get"]("initialSequence");
      if (dP == undefined) dP = dS["get"]("idleSequence");
    } else {
      dP = dR["get"]("media");
    }
    if (dP) {
      dP["bind"]("end", dN, this);
    }
  }
  dL["bind"]("change", dQ, this);
};
TDV["Tour"]["Script"]["executeJS"] = function (dU) {
  try {
    eval(dU);
  } catch (dV) {
    console["log"]("Javascript\x20error:\x20" + dV);
    console["log"]("\x20\x20\x20code:\x20" + dU);
  }
};
TDV["Tour"]["Script"]["fixTogglePlayPauseButton"] = function (dW) {
  var dX = dW["get"]("buttonPlayPause");
  if (typeof dX !== "undefined" && dW["get"]("state") == "playing") {
    if (!Array["isArray"](dX)) dX = [dX];
    for (var dY = 0x0; dY < dX["length"]; ++dY) dX[dY]["set"]("pressed", !![]);
  }
};
TDV["Tour"]["Script"]["getActiveMediaWithViewer"] = function (dZ) {
  var e0 = this["getActivePlayerWithViewer"](dZ);
  if (e0 == undefined) {
    return undefined;
  }
  return this["getMediaFromPlayer"](e0);
};
TDV["Tour"]["Script"]["getActivePlayerWithViewer"] = function (e1) {
  var e2 = this["getCurrentPlayers"]();
  var e3 = e2["length"];
  while (e3-- > 0x0) {
    var e4 = e2[e3];
    if (e4["get"]("viewerArea") == e1) {
      var e5 = e4["get"]("class");
      if (
        (e5 == "PanoramaPlayer" &&
          (e4["get"]("panorama") != undefined ||
            e4["get"]("video") != undefined)) ||
        ((e5 == "VideoPlayer" || e5 == "Video360Player") &&
          e4["get"]("video") != undefined) ||
        (e5 == "PhotoAlbumPlayer" && e4["get"]("photoAlbum") != undefined) ||
        (e5 == "MapPlayer" && e4["get"]("map") != undefined)
      )
        return e4;
    }
  }
  return undefined;
};
TDV["Tour"]["Script"]["getCurrentPlayerWithMedia"] = function (e6) {
  var e7 = undefined;
  var e8 = undefined;
  switch (e6["get"]("class")) {
    case "Panorama":
    case "LivePanorama":
    case "HDRPanorama":
      e7 = "PanoramaPlayer";
      e8 = "panorama";
      break;
    case "Video360":
      e7 = "PanoramaPlayer";
      e8 = "video";
      break;
    case "PhotoAlbum":
      e7 = "PhotoAlbumPlayer";
      e8 = "photoAlbum";
      break;
    case "Map":
      e7 = "MapPlayer";
      e8 = "map";
      break;
    case "Video":
      e7 = "VideoPlayer";
      e8 = "video";
      break;
  }
  if (e7 != undefined) {
    var e9 = this["getByClassName"](e7);
    for (var ea = 0x0; ea < e9["length"]; ++ea) {
      var eb = e9[ea];
      if (eb["get"](e8) == e6) {
        return eb;
      }
    }
  } else {
    return undefined;
  }
};
TDV["Tour"]["Script"]["getCurrentPlayers"] = function () {
  var ec = this["getByClassName"]("PanoramaPlayer");
  ec = ec["concat"](this["getByClassName"]("VideoPlayer"));
  ec = ec["concat"](this["getByClassName"]("Video360Player"));
  ec = ec["concat"](this["getByClassName"]("PhotoAlbumPlayer"));
  ec = ec["concat"](this["getByClassName"]("MapPlayer"));
  return ec;
};
TDV["Tour"]["Script"]["getGlobalAudio"] = function (ed) {
  var ee = window["currentGlobalAudios"];
  if (ee != undefined && ed["get"]("id") in ee) {
    ed = ee[ed["get"]("id")]["audio"];
  }
  return ed;
};
TDV["Tour"]["Script"]["getMediaByName"] = function (ef) {
  var eg = this["getByClassName"]("Media");
  for (var eh = 0x0, ei = eg["length"]; eh < ei; ++eh) {
    var ej = eg[eh];
    var ek = ej["get"]("data");
    if (ek && ek["label"] == ef) {
      return ej;
    }
  }
  return undefined;
};
TDV["Tour"]["Script"]["getMediaByTags"] = function (el, em) {
  return this["_getObjectsByTags"](el, ["Media"], "tags2Media", em);
};
TDV["Tour"]["Script"]["getAudioByTags"] = function (en, eo) {
  return this["_getObjectsByTags"](en, ["Audio"], "tags2Media", eo);
};
TDV["Tour"]["Script"]["getOverlaysByTags"] = function (ep, eq) {
  return this["_getObjectsByTags"](
    ep,
    [
      "HotspotPanoramaOverlay",
      "HotspotMapOverlay",
      "VideoPanoramaOverlay",
      "QuadVideoPanoramaOverlay",
      "FramePanoramaOverlay",
      "QuadFramePanoramaOverlay",
    ],
    "tags2Overlays",
    eq
  );
};
TDV["Tour"]["Script"]["getOverlaysByGroupname"] = function (er) {
  var es = this["get"]("data");
  var et = "groupname2Overlays";
  var eu = es[et];
  if (!eu) {
    var ev = [
      "HotspotPanoramaOverlay",
      "VideoPanoramaOverlay",
      "QuadVideoPanoramaOverlay",
      "FramePanoramaOverlay",
      "QuadFramePanoramaOverlay",
    ];
    es[et] = eu = {};
    for (var ew = 0x0; ew < ev["length"]; ++ew) {
      var ex = ev[ew];
      var ey = this["getByClassName"](ex);
      for (var ez = 0x0, eA = ey["length"]; ez < eA; ++ez) {
        var eB = ey[ez];
        var eC = eB["get"]("data");
        if (eC && eC["group"]) {
          var eD = eu[eC["group"]];
          if (!eD) eu[eC["group"]] = eD = [];
          eD["push"](eB);
        }
      }
    }
  }
  return eu[er] || [];
};
TDV["Tour"]["Script"]["getRootOverlay"] = function (eE) {
  var eF = eE["get"]("class");
  var eG = eF["indexOf"]("HotspotPanoramaOverlayArea") != -0x1;
  var eH = eF["indexOf"]("HotspotPanoramaOverlayImage") != -0x1;
  if (eG || eH) {
    var eI = this["get"]("data");
    var eJ = "overlays";
    var eK = eI[eJ];
    if (!eK) {
      var eL = ["HotspotPanoramaOverlay"];
      eK = [];
      for (var eM = 0x0; eM < eL["length"]; ++eM) {
        var eN = eL[eM];
        eK = eK["concat"](this["getByClassName"](eN));
      }
      eI[eJ] = eK;
    }
    var eO = eG ? "areas" : "items";
    for (var eP = 0x0, eQ = eK["length"]; eP < eQ; ++eP) {
      var eR = eK[eP];
      var eS = eR["get"](eO);
      if (eS) {
        for (var eT = 0x0; eT < eS["length"]; ++eT) {
          if (eS[eT] == eE) return eR;
        }
      }
    }
  }
  return eE;
};
TDV["Tour"]["Script"]["initOverlayGroupRotationOnClick"] = function (eU) {
  var eV = this["getOverlaysByGroupname"](eU);
  if (eV["length"] > 0x1) {
    eV["sort"](function (f2, f3) {
      var f4 = f2["get"]("data")["groupIndex"];
      var f5 = f3["get"]("data")["groupIndex"];
      return f4 - f5;
    });
    for (var eW = 0x0, eX = eV["length"]; eW < eX; ++eW) {
      var eY = eV[eW];
      var eZ = eV[(eW + 0x1) % eX];
      var f0 = eY["get"]("class");
      var f1 = eY;
      if (f0 == "HotspotPanoramaOverlay") {
        f1 = eY["get"]("areas")[0x0];
      }
      f1["bind"](
        "click",
        function (f6, f7) {
          this["setOverlaysVisibility"]([f6], ![]);
          this["setOverlaysVisibility"]([f7], !![]);
        }["bind"](this, eY, eZ),
        this
      );
    }
  }
};
TDV["Tour"]["Script"]["getComponentsByTags"] = function (f8, f9) {
  return this["_getObjectsByTags"](f8, ["UIComponent"], "tags2Components", f9);
};
TDV["Tour"]["Script"]["_getObjectsByTags"] = function (fa, fb, fc, fd) {
  var fe = this["get"]("data");
  var ff = fe[fc];
  if (!ff) {
    fe[fc] = ff = {};
    for (var fg = 0x0; fg < fb["length"]; ++fg) {
      var fh = fb[fg];
      var fi = this["getByClassName"](fh);
      for (var fk = 0x0, fm = fi["length"]; fk < fm; ++fk) {
        var fo = fi[fk];
        var fp = fo["get"]("data");
        if (fp && fp["tags"]) {
          var fq = fp["tags"];
          for (var ft = 0x0, fu = fq["length"]; ft < fu; ++ft) {
            var fv = fq[ft];
            if (fv in ff) ff[fv]["push"](fo);
            else ff[fv] = [fo];
          }
        }
      }
    }
  }
  var fw = undefined;
  fd = fd || "and";
  for (var fk = 0x0, fm = fa["length"]; fk < fm; ++fk) {
    var fx = ff[fa[fk]];
    if (!fx) continue;
    if (!fw) fw = fx["concat"]();
    else {
      if (fd == "and") {
        for (var ft = fw["length"] - 0x1; ft >= 0x0; --ft) {
          if (fx["indexOf"](fw[ft]) == -0x1) fw["splice"](ft, 0x1);
        }
      } else if (fd == "or") {
        for (var ft = fx["length"] - 0x1; ft >= 0x0; --ft) {
          var fo = fx[ft];
          if (fw["indexOf"](fo) == -0x1) fw["push"](fo);
        }
      }
    }
  }
  return fw || [];
};
TDV["Tour"]["Script"]["getComponentByName"] = function (fy) {
  var fz = this["getByClassName"]("UIComponent");
  for (var fA = 0x0, fB = fz["length"]; fA < fB; ++fA) {
    var fC = fz[fA];
    var fD = fC["get"]("data");
    if (fD != undefined && fD["name"] == fy) {
      return fC;
    }
  }
  return undefined;
};
TDV["Tour"]["Script"]["getMainViewer"] = function () {
  var fE = "MainViewer";
  return this[fE] || this[fE + "_mobile"];
};
TDV["Tour"]["Script"]["getMediaFromPlayer"] = function (fF) {
  switch (fF["get"]("class")) {
    case "PanoramaPlayer":
      return fF["get"]("panorama") || fF["get"]("video");
    case "VideoPlayer":
    case "Video360Player":
      return fF["get"]("video");
    case "PhotoAlbumPlayer":
      return fF["get"]("photoAlbum");
    case "MapPlayer":
      return fF["get"]("map");
  }
};
TDV["Tour"]["Script"]["getMediaWidth"] = function (fG) {
  switch (fG["get"]("class")) {
    case "Video360":
      var fH = fG["get"]("video");
      if (fH instanceof Array) {
        var fI = 0x0;
        for (var fJ = 0x0; fJ < fH["length"]; fJ++) {
          var fK = fH[fJ];
          if (fK["get"]("width") > fI) fI = fK["get"]("width");
        }
        return fI;
      } else {
        return fK["get"]("width");
      }
    default:
      return fG["get"]("width");
  }
};
TDV["Tour"]["Script"]["getMediaHeight"] = function (fL) {
  switch (fL["get"]("class")) {
    case "Video360":
      var fM = fL["get"]("video");
      if (fM instanceof Array) {
        var fN = 0x0;
        for (var fO = 0x0; fO < fM["length"]; fO++) {
          var fP = fM[fO];
          if (fP["get"]("height") > fN) fN = fP["get"]("height");
        }
        return fN;
      } else {
        return fP["get"]("height");
      }
    default:
      return fL["get"]("height");
  }
};
TDV["Tour"]["Script"]["getOverlays"] = function (fQ) {
  switch (fQ["get"]("class")) {
    case "LivePanorama":
    case "HDRPanorama":
    case "Panorama":
      var fR = fQ["get"]("overlays")["concat"]() || [];
      var fS = fQ["get"]("frames");
      for (var fT = 0x0; fT < fS["length"]; ++fT) {
        fR = fR["concat"](fS[fT]["get"]("overlays") || []);
      }
      return fR;
    case "Video360":
    case "Map":
      return fQ["get"]("overlays") || [];
    default:
      return [];
  }
};
TDV["Tour"]["Script"]["getPanoramaOverlayByName"] = function (fU, fV) {
  var fW = this["getOverlays"](fU);
  for (var fX = 0x0, fY = fW["length"]; fX < fY; ++fX) {
    var fZ = fW[fX];
    var g0 = fZ["get"]("data");
    if (g0 != undefined && g0["label"] == fV) {
      return fZ;
    }
  }
  return undefined;
};
TDV["Tour"]["Script"]["getPanoramaOverlaysByTags"] = function (g1, g2, g3) {
  var g4 = [];
  var g5 = this["getOverlays"](g1);
  var g6 = this["getOverlaysByTags"](g2, g3);
  for (var g7 = 0x0, g8 = g5["length"]; g7 < g8; ++g7) {
    var g9 = g5[g7];
    if (g6["indexOf"](g9) != -0x1) g4["push"](g9);
  }
  return g4;
};
TDV["Tour"]["Script"]["getPixels"] = function (gb) {
  var gc = /((\+|-)?d+(.d*)?)(px|vw|vh|vmin|vmax)?/i["exec"](gb);
  if (gc == undefined) {
    return 0x0;
  }
  var gd = parseFloat(gc[0x1]);
  var ge = gc[0x4];
  var gf = this["rootPlayer"]["get"]("actualWidth") / 0x64;
  var gg = this["rootPlayer"]["get"]("actualHeight") / 0x64;
  switch (ge) {
    case "vw":
      return gd * gf;
    case "vh":
      return gd * gg;
    case "vmin":
      return gd * Math["min"](gf, gg);
    case "vmax":
      return gd * Math["max"](gf, gg);
    default:
      return gd;
  }
};
TDV["Tour"]["Script"]["getPlayListsWithMedia"] = function (gh, gi) {
  var gj = [];
  var gk = this["getByClassName"]("PlayList");
  for (var gl = 0x0, gm = gk["length"]; gl < gm; ++gl) {
    var gn = gk[gl];
    if (gi && gn["get"]("selectedIndex") == -0x1) continue;
    var go = this["getPlayListItemByMedia"](gn, gh);
    if (go != undefined && go["get"]("player") != undefined) gj["push"](gn);
  }
  return gj;
};
TDV["Tour"]["Script"]["_getPlayListsWithViewer"] = function (gp) {
  var gq = this["getByClassName"]("PlayList");
  var gr = function (gt) {
    var gu = gt["get"]("items");
    for (var gv = gu["length"] - 0x1; gv >= 0x0; --gv) {
      var gw = gu[gv];
      var gx = gw["get"]("player");
      if (gx !== undefined && gx["get"]("viewerArea") == gp) return !![];
    }
    return ![];
  };
  for (var gs = gq["length"] - 0x1; gs >= 0x0; --gs) {
    if (!gr(gq[gs])) gq["splice"](gs, 0x1);
  }
  return gq;
};
TDV["Tour"]["Script"]["getPlayListWithItem"] = function (gy) {
  var gz = this["getByClassName"]("PlayList");
  for (var gA = gz["length"] - 0x1; gA >= 0x0; --gA) {
    var gB = gz[gA];
    var gC = gB["get"]("items");
    for (var gD = gC["length"] - 0x1; gD >= 0x0; --gD) {
      var gE = gC[gD];
      if (gE == gy) return gB;
    }
  }
  return undefined;
};
TDV["Tour"]["Script"]["getFirstPlayListWithMedia"] = function (gF, gG) {
  var gH = this["getPlayListsWithMedia"](gF, gG);
  return gH["length"] > 0x0 ? gH[0x0] : undefined;
};
TDV["Tour"]["Script"]["getPlayListItemByMedia"] = function (gI, gJ) {
  var gK = gI["get"]("items");
  for (var gL = 0x0, gM = gK["length"]; gL < gM; ++gL) {
    var gN = gK[gL];
    if (gN["get"]("media") == gJ) return gN;
  }
  return undefined;
};
TDV["Tour"]["Script"]["getPlayListItemIndexByMedia"] = function (gO, gP) {
  var gQ = this["getPlayListItemByMedia"](gO, gP);
  return gQ ? gO["get"]("items")["indexOf"](gQ) : -0x1;
};
TDV["Tour"]["Script"]["getPlayListItems"] = function (gR, gS) {
  var gT = (function () {
    switch (gR["get"]("class")) {
      case "Panorama":
      case "LivePanorama":
      case "HDRPanorama":
        return "PanoramaPlayListItem";
      case "Video360":
        return "Video360PlayListItem";
      case "PhotoAlbum":
        return "PhotoAlbumPlayListItem";
      case "Map":
        return "MapPlayListItem";
      case "Video":
        return "VideoPlayListItem";
    }
  })();
  if (gT != undefined) {
    var gU = this["getByClassName"](gT);
    for (var gV = gU["length"] - 0x1; gV >= 0x0; --gV) {
      var gW = gU[gV];
      if (
        gW["get"]("media") != gR ||
        (gS != undefined && gW["get"]("player") != gS)
      ) {
        gU["splice"](gV, 0x1);
      }
    }
    return gU;
  } else {
    return [];
  }
};
TDV["Tour"]["Script"]["historyGoBack"] = function (gX) {
  var gY = this["get"]("data")["history"][gX["get"]("id")];
  if (gY != undefined) {
    gY["back"]();
  }
};
TDV["Tour"]["Script"]["historyGoForward"] = function (gZ) {
  var h0 = this["get"]("data")["history"][gZ["get"]("id")];
  if (h0 != undefined) {
    h0["forward"]();
  }
};
TDV["Tour"]["Script"]["init"] = function () {
  var h1 = this["get"]("data")["history"];
  var h2 = function (hb) {
    var hc = hb["source"];
    var hd = hc["get"]("selectedIndex");
    if (hd < 0x0) return;
    var he = hc["get"]("id");
    if (!h1["hasOwnProperty"](he)) h1[he] = new TDV["Tour"]["HistoryData"](hc);
    h1[he]["add"](hd);
  };
  var h3 = this["getByClassName"]("PlayList");
  for (var h5 = 0x0, h6 = h3["length"]; h5 < h6; ++h5) {
    var h7 = h3[h5];
    h7["bind"]("change", h2, this);
  }
  if (this["getMainViewer"]()["get"]("translationTransitionEnabled")) {
    var h8 = this["getByClassName"]("ThumbnailList");
    h8 = h8["concat"](this["getByClassName"]("ThumbnailGrid"));
    h8 = h8["concat"](this["getByClassName"]("DropDown"));
    function hf(hg) {
      var hh = hg["source"]["get"]("playList");
      var hi = hh["get"]("selectedIndex");
      if (hi >= 0x0) {
        this["skip3DTransitionOnce"](hh["get"]("items")[hi]["get"]("player"));
      }
    }
    for (var h5 = 0x0, h9 = h8["length"]; h5 < h9; ++h5) {
      var ha = h8[h5];
      ha["bind"]("change", hf, this);
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
TDV["Tour"]["Script"]["initQuiz"] = function (hQ, hR, hS) {
  var hT = {
    score: {
      veil: { backgroundColor: "#000000", backgroundOpacity: 0.3 },
      window: {
        calification: {
          fontFamily: "Arial",
          width: "100%",
          verticalAlign: "middle",
          textAlign: "center",
          paddingTop: 15,
          paddingBottom: 10,
          fontColor: "#009fe3",
          paddingRight: 100,
          paddingLeft: 100,
          fontSize: 30,
          fontWeight: "bold",
        },
        maxWidth: 1500,
        shadowColor: "#000000",
        paddingTop: 20,
        description: {
          fontFamily: "Arial",
          textAlign: "center",
          paddingTop: 15,
          paddingBottom: 15,
          fontColor: "#000000",
          paddingRight: 100,
          paddingLeft: 100,
          fontSize: 16,
          fontWeight: "normal",
        },
        paddingBottom: 20,
        buttonsContainer: {
          width: "100%",
          verticalAlign: "middle",
          horizontalAlign: "center",
          button: {
            fontFamily: "Arial",
            paddingTop: 12,
            backgroundColor: "#009fe3",
            verticalAlign: "middle",
            paddingBottom: 12,
            fontColor: "#ffffff",
            paddingRight: 25,
            paddingLeft: 25,
            fontSize: 15,
            horizontalAlign: "center",
            fontWeight: "bold",
          },
          paddingBottom: 50,
          paddingRight: 100,
          paddingLeft: 100,
          paddingTop: 35,
          gap: 8,
        },
        shadowBlurRadius: 4,
        statsContainer: {
          contentOpaque: true,
          verticalAlign: "middle",
          paddingTop: 15,
          paddingBottom: 15,
          paddingRight: 100,
          paddingLeft: 100,
          horizontalAlign: "center",
          overflow: "scroll",
          gap: 20,
        },
        shadowVerticalLength: 0,
        backgroundColor: "#ffffff",
        shadowOpacity: 0.3,
        title: {
          fontFamily: "Arial",
          textAlign: "center",
          paddingTop: 50,
          paddingBottom: 15,
          fontColor: "#000000",
          fontSize: 50,
          fontWeight: "bold",
        },
        paddingRight: 20,
        timeContainer: {
          width: "100%",
          verticalAlign: "middle",
          paddingTop: 10,
          paddingBottom: 15,
          paddingRight: 100,
          paddingLeft: 100,
          horizontalAlign: "center",
          gap: 5,
        },
        content: { horizontalAlign: "center", width: "100%" },
        minWidth: 500,
        shadow: true,
        closeButton: {
          iconColor: "#ffffff",
          iconHeight: 18,
          iconWidth: 18,
          width: 45,
          height: 45,
          iconLineWidth: 2,
          backgroundColor: "#009fe3",
        },
        stats: {
          borderRadius: 75,
          mainValue: {
            fontFamily: "Arial",
            fontSize: 40,
            fontWeight: "bold",
            fontColor: "#000000",
          },
          borderSize: 1,
          layout: "vertical",
          secondaryValue: {
            fontFamily: "Arial",
            fontSize: 20,
            fontWeight: "bold",
            fontColor: "#000000",
          },
          title: {
            fontFamily: "Arial",
            paddingTop: 10,
            fontColor: "#000000",
            paddingRight: 5,
            paddingLeft: 5,
            fontSize: 20,
            fontWeight: "normal",
          },
          height: 150,
          minWidth: 150,
          label: {
            fontFamily: "Arial",
            fontSize: 15,
            fontWeight: "normal",
            fontColor: "#000000",
          },
          verticalAlign: "middle",
          horizontalAlign: "center",
          borderColor: "#009fe3",
          gap: 0,
        },
        paddingLeft: 20,
        horizontalAlign: "center",
        shadowSpread: 4,
        shadowHorizontalLength: 0,
      },
    },
    question: {
      veil: { backgroundColor: "#000000", backgroundOpacity: 0.3 },
      window: {
        mediaContainer: {
          height: "100%",
          width: "70%",
          buttonPrevious: {
            height: 37,
            iconURL:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAlCAMAAACAj7KHAAAAA3NCSVQICAjb4U/gAAAAS1BMVEX///8AAAAAAAAAAAAAAACVlZWLi4uDg4MAAAC8vLx8fHx5eXl2dnZ0dHRxcXHDw8PAwMBra2tjY2PY2NiLi4v7+/v5+fn////7+/sWSBTRAAAAGXRSTlMAESIzRFVVVVVmZmZmZmZ3d3d3mZnu7v//nfgMagAAAAlwSFlzAAAK6wAACusBgosNWgAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDYvMjkvMTUTtAt+AAAAkElEQVQokbXSyRaDIAwFUALOQ7W2iP//pQK6CGheF55mmXuYwlPqn0VEUp/uzPd0qAuFvqnsdKEInXVuziTCsDpfraYcxgi25MKh5rsxWHvDhMMIIJWf8EpAeei2CO/CJK8kXR2w5ED6E8B9m0zkNegc8W7ye8AM5LmBWYP/AX8KcgCyA/IGMqrkXJ92239aO3W4D6yL2ECSAAAAAElFTkSuQmCC",
            width: 25,
          },
          buttonNext: {
            height: 37,
            iconURL:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAlCAMAAACAj7KHAAAAA3NCSVQICAjb4U/gAAAAS1BMVEX///8AAAAAAAAAAAAAAACVlZWLi4uDg4MAAAC8vLx8fHx5eXl2dnZ0dHRxcXHDw8PAwMBra2tjY2PY2NiLi4v7+/v5+fn////7+/sWSBTRAAAAGXRSTlMAESIzRFVVVVVmZmZmZmZ3d3d3mZnu7v//nfgMagAAAAlwSFlzAAAK6wAACusBgosNWgAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDYvMjkvMTUTtAt+AAAAjElEQVQokbXTyRaAIAgFUJHmeTL7/y9Naie+Toti2T0R4suYH4qI0HNKGpGV0iYwuoLFlEzeu0YT2dqH2jtFZHN3UR9T6FamKQi3O6Q+STL2O4r6WR4QcTZfdIQjR6NzttxUaKk2Eb/qdql34HfgbPA8eAdwb3jXD/eD7xTnAGcH5g1n9CHXBv8Ln9UJhXMPrAhUbYMAAAAASUVORK5CYII=",
            width: 25,
          },
          viewerArea: {
            playbackBarHeadOpacity: 1,
            playbackBarRight: 0,
            playbackBarProgressOpacity: 0.5,
            playbackBarProgressBackgroundColor: "#3399ff",
            playbackBarHeadBorderRadius: 7,
            backgroundColor: "#e6e6e6",
            playbackBarHeadBorderColor: "#ffffff",
            playbackBarHeadShadowOpacity: 0.3,
            backgroundOpacity: 1,
            playbackBarBorderSize: 0,
            playbackBarHeadShadowBlurRadius: 2,
            playbackBarBorderRadius: 0,
            playbackBarHeadShadowVerticalLength: 0,
            playbackBarHeadBackgroundColor: "#cccccc",
            playbackBarBackgroundColor: "#000000",
            playbackBarHeadShadowSpread: 2,
            playbackBarLeft: 0,
            playbackBarHeight: 6,
            playbackBarHeadHeight: 14,
            playbackBarBottom: 5,
            playbackBarHeadShadowColor: "#000000",
            playbackBarHeadShadowHorizontalLength: 0,
            playbackBarHeadWidth: 14,
            playbackBarHeadBorderSize: 3,
            playbackBarBackgroundOpacity: 0.5,
            playbackBarHeadShadow: true,
          },
        },
        height: "60%",
        backgroundColor: "#ffffff",
        backgroundOpacity: 1,
        width: "60%",
        shadowOpacity: 0.3,
        shadowColor: "#000000",
        paddingTop: 20,
        shadowBlurRadius: 4,
        paddingLeft: 20,
        horizontalAlign: "center",
        paddingBottom: 20,
        buttonsContainer: {
          verticalAlign: "bottom",
          horizontalAlign: "right",
          button: {
            fontFamily: "Arial",
            borderRadius: 3,
            paddingTop: 10,
            fontWeight: "bold",
            paddingBottom: 10,
            paddingRight: 25,
            verticalAlign: "middle",
            backgroundColor: "#000000",
            backgroundOpacity: 0.7,
            fontColor: "#ffffff",
            paddingLeft: 25,
            fontSize: 18,
            horizontalAlign: "center",
          },
        },
        borderRadius: 5,
        title: {
          fontFamily: "Arial",
          textAlign: "center",
          paddingTop: 25,
          paddingBottom: 40,
          fontColor: "#000000",
          paddingRight: 50,
          paddingLeft: 50,
          fontSize: 20,
          fontWeight: "bold",
        },
        optionsContainer: {
          height: "100%",
          width: "30%",
          contentOpaque: true,
          overflow: "scroll",
          gap: 10,
        },
        paddingRight: 20,
        minWidth: 500,
        shadow: true,
        closeButton: {
          iconColor: "#FFFFFF",
          iconHeight: 18,
          iconWidth: 18,
          width: 45,
          height: 45,
          iconLineWidth: 2,
          backgroundColor: "#009FE3",
        },
        bodyContainer: {
          layout: "horizontal",
          width: "100%",
          paddingBottom: 30,
          height: "100%",
          paddingRight: 30,
          paddingLeft: 30,
          gap: 35,
        },
        option: {
          text: {
            fontFamily: "Arial",
            textAlign: "left",
            selected: {
              fontFamily: "Arial",
              fontSize: 18,
              paddingTop: 9,
              textAlign: "left",
              fontColor: "#000000",
            },
            fontColor: "#404040",
            verticalAlign: "middle",
            fontSize: 18,
            paddingTop: 9,
          },
          label: {
            fontFamily: "Arial",
            borderRadius: 19,
            fontWeight: "bold",
            height: 38,
            backgroundColor: "#000000",
            backgroundOpacity: 0.2,
            incorrect: {
              fontFamily: "Arial",
              borderRadius: 19,
              fontWeight: "bold",
              height: 38,
              backgroundColor: "#ed1c24",
              backgroundOpacity: 1,
              width: 38,
              pressedBackgroundOpacity: 1,
              fontColor: "#ffffff",
              verticalAlign: "middle",
              fontSize: 18,
              horizontalAlign: "center",
            },
            width: 38,
            correct: {
              fontFamily: "Arial",
              borderRadius: 19,
              fontWeight: "bold",
              height: 38,
              backgroundColor: "#39b54a",
              backgroundOpacity: 1,
              width: 38,
              pressedBackgroundOpacity: 1,
              fontColor: "#ffffff",
              verticalAlign: "middle",
              fontSize: 18,
              horizontalAlign: "center",
            },
            pressedBackgroundOpacity: 1,
            fontColor: "#ffffff",
            verticalAlign: "middle",
            fontSize: 18,
            horizontalAlign: "center",
          },
          gap: 10,
        },
        shadowVerticalLength: 0,
        shadowSpread: 4,
        shadowHorizontalLength: 0,
      },
    },
    timeout: {
      veil: { backgroundColor: "#000000", backgroundOpacity: 0.3 },
      window: {
        shadowBlurRadius: 4,
        paddingLeft: 80,
        paddingTop: 45,
        paddingBottom: 55,
        buttonsContainer: { width: "100%", horizontalAlign: "center", gap: 10 },
        paddingRight: 80,
        shadowVerticalLength: 0,
        backgroundColor: "#ffffff",
        shadowOpacity: 0.3,
        title: {
          fontFamily: "Arial",
          textAlign: "center",
          paddingBottom: 20,
          fontColor: "#000000",
          fontSize: 40,
          fontWeight: "bold",
        },
        icon: {
          height: 72,
          width: 62,
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAABGCAYAAAB/h5zrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABhRJREFUeNrsW41y2jgQliVjGxMuhDR37/92l2uvhVIcjGtzuLO6aBRpdyVb9G4azWiABKH99n9XcibSj9V13geu6a7z7+scUhAkbwB6GbFmAVP8X0H/58Y76HfQ76DfQYeOLmLNGKq+pyIouxFzS3jNkZg9MucrvB8B96mIyW8EumV858L8XlLQC5DKqGqHSDX9WeMe6G+BdpZ6jwseDZsfIC0MBa6M7KqEzwr5/hlUu4P3MYzeXGdtfG6uc0eBtgGLQOAjqAo2nppKjnuejBkK2Ak8YwI2ifgTcVYrAJxi9ED80VOIrGH6xr/A8wDAvhBXwmZFYjtVsM8KgB8cAsOG1oCdCgCsw0pjMOAeprqhk8qA0bUV2jKGlo04lQLin5iJioJNxu9+uIF0qcSqhtcugPmLDNA//UppaA5c6lIW7RB+WtjHlYQooCUHOqqUKXJmqMrjzMA7cDinyLZPCV2XembMu8yykTmAn8GztjPa7grmVOmPIavJHBvontYooW0AEwYoGJqEIesh0HnuwPEWgKcTDm93MWz8An+rmNL9BK+pxgUYOjBp6g3QZ9PEFMHZLaP8HAn5bDApRHJ5hL13ILUlQZs0BPJmY994ZJSee1cVwxg1xPkV0HAKXD+Az6CAly5HKhGiCoaEj4wMSCIpofB4ZwkES0LinAOBe66kt8SGI/e+EJs9Qa5cA4FmJ6QytGgk+ptF0++gBePaF8R0BvjtmpFFdhjomviRnmHDo5TujFxAAvFmJ0UazsaU1p3hqDLY50zQY7akfBp3xDona0YYGBg2R33eIZHABQobB2DUApF2rcOpLekK1GqKHWtQujBpIX5zvXtvrD0ExP2OoF3q38oRB+PjKHc0ExKVmLW67PVhKLR9K4sTG4KQF8//1mCLF5GmXy3h97cgzbPHxHpC2j8cmrQ4gQ2fWq8AdAVEqZnBrsGbr+GzEnjvHOvhLW31LikOIZ7aLlf7GcDGFhlHRGMLG3RBxGVM7Ssmp+cAO0Am6BtUdVfmzMZaSzDk2WhIxNTOykhkqMLmM7FHTzRF8pyRgwtG9dQHqPRoDr8ZRPVMP7BnhkvBBZ0TMXeuCy+1w94UA8Au0GwwASw4B3jfGeUhR60lSNjWjoJwSntPo0MKf+MfZRBH0lg+q3vl48Z/EcALq8b9hEhf5+StpxgqjAzyo6fhQBbaMb2nylrPabS7HGPjcIwfEedZMJ0vCTrGZvsQlbL+X3pSX453PgY4WFS9Y1LHBkq/JdTDFGidOkqQ1h8Om+bk23tDC3z5Q8YBHfudY0AY0d3SjeEElaNg4IxTgClFSVoazmrq0N1M+9zpGNlrw6KK18xyZqG+EPM17/UBuz48THGtA5P0kDOzmIoAvQHn1CIdkSlZnB3ajkj+LQnQZ8n0hBVBTG20ZGqRZtRWORtD649wKZlFhUK4l4V4zgljQHpu3O5PZyclVMzzcffFsMsO6a5MHQfwBWfEhBSR1jYuqWwJ9XgWCW/yzTA2hKSf7R6ZzlmXRPjiHsHovtYCGBVy1lVBcZJDOOWsXQi8x3fWOUXuCCdYfatPHDjhyzzrLiG95MbYrQFeMSMC9ZxII5BC48BQIcnkPOZR9QMtFZEBcrLGFWHLPQW6IexWWXUxp9vSeACvxNsOamslLN8YzKWkfOCkaxfCoS0YHv8E9nhyaE9lVVqtxehGvF7j6Bg1fUaEqT0HdCdeL7BivS6sNWzeanDF9tqIuQeHs6Kcn76OQan/m1I1I36Uc6kOSwkphxXbQeXecDy4fBQmyYvg3e8ojIIkJCxdIkKZjiAPgnel80toCaYXSkEf+eTi9a5mqmcvJIC9Y6S6A/TgLjGgtZNRjH6U7qKUERUUJ8l5YPbE9L30XsS0VQJTPFfIakT8jcEF7LcU/MYl6yJ+aEUUCtwMX/oRBd+TOKVRMJQi/PST/chFTBlI3aD/GaOD0MQyqZiz5DPMStzuuS4qZO5CTCib6GA2It0zG5x2016EX7ybRVK3eobDtF3deo7q0M6pnqnBTwabsp+lxOsFODUDUDP0zTJSOyIFGqCfwssFfd+zN8Jbkmcv/xFgALaVsLLFsFFBAAAAAElFTkSuQmCC",
        },
        shadowSpread: 4,
        shadow: true,
        shadowColor: "#000000",
        horizontalAlign: "center",
        button: {
          fontFamily: "Arial",
          paddingTop: 12,
          backgroundColor: "#009fe3",
          verticalAlign: "middle",
          paddingBottom: 12,
          fontColor: "#ffffff",
          paddingRight: 25,
          paddingLeft: 25,
          fontSize: 15,
          horizontalAlign: "center",
          fontWeight: "bold",
        },
        gap: 15,
        shadowHorizontalLength: 0,
      },
    },
  };
  hQ["theme"] = "theme" in hQ ? this["mixObject"](hT, hQ["theme"]) : hT;
  var hU =
    hQ["data"] && hQ["data"]["titlesScale"] ? hQ["data"]["titlesScale"] : 0x1;
  var hV =
    hQ["data"] && hQ["data"]["bodyScale"] ? hQ["data"]["bodyScale"] : 0x1;
  if (hQ["player"]["get"]("isMobile")) {
    var hW = this["mixObject"](hQ["theme"], {
      question: {
        window: {
          width: "100%",
          height: "100%",
          minWidth: undefined,
          backgroundOpacity: 0x1,
          borderRadius: 0x0,
          paddingLeft: 0x0,
          paddingRight: 0x0,
          paddingBottom: 0x0,
          paddingTop: 0x0,
          verticalAlign: "middle",
          title: { paddingBottom: 0x19, paddingTop: 0x19 },
          bodyContainer: {
            layout: "vertical",
            horizontalAlign: "center",
            paddingLeft: 0x0,
            paddingRight: 0x0,
            gap: 0x14,
          },
          mediaContainer: { width: "100%", height: "45%" },
          optionsContainer: {
            width: "100%",
            height: "55%",
            paddingLeft: 0x14,
            paddingRight: 0x14,
          },
        },
      },
      score: {
        window: {
          description: { paddingLeft: 0xa, paddingRight: 0xa },
          calification: {
            fontSize: 0x14 * hV,
            paddingLeft: 0xa,
            paddingRight: 0xa,
          },
        },
      },
    });
    hQ["theme"] = hW;
  }
  var hX = this["get"]("data");
  var hY = document["getElementById"]("metaViewport");
  var hZ = hY
    ? /initial-scale=(\d+(\.\d+)?)/["exec"](hY["getAttribute"]("content"))
    : undefined;
  var i0 = hZ ? hZ[0x1] : 0x1;
  hX["scorePortraitConfig"] = {
    theme: {
      window: {
        minWidth: 0xfa / i0,
        maxHeight: 0x258 / i0,
        content: { height: "100%" },
        statsContainer: {
          layout: "vertical",
          horizontalAlign: "center",
          maxHeight: 0x258,
          paddingLeft: 0x0,
          paddingRight: 0x0,
          width: "100%",
          height: "100%",
        },
        buttonsContainer: {
          paddingLeft: 0xa,
          paddingRight: 0xa,
          button: { paddingLeft: 0xf, paddingRight: 0xf },
        },
      },
    },
  };
  hX["scoreLandscapeConfig"] = {
    theme: {
      window: {
        title: { fontSize: 0x1e * hU, paddingTop: 0xa },
        stats: { height: 0x64 },
        buttonsContainer: { paddingBottom: 0x14, paddingTop: 0xa },
        description: { paddingBottom: 0x5, paddingTop: 0x5 },
      },
    },
  };
  var i1 = new TDV["Quiz"](hQ);
  i1["setMaxListeners"](0x32);
  if (hS === !![]) {
    i1["bind"](
      TDV["Quiz"]["EVENT_PROPERTIES_CHANGE"],
      function () {
        if (
          (i1["get"](TDV["Quiz"]["PROPERTY"]["QUESTIONS_ANSWERED"]) +
            i1["get"](TDV["Quiz"]["PROPERTY"]["ITEMS_FOUND"])) /
          (i1["get"](TDV["Quiz"]["PROPERTY"]["QUESTION_COUNT"]) +
            i1["get"](TDV["Quiz"]["PROPERTY"]["ITEM_COUNT"])) ==
          0x1
        )
          i1["finish"]();
      }["bind"](this)
    );
  }
  if (hR === !![]) {
    i1["start"]();
  }
  hX["quiz"] = i1;
  hX["quizConfig"] = hQ;
};
TDV["Tour"]["Script"]["getQuizTotalObjectiveProperty"] = function (i2) {
  var i3 = this["get"]("data")["quiz"];
  var i4 = this["get"]("data")["quizConfig"];
  var i5 = i4["objectives"];
  var i6 = 0x0;
  for (var i7 = 0x0, i8 = i5["length"]; i7 < i8; ++i7) {
    var i9 = i5[i7];
    i6 += i3["getObjective"](i9["id"], i2);
  }
  return i6;
};
TDV["Tour"]["Script"]["_initSplitViewer"] = function (ia) {
  function ib() {
    var iz = ia["get"]("actualWidth");
    ip["get"]("children")[0x0]["set"]("width", iz);
    iq["get"]("children")[0x0]["set"]("width", iz);
    var iA = it["get"]("left");
    var iB = typeof iA == "string" ? ic(iA) : iA;
    iB += it["get"]("actualWidth") * 0.5;
    ip["set"]("width", ie(iB));
    iq["set"]("width", ie(iz - iB));
  }
  function ic(iC) {
    return (
      (parseFloat(iC["replace"]("%", "")) / 0x64) * ia["get"]("actualWidth")
    );
  }
  function ie(iD) {
    return (iD / ia["get"]("actualWidth")) * 0x64 + "%";
  }
  function ig(iE) {
    ih(iE["source"]);
  }
  function ih(iF) {
    var iG = iF == iv ? iu : iv;
    if ((iw && iF != iw) || !iF || !iG) return;
    var iH =
      iG["get"]("camera")["get"]("initialPosition")["get"]("yaw") -
      iF["get"]("camera")["get"]("initialPosition")["get"]("yaw");
    iG["setPosition"](
      iF["get"]("yaw") + iH,
      iF["get"]("pitch"),
      iF["get"]("roll"),
      iF["get"]("hfov")
    );
  }
  function ii(iI) {
    iw = iI["source"];
  }
  function ij(iJ) {
    ik(iJ["source"]);
  }
  function ik(iK) {
    var iL = iK["get"]("viewerArea");
    if (iL == ir) {
      if (iu) {
        iu["get"]("camera")["set"]("hoverFactor", ix);
      }
      iu = iK;
      iw = iu;
      if (iu) {
        ix = iu["get"]("camera")["get"]("hoverFactor");
        iu["get"]("camera")["set"]("hoverFactor", 0x0);
      }
    } else if (iL == is) {
      if (iv) {
        iv["get"]("camera")["set"]("hoverFactor", iy);
      }
      iv = iK;
      iw = iu;
      if (iv) {
        iy = iv["get"]("camera")["get"]("hoverFactor");
        iv["get"]("camera")["set"]("hoverFactor", 0x0);
      }
    }
    ih(iK);
  }
  function il(iM) {
    var iN = this["getCurrentPlayers"]();
    var iO = iN["length"];
    while (iO-- > 0x0) {
      var iQ = iN[iO];
      if (iQ["get"]("viewerArea") != iM) {
        iN["splice"](iO, 0x1);
      }
    }
    for (iO = 0x0; iO < iN["length"]; ++iO) {
      var iQ = iN[iO];
      iQ["bind"]("preloadMediaShow", ij, this);
      iQ["bind"]("cameraPositionChange", ig, this);
      iQ["bind"]("userInteractionStart", ii, this);
      if (iQ["get"]("panorama")) ik(iQ);
    }
    return iN;
  }
  function im(iR) {
    ik(this["getActivePlayerWithViewer"](iR["source"]));
    ih(iw);
  }
  var io = ia["get"]("children");
  var ip = io[0x0];
  var iq = io[0x1];
  var ir = ip["get"]("children")[0x0];
  var is = iq["get"]("children")[0x0];
  var it = io[0x2];
  var iu, iv, iw;
  var ix, iy;
  il["call"](this, ir);
  il["call"](this, is);
  ir["bind"]("mouseDown", im, this);
  is["bind"]("mouseDown", im, this);
  ia["bind"](
    "resize",
    function () {
      it["set"](
        "left",
        (ia["get"]("actualWidth") - it["get"]("actualWidth")) * 0.5
      );
      ib();
    },
    this
  );
  it["bind"](
    "mouseDown",
    function (iS) {
      var iT = iS["pageX"];
      var iU = function (iV) {
        var iW = iV["pageX"];
        var iX = iT - iW;
        var iY = ia["get"]("actualWidth");
        var iZ = it["get"]("left");
        var j0 = (typeof iZ == "string" ? ic(iZ) : iZ) - iX;
        if (j0 < 0x0) {
          iW -= j0;
          j0 = 0x0;
        } else if (j0 + it["get"]("actualWidth") >= iY) {
          iW -= j0 - (iY - it["get"]("actualWidth"));
          j0 = iY - it["get"]("actualWidth");
        }
        it["set"]("left", j0);
        ib();
        iT = iW;
      };
      this["bind"]("mouseMove", iU, this);
      this["bind"](
        "mouseUp",
        function () {
          this["unbind"]("mouseMove", iU, this);
        },
        this
      );
    },
    this
  );
  ib();
};
TDV["Tour"]["Script"]["_initTwinsViewer"] = function (j1) {
  function j2() {
    var jn = j1["get"]("actualWidth");
    jd["get"]("children")[0x0]["set"]("width", jn);
    je["get"]("children")[0x0]["set"]("width", jn);
    var jo = jh["get"]("left");
    var jp = typeof jo == "string" ? j3(jo) : jo;
    jp += jh["get"]("actualWidth") * 0.5;
    jd["set"]("width", j4(jp));
    je["set"]("width", j4(jn - jp));
  }
  function j3(jq) {
    return (
      (parseFloat(jq["replace"]("%", "")) / 0x64) * j1["get"]("actualWidth")
    );
  }
  function j4(jr) {
    return (jr / j1["get"]("actualWidth")) * 0x64 + "%";
  }
  function j5(js) {
    j6(js["source"]);
  }
  function j6(jt) {
    var ju = jt == jj ? ji : jj;
    if ((jk && jt != jk) || !jt || !ju) return;
    var jv =
      ju["get"]("camera")["get"]("initialPosition")["get"]("yaw") -
      jt["get"]("camera")["get"]("initialPosition")["get"]("yaw");
    ju["setPosition"](
      jt["get"]("yaw") + jv,
      jt["get"]("pitch"),
      jt["get"]("roll"),
      jt["get"]("hfov")
    );
  }
  function j7(jw) {
    jk = jw["source"];
  }
  function j8(jx) {
    j9(jx["source"]);
  }
  function j9(jy) {
    var jz = jy["get"]("viewerArea");
    if (jz == jf) {
      if (ji) {
        ji["get"]("camera")["set"]("hoverFactor", jl);
      }
      ji = jy;
      jk = ji;
      if (ji) {
        jl = ji["get"]("camera")["get"]("hoverFactor");
        ji["get"]("camera")["set"]("hoverFactor", 0x0);
      }
    } else if (jz == jg) {
      if (jj) {
        jj["get"]("camera")["set"]("hoverFactor", jm);
      }
      jj = jy;
      jk = ji;
      if (jj) {
        jm = jj["get"]("camera")["get"]("hoverFactor");
        jj["get"]("camera")["set"]("hoverFactor", 0x0);
      }
    }
    j6(jy);
  }
  function ja(jA) {
    var jB = this["getCurrentPlayers"]();
    var jC = jB["length"];
    while (jC-- > 0x0) {
      var jE = jB[jC];
      if (jE["get"]("viewerArea") != jA) {
        jB["splice"](jC, 0x1);
      }
    }
    for (jC = 0x0; jC < jB["length"]; ++jC) {
      var jE = jB[jC];
      jE["bind"]("preloadMediaShow", j8, this);
      jE["bind"]("cameraPositionChange", j5, this);
      jE["bind"]("userInteractionStart", j7, this);
      if (jE["get"]("panorama")) j9(jE);
    }
    return jB;
  }
  function jb(jF) {
    j9(this["getActivePlayerWithViewer"](jF["source"]));
    j6(jk);
  }
  var jc = j1["get"]("children");
  var jd = jc[0x0];
  var je = jc[0x1];
  var jf = jd["get"]("children")[0x0];
  var jg = je["get"]("children")[0x0];
  var jh = jc[0x2];
  var ji, jj, jk;
  var jl, jm;
  ja["call"](this, jf);
  ja["call"](this, jg);
  jf["bind"]("mouseDown", jb, this);
  jg["bind"]("mouseDown", jb, this);
  j1["bind"](
    "resize",
    function () {
      jh["set"](
        "left",
        (j1["get"]("actualWidth") - jh["get"]("actualWidth")) * 0.5
      );
      j2();
    },
    this
  );
  j2();
};
TDV["Tour"]["Script"]["isCardboardViewMode"] = function () {
  var jG = this["getByClassName"]("PanoramaPlayer");
  return jG["length"] > 0x0 && jG[0x0]["get"]("viewMode") == "cardboard";
};
TDV["Tour"]["Script"]["isPanorama"] = function (jH) {
  return (
    ["Panorama", "HDRPanorama", "LivePanorama", "Video360", "VideoPanorama"][
      "indexOf"
    ](jH["get"]("class")) != -0x1
  );
};
TDV["Tour"]["Script"]["keepCompVisible"] = function (jI, jJ) {
  var jK = "keepVisibility_" + jI["get"]("id");
  var jL = this["getKey"](jK);
  if (jL == undefined && jJ) {
    this["registerKey"](jK, jJ);
  } else if (jL != undefined && !jJ) {
    this["unregisterKey"](jK);
  }
};
TDV["Tour"]["Script"]["_initItemWithComps"] = function (
  jM,
  jN,
  jO,
  jP,
  jQ,
  jR,
  jS,
  jT
) {
  var jU = jM["get"]("items")[jN];
  var jV = jU["get"]("media");
  var jW = jV["get"]("loop") == undefined || jV["get"]("loop");
  var jX = jT > 0x0;
  var jY = this["rootPlayer"];
  var jZ = function (k7) {
    var k8 = jR ? jR["get"]("class") : undefined;
    var k9 = undefined;
    switch (k8) {
      case "FadeInEffect":
      case "FadeOutEffect":
        k9 = jY["createInstance"](k7 ? "FadeInEffect" : "FadeOutEffect");
        break;
      case "SlideInEffect":
      case "SlideOutEffect":
        k9 = jY["createInstance"](k7 ? "SlideInEffect" : "SlideOutEffect");
        break;
    }
    if (k9) {
      k9["set"]("duration", jR["get"]("duration"));
      k9["set"]("easing", jR["get"]("easing"));
      if (k8["indexOf"]("Slide") != -0x1)
        k9["set"](
          k7 ? "from" : "to",
          jR["get"](jR["get"]("class") == "SlideInEffect" ? "from" : "to")
        );
    }
    return k9;
  };
  var k0 = function () {
    for (var ka = 0x0, kb = jO["length"]; ka < kb; ++ka) {
      var kc = jO[ka];
      if (jT > 0x0) {
        this["setComponentVisibility"](kc, !jQ, 0x0, jZ(!jQ));
      } else {
        var kd = "visibility_" + kc["get"]("id");
        if (this["existsKey"](kd)) {
          if (this["getKey"](kd))
            this["setComponentVisibility"](kc, !![], 0x0, jZ(!![]));
          else this["setComponentVisibility"](kc, ![], 0x0, jZ(![]));
          this["unregisterKey"](kd);
        }
      }
    }
    jU["unbind"]("end", k0, this);
    if (!jW) jV["unbind"]("end", k0, this);
  };
  var k1 = function () {
    jU["unbind"]("stop", k1, this, !![]);
    jU["unbind"]("stop", k1, this);
    jU["unbind"]("begin", k1, this, !![]);
    jU["unbind"]("begin", k1, this);
    for (var ke = 0x0, kf = jO["length"]; ke < kf; ++ke) {
      this["keepCompVisible"](jO[ke], ![]);
    }
  };
  var k2 = function (kg, kh, ki) {
    var kj = function () {
      var kk = function (ko, kp, kq) {
        jY["setComponentVisibility"](
          ko,
          kp,
          kh,
          kq,
          kp ? "showEffect" : "hideEffect",
          ![]
        );
        if (ki > 0x0) {
          var kr = kh + ki + (kq != undefined ? kq["get"]("duration") : 0x0);
          jY["setComponentVisibility"](
            ko,
            !kp,
            kr,
            jZ(!kp),
            kp ? "hideEffect" : "showEffect",
            !![]
          );
        }
      };
      for (var kl = 0x0, km = jO["length"]; kl < km; ++kl) {
        var kn = jO[kl];
        if (jQ == "toggle") {
          if (!kn["get"]("visible")) kk(kn, !![], jZ(!![]));
          else kk(kn, ![], jZ(![]));
        } else {
          kk(kn, jQ, jZ(jQ));
        }
      }
      jU["unbind"](kg, kj, this);
      if (kg == "end" && !jW) jV["unbind"](kg, kj, this);
    };
    jU["bind"](kg, kj, this);
    if (kg == "end" && !jW) jV["bind"](kg, kj, this);
  };
  if (jP == "begin") {
    for (var k3 = 0x0, k4 = jO["length"]; k3 < k4; ++k3) {
      var k5 = jO[k3];
      this["keepCompVisible"](k5, !![]);
      if (jX) {
        var k6 = "visibility_" + k5["get"]("id");
        this["registerKey"](k6, k5["get"]("visible"));
      }
    }
    jU["bind"]("stop", k1, this, !![]);
    jU["bind"]("stop", k1, this);
    jU["bind"]("begin", k1, this, !![]);
    jU["bind"]("begin", k1, this);
    if (jX) {
      jU["bind"]("end", k0, this);
      if (!jW) jV["bind"]("end", k0, this);
    }
  } else if (jP == "end" && jT > 0x0) {
    k2("begin", jT, 0x0);
    jT = 0x0;
  }
  if (jP != undefined) k2(jP, jS, jT);
};
TDV["Tour"]["Script"]["loadFromCurrentMediaPlayList"] = function (ks, kt, ku) {
  var kv = ks["get"]("selectedIndex");
  var kw = ks["get"]("items")["length"];
  var kx = (kv + kt) % kw;
  while (kx < 0x0) {
    kx = kw + kx;
  }
  if (kv != kx) {
    if (ku) {
      var ky = ks["get"]("items")[kx];
      this["skip3DTransitionOnce"](ky["get"]("player"));
    }
    ks["set"]("selectedIndex", kx);
  }
};
TDV["Tour"]["Script"]["mixObject"] = function (kz, kA) {
  return this["assignObjRecursively"](kA, this["copyObjRecursively"](kz));
};
TDV["Tour"]["Script"]["downloadFile"] = function (kB) {
  if (
    (navigator["userAgent"]["toLowerCase"]()["indexOf"]("chrome") > -0x1 ||
      navigator["userAgent"]["toLowerCase"]()["indexOf"]("safari") > -0x1) &&
    !/(iP)/g["test"](navigator["userAgent"])
  ) {
    var kC = document["createElement"]("a");
    kC["href"] = kB;
    kC["setAttribute"]("target", "_blank");
    if (kC["download"] !== undefined) {
      var kD = kB["substring"](kB["lastIndexOf"]("/") + 0x1, kB["length"]);
      kC["download"] = kD;
    }
    if (document["createEvent"]) {
      var kE = document["createEvent"]("MouseEvents");
      kE["initEvent"]("click", !![], !![]);
      kC["dispatchEvent"](kE);
      return;
    }
  }
  window["open"](kB, "_blank");
};
TDV["Tour"]["Script"]["openLink"] = function (kF, kG) {
  if (!kF || kF == location["href"]) {
    return;
  }
  if (!kG) kG = "_blank";
  if (kG == "_top" || kG == "_self") {
    this["updateDeepLink"](!![], !![], !![]);
  }
  var kH =
    (window &&
      window["process"] &&
      window["process"]["versions"] &&
      window["process"]["versions"]["electron"]) ||
    (navigator &&
      navigator["userAgent"] &&
      navigator["userAgent"]["indexOf"]("Electron") >= 0x0);
  if (kH && kG == "_blank") {
    if (kF["startsWith"]("files/")) {
      kF = "/" + kF;
    }
    if (kF["startsWith"]("//")) {
      kF = "https:" + kF;
    } else if (kF["startsWith"]("/")) {
      var kI = window["location"]["href"]["split"]("/");
      kI["pop"]();
      kF = kI["join"]("/") + kF;
    }
    var kJ = kF["split"](".")["pop"]()["toLowerCase"]();
    if (
      (["pdf", "zip", "xls", "xlsx"]["indexOf"](kJ) == -0x1 ||
        kF["startsWith"]("file://")) &&
      window["hasOwnProperty"]("require")
    ) {
      var kK = window["require"]("electron")["shell"];
      kK["openExternal"](kF);
    } else {
      window["open"](kF, kG);
    }
  } else if (kH && (kG == "_top" || kG == "_self")) {
    window["location"] = kF;
  } else {
    var kL = this["get"]("data")["tour"];
    if (kL["isMobileApp"]() && kL["isIOS"]()) kF = "blank:" + kF;
    var kM = window["open"](kF, kG);
    kM["focus"]();
  }
};
TDV["Tour"]["Script"]["pauseCurrentPlayers"] = function (kN) {
  var kO = this["getCurrentPlayers"]();
  var kP = kO["length"];
  while (kP-- > 0x0) {
    var kQ = kO[kP];
    if (
      kQ["get"]("state") == "playing" ||
      (kQ["get"]("data") && kQ["get"]("data")["playing"]) ||
      (kQ["get"]("viewerArea") &&
        kQ["get"]("viewerArea")["get"]("id") == this["getMainViewer"]()) ||
      (kQ["get"]("camera") &&
        kQ["get"]("camera")["get"]("idleSequence") &&
        kQ["get"]("camera")["get"]("timeToIdle") > 0x0 &&
        kQ["get"]("state") == "playing")
    ) {
      var kR = this["getMediaFromPlayer"](kQ);
      if (kN && kR && kR["get"]("class") != "Video360" && "pauseCamera" in kQ) {
        kQ["pauseCamera"]();
      } else {
        kQ["pause"]();
      }
    } else {
      kO["splice"](kP, 0x1);
    }
  }
  return kO;
};
TDV["Tour"]["Script"]["pauseGlobalAudiosWhilePlayItem"] = function (
  kS,
  kT,
  kU
) {
  var kV = function () {
    if (kS["get"]("selectedIndex") != kT) {
      this["resumeGlobalAudios"]();
    }
  };
  this["pauseGlobalAudios"](kU, !![]);
  this["executeFunctionWhenChange"](kS, kT, kV, kV);
};
TDV["Tour"]["Script"]["pauseGlobalAudios"] = function (kW, kX) {
  this["stopTextToSpeech"]();
  if (window["pausedAudiosLIFO"] == undefined) window["pausedAudiosLIFO"] = [];
  var kY = this["getByClassName"]("VideoPanoramaOverlay");
  kY = kY["concat"](this["getByClassName"]("QuadVideoPanoramaOverlay"));
  for (var l0 = kY["length"] - 0x1; l0 >= 0x0; --l0) {
    var l1 = kY[l0];
    if (l1["get"]("video")["get"]("hasAudio") == ![]) kY["splice"](l0, 0x1);
  }
  var l2 = this["getByClassName"]("Audio")["concat"](kY);
  var l3 = {};
  if (window["currentGlobalAudios"] != undefined)
    l2 = l2["concat"](
      Object["values"](window["currentGlobalAudios"])["map"](function (l7) {
        if (!l7["allowResume"]) l3[l7["audio"]["get"]("id")] = l7["audio"];
        return l7["audio"];
      })
    );
  var l4 = [];
  for (var l0 = 0x0, l5 = l2["length"]; l0 < l5; ++l0) {
    var l6 = l2[l0];
    if (
      l6 &&
      l6["get"]("state") == "playing" &&
      (kW == undefined || kW["indexOf"](l6) == -0x1)
    ) {
      if (l6["get"]("id") in l3) {
        l6["stop"]();
      } else {
        l6["pause"]();
        l4["push"](l6);
      }
    }
  }
  if (kX || l4["length"] > 0x0) window["pausedAudiosLIFO"]["push"](l4);
  return l4;
};
TDV["Tour"]["Script"]["resumeGlobalAudios"] = function () {
  if (window["pausedAudiosLIFO"] == undefined) return;
  if (window["resumeAudiosBlocked"]) {
    if (window["pausedAudiosLIFO"]["length"] > 0x1) {
      window["pausedAudiosLIFO"][window["pausedAudiosLIFO"]["length"] - 0x2] =
        window["pausedAudiosLIFO"][window["pausedAudiosLIFO"]["length"] - 0x2][
          "concat"
        ](
          window["pausedAudiosLIFO"][window["pausedAudiosLIFO"]["length"] - 0x1]
        );
      window["pausedAudiosLIFO"]["splice"](
        window["pausedAudiosLIFO"]["length"] - 0x1,
        0x1
      );
    }
    return;
  }
  var l8 = window["pausedAudiosLIFO"]["pop"]();
  if (!l8) return;
  for (var l9 = 0x0, la = l8["length"]; l9 < la; ++l9) {
    var lb = l8[l9];
    if (lb["get"]("state") == "paused") lb["play"]();
  }
};
TDV["Tour"]["Script"]["pauseGlobalAudio"] = function (lc) {
  var ld = window["currentGlobalAudios"];
  if (ld) {
    var le = ld[lc["get"]("id")];
    if (le) lc = le["audio"];
  }
  if (lc["get"]("state") == "playing") lc["pause"]();
};
TDV["Tour"]["Script"]["playAudioList"] = function (lf, lg) {
  if (lf["length"] == 0x0) return;
  if (lf["length"] == 0x1 && lg) {
    var lh = lf[0x0];
    lh["set"]("loop", !![]);
    this["playGlobalAudio"](lh, !![], null, !![]);
  } else {
    var li = -0x1;
    var lj;
    var lk = this["playGlobalAudio"];
    var ll = function () {
      if (++li >= lf["length"]) {
        if (!lg) return;
        li = 0x0;
      }
      lj = lf[li];
      lk(lj, !![], ll, !![]);
    };
    ll();
  }
};
TDV["Tour"]["Script"]["playGlobalAudioWhilePlayActiveMedia"] = function (
  lm,
  ln,
  lo,
  lp
) {
  var lq = this["getActiveMediaWithViewer"](this["getMainViewer"]());
  var lr = this["getFirstPlayListWithMedia"](lq, !![]);
  var ls = this["getPlayListItemByMedia"](lr, lq);
  var lt = lr["get"]("items")["indexOf"](ls);
  return this["playGlobalAudioWhilePlay"](lr, lt, lm, ln, lo, lp);
};
TDV["Tour"]["Script"]["playGlobalAudioWhilePlay"] = function (
  lu,
  lv,
  lw,
  lx,
  ly,
  lz
) {
  var lA = function (lJ) {
    if (lJ["data"]["previousSelectedIndex"] == lv) {
      this["stopGlobalAudio"](lw);
      if (lE) {
        var lK = lD["get"]("media");
        var lL = lK["get"]("audios");
        lL["splice"](lL["indexOf"](lw), 0x1);
        lK["set"]("audios", lL);
      }
      lu["unbind"]("change", lA, this);
      if (ly) ly();
    }
  };
  var lC = window["currentGlobalAudios"];
  if (lC && lw["get"]("id") in lC) {
    lw = lC[lw["get"]("id")]["audio"];
    if (lw["get"]("state") != "playing") {
      lw["play"]();
    }
    return lw;
  }
  lu["bind"]("change", lA, this);
  var lD = lu["get"]("items")[lv];
  var lE = lD["get"]("class") == "PanoramaPlayListItem";
  if (lE) {
    var lF = lD["get"]("media");
    var lC = (lF["get"]("audios") || [])["slice"]();
    if (lw["get"]("class") == "MediaAudio") {
      var lG = this["rootPlayer"]["createInstance"]("PanoramaAudio");
      lG["set"]("autoplay", ![]);
      lG["set"]("audio", lw["get"]("audio"));
      lG["set"]("loop", lw["get"]("loop"));
      lG["set"]("id", lw["get"]("id"));
      this["cloneBindings"](lw, lG, "end");
      this["cloneBindings"](lw, lG, "stateChange");
      lw = lG;
    }
    lC["push"](lw);
    lF["set"]("audios", lC);
  }
  var lH = this["playGlobalAudio"](lw, lx, function () {
    lu["unbind"]("change", lA, this);
    if (ly) ly["call"](this);
  });
  if (lz === !![]) {
    var lI = function () {
      if (lH["get"]("state") == "playing") {
        this["pauseGlobalAudios"]([lH], !![]);
      } else if (lH["get"]("state") == "stopped") {
        this["resumeGlobalAudios"]();
        lH["unbind"]("stateChange", lI, this);
      }
    };
    lH["bind"]("stateChange", lI, this);
  }
  return lH;
};
TDV["Tour"]["Script"]["playGlobalAudio"] = function (lM, lN, lO, lP) {
  var lQ = function () {
    lM["unbind"]("end", lQ, this);
    this["stopGlobalAudio"](lM);
    if (lO) lO["call"](this);
  };
  lM = this["getGlobalAudio"](lM);
  var lR = window["currentGlobalAudios"];
  if (!lR) {
    lR = window["currentGlobalAudios"] = {};
  }
  lR[lM["get"]("id")] = { audio: lM, asBackground: lP || ![], allowResume: lN };
  if (lM["get"]("state") == "playing") {
    return lM;
  }
  if (!lM["get"]("loop")) {
    lM["bind"]("end", lQ, this);
  }
  lM["play"]();
  return lM;
};
TDV["Tour"]["Script"]["restartTourWithoutInteraction"] = function (lS) {
  var lT = -0x1;
  this["bind"]("userInteraction", lU["bind"](this), this);
  lU();
  function lU() {
    if (lT != -0x1) clearTimeout(lT);
    lT = setTimeout(
      function () {
        var lV = this["get"]("data")["tour"];
        if (lV) lV["reload"]();
      }["bind"](this),
      lS * 0x3e8
    );
  }
};
TDV["Tour"]["Script"]["resumePlayers"] = function (lW, lX) {
  for (var lY = 0x0; lY < lW["length"]; ++lY) {
    var lZ = lW[lY];
    var m0 = this["getMediaFromPlayer"](lZ);
    if (!m0) continue;
    if (lX && m0["get"]("class") != "Video360" && "pauseCamera" in lZ) {
      lZ["resumeCamera"]();
    } else if (lZ["get"]("state") != "playing") {
      var m1 = lZ["get"]("data");
      if (!m1) {
        m1 = {};
        lZ["set"]("data", m1);
      }
      m1["playing"] = !![];
      var m2 = function () {
        if (lZ["get"]("state") == "playing") {
          delete m1["playing"];
          lZ["unbind"]("stateChange", m2, this);
        }
      };
      lZ["bind"]("stateChange", m2, this);
      lZ["play"]();
    }
  }
};
TDV["Tour"]["Script"]["stopGlobalAudios"] = function (m3) {
  var m4 = window["currentGlobalAudios"];
  var m5 = this;
  if (m4) {
    Object["keys"](m4)["forEach"](function (m6) {
      var m7 = m4[m6];
      if (!m3 || (m3 && !m7["asBackground"])) {
        m5["stopGlobalAudio"](m7["audio"]);
      }
    });
  }
};
TDV["Tour"]["Script"]["stopGlobalAudio"] = function (m8) {
  var m9 = window["currentGlobalAudios"];
  if (m9) {
    var ma = m9[m8["get"]("id")];
    if (ma) {
      m8 = ma["audio"];
      delete m9[m8["get"]("id")];
      if (Object["keys"](m9)["length"] == 0x0) {
        window["currentGlobalAudios"] = undefined;
      }
    }
  }
  if (m8) m8["stop"]();
};
TDV["Tour"]["Script"]["setCameraSameSpotAsMedia"] = function (mb, mc) {
  var md = this["getCurrentPlayerWithMedia"](mc);
  if (md != undefined) {
    var me = mb["get"]("initialPosition");
    me["set"]("yaw", md["get"]("yaw"));
    me["set"]("pitch", md["get"]("pitch"));
    me["set"]("hfov", md["get"]("hfov"));
  }
};
TDV["Tour"]["Script"]["setComponentVisibility"] = function (
  mf,
  mg,
  mh,
  mi,
  mj,
  mk
) {
  var ml = this["getKey"]("keepVisibility_" + mf["get"]("id"));
  if (ml) return;
  this["unregisterKey"]("visibility_" + mf["get"]("id"));
  var mm = function () {
    if (mj) {
      mf["set"](mj, mi);
    }
    mf["set"]("visible", mg);
    if (mf["get"]("class") == "ViewerArea") {
      try {
        if (mg) mf["restart"]();
        else if (mf["get"]("playbackState") == "playing") mf["pause"]();
      } catch (mr) { }
    }
  };
  var mn = "effectTimeout_" + mf["get"]("id");
  if (!mk && window["hasOwnProperty"](mn)) {
    var mp = window[mn];
    if (mp instanceof Array) {
      for (var mq = 0x0; mq < mp["length"]; mq++) {
        clearTimeout(mp[mq]);
      }
    } else {
      clearTimeout(mp);
    }
    delete window[mn];
  } else if (mg == mf["get"]("visible") && !mk) return;
  if (mh && mh > 0x0) {
    var mp = setTimeout(function () {
      if (window[mn] instanceof Array) {
        var ms = window[mn];
        var mt = ms["indexOf"](mp);
        ms["splice"](mt, 0x1);
        if (ms["length"] == 0x0) {
          delete window[mn];
        }
      } else {
        delete window[mn];
      }
      mm();
    }, mh);
    if (window["hasOwnProperty"](mn)) {
      window[mn] = [window[mn], mp];
    } else {
      window[mn] = mp;
    }
  } else {
    mm();
  }
};
TDV["Tour"]["Script"]["setDirectionalPanoramaAudio"] = function (
  mu,
  mv,
  mw,
  mx
) {
  mu["set"]("yaw", mv);
  mu["set"]("pitch", mw);
  mu["set"]("maximumAngle", mx);
};
TDV["Tour"]["Script"]["setLocale"] = function (my) {
  this["stopTextToSpeech"]();
  var mz = this["get"]("data")["localeManager"];
  if (mz) this["get"]("data")["localeManager"]["setLocale"](my);
  else {
    this["get"]("data")["defaultLocale"] = my;
    this["get"]("data")["forceDefaultLocale"] = !![];
  }
};
TDV["Tour"]["Script"]["setEndToItemIndex"] = function (mA, mB, mC) {
  var mD = function () {
    if (mA["get"]("selectedIndex") == mB) {
      var mE = mA["get"]("items")[mC];
      this["skip3DTransitionOnce"](mE["get"]("player"));
      mA["set"]("selectedIndex", mC);
    }
  };
  this["executeFunctionWhenChange"](mA, mB, mD);
};
TDV["Tour"]["Script"]["setMapLocation"] = function (mF, mG) {
  var mH = function () {
    mF["unbind"]("stop", mH, this);
    mI["set"]("mapPlayer", null);
  };
  mF["bind"]("stop", mH, this);
  var mI = mF["get"]("player");
  mI["set"]("mapPlayer", mG);
};
TDV["Tour"]["Script"]["setMainMediaByIndex"] = function (mJ) {
  var mK = undefined;
  if (mJ >= 0x0 && mJ < this["mainPlayList"]["get"]("items")["length"]) {
    this["mainPlayList"]["set"]("selectedIndex", mJ);
    mK = this["mainPlayList"]["get"]("items")[mJ];
  }
  return mK;
};
TDV["Tour"]["Script"]["setMainMediaByName"] = function (mL) {
  var mM = this["getMainViewer"]();
  var mN = this["_getPlayListsWithViewer"](mM);
  for (var mO = 0x0, mP = mN["length"]; mO < mP; ++mO) {
    var mQ = mN[mO];
    var mR = mQ["get"]("items");
    for (var mS = 0x0, mT = mR["length"]; mS < mT; ++mS) {
      var mU = mR[mS];
      var mV = mU["get"]("media")["get"]("data");
      if (
        mV !== undefined &&
        mV["label"] == mL &&
        mU["get"]("player")["get"]("viewerArea") == mM
      ) {
        mQ["set"]("selectedIndex", mS);
        return mU;
      }
    }
  }
};
TDV["Tour"]["Script"]["executeAudioAction"] = function (
  mW,
  mX,
  mY,
  mZ,
  n0,
  n1
) {
  if (mW["length"] == 0x0) return;
  var n2, n3;
  var n4 = this["getMainViewer"]();
  if (mY && !(mY === !![])) {
    var n5 = this["getPlayListsWithMedia"](mY);
    for (var n6 = 0x0; n6 < n5["length"]; ++n6) {
      var n7 = n5[n6];
      var n9 = this["getPlayListItemByMedia"](n7, mY);
      if (
        n9 &&
        n9["get"]("player") &&
        n9["get"]("player")["get"]("viewerArea") == n4
      ) {
        n2 = n7;
        n3 = n2["get"]("items")["indexOf"](n9);
        break;
      }
    }
    if (!n2 && n5["length"] > 0x0) {
      n2 = n5[0x0];
      n3 = this["getPlayListItemIndexByMedia"](n2, mY);
    }
    if (!n2) mY = !![];
  }
  if (mY === !![]) {
    var na = this["getActiveMediaWithViewer"](n4);
    if (na) {
      n2 = this["getFirstPlayListWithMedia"](na, !![]);
      var n9 = this["getPlayListItemByMedia"](n2, na);
      n3 = n2["get"]("items")["indexOf"](n9);
    } else {
      mY = null;
    }
  }
  var nb = [];
  var nc = function () {
    var nk = nb["concat"]();
    var nl = ![];
    var nm = function (np) {
      var nq = np["source"]["get"]("state");
      if (nq == "playing") {
        if (!nl) {
          nl = !![];
          this["pauseGlobalAudios"](nb, !![]);
        }
      } else if (nq == "stopped") {
        nk["splice"](nk["indexOf"](np["source"]), 0x1);
        if (nk["length"] == 0x0) {
          this["resumeGlobalAudios"]();
        }
        np["source"]["unbind"]("stateChange", nm, this);
      }
    }["bind"](this);
    for (var nn = 0x0, no = nb["length"]; nn < no; ++nn) {
      nb[nn]["bind"]("stateChange", nm, this);
    }
  }["bind"](this);
  var nd = function () {
    for (var nr = 0x0, ns = mW["length"]; nr < ns; ++nr) {
      var nt = mW[nr];
      nb["push"](this["playGlobalAudio"](nt, mZ));
    }
    if (n0) nc();
  }["bind"](this);
  var ne = function () {
    for (var nu = 0x0, nv = mW["length"]; nu < nv; ++nu) {
      var nw = mW[nu];
      nb["push"](this["playGlobalAudioWhilePlay"](n2, n3, nw, mZ));
    }
    if (n0) nc();
  }["bind"](this);
  var nf = function () {
    for (var nx = 0x0, ny = mW["length"]; nx < ny; ++nx) {
      this["pauseGlobalAudio"](mW[nx]);
    }
  }["bind"](this);
  var ng = function () {
    for (var nz = 0x0, nA = mW["length"]; nz < nA; ++nz) {
      this["stopGlobalAudio"](mW[nz]);
    }
  }["bind"](this);
  var nh = function () {
    for (var nB = 0x0, nC = mW["length"]; nB < nC; ++nB) {
      if (this["getGlobalAudio"](mW[nB])["get"]("state") == "playing")
        return !![];
    }
    return ![];
  }["bind"](this);
  if (mX == "playPause" || mX == "playStop") {
    if (nh()) {
      if (mX == "playPause") {
        nf();
      } else if (mX == "playStop") {
        ng();
      }
    } else {
      if (n0) {
        if (mX == "playStop") {
          this["stopGlobalAudios"](!![]);
        }
      }
      if (n2) {
        ne();
      } else {
        nd();
      }
    }
  } else if (mX == "play") {
    if (n2 || mY === !![]) {
      if (n1) {
        var ni = n2
          ? n2["get"]("items")[n3]["get"]("player")
          : this["getActivePlayerWithViewer"](this["getMainViewer"]());
        if (ni && ni["pauseCamera"]) {
          var nj = mW["concat"]();
          endCallback = function (nD) {
            nj["splice"](nj["indexOf"](nD), 0x1);
            if (nj["length"] == 0x0) ni["resumeCamera"]();
          }["bind"](this);
          ni["pauseCamera"]();
        }
      }
      ne();
    } else {
      nd();
    }
  } else if (mX == "stop") {
    ng();
  } else if (mX == "pause") {
    nf();
  }
};
TDV["Tour"]["Script"]["executeAudioActionByTags"] = function (
  nE,
  nF,
  nG,
  nH,
  nI,
  nJ,
  nK
) {
  var nL = this["getAudioByTags"](nE, nF);
  this["executeAudioAction"](nL, nG, nH, nI, nJ, nK);
};
TDV["Tour"]["Script"]["setMediaBehaviour"] = function (nM, nN, nO, nP) {
  var nQ = this;
  var nR = function (oe) {
    if (oe["data"]["state"] == "stopped" && nP) {
      nV["call"](this, !![]);
    }
  };
  var nS = function () {
    o1["unbind"]("begin", nS, nQ);
    var of = o1["get"]("media");
    if (
      of["get"]("class") != "Panorama" ||
      (of["get"]("camera") != undefined &&
        of["get"]("camera")["get"]("initialSequence") != undefined)
    ) {
      o2["bind"]("stateChange", nR, nQ);
    }
  };
  var nT = function () {
    var og = nY["get"]("selectedIndex");
    if (og != -0x1) {
      o0 = og;
      nV["call"](this, ![]);
    }
  };
  var nU = function () {
    nV["call"](this, ![]);
  };
  var nV = function (oh) {
    if (!nY) return;
    var oi = o1["get"]("media");
    if (
      (oi["get"]("class") == "Video360" || oi["get"]("class") == "Video") &&
      oi["get"]("loop") == !![] &&
      !oh
    )
      return;
    nM["set"]("selectedIndex", -0x1);
    if (o9 && o8 != -0x1) {
      if (o9) {
        if (
          o8 > 0x0 &&
          o9["get"]("movements")[o8 - 0x1]["get"]("class") ==
          "TargetPanoramaCameraMovement"
        ) {
          var oj = oa["get"]("initialPosition");
          var ok = oj["get"]("yaw");
          var ol = oj["get"]("pitch");
          var om = oj["get"]("hfov");
          var on = o9["get"]("movements")[o8 - 0x1];
          var oo = on["get"]("targetYaw");
          var op = on["get"]("targetPitch");
          var oq = on["get"]("targetHfov");
          if (oo !== undefined) oj["set"]("yaw", oo);
          if (op !== undefined) oj["set"]("pitch", op);
          if (oq !== undefined) oj["set"]("hfov", oq);
          var or = function (ou) {
            oj["set"]("yaw", ok);
            oj["set"]("pitch", ol);
            oj["set"]("hfov", om);
            o4["unbind"]("end", or, this);
          };
          o4["bind"]("end", or, this);
        }
        o9["set"]("movementIndex", o8);
      }
    }
    if (o2) {
      o1["unbind"]("begin", nS, this);
      o2["unbind"]("stateChange", nR, this);
      for (var os = 0x0; os < ob["length"]; ++os) {
        ob[os]["unbind"]("click", nU, this);
      }
    }
    if (o7) {
      var ot = this["getMediaFromPlayer"](o2);
      if (
        (nY == this["mainPlayList"] || nY["get"]("items")["length"] > 0x1) &&
        (ot == undefined || ot == o1["get"]("media"))
      ) {
        nY["set"]("selectedIndex", o0);
      }
      if (nM != nY) nY["unbind"]("change", nT, this);
    } else {
      o5["set"]("visible", o6);
    }
    nY = undefined;
  };
  if (!nO) {
    var nW = nM["get"]("selectedIndex");
    var nX =
      nW != -0x1
        ? nM["get"]("items")[nM["get"]("selectedIndex")]["get"]("player")
        : this["getActivePlayerWithViewer"](this["getMainViewer"]());
    if (nX) {
      nO = this["getMediaFromPlayer"](nX);
    }
  }
  var nY = undefined;
  if (nO) {
    var nZ = this["getPlayListsWithMedia"](nO, !![]);
    if (nZ["indexOf"](nM) != -0x1) {
      nY = nM;
    } else if (nZ["indexOf"](this["mainPlayList"]) != -0x1) {
      nY = this["mainPlayList"];
    } else if (nZ["length"] > 0x0) {
      nY = nZ[0x0];
    }
  }
  if (!nY) {
    nM["set"]("selectedIndex", nN);
    return;
  }
  var o0 = nY["get"]("selectedIndex");
  var o1 = nM["get"]("items")[nN];
  var o2 = o1["get"]("player");
  var o3 = this["getMediaFromPlayer"](o2);
  if (
    (nM["get"]("selectedIndex") == nN && o3 == o1["get"]("media")) ||
    o0 == -0x1
  ) {
    return;
  }
  if (nM["get"]("selectedIndex") == nN && o3 != o1["get"]("media"))
    nM["set"]("selectedIndex", -0x1);
  var o4 = nY["get"]("items")[o0];
  var o5 = o2["get"]("viewerArea");
  var o6 = o5["get"]("visible");
  var o7 = o5 == o4["get"]("player")["get"]("viewerArea");
  if (o7) {
    if (nM != nY) {
      nY["set"]("selectedIndex", -0x1);
      nY["bind"]("change", nT, this);
    }
  } else {
    o5["set"]("visible", !![]);
  }
  var o8 = -0x1;
  var o9 = undefined;
  var oa = o4["get"]("camera");
  if (oa) {
    o9 = oa["get"]("initialSequence");
    if (o9) {
      o8 = o9["get"]("movementIndex");
    }
  }
  nM["set"]("selectedIndex", nN);
  var ob = [];
  var oc = function (ov) {
    var ow = o2["get"](ov);
    if (ow == undefined) return;
    if (Array["isArray"](ow)) ob = ob["concat"](ow);
    else ob["push"](ow);
  };
  oc("buttonStop");
  for (var od = 0x0; od < ob["length"]; ++od) {
    ob[od]["bind"]("click", nU, this);
  }
  o1["bind"]("begin", nS, nQ);
  this["executeFunctionWhenChange"](nM, nN, nP ? nU : undefined);
};
TDV["Tour"]["Script"]["setOverlayBehaviour"] = function (ox, oy, oz, oA) {
  var oB = function () {
    switch (oz) {
      case "triggerClick":
        this["triggerOverlay"](ox, "click");
        break;
      case "stop":
      case "play":
      case "pause":
        ox[oz]();
        break;
      case "togglePlayPause":
      case "togglePlayStop":
        if (ox["get"]("state") == "playing")
          ox[oz == "togglePlayPause" ? "pause" : "stop"]();
        else ox["play"]();
        break;
    }
    if (oA) {
      if (window["overlaysDispatched"] == undefined)
        window["overlaysDispatched"] = {};
      var oG = ox["get"]("id");
      window["overlaysDispatched"][oG] = !![];
      setTimeout(function () {
        delete window["overlaysDispatched"][oG];
      }, 0x3e8);
    }
  };
  if (
    oA &&
    window["overlaysDispatched"] != undefined &&
    ox["get"]("id") in window["overlaysDispatched"]
  )
    return;
  var oC = this["getFirstPlayListWithMedia"](oy, !![]);
  if (oC != undefined) {
    var oD = this["getPlayListItemByMedia"](oC, oy);
    var oE = oD["get"]("player");
    if (
      oC["get"]("items")["indexOf"](oD) != oC["get"]("selectedIndex") ||
      (this["isPanorama"](oD["get"]("media")) &&
        oE["get"]("rendererPanorama") != oD["get"]("media"))
    ) {
      var oF = function (oH) {
        oD["unbind"]("begin", oF, this);
        oB["call"](this);
      };
      oD["bind"]("begin", oF, this);
      return;
    }
  }
  oB["call"](this);
};
TDV["Tour"]["Script"]["setOverlaysVisibility"] = function (oI, oJ, oK) {
  var oL = "overlayEffects";
  var oM = undefined;
  var oN = this["getKey"](oL);
  if (!oN) {
    oN = {};
    this["registerKey"](oL, oN);
  }
  for (var oO = 0x0, oP = oI["length"]; oO < oP; ++oO) {
    var oQ = oI[oO];
    if (oK && oK > 0x0) {
      oN[oQ["get"]("id")] = setTimeout(oR["bind"](this, oQ), oK);
    } else {
      oR["call"](this, oQ);
    }
  }
  function oR(oS) {
    var oT = oS["get"]("id");
    var oU = oN[oT];
    if (oU) {
      clearTimeout(oU);
      delete oU[oT];
    }
    var oV = oJ == "toggle" ? !oS["get"]("enabled") : oJ;
    oS["set"]("enabled", oV);
    var oX = oS["get"]("data");
    if (oV && oX && "group" in oX) {
      var oY = this["getOverlaysByGroupname"](oX["group"]);
      for (var oZ = 0x0, p0 = oY["length"]; oZ < p0; ++oZ) {
        var p2 = oY[oZ];
        if (p2 != oS) p2["set"]("enabled", !oV);
      }
    }
    if (!oM) oM = this["getByClassName"]("AdjacentPanorama");
    for (var p3 = 0x0, p4 = oM["length"]; p3 < p4; ++p3) {
      var p5 = oM[p3];
      var oX = p5["get"]("data");
      if (!oX) continue;
      var p2 = this[oX["overlayID"]];
      if (p2 && p2 == oS) {
        p5["set"]("enabled", p2["get"]("enabled"));
      }
    }
  }
};
TDV["Tour"]["Script"]["setOverlaysVisibilityByTags"] = function (
  p6,
  p7,
  p8,
  p9,
  pa
) {
  var pb = p8
    ? this["getPanoramaOverlaysByTags"](p8, p6, p9)
    : this["getOverlaysByTags"](p6, p9);
  this["setOverlaysVisibility"](pb, p7, pa);
};
TDV["Tour"]["Script"]["setComponentsVisibilityByTags"] = function (
  pc,
  pd,
  pe,
  pf,
  pg
) {
  var ph = this["getComponentsByTags"](pc, pg);
  for (var pi = 0x0, pj = ph["length"]; pi < pj; ++pi) {
    var pk = ph[pi];
    if (pd == "toggle") pk["get"]("visible") ? pf(pk) : pe(pk);
    else pd ? pe(pk) : pf(pk);
  }
};
TDV["Tour"]["Script"]["setPanoramaCameraWithCurrentSpot"] = function (pl, pm) {
  var pn = this["getActiveMediaWithViewer"](pm || this["getMainViewer"]());
  if (
    pn != undefined &&
    (pn["get"]("class")["indexOf"]("Panorama") != -0x1 ||
      pn["get"]("class") == "Video360")
  ) {
    var po = pl["get"]("media");
    var pp = this["cloneCamera"](pl["get"]("camera"));
    this["setCameraSameSpotAsMedia"](pp, pn);
    this["startPanoramaWithCamera"](po, pp);
  }
};
TDV["Tour"]["Script"]["setPanoramaCameraWithSpot"] = function (
  pq,
  pr,
  ps,
  pt,
  pu
) {
  var pv = pq["get"]("selectedIndex");
  var pw = pq["get"]("items");
  var px = pr["get"]("player");
  if (pw[pv] == pr || px["get"]("rendererPanorama") == pr["get"]("media")) {
    if (ps === undefined) ps = px["get"]("yaw");
    if (pt === undefined) pt = px["get"]("pitch");
    if (pu === undefined) pu = px["get"]("hfov");
    px["moveTo"](ps, pt, px["get"]("roll"), pu);
  } else {
    var py = pr["get"]("media");
    var pz = this["cloneCamera"](pr["get"]("camera"));
    var pA = pz["get"]("initialPosition");
    if (ps !== undefined) pA["set"]("yaw", ps);
    if (pt !== undefined) pA["set"]("pitch", pt);
    if (pu !== undefined) pA["set"]("hfov", pu);
    this["startPanoramaWithCamera"](py, pz);
  }
};
TDV["Tour"]["Script"]["setSurfaceSelectionHotspotMode"] = function (pB) {
  var pC = this["getByClassName"]("HotspotPanoramaOverlay");
  var pD = this["getByClassName"]("PanoramaPlayer");
  var pE = pB == "hotspotEnabled";
  var pF = pB == "circleEnabled";
  var pG = !!pB;
  pC["forEach"](function (pH) {
    var pI = pH["get"]("data");
    if (pI && pI["hasPanoramaAction"] == !![])
      pH["set"]("enabledInSurfaceSelection", pE);
  });
  pD["forEach"](function (pJ) {
    pJ["set"]("adjacentPanoramaPositionsEnabled", pF);
    pJ["set"]("surfaceSelectionEnabled", pG);
  });
  this["get"]("data")["surfaceSelectionHotspotMode"] = pB;
};
TDV["Tour"]["Script"]["setValue"] = function (pK, pL, pM) {
  try {
    if ("set" in pK) pK["set"](pL, pM);
    else pK[pL] = pM;
  } catch (pN) { }
};
TDV["Tour"]["Script"]["setStartTimeVideo"] = function (pO, pP) {
  var pQ = this["getPlayListItems"](pO);
  var pR = [];
  var pS = function () {
    for (var pW = 0x0; pW < pQ["length"]; ++pW) {
      var pX = pQ[pW];
      pX["set"]("startTime", pR[pW]);
      pX["unbind"]("stop", pS, this);
    }
  };
  for (var pT = 0x0; pT < pQ["length"]; ++pT) {
    var pU = pQ[pT];
    var pV = pU["get"]("player");
    if (!pV) continue;
    if (pV["get"]("video") == pO && pV["get"]("state") == "playing") {
      pV["seek"](pP);
    } else {
      pR["push"](pU["get"]("startTime"));
      pU["set"]("startTime", pP);
      pU["bind"]("stop", pS, this);
    }
  }
};
TDV["Tour"]["Script"]["setStartTimeVideoSync"] = function (pY, pZ) {
  if (pY && pZ) this["setStartTimeVideo"](pY, pZ["get"]("currentTime"));
};
TDV["Tour"]["Script"]["skip3DTransitionOnce"] = function (q0) {
  if (q0 && q0["get"]("class") == "PanoramaPlayer") {
    var q1 = q0["get"]("viewerArea");
    if (q1 && q1["get"]("translationTransitionEnabled") == !![]) {
      var q2 = function () {
        q0["unbind"]("preloadMediaShow", q2, this);
        q1["set"]("translationTransitionEnabled", !![]);
      };
      q1["set"]("translationTransitionEnabled", ![]);
      q0["bind"]("preloadMediaShow", q2, this);
    }
  }
};
TDV["Tour"]["Script"]["shareSocial"] = function (q3, q4, q5, q6, q7, q8) {
  if (q4 == undefined) {
    q4 = location["href"]["split"](
      location["search"] || location["hash"] || /[?#]/
    )[0x0];
  }
  if (q5) {
    q4 += this["updateDeepLink"](q6, q7, ![]);
  }
  q4 = (function (qa) {
    switch (qa) {
      case "email":
        return "mailto:?body=" + encodeURIComponent(q4);
      case "facebook":
        var qb = q4["indexOf"]("?") != -0x1;
        q4 = q4["replace"]("#", "?");
        if (qb) {
          var qc = q4["lastIndexOf"]("?");
          q4 = q4["substring"](0x0, qc) + "&" + q4["substring"](qc + 0x1);
        }
        return (
          "https://www.facebook.com/sharer/sharer.php?u=" +
          encodeURIComponent(q4)
        );
      case "linkedin":
        return (
          "https://www.linkedin.com/shareArticle?mini=true&url=" +
          encodeURIComponent(q4)
        );
      case "pinterest":
        return "https://pinterest.com/pin/create/button/?url=" + q4;
      case "telegram":
        return "https://t.me/share/url?url=" + q4;
      case "twitter":
        return "https://twitter.com/intent/tweet?source=webclient&url=" + q4;
      case "whatsapp":
        return "https://api.whatsapp.com/send/?text=" + encodeURIComponent(q4);
      default:
        return q4;
    }
  })(q3);
  if (q8) {
    for (var q9 in q8) {
      q4 += "&" + q9 + "=" + q8[q9];
    }
  }
  if (q3 == "clipboard") this["copyToClipboard"](q4);
  else this["openLink"](q4, "_blank");
};
TDV["Tour"]["Script"]["showComponentsWhileMouseOver"] = function (
  qd,
  qe,
  qf,
  qg
) {
  var qh = function (ql) {
    for (var qm = 0x0, qn = qe["length"]; qm < qn; qm++) {
      var qo = qe[qm];
      if (!qg || qg(qo, ql)) qo["set"]("visible", ql);
    }
  };
  if (this["get"]("isMobile")) {
    qh["call"](this, !![]);
  } else {
    var qi = -0x1;
    var qj = function () {
      qh["call"](this, !![]);
      if (qi >= 0x0) clearTimeout(qi);
      qd["bind"]("rollOut", qk, this);
    };
    var qk = function () {
      var qp = function () {
        qh["call"](this, ![]);
      };
      qd["unbind"]("rollOut", qk, this);
      qi = setTimeout(qp["bind"](this), qf);
    };
    qd["bind"]("rollOver", qj, this);
  }
};
TDV["Tour"]["Script"]["showPopupMedia"] = function (qq, qr, qs, qt, qu, qv) {
  var qw = this;
  var qx = function () {
    window["resumeAudiosBlocked"] = ![];
    qs["set"]("selectedIndex", -0x1);
    qw["getMainViewer"]()["set"]("toolTipEnabled", !![]);
    this["resumePlayers"](qC, !![]);
    if (qB) {
      this["unbind"]("resize", qz, this);
    }
    qq["unbind"]("close", qx, this);
  };
  var qy = function () {
    qq["hide"]();
  };
  var qz = function () {
    var qD = function (qU) {
      return qq["get"](qU) || 0x0;
    };
    var qE = qw["get"]("actualWidth");
    var qF = qw["get"]("actualHeight");
    var qG = qw["getMediaWidth"](qr);
    var qH = qw["getMediaHeight"](qr);
    var qI = parseFloat(qt) / 0x64;
    var qJ = parseFloat(qu) / 0x64;
    var qK = qI * qE;
    var qL = qJ * qF;
    var qM = qD("footerHeight");
    var qN = qD("headerHeight");
    if (!qN) {
      var qO =
        qD("closeButtonIconHeight") +
        qD("closeButtonPaddingTop") +
        qD("closeButtonPaddingBottom");
      var qP =
        qw["getPixels"](qD("titleFontSize")) +
        qD("titlePaddingTop") +
        qD("titlePaddingBottom");
      qN = qO > qP ? qO : qP;
      qN += qD("headerPaddingTop") + qD("headerPaddingBottom");
    }
    var qQ =
      qK -
      qD("bodyPaddingLeft") -
      qD("bodyPaddingRight") -
      qD("paddingLeft") -
      qD("paddingRight");
    var qR =
      qL -
      qN -
      qM -
      qD("bodyPaddingTop") -
      qD("bodyPaddingBottom") -
      qD("paddingTop") -
      qD("paddingBottom");
    var qS = qQ / qR;
    var qT = qG / qH;
    if (qS > qT) {
      qK =
        qR * qT +
        qD("bodyPaddingLeft") +
        qD("bodyPaddingRight") +
        qD("paddingLeft") +
        qD("paddingRight");
    } else {
      qL =
        qQ / qT +
        qN +
        qM +
        qD("bodyPaddingTop") +
        qD("bodyPaddingBottom") +
        qD("paddingTop") +
        qD("paddingBottom");
    }
    if (qK > qE * qI) {
      qK = qE * qI;
    }
    if (qL > qF * qJ) {
      qL = qF * qJ;
    }
    qq["set"]("width", qK);
    qq["set"]("height", qL);
    qq["set"]("x", (qE - qD("actualWidth")) * 0.5);
    qq["set"]("y", (qF - qD("actualHeight")) * 0.5);
  };
  if (qv) {
    this["executeFunctionWhenChange"](qs, 0x0, qy);
  }
  var qA = qr["get"]("class");
  var qB = qA == "Video" || qA == "Video360";
  qs["set"]("selectedIndex", 0x0);
  if (qB) {
    this["bind"]("resize", qz, this);
    qz();
    qs["get"]("items")[0x0]["get"]("player")["play"]();
  } else {
    qq["set"]("width", qt);
    qq["set"]("height", qu);
  }
  window["resumeAudiosBlocked"] = !![];
  this["getMainViewer"]()["set"]("toolTipEnabled", ![]);
  var qC = this["pauseCurrentPlayers"](!![]);
  qq["bind"]("close", qx, this);
  qq["show"](this, !![]);
};
TDV["Tour"]["Script"]["showPopupImage"] = function (
  qV,
  qW,
  qX,
  qY,
  qZ,
  r0,
  r1,
  r2,
  r3,
  r4,
  r5,
  r6
) {
  var r7 = ![];
  var r8 = function () {
    rp["unbind"]("loaded", rb, this);
    rf["call"](this);
  };
  var r9 = function () {
    rp["unbind"]("click", r9, this);
    if (rt != undefined) {
      clearTimeout(rt);
    }
  };
  var ra = function () {
    setTimeout(rj, 0x0);
  };
  var rb = function () {
    this["unbind"]("click", r8, this);
    ro["set"]("visible", !![]);
    rj();
    rq["set"]("visible", !![]);
    rp["unbind"]("loaded", rb, this);
    rp["bind"]("resize", ra, this);
    rt = setTimeout(rc["bind"](this), 0xc8);
  };
  var rc = function () {
    rt = undefined;
    if (r2) {
      rp["bind"]("click", r9, this);
      re["call"](this);
    }
    rp["bind"]("userInteractionStart", rk, this);
    rp["bind"]("userInteractionEnd", rl, this);
    rp["bind"]("backgroundClick", rf, this);
    if (qW) {
      rp["bind"]("click", rh, this);
      rp["set"]("imageCursor", "hand");
    }
    rq["bind"]("click", rf, this);
    if (r5) r5["call"](this);
  };
  var rd = function () {
    if (r2 && rt) {
      clearTimeout(rt);
      rt = undefined;
    }
  };
  var re = function () {
    if (r2) {
      rd();
      rt = setTimeout(rf["bind"](this), r2);
    }
  };
  var rf = function () {
    this["getMainViewer"]()["set"]("toolTipEnabled", !![]);
    r7 = !![];
    if (rt) clearTimeout(rt);
    if (ru) clearTimeout(ru);
    if (r2) r9();
    if (r6) r6["call"](this);
    rp["set"]("visible", ![]);
    if (r0 && r0["get"]("duration") > 0x0) {
      r0["bind"]("end", rg, this);
    } else {
      rp["set"]("image", null);
    }
    rq["set"]("visible", ![]);
    ro["set"]("visible", ![]);
    this["unbind"]("click", r8, this);
    rp["unbind"]("backgroundClick", rf, this);
    rp["unbind"]("userInteractionStart", rk, this);
    rp["unbind"]("userInteractionEnd", rl, this, !![]);
    rp["unbind"]("resize", ra, this);
    if (qW) {
      rp["unbind"]("click", rh, this);
      rp["set"]("cursor", "default");
    }
    rq["unbind"]("click", rf, this);
    this["resumePlayers"](rs, r3 == null || r4);
    if (r4) {
      this["resumeGlobalAudios"]();
    }
    if (r3) {
      this["stopGlobalAudio"](r3);
    }
  };
  var rg = function () {
    rp["set"]("image", null);
    r0["unbind"]("end", rg, this);
  };
  var rh = function () {
    rp["set"]("image", ri() ? qV : qW);
  };
  var ri = function () {
    return rp["get"]("image") == qW;
  };
  var rj = function () {
    var rv =
      rp["get"]("actualWidth") -
      rp["get"]("imageLeft") -
      rp["get"]("imageWidth") +
      0xa;
    var rw = rp["get"]("imageTop") + 0xa;
    if (rv < 0xa) rv = 0xa;
    if (rw < 0xa) rw = 0xa;
    rq["set"]("right", rv);
    rq["set"]("top", rw);
  };
  var rk = function () {
    rd();
    if (ru) {
      clearTimeout(ru);
      ru = undefined;
    } else {
      rq["set"]("visible", ![]);
    }
  };
  var rl = function () {
    re["call"](this);
    if (!r7) {
      ru = setTimeout(rm, 0x12c);
    }
  };
  var rm = function () {
    ru = undefined;
    rq["set"]("visible", !![]);
    rj();
  };
  var rn = function (rx) {
    var ry = rx["get"]("data");
    if (ry && "extraLevels" in ry) {
      var rz = this["rootPlayer"]["createInstance"](rx["get"]("class"));
      var rA = ry["extraLevels"];
      for (var rB = 0x0; rB < rA["length"]; rB++) {
        var rC = rA[rB];
        if (typeof rC == "string") rA[rB] = this[rC["replace"]("this.", "")];
      }
      rz["set"]("levels", rx["get"]("levels")["concat"](rA));
      rx = rz;
    }
    return rx;
  };
  this["getMainViewer"]()["set"]("toolTipEnabled", ![]);
  var ro = this["veilPopupPanorama"];
  var rp = this["zoomImagePopupPanorama"];
  var rq = this["closeButtonPopupPanorama"];
  if (r1) {
    for (var rr in r1) {
      rq["set"](rr, r1[rr]);
    }
  }
  var rs = this["pauseCurrentPlayers"](r3 == null || !r4);
  if (r4) {
    this["pauseGlobalAudios"](null, !![]);
  }
  if (r3) {
    this["playGlobalAudio"](r3, !![]);
  }
  var rt = undefined;
  var ru = undefined;
  qV = rn["call"](this, qV);
  if (qW) qW = rn["call"](this, qW);
  rp["bind"]("loaded", rb, this);
  setTimeout(
    function () {
      this["bind"]("click", r8, this, ![]);
    }["bind"](this),
    0x0
  );
  rp["set"]("image", qV);
  rp["set"]("customWidth", qX);
  rp["set"]("customHeight", qY);
  rp["set"]("showEffect", qZ);
  rp["set"]("hideEffect", r0);
  rp["set"]("visible", !![]);
  return rp;
};
TDV["Tour"]["Script"]["showPopupPanoramaOverlay"] = function (
  rD,
  rE,
  rF,
  rG,
  rH,
  rI,
  rJ,
  rK
) {
  var rL = this["isCardboardViewMode"]();
  if (
    rD["get"]("visible") ||
    (!rL && this["zoomImagePopupPanorama"]["get"]("visible"))
  )
    return;
  this["getMainViewer"]()["set"]("toolTipEnabled", ![]);
  if (!rL) {
    var rM = this["zoomImagePopupPanorama"];
    var rN = rD["get"]("showDuration");
    var rO = rD["get"]("hideDuration");
    var rQ = this["pauseCurrentPlayers"](rI == null || !rJ);
    var rR = rD["get"]("popupMaxWidth");
    var rS = rD["get"]("popupMaxHeight");
    var rT = function () {
      var rX = function () {
        if (!this["isCardboardViewMode"]()) rD["set"]("visible", ![]);
      };
      rD["unbind"]("showEnd", rT, this);
      rD["set"]("showDuration", 0x1);
      rD["set"]("hideDuration", 0x1);
      this["showPopupImage"](
        rF,
        rG,
        rD["get"]("popupMaxWidth"),
        rD["get"]("popupMaxHeight"),
        null,
        null,
        rE,
        rH,
        rI,
        rJ,
        rX,
        rU
      );
    };
    var rU = function () {
      var rY = function () {
        rD["unbind"]("hideEnd", rY, this);
        if (rK) rK();
      };
      var rZ = function () {
        rD["unbind"]("showEnd", rZ, this);
        rD["bind"]("hideEnd", rY, this, !![]);
        rD["set"]("visible", ![]);
        rD["set"]("showDuration", rN);
        rD["set"]("popupMaxWidth", rR);
        rD["set"]("popupMaxHeight", rS);
      };
      this["resumePlayers"](rQ, rI == null || !rJ);
      var s0 = rM["get"]("imageWidth");
      var s1 = rM["get"]("imageHeight");
      rD["bind"]("showEnd", rZ, this, !![]);
      rD["set"]("showDuration", 0x1);
      rD["set"]("hideDuration", rO);
      rD["set"]("popupMaxWidth", s0);
      rD["set"]("popupMaxHeight", s1);
      if (rD["get"]("visible")) rZ();
      else rD["set"]("visible", !![]);
      this["getMainViewer"]()["set"]("toolTipEnabled", !![]);
      if (rK) rK();
    };
    rD["bind"]("showEnd", rT, this, !![]);
  } else {
    var rV = function () {
      this["resumePlayers"](rQ, rI == null || rJ);
      if (rJ) {
        this["resumeGlobalAudios"]();
      }
      if (rI) {
        this["stopGlobalAudio"](rI);
      }
      if (rG) {
        rD["set"]("image", rF);
        rD["unbind"]("click", rW, this);
      }
      rD["unbind"]("hideEnd", rV, this);
      this["getMainViewer"]()["set"]("toolTipEnabled", !![]);
      if (rK) rK();
    };
    var rW = function () {
      rD["set"]("image", rD["get"]("image") == rF ? rG : rF);
    };
    var rQ = this["pauseCurrentPlayers"](rI == null || !rJ);
    if (rJ) {
      this["pauseGlobalAudios"](null, !![]);
    }
    if (rI) {
      this["playGlobalAudio"](rI, !![]);
    }
    if (rG) rD["bind"]("click", rW, this);
    rD["bind"]("hideEnd", rV, this, !![]);
  }
  rD["set"]("visible", !![]);
};
TDV["Tour"]["Script"]["showPopupPanoramaVideoOverlay"] = function (
  s2,
  s3,
  s4,
  s5,
  s6
) {
  var s7 = ![];
  var s8 = function () {
    s2["unbind"]("showEnd", s8);
    sc["bind"]("click", sa, this);
    sb();
    sc["set"]("visible", !![]);
  }["bind"](this);
  var s9 = function () {
    s7 = !![];
    if (!s2["get"]("loop")) sa();
  }["bind"](this);
  var sa = function () {
    window["resumeAudiosBlocked"] = ![];
    this["getMainViewer"]()["set"]("toolTipEnabled", !![]);
    s2["set"]("visible", ![]);
    sc["set"]("visible", ![]);
    sc["unbind"]("click", sa, this);
    s2["unbind"]("end", s9, this);
    s2["unbind"]("hideEnd", sa, this, !![]);
    this["resumePlayers"](se, !![]);
    if (s4) {
      this["resumeGlobalAudios"]();
    }
    if (s5) s5();
    if (s6 && s7) s6();
  }["bind"](this);
  var sb = function () {
    var sf = 0xa;
    var sg = 0xa;
    sc["set"]("right", sf);
    sc["set"]("top", sg);
  }["bind"](this);
  this["getMainViewer"]()["set"]("toolTipEnabled", ![]);
  var sc = this["closeButtonPopupPanorama"];
  if (s3) {
    for (var sd in s3) {
      sc["set"](sd, s3[sd]);
    }
  }
  window["resumeAudiosBlocked"] = !![];
  var se = this["pauseCurrentPlayers"](!![]);
  if (s4) {
    this["pauseGlobalAudios"]();
  }
  s2["bind"]("end", s9, this, !![]);
  s2["bind"]("showEnd", s8, this, !![]);
  s2["bind"]("hideEnd", sa, this, !![]);
  s2["set"]("visible", !![]);
};
TDV["Tour"]["Script"]["showWindow"] = function (sh, si, sj) {
  if (sh["get"]("visible") == !![]) {
    return;
  }
  var sk = function () {
    this["getMainViewer"]()["set"]("toolTipEnabled", !![]);
    if (sj) {
      this["resumeGlobalAudios"]();
    }
    sl();
    this["resumePlayers"](so, !sj);
    sh["unbind"]("close", sk, this);
  };
  var sl = function () {
    sh["unbind"]("click", sl, this);
    if (sm != undefined) {
      clearTimeout(sm);
    }
  };
  var sm = undefined;
  if (si) {
    var sn = function () {
      sh["hide"]();
    };
    sh["bind"]("click", sl, this);
    sm = setTimeout(sn, si);
  }
  this["getMainViewer"]()["set"]("toolTipEnabled", ![]);
  if (sj) {
    this["pauseGlobalAudios"](null, !![]);
  }
  var so = this["pauseCurrentPlayers"](!sj);
  sh["bind"]("close", sk, this);
  sh["show"](this, !![]);
};
TDV["Tour"]["Script"]["startPanoramaWithCamera"] = function (sp, sq) {
  var sr = this["getByClassName"]("PlayList");
  if (sr["length"] == 0x0) return;
  var ss =
    window["currentPanoramasWithCameraChanged"] == undefined ||
    !(sp["get"]("id") in window["currentPanoramasWithCameraChanged"]);
  var st = [];
  for (var sv = 0x0, sw = sr["length"]; sv < sw; ++sv) {
    var sx = sr[sv];
    var sy = sx["get"]("items");
    for (var sz = 0x0, sA = sy["length"]; sz < sA; ++sz) {
      var sC = sy[sz];
      if (
        sC["get"]("media") == sp &&
        (sC["get"]("class") == "PanoramaPlayListItem" ||
          sC["get"]("class") == "Video360PlayListItem")
      ) {
        if (ss) {
          st["push"]({ camera: sC["get"]("camera"), item: sC });
        }
        sC["set"]("camera", sq);
      }
    }
  }
  if (st["length"] > 0x0) {
    if (window["currentPanoramasWithCameraChanged"] == undefined) {
      window["currentPanoramasWithCameraChanged"] = {};
    }
    var sD = sp["get"]("id");
    window["currentPanoramasWithCameraChanged"][sD] = st;
    var sE = function () {
      if (sD in window["currentPanoramasWithCameraChanged"]) {
        delete window["currentPanoramasWithCameraChanged"][sD];
      }
      for (var sG = 0x0; sG < st["length"]; sG++) {
        st[sG]["item"]["set"]("camera", st[sG]["camera"]);
        st[sG]["item"]["unbind"]("end", sE, this);
      }
    };
    for (var sv = 0x0; sv < st["length"]; sv++) {
      var sF = st[sv];
      var sC = sF["item"];
      this["skip3DTransitionOnce"](sC["get"]("player"));
      sC["bind"]("end", sE, this);
    }
  }
};
TDV["Tour"]["Script"]["stopAndGoCamera"] = function (sH, sI) {
  var sJ = sH["get"]("initialSequence");
  sJ["pause"]();
  var sK = function () {
    sJ["play"]();
  };
  setTimeout(sK, sI);
};
TDV["Tour"]["Script"]["syncPlaylists"] = function (sL) {
  var sM = function (sU, sV) {
    for (var sW = 0x0, sX = sL["length"]; sW < sX; ++sW) {
      var sY = sL[sW];
      if (sY != sV) {
        var sZ = sY["get"]("items");
        for (var t0 = 0x0, t1 = sZ["length"]; t0 < t1; ++t0) {
          if (sZ[t0]["get"]("media") == sU) {
            if (sY["get"]("selectedIndex") != t0) {
              sY["set"]("selectedIndex", t0);
            }
            break;
          }
        }
      }
    }
  };
  var sN = function (t2) {
    var t3 = t2["source"];
    var t4 = t3["get"]("selectedIndex");
    if (t4 < 0x0) return;
    var t5 = t3["get"]("items")[t4]["get"]("media");
    sM(t5, t3);
  };
  var sO = function (t6) {
    var t7 = t6["source"]["get"]("panoramaMapLocation");
    if (t7) {
      var t8 = t7["get"]("map");
      sM(t8);
    }
  };
  for (var sQ = 0x0, sS = sL["length"]; sQ < sS; ++sQ) {
    sL[sQ]["bind"]("change", sN, this);
  }
  var sT = this["getByClassName"]("MapPlayer");
  for (var sQ = 0x0, sS = sT["length"]; sQ < sS; ++sQ) {
    sT[sQ]["bind"]("panoramaMapLocation_change", sO, this);
  }
};
TDV["Tour"]["Script"]["translate"] = function (t9) {
  return this["get"]("data")["localeManager"]["trans"](t9);
};
TDV["Tour"]["Script"]["triggerOverlay"] = function (ta, tb) {
  if (ta["get"]("areas") != undefined) {
    var tc = ta["get"]("areas");
    for (var td = 0x0; td < tc["length"]; ++td) {
      tc[td]["trigger"](tb);
    }
  } else {
    ta["trigger"](tb);
  }
};
TDV["Tour"]["Script"]["updateDeepLink"] = function (te, tf, tg) {
  var th = this["mainPlayList"]["get"]("selectedIndex");
  var ti;
  var tj;
  if (th >= 0x0) {
    ti = "#media=" + (th + 0x1);
    tj = this["mainPlayList"]["get"]("items")[th]["get"]("media");
  } else {
    tj = this["getActiveMediaWithViewer"](this["getMainViewer"]());
    if (tj != undefined) {
      var tl = tj["get"]("data");
      if (tl) {
        ti = "#media-name=" + tl["label"];
      }
    }
  }
  if (tj) {
    if (te) {
      var tm = this["getActivePlayerWithViewer"](this["getMainViewer"]());
      if (tm && tm["get"]("class") == "PanoramaPlayer") {
        var tn = tm["get"]("yaw");
        var to = tm["get"]("pitch");
        if (!isNaN(tn) && !isNaN(to))
          ti += "&yaw=" + tn["toFixed"](0x2) + "&pitch=" + to["toFixed"](0x2);
      }
    }
    if (tf) {
      var tp = this["getOverlays"](tj);
      var tq = [];
      var tr = [];
      for (var ts = 0x0, tt = tp["length"]; ts < tt; ++ts) {
        var tu = tp[ts];
        var tv = tu["get"]("enabled");
        var tl = tu["get"]("data");
        if (tv === undefined || !tl || !tl["label"]) continue;
        var tw = encodeURIComponent(tl["label"]);
        var tx = tl["group"];
        if (tv != tl["defaultEnabledValue"]) {
          if (tv) {
            tq["push"](tw);
          } else if (!tx) {
            tr["push"](tw);
          }
        }
      }
      if (tq["length"] > 0x0) ti += "&son=" + tq["join"](",");
      if (tr["length"] > 0x0) ti += "&hon=" + tr["join"](",");
    }
  }
  if (ti && tg === !![]) {
    location["hash"] = ti;
  }
  return ti;
};
TDV["Tour"]["Script"]["updateMediaLabelFromPlayList"] = function (ty, tz, tA) {
  var tB = function () {
    var tD = ty["get"]("selectedIndex");
    if (tD >= 0x0) {
      var tE = function () {
        tH["unbind"]("begin", tE);
        tF(tD);
      };
      var tF = function (tI) {
        var tJ = tH["get"]("media");
        var tK = tJ["get"]("data");
        var tL = tK !== undefined ? tK["description"] : undefined;
        tG(tL);
      };
      var tG = function (tM) {
        if (tM !== undefined) {
          tz["set"](
            "html",
            "<div\x20style=\x22text-align:left\x22><SPAN\x20STYLE=\x22color:#FFFFFF;font-size:12px;font-family:Verdana\x22><span\x20color=\x22white\x22\x20font-family=\x22Verdana\x22\x20font-size=\x2212px\x22>" +
            tM +
            "</SPAN></div>"
          );
        } else {
          tz["set"]("html", "");
        }
        var tN = tz["get"]("html");
        tz["set"]("visible", tN !== undefined && tN);
      };
      var tH = ty["get"]("items")[tD];
      if (tz["get"]("html")) {
        tG("Loading...");
        tH["bind"]("begin", tE);
      } else {
        tF(tD);
      }
    }
  };
  var tC = function () {
    tz["set"]("html", undefined);
    ty["unbind"]("change", tB, this);
    tA["unbind"]("stop", tC, this);
  };
  if (tA) {
    tA["bind"]("stop", tC, this);
  }
  ty["bind"]("change", tB, this);
  tB();
};
TDV["Tour"]["Script"]["updateVideoCues"] = function (tO, tP) {
  var tQ = tO["get"]("items")[tP];
  var tR = tQ["get"]("media");
  if (tR["get"]("cues")["length"] == 0x0) return;
  var tS = tQ["get"]("player");
  var tT = [];
  var tU = function () {
    if (tO["get"]("selectedIndex") != tP) {
      tR["unbind"]("cueChange", tV, this);
      tO["unbind"]("change", tU, this);
    }
  };
  var tV = function (tW) {
    var tX = tW["data"]["activeCues"];
    for (var tY = 0x0, tZ = tT["length"]; tY < tZ; ++tY) {
      var u0 = tT[tY];
      if (
        tX["indexOf"](u0) == -0x1 &&
        (u0["get"]("startTime") > tS["get"]("currentTime") ||
          u0["get"]("endTime") < tS["get"]("currentTime") + 0.5)
      ) {
        u0["trigger"]("end");
      }
    }
    tT = tX;
  };
  tR["bind"]("cueChange", tV, this);
  tO["bind"]("change", tU, this);
};
TDV["Tour"]["Script"]["visibleComponentsIfPlayerFlagEnabled"] = function (
  u1,
  u2
) {
  var u3 = this["get"](u2);
  for (var u4 in u1) {
    u1[u4]["set"]("visible", u3);
  }
};
TDV["Tour"]["Script"]["quizStart"] = function () {
  var u5 = this["get"]("data")["quiz"];
  return u5 ? u5["start"]() : undefined;
};
TDV["Tour"]["Script"]["quizFinish"] = function () {
  var u6 = this["get"]("data")["quiz"];
  return u6 ? u6["finish"]() : undefined;
};
TDV["Tour"]["Script"]["quizPauseTimer"] = function () {
  var u7 = this["get"]("data")["quiz"];
  return u7 ? u7["pauseTimer"]() : undefined;
};
TDV["Tour"]["Script"]["quizResumeTimer"] = function () {
  var u8 = this["get"]("data")["quiz"];
  return u8 ? u8["continueTimer"]() : undefined;
};
TDV["Tour"]["Script"]["quizSetItemFound"] = function (u9) {
  var ua = this["get"]("data")["quiz"];
  if (ua) ua["setItemFound"](u9);
};
TDV["Tour"]["Script"]["quizShowQuestion"] = function (ub) {
  var uc = this["get"]("data");
  var ud = uc["quiz"];
  var ue;
  if (ud) {
    var uf = this["pauseCurrentPlayers"](!![]);
    var ug = this[ub];
    var uh;
    if (!ug["media"]) {
      uh = this["get"]("isMobile")
        ? {
          theme: {
            window: {
              height: undefined,
              maxHeight: this["get"]("actualHeight"),
              optionsContainer: { height: "100%" },
            },
          },
        }
        : {
          theme: {
            window: {
              width: "40%",
              height: undefined,
              maxHeight: 0x2bc,
              optionsContainer: { width: "100%" },
            },
          },
        };
    } else if (
      this["get"]("isMobile") &&
      this["get"]("orientation") == "landscape"
    ) {
      uh = {
        theme: {
          window: {
            bodyContainer: {
              layout: "horizontal",
              paddingLeft: 0x1e,
              paddingRight: 0x1e,
            },
            mediaContainer: { width: "60%", height: "100%" },
            buttonsContainer: { paddingLeft: 0x14, paddingRight: 0x14 },
            optionsContainer: {
              width: "40%",
              height: "100%",
              paddingLeft: 0x0,
              paddingRight: 0x0,
            },
          },
        },
      };
    }
    if (this["get"]("isMobile") && this["get"]("orientation") == "landscape") {
      var ui = this["get"]("data")["tour"]["getNotchValue"]();
      if (ui > 0x0) {
        uh = this["mixObject"](uh || {}, {
          theme: { window: { width: undefined, left: ui, right: ui } },
        });
      }
    }
    var uj =
      this["get"]("data")["textToSpeechConfig"]["speechOnQuizQuestion"] &&
      !!ug["title"];
    if (uj) this["textToSpeech"](ug["title"], ub);
    ue = ud["showQuestion"](ub, uh);
    ue["then"](
      function (uk) {
        if (uj) this["stopTextToSpeech"]();
        this["resumePlayers"](uf, !![]);
      }["bind"](this)
    );
  }
  return ue;
};
TDV["Tour"]["Script"]["quizShowScore"] = function (ul) {
  var um = this["get"]("data");
  var un = um["quiz"];
  if (un) {
    if (this["get"]("isMobile")) {
      ul = ul || {};
      ul = this["mixObject"](
        ul,
        um[
        this["get"]("orientation") == "portrait"
          ? "scorePortraitConfig"
          : "scoreLandscapeConfig"
        ]
      );
    }
    return un["showScore"](ul);
  }
};
TDV["Tour"]["Script"]["quizShowTimeout"] = function (uo, up) {
  var uq = this["get"]("data");
  var ur = uq["quiz"];
  if (ur) {
    if (this["get"]("isMobile")) {
      up = up || {};
      up = this["mixObject"](
        up,
        uq[
        this["get"]("orientation") == "portrait"
          ? "scorePortraitConfig"
          : "scoreLandscapeConfig"
        ]
      );
    }
    ur["showTimeout"](uo, up);
  }
};
TDV["Tour"]["Script"]["stopTextToSpeech"] = function (us) {
  if (
    window["speechSynthesis"] &&
    (us == undefined || this["t2sLastID"] == us)
  ) {
    var ut = window["speechSynthesis"];
    if (ut["speaking"]) {
      ut["cancel"]();
    }
    this["t2sLastID"] = undefined;
  }
};
TDV["Tour"]["Script"]["textToSpeech"] = function (uu, uv, uw) {
  if (this["get"]("mute")) {
    return;
  }
  var ux = this["get"]("data");
  var uy = ux["disableTTS"] || ![];
  if (uy) return;
  if ((uv != undefined && this["t2sLastID"] != uv) || uv == undefined) {
    uw = uw || 0x0;
    if (this["t2sLastID"] && uw > this["t2sLastPriority"]) {
      return;
    }
    var uz = ux["tour"];
    var uA = ux["textToSpeechConfig"];
    var uB = ux["localeManager"]["currentLocaleID"];
    if (window["speechSynthesis"]) {
      var uC = window["speechSynthesis"];
      if (uC["speaking"]) {
        uC["cancel"]();
      }
      var uD = new SpeechSynthesisUtterance(uu);
      if (uB) uD["lang"] = uB;
      var uE;
      if (uA) {
        uD["volume"] = uA["volume"];
        uD["pitch"] = uA["pitch"];
        uD["rate"] = uA["rate"];
        if (uA["stopBackgroundAudio"]) this["pauseGlobalAudios"](null, !![]);
      }
      uD["onend"] = function () {
        this["t2sLastID"] = null;
        if (uE) clearInterval(uE);
        if (uA["stopBackgroundAudio"]) this["resumeGlobalAudios"]();
      }["bind"](this);
      if (
        navigator["userAgent"]["indexOf"]("Chrome") != -0x1 &&
        !this["get"]("isMobile")
      ) {
        uE = setInterval(function () {
          uC["pause"]();
          uC["resume"]();
        }, 0xbb8);
      }
      uC["speak"](uD);
      this["t2sLastPriority"] = uw;
      this["t2sLastID"] = uv;
    } else if (uz["isMobileApp"]()) {
      if (!uz["isIOS"]()) {
        var uF = function (uG, uH) {
          var uI = { command: "tts", type: uG };
          if (uH) uI = this["mixObject"](uI, uH);
          android["sendJSON"](JSON["stringify"](uI));
        }["bind"](this);
        android["onTTSEnd"] = function () {
          this["t2sLastID"] = null;
          if (uA["stopBackgroundAudio"]) this["resumeGlobalAudios"]();
          android["onTTSEnd"] = undefined;
        }["bind"](this);
        uF("stop");
        if (uA) {
          uF("init", {
            volume: uA["volume"],
            pitch: uA["pitch"],
            rate: uA["rate"],
            language: uB,
          });
          if (uA["stopBackgroundAudio"]) this["pauseGlobalAudios"](null, !![]);
        }
        uF("play", { text: uu, androidCallback: "onTTSEnd" });
      } else {
        console["error"](
          "Text\x20to\x20Speech\x20isn\x27t\x20supported\x20on\x20this\x20browser"
        );
      }
    } else {
      console["error"](
        "Text\x20to\x20Speech\x20isn\x27t\x20supported\x20on\x20this\x20browser"
      );
    }
  }
};
TDV["Tour"]["Script"]["textToSpeechComponent"] = function (uJ) {
  var uK = uJ["get"]("class");
  var uL;
  if (uK == "HTMLText") {
    var uM = uJ["get"]("html");
    if (uM) {
      uL = this["htmlToPlainText"](uM, {
        linkProcess: function (uN, uO) {
          return uO;
        },
      });
    }
  } else if (uK == "BaseButton") {
    uL = uJ["get"]("label");
  } else if (uK == "Label") {
    uL = uJ["get"]("text");
  }
  if (uL) {
    this["textToSpeech"](uL, uJ["get"]("id"));
  }
};
TDV["Tour"]["Script"]["_initTTSTooltips"] = function () {
  function uP(uR) {
    var uS = uR["source"];
    this["textToSpeech"](uS["get"]("toolTip"), uS["get"]("id"), 0x1);
  }
  function uQ(uT) {
    var uU = uT["source"];
    this["stopTextToSpeech"](uU["get"]("id"));
  }
  setTimeout(
    function () {
      var uV = this["getByClassName"]("UIComponent");
      for (var uW = 0x0, uX = uV["length"]; uW < uX; ++uW) {
        var uY = uV[uW];
        var uZ = uY["get"]("toolTip");
        if (!!uZ || uY["get"]("class") == "ViewerArea") {
          uY["bind"]("toolTipShow", uP, this);
          uY["bind"]("toolTipHide", uQ, this);
        }
      }
    }["bind"](this),
    0x0
  );
};
TDV["Tour"]["Script"]["takeScreenshot"] = function (v0) {
  var v1 = this["getActivePlayerWithViewer"](v0);
  if (v1 && v1["get"]("class") == "PanoramaPlayer") v1["saveScreenshot"]();
};
TDV["Tour"]["Script"]["htmlToPlainText"] = function htmlToPlainText(v2, v3) {
  var v4 = function (vi, vj) {
    var vk = "";
    for (var vl = 0x0; vl < vj; vl += 0x1) {
      vk += vi;
    }
    return vk;
  };
  var v5 = null;
  var v6 = null;
  var v7 = "underline";
  var v8 = "indention";
  var v9 = "-";
  var va = 0x3;
  var vb = "-";
  var vc = ![];
  if (!!v3) {
    if (typeof v3["linkProcess"] === "function") {
      v5 = v3["linkProcess"];
    }
    if (typeof v3["imgProcess"] === "function") {
      v6 = v3["imgProcess"];
    }
    if (!!v3["headingStyle"]) {
      v7 = v3["headingStyle"];
    }
    if (!!v3["listStyle"]) {
      v8 = v3["listStyle"];
    }
    if (!!v3["uIndentionChar"]) {
      v9 = v3["uIndentionChar"];
    }
    if (!!v3["listIndentionTabs"]) {
      va = v3["listIndentionTabs"];
    }
    if (!!v3["oIndentionChar"]) {
      vb = v3["oIndentionChar"];
    }
    if (!!v3["keepNbsps"]) {
      vc = v3["keepNbsps"];
    }
  }
  var vd = v4(v9, va);
  var ve = String(v2)["replace"](/\n|\r/g, "\x20");
  const vf = ve["match"](/<\/body>/i);
  if (vf) {
    ve = ve["substring"](0x0, vf["index"]);
  }
  const vg = ve["match"](/<body[^>]*>/i);
  if (vg) {
    ve = ve["substring"](vg["index"] + vg[0x0]["length"], ve["length"]);
  }
  ve = ve["replace"](
    /<(script|style)( [^>]*)*>((?!<\/\1( [^>]*)*>).)*<\/\1>/gi,
    ""
  );
  ve = ve["replace"](
    /<(\/)?((?!h[1-6]( [^>]*)*>)(?!img( [^>]*)*>)(?!a( [^>]*)*>)(?!ul( [^>]*)*>)(?!ol( [^>]*)*>)(?!li( [^>]*)*>)(?!p( [^>]*)*>)(?!div( [^>]*)*>)(?!td( [^>]*)*>)(?!br( [^>]*)*>)[^>\/])[^<>]*>/gi,
    ""
  );
  ve = ve["replace"](/<img([^>]*)>/gi, function (vm, vn) {
    var vo = "";
    var vp = "";
    var vq = /src="([^"]*)"/i["exec"](vn);
    var vr = /alt="([^"]*)"/i["exec"](vn);
    if (vq !== null) {
      vo = vq[0x1];
    }
    if (vr !== null) {
      vp = vr[0x1];
    }
    if (typeof v6 === "function") {
      return v6(vo, vp);
    }
    if (vp === "") {
      return "![image]\x20(" + vo + ")";
    }
    return "![" + vp + "]\x20(" + vo + ")";
  });
  function vh() {
    return function (vs, vt, vu, vv) {
      var vw = 0x0;
      if (vu && /start="([0-9]+)"/i["test"](vu)) {
        vw = /start="([0-9]+)"/i["exec"](vu)[0x1] - 0x1;
      }
      var vx =
        "<p>" +
        vv["replace"](
          /<li[^>]*>(((?!<li[^>]*>)(?!<\/li>).)*)<\/li>/gi,
          function (vy, vz) {
            var vA = 0x0;
            var vB = vz["replace"](/(^|(<br \/>))(?!<p>)/gi, function () {
              if (vt === "o" && vA === 0x0) {
                vw += 0x1;
                vA += 0x1;
                return "<br\x20/>" + vw + v4(vb, va - String(vw)["length"]);
              }
              return "<br\x20/>" + vd;
            });
            return vB;
          }
        ) +
        "</p>";
      return vx;
    };
  }
  if (v8 === "linebreak") {
    ve = ve["replace"](/<\/?ul[^>]*>|<\/?ol[^>]*>|<\/?li[^>]*>/gi, "\x0a");
  } else if (v8 === "indention") {
    while (/<(o|u)l[^>]*>(.*)<\/\1l>/gi["test"](ve)) {
      ve = ve["replace"](
        /<(o|u)l([^>]*)>(((?!<(o|u)l[^>]*>)(?!<\/(o|u)l>).)*)<\/\1l>/gi,
        vh()
      );
    }
  }
  if (v7 === "linebreak") {
    ve = ve["replace"](/<h([1-6])[^>]*>([^<]*)<\/h\1>/gi, "\x0a$2\x0a");
  } else if (v7 === "underline") {
    ve = ve["replace"](/<h1[^>]*>(((?!<\/h1>).)*)<\/h1>/gi, function (vC, vD) {
      return (
        "\x0a&nbsp;\x0a" +
        vD +
        "\x0a" +
        v4("=", vD["length"]) +
        "\x0a&nbsp;\x0a"
      );
    });
    ve = ve["replace"](/<h2[^>]*>(((?!<\/h2>).)*)<\/h2>/gi, function (vE, vF) {
      return (
        "\x0a&nbsp;\x0a" +
        vF +
        "\x0a" +
        v4("-", vF["length"]) +
        "\x0a&nbsp;\x0a"
      );
    });
    ve = ve["replace"](
      /<h([3-6])[^>]*>(((?!<\/h\1>).)*)<\/h\1>/gi,
      function (vG, vH, vI) {
        return "\x0a&nbsp;\x0a" + vI + "\x0a&nbsp;\x0a";
      }
    );
  } else if (v7 === "hashify") {
    ve = ve["replace"](
      /<h([1-6])[^>]*>([^<]*)<\/h\1>/gi,
      function (vJ, vK, vL) {
        return "\x0a&nbsp;\x0a" + v4("#", vK) + "\x20" + vL + "\x0a&nbsp;\x0a";
      }
    );
  }
  ve = ve["replace"](
    /<br( [^>]*)*>|<p( [^>]*)*>|<\/p( [^>]*)*>|<div( [^>]*)*>|<\/div( [^>]*)*>|<td( [^>]*)*>|<\/td( [^>]*)*>/gi,
    "\x0a"
  );
  ve = ve["replace"](
    /<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a[^>]*>/gi,
    function (vM, vN, vO) {
      if (typeof v5 === "function") {
        return v5(vN, vO);
      }
      return "\x20[" + vO + "]\x20(" + vN + ")\x20";
    }
  );
  ve = ve["replace"](/\n[ \t\f]*/gi, "\x0a");
  ve = ve["replace"](/\n\n+/gi, "\x0a");
  if (vc) {
    ve = ve["replace"](/( |\t)+/gi, "\x20");
    ve = ve["replace"](/&nbsp;/gi, "\x20");
  } else {
    ve = ve["replace"](/( |&nbsp;|\t)+/gi, "\x20");
  }
  ve = ve["replace"](/\n +/gi, "\x0a");
  ve = ve["replace"](/^ +/gi, "");
  while (ve["indexOf"]("\x0a") === 0x0) {
    ve = ve["substring"](0x1);
  }
  if (
    ve["length"] === 0x0 ||
    ve["lastIndexOf"]("\x0a") !== ve["length"] - 0x1
  ) {
    ve += "\x0a";
  }
  return ve;
};
TDV["Tour"]["Script"]["openEmbeddedPDF"] = function (vP, vQ) {
  var vR = !!window["MSInputMethodContext"] && !!document["documentMode"];
  if (vR) {
    this["openLink"](vQ, "_blank");
    return;
  }
  var vS = vP["get"]("class");
  var vT = !new RegExp("^(?:[a-z]+:)?//", "i")["test"](vQ);
  if (vT && vS == "WebFrame") {
    var vU = location["origin"] + location["pathname"];
    vP["set"](
      "url",
      "lib/pdfjs/web/viewer.html?file=" +
      encodeURIComponent(
        vU["substring"](0x0, vU["lastIndexOf"]("/")) + "/" + vQ
      )
    );
  } else {
    var vV = location["origin"] == new URL(vQ)["origin"];
    var vW =
      "<iframe\x20\x20id=\x27googleViewer\x27\x20src=\x27https://docs.google.com/viewer?url=[url]&embedded=true\x27\x20width=\x27100%\x27\x20height=\x27100%\x27\x20frameborder=\x270\x27>" +
      "<p>This\x20browser\x20does\x20not\x20support\x20inline\x20PDFs.\x20Please\x20download\x20the\x20PDF\x20to\x20view\x20it:\x20<a\x20href=\x27[url]\x27>Download\x20PDF</a></p>" +
      "</iframe>";
    var vX = /^((?!chrome|android|crios|ipad|iphone).)*safari/i["test"](
      navigator["userAgent"]
    );
    var vY =
      "<div\x20id=\x22content\x22\x20style=\x22width:100%;height:100%;position:absolute;left:0;top:0;\x22></div>" +
      "<script\x20type=\x22text/javascript\x22>" +
      "!function(root,factory){\x22function\x22==typeof\x20define&&define.amd?define([],factory):\x22object\x22==typeof\x20module&&module.exports?module.exports=factory():root.PDFObject=factory()}(this,function(){\x22use\x20strict\x22;if(void\x200===window||void\x200===window.navigator||void\x200===window.navigator.userAgent||void\x200===window.navigator.mimeTypes)return!1;let\x20nav=window.navigator,ua=window.navigator.userAgent,isIE=\x22ActiveXObject\x22in\x20window,isModernBrowser=void\x200!==window.Promise,supportsPdfMimeType=void\x200!==nav.mimeTypes[\x22application/pdf\x22],isMobileDevice=void\x200!==nav.platform&&\x22MacIntel\x22===nav.platform&&void\x200!==nav.maxTouchPoints&&nav.maxTouchPoints>1||/Mobi|Tablet|Android|iPad|iPhone/.test(ua),isSafariDesktop=!isMobileDevice&&void\x200!==nav.vendor&&/Apple/.test(nav.vendor)&&/Safari/.test(ua),isFirefoxWithPDFJS=!(isMobileDevice||!/irefox/.test(ua))&&parseInt(ua.split(\x22rv:\x22)[1].split(\x22.\x22)[0],10)>18,createAXO=function(type){var\x20ax;try{ax=new\x20ActiveXObject(type)}catch(e){ax=null}return\x20ax},supportsPDFs=!isMobileDevice&&(isFirefoxWithPDFJS||supportsPdfMimeType||isIE&&!(!createAXO(\x22AcroPDF.PDF\x22)&&!createAXO(\x22PDF.PdfCtrl\x22))),embedError=function(msg,suppressConsole){return\x20suppressConsole||console.log(\x22[PDFObject]\x20\x22+msg),!1},emptyNodeContents=function(node){for(;node.firstChild;)node.removeChild(node.firstChild)},generatePDFJSMarkup=function(targetNode,url,pdfOpenFragment,PDFJS_URL,id,omitInlineStyles){emptyNodeContents(targetNode);let\x20fullURL=PDFJS_URL+\x22?file=\x22+encodeURIComponent(url)+pdfOpenFragment,div=document.createElement(\x22div\x22),iframe=document.createElement(\x22iframe\x22);return\x20iframe.src=fullURL,iframe.className=\x22pdfobject\x22,iframe.type=\x22application/pdf\x22,iframe.frameborder=\x220\x22,id&&(iframe.id=id),omitInlineStyles||(div.style.cssText=\x22position:\x20absolute;\x20top:\x200;\x20right:\x200;\x20bottom:\x200;\x20left:\x200;\x22,iframe.style.cssText=\x22border:\x20none;\x20width:\x20100%;\x20height:\x20100%;\x22,/*targetNode.style.position=\x22relative\x22,*/targetNode.style.overflow=\x22auto\x22),div.appendChild(iframe),targetNode.appendChild(div),targetNode.classList.add(\x22pdfobject-container\x22),targetNode.getElementsByTagName(\x22iframe\x22)[0]},embed=function(url,targetSelector,options){let\x20selector=targetSelector||!1,opt=options||{},id=\x22string\x22==typeof\x20opt.id?opt.id:\x22\x22,page=opt.page||!1,pdfOpenParams=opt.pdfOpenParams||{},fallbackLink=opt.fallbackLink||!0,width=opt.width||\x22100%\x22,height=opt.height||\x22100%\x22,assumptionMode=\x22boolean\x22!=typeof\x20opt.assumptionMode||opt.assumptionMode,forcePDFJS=\x22boolean\x22==typeof\x20opt.forcePDFJS&&opt.forcePDFJS,supportRedirect=\x22boolean\x22==typeof\x20opt.supportRedirect&&opt.supportRedirect,omitInlineStyles=\x22boolean\x22==typeof\x20opt.omitInlineStyles&&opt.omitInlineStyles,suppressConsole=\x22boolean\x22==typeof\x20opt.suppressConsole&&opt.suppressConsole,forceIframe=\x22boolean\x22==typeof\x20opt.forceIframe&&opt.forceIframe,PDFJS_URL=opt.PDFJS_URL||!1,targetNode=function(targetSelector){let\x20targetNode=document.body;return\x22string\x22==typeof\x20targetSelector?targetNode=document.querySelector(targetSelector):void\x200!==window.jQuery&&targetSelector\x20instanceof\x20jQuery&&targetSelector.length?targetNode=targetSelector.get(0):void\x200!==targetSelector.nodeType&&1===targetSelector.nodeType&&(targetNode=targetSelector),targetNode}(selector),fallbackHTML=\x22\x22,pdfOpenFragment=\x22\x22;if(\x22string\x22!=typeof\x20url)return\x20embedError(\x22URL\x20is\x20not\x20valid\x22,suppressConsole);if(!targetNode)return\x20embedError(\x22Target\x20element\x20cannot\x20be\x20determined\x22,suppressConsole);if(page&&(pdfOpenParams.page=page),pdfOpenFragment=function(pdfParams){let\x20prop,string=\x22\x22;if(pdfParams){for(prop\x20in\x20pdfParams)pdfParams.hasOwnProperty(prop)&&(string+=encodeURIComponent(prop)+\x22=\x22+encodeURIComponent(pdfParams[prop])+\x22&\x22);string&&(string=(string=\x22#\x22+string).slice(0,string.length-1))}return\x20string}(pdfOpenParams),forcePDFJS&&PDFJS_URL)return\x20generatePDFJSMarkup(targetNode,url,pdfOpenFragment,PDFJS_URL,id,omitInlineStyles);if(supportsPDFs||assumptionMode&&isModernBrowser&&!isMobileDevice){return\x20function(embedType,targetNode,targetSelector,url,pdfOpenFragment,width,height,id,omitInlineStyles){emptyNodeContents(targetNode);let\x20embed=document.createElement(embedType);if(embed.src=url+pdfOpenFragment,embed.className=\x22pdfobject\x22,embed.type=\x22application/pdf\x22,id&&(embed.id=id),!omitInlineStyles){let\x20style=\x22embed\x22===embedType?\x22overflow:\x20auto;\x22:\x22border:\x20none;\x22;targetSelector&&targetSelector!==document.body?style+=\x22width:\x20\x22+width+\x22;\x20height:\x20\x22+height+\x22;\x22:style+=\x22position:\x20absolute;\x20top:\x200;\x20right:\x200;\x20bottom:\x200;\x20left:\x200;\x20width:\x20100%;\x20height:\x20100%;\x22,embed.style.cssText=style}return\x20targetNode.classList.add(\x22pdfobject-container\x22),targetNode.appendChild(embed),targetNode.getElementsByTagName(embedType)[0]}(forceIframe||supportRedirect&&isSafariDesktop?\x22iframe\x22:\x22embed\x22,targetNode,targetSelector,url,pdfOpenFragment,width,height,id,omitInlineStyles)}return\x20PDFJS_URL?generatePDFJSMarkup(targetNode,url,pdfOpenFragment,PDFJS_URL,id,omitInlineStyles):(fallbackLink&&(fallbackHTML=\x22string\x22==typeof\x20fallbackLink?fallbackLink:\x22<p>This\x20browser\x20does\x20not\x20support\x20inline\x20PDFs.\x20Please\x20download\x20the\x20PDF\x20to\x20view\x20it:\x20<a\x20href=\x27[url]\x27>Download\x20PDF</a></p>\x22,targetNode.innerHTML=fallbackHTML.replace(/\x5c[url\x5c]/g,url)),embedError(\x22This\x20browser\x20does\x20not\x20support\x20embedded\x20PDFs\x22,suppressConsole))};return{embed:function(a,b,c){return\x20embed(a,b,c)},pdfobjectversion:\x222.2.3\x22,supportsPDFs:supportsPDFs}});" +
      "if\x20(typeof\x20module\x20===\x20\x22object\x22\x20&&\x20module.exports)\x20{" +
      "this.PDFObject\x20=\x20module.exports;" +
      "}" +
      "PDFObject.embed(\x22" +
      vQ +
      "\x22,\x20\x22#content\x22,\x20{" +
      (vV
        ? "\x22PDFJS_URL\x22:\x20\x22" +
        new URL("lib/pdfjs/web/viewer.html", document["baseURI"])["href"] +
        "\x22,\x20"
        : "") +
      "\x22fallbackLink\x22:\x20\x22" +
      vW +
      "\x22," +
      "\x22forcePDFJS\x22:\x20" +
      vX +
      "});" +
      "if(!PDFObject.supportsPDFs\x20&&\x20!" +
      vV +
      "){" +
      "\x20var\x20iframeTimerId;" +
      "\x20function\x20startTimer(){" +
      "\x20\x20\x20\x20iframeTimerId\x20=\x20window.setTimeout(checkIframeLoaded,\x202000);" +
      "\x20}" +
      "\x20function\x20checkIframeLoaded(){\x20\x20" +
      "\x20\x20\x20\x20var\x20iframe\x20=\x20document.getElementById(\x22googleViewer\x22);" +
      "\x20\x20\x20\x20iframe.src\x20=\x20iframe.src;" +
      "\x20\x20\x20\x20iframeTimerId\x20=\x20window.setTimeout(checkIframeLoaded,\x202000);" +
      "\x20}" +
      "\x20document.getElementById(\x22googleViewer\x22).addEventListener(\x22load\x22,\x20function(){" +
      "\x20\x20\x20clearInterval(iframeTimerId);\x20" +
      "\x20});" +
      "\x20startTimer();" +
      "}" +
      "</script>";
    if (vS == "WebFrame") {
      vP["set"](
        "url",
        "data:text/html;charset=utf-8," +
        encodeURIComponent(
          "<!DOCTYPE\x20html>" +
          "<html>" +
          "<head></head>" +
          "<body\x20style=\x22height:100%;width:100%;overflow:hidden;margin:0px;background-color:rgb(82,\x2086,\x2089);\x22>" +
          vY +
          "</body>" +
          "</html>"
        )
      );
    } else if (vS == "HTML") {
      vP["set"](
        "content",
        "data:text/html;charset=utf-8," + encodeURIComponent(vY)
      );
    }
  }
};
TDV["Tour"]["Script"]["getKey"] = function (vZ) {
  return window[vZ];
};
TDV["Tour"]["Script"]["registerKey"] = function (w0, w1) {
  window[w0] = w1;
};
TDV["Tour"]["Script"]["unregisterKey"] = function (w2) {
  delete window[w2];
};
TDV["Tour"]["Script"]["existsKey"] = function (w3) {
  return w3 in window;
};
//# sourceMappingURL=script_v2022.1.31.js.map
//Generated with v2022.1.31, Thu Dec 1 2022
