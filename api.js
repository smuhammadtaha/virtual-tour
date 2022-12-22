var _this = this;
console.log(
  "This virtual tour is running a script powered by blaze IT (https://blazeit.sk). Created by Matej Murin <matej@blazeit.sk>, May 2021."
);
(() => {
  var __webpack_modules__ = {
      1305: (t, e, o) => {
        o(5332), o(1282);
      },
      5332: () => {
        function triggerComponentAction(payload, eventName) {
          var _this = this,
            action = eventName || "click",
            componentName = void 0;
          try {
            var executeBinding = function executeBinding(ctx) {
                return function () {
                  return eval(binding);
                }.call(ctx);
              },
              component = window.blazeIT.getComponent(payload);
            if (!component) return !1;
            componentName = component.get("data").name;
            var binding = window.blazeIT.getComponentClickBinding(component);
            if (!binding)
              return (
                window.blazeIT.logger.error(
                  'Error in triggerComponentAction: Action of type "'
                    .concat(action, '" was not found on component "')
                    .concat(componentName, '".')
                ),
                !1
              );
            executeBinding(_this);
          } catch (t) {
            return (
              window.blazeIT.logger.error(
                'Error in triggerComponentAction: Action of type "'
                  .concat(action, '" could not be triggered on component "')
                  .concat(componentName, '".')
              ),
              window.blazeIT.logger.error(t),
              !1
            );
          }
          return !0;
        }
        window.blazeIT.triggerComponentAction =
          triggerComponentAction.bind(_this);
      },
      1282: () => {
        window.blazeIT.triggerHotspotAction = function (t, e) {
          var o = e || "click",
            n = void 0;
          try {
            var r = window.blazeIT.getHotspot(t);
            if (!r) return !1;
            (n = r.get("data").label), this.triggerOverlay(r, o);
          } catch (t) {
            return (
              window.blazeIT.logger.error(
                'Error in triggerHotspotAction: Action of type "'
                  .concat(o, '" could not be triggered on hotspot "')
                  .concat(n, '".')
              ),
              window.blazeIT.logger.error(t),
              !1
            );
          }
          return !0;
        }.bind(_this);
      },
      1321: () => {
        window.blazeIT.getComponent = function (t) {
          if (!t)
            return (
              window.blazeIT.logger.error(
                "Error in getComponent: No argument was provided."
              ),
              null
            );
          var e = void 0,
            o = void 0;
          return (
            "string" == typeof t
              ? ((o = t), (e = window.blazeIT.getComponentByName(o)))
              : (o = (e = t).get("data").name),
            e
          );
        }.bind(_this);
      },
      4579: () => {
        function t(e) {
          return (t =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                })(e);
        }
        window.blazeIT.getComponentAttributes = function (e) {
          if (!e)
            return (
              window.blazeIT.logger.error(
                "Error in getComponentAttributes: No argument was provided."
              ),
              null
            );
          var o = window.blazeIT.getComponent(e);
          if (!o) return null;
          var n = Object.keys(o).find(function (e) {
            return "object" == t(o[e]) && !!o[e].class && !!o[e].id;
          });
          return n
            ? o[n]
            : (window.blazeIT.logger.error(
                "Error in getComponentAttributes: Could not retrieve the attributes. Please, check the attributes manually - retrieve the component in the Developer Console."
              ),
              null);
        }.bind(_this);
      },
      2682: () => {
        window.blazeIT.getComponentByName = function (t) {
          for (
            var e = this.getByClassName("UIComponent"), o = 0;
            o < e.length;
            o++
          ) {
            var n = e[o],
              r = n.get("data");
            if (r && r.name == t) return n;
          }
          return (
            window.blazeIT.logger.error(
              'Error in getComponentByName: Component "'.concat(
                t,
                '" was not found.'
              )
            ),
            null
          );
        }.bind(_this);
      },
      6423: () => {
        window.blazeIT.getComponentClickBinding = function (t, e) {
          var o = e || "click",
            n = window.blazeIT.getComponent(t);
          if (!n)
            return (
              window.blazeIT.logger.error(
                "Error in getComponentClickBinding: Component could not be retrieved."
              ),
              null
            );
          var r = n.getBindings(o);
          return 0 == r.length || "string" != typeof r[0] ? null : r[0];
        };
      },
      7072: () => {
        window.blazeIT.getComponents = function () {
          return this.getByClassName("UIComponent");
        }.bind(_this);
      },
      9199: () => {
        window.blazeIT.getComponentsByTag = function (t) {
          return t
            ? this.getByClassName("UIComponent")
                .filter(function (t) {
                  return !!t.get("data").tags;
                })
                .filter(function (e) {
                  return e.get("data").tags.includes(t);
                })
            : (window.blazeIT.logger.error(
                "Error in getComponentsByTag: No tag was provided."
              ),
              null);
        }.bind(_this);
      },
      7658: () => {
        window.blazeIT.hideComponent = function (t) {
          if (!t)
            return (
              window.blazeIT.logger.error(
                "Error in hideComponent: No argument was provided."
              ),
              !1
            );
          var e = window.blazeIT.getComponent(t);
          return !!e && (e.set("visible", !1), !0);
        }.bind(_this);
      },
      4936: (t, e, o) => {
        o(2682),
          o(1321),
          o(6423),
          o(7072),
          o(9199),
          o(4579),
          o(620),
          o(7658),
          o(3453);
      },
      620: () => {
        function t(e) {
          return (t =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                })(e);
        }
        window.blazeIT.setComponentAttributes = function (e, o) {
          if (!e)
            return (
              window.blazeIT.logger.error(
                "Error in setComponentAttributes: No argument was provided."
              ),
              !1
            );
          if (!o || "object" != t(o))
            return (
              window.blazeIT.logger.error(
                'Error in setComponentAttributes: Argument "attributes" was not provided or is not an object.'
              ),
              !1
            );
          var n = window.blazeIT.getComponent(e);
          return (
            !!n &&
            (Object.keys(o).forEach(function (t) {
              n.set(t, o[t]);
            }),
            !0)
          );
        }.bind(_this);
      },
      3453: () => {
        window.blazeIT.showComponent = function (t) {
          if (!t)
            return (
              window.blazeIT.logger.error(
                "Error in showComponent: No argument was provided."
              ),
              !1
            );
          var e = window.blazeIT.getComponent(t);
          return !!e && (e.set("visible", !0), !0);
        }.bind(_this);
      },
      2075: () => {
        window.blazeIT.getElementsByClass = function (t) {
          return this.getByClassName(t);
        }.bind(_this);
      },
      1894: (t, e, o) => {
        o(2075), o(9587), o(7138);
      },
      9587: () => {
        function t(e) {
          return (t =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                })(e);
        }
        window.blazeIT.isItemPanorama = function (e) {
          if (!e || "object" != t(e) || !e.get)
            return (
              window.blazeIT.logger.error(
                "Error in isItemPanorama: No valid item provided."
              ),
              !1
            );
          var o = e.get("class");
          return o
            ? ["Panorama", "LivePanorama", "HDRPanorama"].includes(o)
            : (window.blazeIT.logger.error(
                "Error in isItemPanorama: Item's class could not be obtained."
              ),
              !1);
        }.bind(_this);
      },
      7138: () => {
        function t(e) {
          return (t =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                })(e);
        }
        window.blazeIT.isPlayListItemPanorama = function (e) {
          if (!e || "object" != t(e) || !e.get)
            return (
              window.blazeIT.logger.error(
                "Error in isPlayListItemPanorama: No valid item provided."
              ),
              !1
            );
          var o = e.get("class");
          return o
            ? "PanoramaPlayListItem" == o
            : (window.blazeIT.logger.error(
                "Error in isPlayListItemPanorama: Item's class could not be obtained."
              ),
              !1);
        }.bind(_this);
      },
      3850: () => {
        window.blazeIT.getHotspot = function (t) {
          if (!t)
            return (
              window.blazeIT.logger.error(
                "Error in getHotspot: No argument was provided."
              ),
              null
            );
          var e = void 0,
            o = void 0;
          return (
            "string" == typeof t
              ? ((o = t), (e = window.blazeIT.getHotspotByName(o)))
              : (e = t),
            e
          );
        }.bind(_this);
      },
      7773: () => {
        function t(e) {
          return (t =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                })(e);
        }
        window.blazeIT.getHotspotAttributes = function (e, o) {
          if (!e)
            return (
              window.blazeIT.logger.error(
                "Error in getHotspotAttributes: No argument was provided."
              ),
              !1
            );
          var n = window.blazeIT.getHotspot(e);
          if (!n) return !1;
          var r = Object.keys(n).find(function (e) {
            return "object" == t(n[e]) && !!n[e].class && !!n[e].id;
          });
          return r
            ? n[r]
            : (window.blazeIT.logger.error(
                "Error in getHotspotAttributes: Could not retrieve the attributes. Please, check the attributes manually - retrieve the hotspot in the Developer Console."
              ),
              null);
        }.bind(_this);
      },
      699: () => {
        function t(e) {
          return (t =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                })(e);
        }
        window.blazeIT.getHotspotByName = function (e) {
          return e
            ? "string" != typeof e
              ? (window.blazeIT.logger.error(
                  'Error in getHotspotByName: Argument "hotspotName" is not a string.'
                ),
                null)
              : window.blazeIT.getHotspots().find(function (o) {
                  var n = o.get("data");
                  return !(!n || "object" != t(n)) && n.label == e;
                }) ||
                (window.blazeIT.logger.error(
                  'Error in getHotspotByName: Hotspot "'.concat(
                    e,
                    '" was not found.'
                  )
                ),
                null)
            : (window.blazeIT.logger.error(
                'Error in getHotspotByName: Argument "hotspotName" was not provided.'
              ),
              null);
        }.bind(_this);
      },
      8595: () => {
        window.blazeIT.getHotspotImageAttribute = function (t, e) {
          if (!t)
            return (
              window.blazeIT.logger.error(
                "Error in getHotspotImageAttribute: No argument was provided."
              ),
              null
            );
          if (!e || "string" != typeof e)
            return (
              window.blazeIT.logger.error(
                'Error in getHotspotImageAttribute: Argument "attribute" was not provided or is not a string.'
              ),
              null
            );
          var o = window.blazeIT.getHotspot(t);
          if (!o) return null;
          if ("HotspotPanoramaOverlay" != o.get("class"))
            return (
              window.blazeIT.logger.error(
                "Error in getHotspotImageAttribute: This function only supports hotspots with class 'HotspotPanoramaOverlay'. Attempted hotspot has a class '".concat(
                  o.get("class"),
                  "'."
                )
              ),
              null
            );
          var n = o.get("items").find(function (t) {
            return (t.get("data") || {}).label == o.get("data").label;
          });
          return n
            ? n.get(e)
            : (window.blazeIT.logger.error(
                "Error in getHotspotImageAttribute: Could not find an item within the hotspot."
              ),
              null);
        }.bind(_this);
      },
      3445: () => {
        window.blazeIT.getHotspots = function () {
          var t = this,
            e = t.getByClassName("Panorama");
          e = (e = (e = (e = e.concat(t.getByClassName("LivePanorama"))).concat(
            t.getByClassName("HDRPanorama")
          )).concat(t.getByClassName("Video360"))).concat(
            t.getByClassName("Map")
          );
          var o = [];
          return (
            e.forEach(function (e) {
              var n = t.getOverlays(e);
              o = o.concat(n);
            }),
            o
          );
        }.bind(_this);
      },
      2893: () => {
        window.blazeIT.getHotspotsByTag = function (t) {
          return t
            ? window.blazeIT
                .getHotspots()
                .filter(function (t) {
                  return !!t.get("data").tags;
                })
                .filter(function (e) {
                  return e.get("data").tags.includes(t);
                })
            : (window.blazeIT.logger.error(
                "Error in getHotspotsByTag: No tag was provided."
              ),
              null);
        }.bind(_this);
      },
      9503: () => {
        window.blazeIT.hideHotspot = function (t) {
          if (!t)
            return (
              window.blazeIT.logger.error(
                "Error in hideHotspot: No argument was provided."
              ),
              !1
            );
          var e = window.blazeIT.getHotspot(t);
          return (
            !!e &&
            (window.blazeIT.setHotspotAttributes(e, {
              opacity: 0,
              enabled: !1,
            }),
            !0)
          );
        }.bind(_this);
      },
      7462: (t, e, o) => {
        o(3445),
          o(699),
          o(3850),
          o(8595),
          o(2893),
          o(7773),
          o(7640),
          o(1566),
          o(9503),
          o(4832);
      },
      7640: () => {
        function t(e) {
          return (t =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                })(e);
        }
        window.blazeIT.setHotspotAttributes = function (e, o) {
          if (!e)
            return (
              window.blazeIT.logger.error(
                "Error in setHotspotAttributes: No argument was provided."
              ),
              !1
            );
          if (!o || "object" != t(o))
            return (
              window.blazeIT.logger.error(
                'Error in setHotspotAttributes: Argument "attributes" was not provided or is not an object.'
              ),
              !1
            );
          var n = window.blazeIT.getHotspot(e);
          return (
            !!n &&
            (Object.keys(o).forEach(function (t) {
              n.set(t, o[t]);
            }),
            !0)
          );
        }.bind(_this);
      },
      1566: () => {
        function t(e) {
          return (t =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                })(e);
        }
        window.blazeIT.setHotspotImageAttributes = function (e, o) {
          if (!e)
            return (
              window.blazeIT.logger.error(
                "Error in setHotspotImageAttributes: No argument was provided."
              ),
              !1
            );
          if (!o || "object" != t(o))
            return (
              window.blazeIT.logger.error(
                'Error in setHotspotImageAttributes: Argument "attributes" was not provided or is not an object.'
              ),
              !1
            );
          var n = window.blazeIT.getHotspot(e);
          return (
            !!n &&
            ("HotspotPanoramaOverlay" != n.get("class")
              ? (window.blazeIT.logger.error(
                  "Error in setHotspotImageAttributes: This function only supports hotspots with class 'HotspotPanoramaOverlay'. Attempted hotspot has a class '".concat(
                    n.get("class"),
                    "'. Retrieve the hospot by name and set the attributes manually using '.set(key, value)'."
                  )
                ),
                !1)
              : (Object.keys(o).forEach(function (t) {
                  n.get("items").forEach(function (e) {
                    e.set(t, o[t]);
                  });
                }),
                !0))
          );
        }.bind(_this);
      },
      4832: () => {
        window.blazeIT.showHotspot = function (t) {
          if (!t)
            return (
              window.blazeIT.logger.error(
                "Error in showHotspot: No argument was provided."
              ),
              !1
            );
          var e = window.blazeIT.getHotspot(t);
          return (
            !!e &&
            (window.blazeIT.setHotspotAttributes(e, {
              opacity: 1,
              enabled: !0,
            }),
            !0)
          );
        }.bind(_this);
      },
      4165: (t, e, o) => {
        o(1894), o(7462), o(4936), o(4974), o(7026), o(4963), o(1305);
      },
      4963: (t, e, o) => {
        o(10), o(7642), o(6769);
      },
      10: () => {
        window.blazeIT.navigateToPanorama = function (t) {
          var e = this;
          if (!t)
            return (
              window.blazeIT.logger.error(
                'Error in navigateToPanorama: Argument "panoramaName" was not provided.'
              ),
              !1
            );
          if (!window.blazeIT.getPanoramaByName(t)) return !1;
          var o = window.blazeIT.getPlayListItemByMediaName(t),
            n = window.blazeIT.getPlayListItemIndex(o),
            r = o.get("camera").get("initialPosition");
          return (
            e.setPanoramaCameraWithSpot(
              e.mainPlayList,
              o,
              r.get("yaw"),
              r.get("pitch"),
              r.get("hfov") || 110
            ),
            e.mainPlayList.set("selectedIndex", n),
            !0
          );
        }.bind(_this);
      },
      6769: () => {
        window.blazeIT.navigateToPanoramaPlayListItem = function (t) {
          var e = this;
          if (!t)
            return (
              window.blazeIT.logger.error(
                'Error in navigateToPanoramaPlayListItem: Argument "playListItem" was not provided.'
              ),
              !1
            );
          var o = window.blazeIT.getPlayListItemIndex(t);
          if (-1 == o) return !1;
          var n = t.get("camera");
          if (n) {
            var r = n.get("initialPosition");
            e.setPanoramaCameraWithSpot(
              e.mainPlayList,
              t,
              r.get("yaw"),
              r.get("pitch"),
              r.get("hfov") || 110
            );
          } else e.setPanoramaCameraWithSpot(e.mainPlayList, t);
          return e.mainPlayList.set("selectedIndex", o), !0;
        }.bind(_this);
      },
      7642: () => {
        window.blazeIT.navigateToPlayListItem = function (t) {
          if (!t)
            return (
              window.blazeIT.logger.error(
                'Error in navigateToPlayListItem: Argument "playListItem" was not provided.'
              ),
              !1
            );
          var e = window.blazeIT.getPlayListItemIndex(t);
          return (
            -1 != e &&
            (window.blazeIT.isPlayListItemPanorama(t)
              ? window.blazeIT.navigateToPanoramaPlayListItem(t)
              : this.mainPlayList.set("selectedIndex", e),
            !0)
          );
        }.bind(_this);
      },
      1628: () => {
        window.blazeIT.getCurrentMedia = function () {
          var t = this;
          try {
            var e = t.MainViewer || t.MainViewer_mobile || t.MainViewer_vr;
            return e
              ? t.getActiveMediaWithViewer(e)
              : (window.blazeIT.logger.error(
                  "Error in getCurrentMedia: Could not access the current viewer."
                ),
                null);
          } catch (t) {
            return (
              window.blazeIT.logger.error(
                "Error in getCurrentMedia: Could not retrieve current media."
              ),
              null
            );
          }
        }.bind(_this);
      },
      8024: () => {
        window.blazeIT.getPanoramaByName = function (t) {
          return t
            ? "string" != typeof t
              ? (window.blazeIT.logger.error(
                  'Error in getPanoramaByName: Argument "panoramaName" is not a string.'
                ),
                null)
              : this.getMediaByName(t) ||
                (window.blazeIT.logger.error(
                  'Error in getPanoramaByName: Panorama called "'.concat(
                    t,
                    '" was not found.'
                  )
                ),
                null)
            : (window.blazeIT.logger.error(
                'Error in getPanoramaByName: Argument "panoramaName" was not provided.'
              ),
              null);
        }.bind(_this);
      },
      4253: () => {
        window.blazeIT.getPanoramas = function () {
          var t = this,
            e = t.getByClassName("Panorama");
          return (e = e.concat(t.getByClassName("LivePanorama"))).concat(
            t.getByClassName("HDRPanorama")
          );
        }.bind(_this);
      },
      7026: (t, e, o) => {
        o(1628), o(8024), o(4253);
      },
      6487: () => {
        window.blazeIT.getCurrentPlayListItem = function () {
          var t = window.blazeIT.getCurrentMedia().get("id"),
            e = this.mainPlayList.get("items"),
            o = e.findIndex(function (e) {
              return e.get("media").get("id") == t;
            });
          return e[o];
        }.bind(_this);
      },
      4286: () => {
        window.blazeIT.getNextPanoramaPlayListItem = function () {
          for (
            var t = this.mainPlayList.get("items"),
              e = window.blazeIT.getCurrentPlayListItem(),
              o = window.blazeIT.getPlayListItemIndex(e),
              n = o == t.length - 1 ? 0 : o + 1,
              r = t[n],
              i = 0;
            !window.blazeIT.isPlayListItemPanorama(r);

          )
            if (
              ((r = t[(n = n == t.length - 1 ? 0 : o + 1)]), ++i > 2 * t.length)
            )
              return (
                window.blazeIT.logger.error(
                  "Error in getNextPanoramaPlayListItem: Could not obtain next panorama from the playlist."
                ),
                null
              );
          return r;
        }.bind(_this);
      },
      2041: () => {
        window.blazeIT.getNextPlayListItem = function () {
          var t = this.mainPlayList.get("items"),
            e = window.blazeIT.getCurrentPlayListItem(),
            o = window.blazeIT.getPlayListItemIndex(e);
          return t[o == t.length - 1 ? 0 : o + 1];
        }.bind(_this);
      },
      5684: () => {
        window.blazeIT.getPlayListItemByIndex = function (t) {
          if ("number" != typeof t)
            return (
              window.blazeIT.logger.error(
                'Error in getPlayListItemByIndex: Argument "playListItemIndex" was not provided.'
              ),
              null
            );
          var e = this.mainPlayList.get("items");
          return e[t]
            ? e[t]
            : (window.blazeIT.logger.error(
                'Error in getPlayListItemByIndex: There is no playlist item on index "'.concat(
                  t,
                  '".'
                )
              ),
              null);
        }.bind(_this);
      },
      4132: () => {
        window.blazeIT.getPlayListItemByMediaId = function (t) {
          if (!t)
            return (
              window.blazeIT.logger.error(
                'Error in getPlayListItemByMediaId: Argument "mediaId" was not provided.'
              ),
              null
            );
          var e = this.mainPlayList.get("items"),
            o = e.findIndex(function (e) {
              var o = e.get("media");
              if (!o) return !1;
              var n = o.get("id");
              return !!n && n == t;
            });
          return -1 == o
            ? (window.blazeIT.logger.error(
                'Error in getPlayListItemByMediaId: Playlist does not contain any item that has media ID "'.concat(
                  t,
                  '".'
                )
              ),
              null)
            : e[o];
        }.bind(_this);
      },
      4398: () => {
        window.blazeIT.getPlayListItemByMediaName = function (t) {
          if (!t)
            return (
              window.blazeIT.logger.error(
                'Error in getPlayListItemByMediaName: Argument "mediaName" was not provided.'
              ),
              null
            );
          var e = this.mainPlayList.get("items"),
            o = e.findIndex(function (e) {
              var o = e.get("media");
              if (!o) return !1;
              var n = o.get("data");
              return !!n && n.label == t;
            });
          return -1 == o
            ? (window.blazeIT.logger.error(
                'Error in getPlayListItemByMediaName: Playlist does not contain any item with media called "'.concat(
                  t,
                  '". Make sure the media name is spelled correctly. Also, names are case sensitive.'
                )
              ),
              null)
            : e[o];
        }.bind(_this);
      },
      6602: () => {
        function t(e) {
          return (t =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                })(e);
        }
        window.blazeIT.getPlayListItemIndex = function (e) {
          return e && "object" == t(e) && e.get && e.get("media")
            ? this.mainPlayList.get("items").findIndex(function (t) {
                return t.get("media").get("id") == e.get("media").get("id");
              })
            : (window.blazeIT.logger.error(
                'Error in getPlayListItemIndex: Argument "playListItem" was not provided or is not a PlayListItem instance.'
              ),
              -1);
        }.bind(_this);
      },
      6064: () => {
        window.blazeIT.getPlayListItems = function () {
          return this.mainPlayList.get("items");
        }.bind(_this);
      },
      7572: () => {
        window.blazeIT.getPreviousPanoramaPlayListItem = function () {
          for (
            var t = this.mainPlayList.get("items"),
              e = window.blazeIT.getCurrentPlayListItem(),
              o = window.blazeIT.getPlayListItemIndex(e),
              n = 0 == o ? t.length - 1 : o - 1,
              r = t[n],
              i = 0;
            !window.blazeIT.isPlayListItemPanorama(nextItem);

          )
            if (
              ((r = t[(n = 0 == n ? t.length - 1 : n - 1)]), ++i > 2 * t.length)
            )
              return (
                window.blazeIT.logger.error(
                  "Error in getPreviousPanoramaPlayListItem: Could not obtain next panorama from the playlist."
                ),
                null
              );
          return r;
        }.bind(_this);
      },
      7453: () => {
        window.blazeIT.getPreviousPlayListItem = function () {
          var t = this.mainPlayList.get("items"),
            e = window.blazeIT.getCurrentPlayListItem(),
            o = window.blazeIT.getPlayListItemIndex(e);
          return t[0 == o ? t.length - 1 : o - 1];
        }.bind(_this);
      },
      4974: (t, e, o) => {
        o(6602),
          o(6487),
          o(2041),
          o(7453),
          o(4286),
          o(7572),
          o(6064),
          o(4132),
          o(5684),
          o(4398);
      },
      5341: (t, e, o) => {
        o(6653), o(4165);
      },
      6872: () => {
        window.blazeIT || (window.blazeIT = {}),
          (window.blazeIT.options = {}),
          (window.blazeIT.version = { id: "JS LIBRARY", v: 422 }),
          (window.blazeIT.variables = {});
      },
      6653: (t, e, o) => {
        o(6872), o(2629), o(983);
      },
      2629: () => {
        window.blazeIT.init = function () {
          var t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
          window.blazeIT || (window.blazeIT = {}), (window.blazeIT.options = t);
        };
      },
      983: () => {
        var t = {
          log: function (t) {
            window.blazeIT.options.env &&
              window.blazeIT.options.env.toLowerCase();
          },
          error: function (t) {
            1 == window.blazeIT.options.logErrors && console.error(t);
          },
        };
        window.blazeIT.logger = t;
      },
    },
    __webpack_module_cache__ = {};
  function __webpack_require__(t) {
    if (__webpack_module_cache__[t]) return __webpack_module_cache__[t].exports;
    var e = (__webpack_module_cache__[t] = { exports: {} });
    return __webpack_modules__[t](e, e.exports, __webpack_require__), e.exports;
  }
  __webpack_require__(5341);
})();
