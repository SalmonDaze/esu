// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"instance.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Instance = void 0;

var Instance =
/** @class */
function () {
  function Instance(name, _a, _b, initState) {
    var initVX = _a.initVX,
        initVY = _a.initVY,
        initX = _a.initX,
        initY = _a.initY;
    var action = _b.action,
        paint = _b.paint;
    this.state = {};
    this.name = name;
    this._vx = initVX;
    this._vy = initVY;
    this._x = initX;
    this._y = initY;
    this.action = action;
    this.paint = paint;
    this.state = initState;
  }

  Instance.prototype.update = function (engine, time) {
    this.action(this, engine, time);
  };

  Instance.prototype.draw = function (engine) {
    this.paint(this, engine);
  };

  Object.defineProperty(Instance.prototype, "vx", {
    get: function get() {
      return this._vx;
    },
    set: function set(val) {
      this._vx = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Instance.prototype, "vy", {
    get: function get() {
      return this._vy;
    },
    set: function set(val) {
      this._vy = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Instance.prototype, "x", {
    get: function get() {
      return this._x;
    },
    set: function set(val) {
      this._x = val;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Instance.prototype, "y", {
    get: function get() {
      return this._y;
    },
    set: function set(val) {
      this._y = val;
    },
    enumerable: false,
    configurable: true
  });

  Instance.prototype.movement = function (vx, vy) {
    this.x += vx;
    this.y += vy;
  };

  return Instance;
}();

exports.Instance = Instance;
},{}],"engine.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Skeleton = void 0;

var instance_1 = require("./instance");

var Skeleton =
/** @class */
function () {
  function Skeleton(canvas, opts) {
    if (opts === void 0) {
      opts = {
        debug: false
      };
    }

    this.defer = 0;
    this.fps = 60;
    this.time = 0;
    this.startTime = 0;
    this.listeners = {};
    this.gameState = new Map();
    this.textureCache = new Map();
    this.instanceSet = new Map();
    var defaultOpts = {
      width: 800,
      height: 600
    };
    this.opts = __assign(__assign({}, defaultOpts), opts);
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
  }

  Skeleton.prototype.loadTexture = function (textureList, callback) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      var count = 0;
      textureList.forEach(function (_a) {
        var label = _a.label,
            url = _a.url;
        var img = new Image();
        img.src = url;

        img.onload = function () {
          _this.textureCache.set(label, {
            texture: img,
            status: true
          });

          typeof callback === "function" && callback(++count, textureList.length);
          count === textureList.length && resolve();
        };

        img.onerror = function () {
          reject(url + "\u8D44\u6E90\u83B7\u53D6\u5931\u8D25");
        };
      });
    });
  };

  Skeleton.prototype.setInstance = function (name, params, behavior, initState) {
    this.instanceSet.set(name, new instance_1.Instance(name, params, behavior, initState));
    return this;
  };

  Skeleton.prototype.setVariable = function (type, value) {
    if (Object.prototype.toString.call(type) === "[object Object]") {
      for (var _i = 0, _a = Object.entries(type); _i < _a.length; _i++) {
        var item = _a[_i];
        this.gameState[item[0]] = item[1];
      }
    } else {
      this.gameState[type] = value;
    }
  };

  Skeleton.prototype.getVariable = function (name, defaultValue) {
    return this.gameState[name] || (this.gameState[name] = defaultValue);
  };

  Skeleton.prototype.getTexture = function (name) {
    return this.textureCache[name];
  };

  Skeleton.prototype.showFps = function () {
    this.ctx.fillStyle = "red";
    this.ctx.font = "16px Arial";
    this.ctx.fillText("FPS: " + Math.round(+this.fps.toFixed()), 5, 40);
    this.defer++;

    if (this.defer > 20) {
      this.defer = 0;
      this.fps = this.lastTickTime ? 1000 / (this.tickTime - this.lastTickTime) : 60;
    }
  };

  Skeleton.prototype.tick = function () {
    this.lastTickTime = this.tickTime;
    this.tickTime = +new Date();
  };

  Skeleton.prototype.setInstanceState = function (name, key, value) {
    var instance = this.instanceSet.get(name);
    if (!instance) throw new Error("\u672A\u627E\u5230 " + name + " \u5B9E\u4F8B");
    instance.state[key] = value;
  };

  Skeleton.prototype.getInstance = function (name) {
    return this.instanceSet.get(name);
  };

  Skeleton.prototype.destoryInstance = function (name) {
    return this.instanceSet.delete(name);
  };

  Skeleton.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.opts.width, this.opts.height);
  };

  Skeleton.prototype.updateInstance = function () {
    var _this = this;

    this.instanceSet.forEach(function (instance) {
      instance.update(_this, _this.time);
    });
  };

  Skeleton.prototype.paintInstance = function () {
    var _this = this;

    this.instanceSet.forEach(function (instance) {
      instance.draw(_this);
    });
  };

  Skeleton.prototype.addEvent = function (type, listener) {
    var _this = this;

    document.addEventListener(type, function (e) {
      return listener(e, _this, _this.instanceSet);
    });
  };

  Skeleton.prototype.animate = function () {
    this.clear();
    this.tick();
    this.opts.debug && this.showFps();
    this.updateInstance();
    this.paintInstance();
    window.requestAnimationFrame(this.animate.bind(this)); // this.instanceSet.forEach((instance) => {
    //   typeof instance.texture === "function"
    //     ? instance.texture(this.ctx, instance)
    //     : this.ctx.drawImage(
    //         this.textureCache.get(instance.texture).texture,
    //         instance.x,
    //         instance.y
    //       );
    //   instance.movement(instance.vx, instance.vy);
    // });
  };

  Skeleton.prototype.startDraw = function () {
    this.startTime = +new Date();
    this.animate();
  };

  return Skeleton;
}();

