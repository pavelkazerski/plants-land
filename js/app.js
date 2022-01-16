(() => {
  "use strict";
  const t = {};
  function e(t) {
    return t.filter(function (t, e, r) {
      return r.indexOf(t) === e;
    });
  }
  t.watcher = new (class {
    constructor(t) {
      (this.config = Object.assign({ logging: !0 }, t)),
        this.observer,
        !document.documentElement.classList.contains("watcher") &&
          this.scrollWatcherRun();
    }
    scrollWatcherUpdate() {
      this.scrollWatcherRun();
    }
    scrollWatcherRun() {
      document.documentElement.classList.add("watcher"),
        this.scrollWatcherConstructor(
          document.querySelectorAll("[data-watch]")
        );
    }
    scrollWatcherConstructor(t) {
      if (t.length) {
        this.scrollWatcherLogging(
          `Проснулся, слежу за объектами (${t.length})...`
        ),
          e(
            Array.from(t).map(function (t) {
              return `${
                t.dataset.watchRoot ? t.dataset.watchRoot : null
              }|${t.dataset.watchMargin ? t.dataset.watchMargin : "0px"}|${t.dataset.watchThreshold ? t.dataset.watchThreshold : 0}`;
            })
          ).forEach((e) => {
            let r = e.split("|"),
              n = { root: r[0], margin: r[1], threshold: r[2] },
              a = Array.from(t).filter(function (t) {
                let e = t.dataset.watchRoot ? t.dataset.watchRoot : null,
                  r = t.dataset.watchMargin ? t.dataset.watchMargin : "0px",
                  a = t.dataset.watchThreshold ? t.dataset.watchThreshold : 0;
                if (
                  String(e) === n.root &&
                  String(r) === n.margin &&
                  String(a) === n.threshold
                )
                  return t;
              }),
              i = this.getScrollWatcherConfig(n);
            this.scrollWatcherInit(a, i);
          });
      } else
        this.scrollWatcherLogging("Сплю, нет объектов для слежения. ZzzZZzz");
    }
    getScrollWatcherConfig(t) {
      let e = {};
      if (
        (document.querySelector(t.root)
          ? (e.root = document.querySelector(t.root))
          : "null" !== t.root &&
            this.scrollWatcherLogging(
              `Эмм... родительского объекта ${t.root} нет на странице`
            ),
        (e.rootMargin = t.margin),
        !(t.margin.indexOf("px") < 0 && t.margin.indexOf("%") < 0))
      ) {
        if ("prx" === t.threshold) {
          t.threshold = [];
          for (let e = 0; e <= 1; e += 0.005) t.threshold.push(e);
        } else t.threshold = t.threshold.split(",");
        return (e.threshold = t.threshold), e;
      }
      this.scrollWatcherLogging(
        "Ой ой, настройку data-watch-margin нужно задавать в PX или %"
      );
    }
    scrollWatcherCreate(t) {
      this.observer = new IntersectionObserver((t, e) => {
        t.forEach((t) => {
          this.scrollWatcherCallback(t, e);
        });
      }, t);
    }
    scrollWatcherInit(t, e) {
      this.scrollWatcherCreate(e), t.forEach((t) => this.observer.observe(t));
    }
    scrollWatcherIntersecting(t, e) {
      t.isIntersecting
        ? (!e.classList.contains("_watcher-view") &&
            e.classList.add("_watcher-view"),
          this.scrollWatcherLogging(
            `Я вижу ${e.classList}, добавил класс _watcher-view`
          ))
        : (e.classList.contains("_watcher-view") &&
            e.classList.remove("_watcher-view"),
          this.scrollWatcherLogging(
            `Я не вижу ${e.classList}, убрал класс _watcher-view`
          ));
    }
    scrollWatcherOff(t, e) {
      e.unobserve(t),
        this.scrollWatcherLogging(`Я перестал следить за ${t.classList}`);
    }
    scrollWatcherLogging(t) {
      this.config.logging &&
        (function (t) {
          setTimeout(() => {
            window.FLS && console.log(t);
          }, 0);
        })(`[Наблюдатель]: ${t}`);
    }
    scrollWatcherCallback(t, e) {
      const r = t.target;
      this.scrollWatcherIntersecting(t, r),
        r.hasAttribute("data-watch-once") &&
          t.isIntersecting &&
          this.scrollWatcherOff(r, e),
        document.dispatchEvent(
          new CustomEvent("watcherCallback", { detail: { entry: t } })
        );
    }
  })({});
  let r = !1;
  function n(t) {
    this.type = t;
  }
  setTimeout(() => {
    if (r) {
      let t = new Event("windowScroll");
      window.addEventListener("scroll", function (e) {
        document.dispatchEvent(t);
      });
    }
  }, 0),
    (n.prototype.init = function () {
      const t = this;
      (this.оbjects = []),
        (this.daClassname = "_dynamic_adapt_"),
        (this.nodes = document.querySelectorAll("[data-da]"));
      for (let t = 0; t < this.nodes.length; t++) {
        const e = this.nodes[t],
          r = e.dataset.da.trim().split(","),
          n = {};
        (n.element = e),
          (n.parent = e.parentNode),
          (n.destination = document.querySelector(r[0].trim())),
          (n.breakpoint = r[1] ? r[1].trim() : "767"),
          (n.place = r[2] ? r[2].trim() : "last"),
          (n.index = this.indexInParent(n.parent, n.element)),
          this.оbjects.push(n);
      }
      this.arraySort(this.оbjects),
        (this.mediaQueries = Array.prototype.map.call(
          this.оbjects,
          function (t) {
            return (
              "(" +
              this.type +
              "-width: " +
              t.breakpoint +
              "px)," +
              t.breakpoint
            );
          },
          this
        )),
        (this.mediaQueries = Array.prototype.filter.call(
          this.mediaQueries,
          function (t, e, r) {
            return Array.prototype.indexOf.call(r, t) === e;
          }
        ));
      for (let e = 0; e < this.mediaQueries.length; e++) {
        const r = this.mediaQueries[e],
          n = String.prototype.split.call(r, ","),
          a = window.matchMedia(n[0]),
          i = n[1],
          s = Array.prototype.filter.call(this.оbjects, function (t) {
            return t.breakpoint === i;
          });
        a.addListener(function () {
          t.mediaHandler(a, s);
        }),
          this.mediaHandler(a, s);
      }
    }),
    (n.prototype.mediaHandler = function (t, e) {
      if (t.matches)
        for (let t = 0; t < e.length; t++) {
          const r = e[t];
          (r.index = this.indexInParent(r.parent, r.element)),
            this.moveTo(r.place, r.element, r.destination);
        }
      else
        for (let t = e.length - 1; t >= 0; t--) {
          const r = e[t];
          r.element.classList.contains(this.daClassname) &&
            this.moveBack(r.parent, r.element, r.index);
        }
    }),
    (n.prototype.moveTo = function (t, e, r) {
      e.classList.add(this.daClassname),
        "last" === t || t >= r.children.length
          ? r.insertAdjacentElement("beforeend", e)
          : "first" !== t
          ? r.children[t].insertAdjacentElement("beforebegin", e)
          : r.insertAdjacentElement("afterbegin", e);
    }),
    (n.prototype.moveBack = function (t, e, r) {
      e.classList.remove(this.daClassname),
        void 0 !== t.children[r]
          ? t.children[r].insertAdjacentElement("beforebegin", e)
          : t.insertAdjacentElement("beforeend", e);
    }),
    (n.prototype.indexInParent = function (t, e) {
      const r = Array.prototype.slice.call(t.children);
      return Array.prototype.indexOf.call(r, e);
    }),
    (n.prototype.arraySort = function (t) {
      "min" === this.type
        ? Array.prototype.sort.call(t, function (t, e) {
            return t.breakpoint === e.breakpoint
              ? t.place === e.place
                ? 0
                : "first" === t.place || "last" === e.place
                ? -1
                : "last" === t.place || "first" === e.place
                ? 1
                : t.place - e.place
              : t.breakpoint - e.breakpoint;
          })
        : Array.prototype.sort.call(t, function (t, e) {
            return t.breakpoint === e.breakpoint
              ? t.place === e.place
                ? 0
                : "first" === t.place || "last" === e.place
                ? 1
                : "last" === t.place || "first" === e.place
                ? -1
                : e.place - t.place
              : e.breakpoint - t.breakpoint;
          });
    });
  new n("max").init();
  const a = document.querySelectorAll(".menu__list");
  function i() {
    document.querySelectorAll(".menu__link").forEach((t) => {
      event.target == t
        ? t.classList.contains("menu__link_active") ||
          t.classList.add("menu__link_active")
        : t.classList.contains("menu__link_active") &&
          t.classList.remove("menu__link_active");
    });
  }
  a &&
    a.forEach((t) => {
      t.addEventListener("click", function (t) {
        t.target.closest(".menu__link") && i();
      });
    });
  const s = document.querySelector(".header__mobile-search");
  s &&
    s.addEventListener("click", function () {
      document
        .querySelector(".search-header")
        .classList.toggle("search-header_active");
    }),
    (window.FLS = !0),
    (function (t) {
      let e = new Image();
      (e.onload = e.onerror =
        function () {
          t(2 == e.height);
        }),
        (e.src =
          "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA");
    })(function (t) {
      let e = !0 === t ? "webp" : "no-webp";
      document.documentElement.classList.add(e);
    });
})();