exports.Skeleton = Skeleton;
},{"./instance":"instance.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var engine_1 = require("./engine");

(function () {
  return __awaiter(void 0, void 0, void 0, function () {
    function draw() {
      game.startDraw();
    }

    var canvas, ctx, game, textures, ballBehavior, pointerBehavior, i, id;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          canvas = document.querySelector("#canvas");
          ctx = canvas.getContext("2d");
          game = new engine_1.Skeleton(canvas, {
            debug: true
          });
          textures = [{
            label: "realDJH",
            url: "http://salmondaze.gitee.io/djhsm/assets/DJH.png"
          }, {
            label: "DJH",
            url: "https://t8.baidu.com/it/u=1484500186,1503043093&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1600403887&t=11b6956df493dd5eaba4d4c649829523"
          }, {
            label: "DJHcry",
            url: "https://t7.baidu.com/it/u=3204887199,3790688592&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1600403887&t=08e3a2384ee14f63629e4e64e6586d08"
          }, {
            label: "food",
            url: "https://t9.baidu.com/it/u=1307125826,3433407105&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1600403887&t=89240e9d675af2537322304ca56e67d5"
          }, {
            label: "mt",
            url: "https://t9.baidu.com/it/u=2268908537,2815455140&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1600403887&t=8fc552ca5c6c8cba5239ea0ff0bd29f1"
          }];
          return [4
          /*yield*/
          , game.loadTexture(textures, function (index, count) {
            console.log(index / count * 100 + "%");
          })];

        case 1:
          _a.sent();

          game.setVariable("count", 4000);
          game.addEvent('mousedown', function (e, engine, instanceSet) {
            console.log(e);
            var ball = game.getVariable('count');
            engine.setInstance("ball" + (ball + 1), {
              initVX: Math.ceil(Math.random() * 3),
              initVY: Math.ceil(Math.random() * 3),
              initX: e.offsetX,
              initY: e.offsetY
            }, ballBehavior, {
              color: "" + Math.floor(Number(Math.random() * 255)).toString(16) + Math.floor(Number(Math.random() * 255)).toString(16) + Math.floor(Number(Math.random() * 255)).toString(16)
            });
            game.setVariable('count', ball + 1);
          });
          game.addEvent('mousemove', function (e, engine, instanceSet) {
            var pointer = engine.getInstance('pointer');
            pointer.x = e.offsetX;
            pointer.y = e.offsetY;
          });
          ballBehavior = {
            action: function action(instance, engine, time) {
              var p = game.getInstance("pointer");
              if (instance.x > 790 || instance.x < 10) instance.vx = -instance.vx;
              if (instance.y > 590 || instance.y < 10) instance.vy = -instance.vy;

              if (p.x < instance.x + p.state.radius && p.x > instance.x - p.state.radius && p.y > instance.y - p.state.radius && p.y < instance.y + p.state.radius) {
                game.destoryInstance(instance.name);
                game.setInstanceState(p.name, 'radius', p.state.radius + 0.1);
                console.log("进来了");
              }

              instance.x += instance.vx;
              instance.y += instance.vy;
            },
            paint: function paint(instance, engine) {
              var ctx = engine.ctx;
              ctx.beginPath();
              ctx.fillStyle = instance.state.color;
              ctx.arc(instance.x, instance.y, 2, 0, Math.PI * 2, false);
              ctx.fill();
            }
          };
          pointerBehavior = {
            action: function action(instance, engine, time) {},
            paint: function paint(instance, engine) {
              var ctx = engine.ctx;
              ctx.beginPath();
              ctx.drawImg;
              ctx.fillStyle = instance.color;
              ctx.arc(instance.x, instance.y, instance.state.radius, 0, Math.PI * 2, false);
              ctx.fill();
            }
          };

          for (i = 0; i < game.getVariable('count'); i++) {
            game.setInstance("ball" + i, {
              initVX: Math.ceil(Math.random() * 3),
              initVY: Math.ceil(Math.random() * 3),
              initX: Math.floor(Math.random() * 750 + 30),
              initY: Math.floor(Math.random() * 550 + 30)
            }, ballBehavior, {
              radius: 1
            });
            game.setInstanceState("ball" + i, 'color', "" + Math.floor(Number(Math.random() * 255)).toString(16) + Math.floor(Number(Math.random() * 255)).toString(16) + Math.floor(Number(Math.random() * 255)).toString(16));
          }

          game.setInstance("pointer", {
            initVX: 0,
            initVY: 0,
            initX: 400,
            initY: 300
          }, pointerBehavior, {
            radius: 1
          });
          draw();
          return [2
          /*return*/
          ];
      }
    });
  });
})();
},{"./engine":"engine.ts"}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65350" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/engine.77de5100.js.map