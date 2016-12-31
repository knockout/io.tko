"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 API converts the `opine`-flavoured documentation here.

 Here is a sample:
*/
// /*---
//  purpose: knockout-wide settings
//  */
// var settings = { /*...*/ }

var API = function () {
  function API(spec) {
    _classCallCheck(this, API);

    this.type = spec.type;
    this.name = spec.name;
    this.source = spec.source;
    this.line = spec.line;
    this.purpose = spec.vars.purpose;
    this.spec = spec.vars.params;
    this.url = this.buildUrl(spec.source, spec.line);
  }

  _createClass(API, [{
    key: "buildUrl",
    value: function buildUrl(source, line) {
      return "" + API.urlRoot + source + "#L" + line;
    }
  }]);

  return API;
}();

API.urlRoot = "https://github.com/knockout/knockout/blob/master/";

API.items = ko.observableArray();

API.add = function (token) {
  console.log("T", token);
  API.items.push(new API(token));
};
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Documentation = function Documentation(template, title, category, subcategory) {
  _classCallCheck(this, Documentation);

  this.template = template;
  this.title = title;
  this.category = category;
  this.subcategory = subcategory;
};

Documentation.categoriesMap = {
  1: "Getting started",
  2: "Observables",
  3: "Bindings and Components",
  4: "Bindings included",
  5: "Further information"
};

Documentation.fromNode = function (i, node) {
  return new Documentation(node.getAttribute('id'), node.getAttribute('data-title'), node.getAttribute('data-cat'), node.getAttribute('data-subcat'));
};

Documentation.initialize = function () {
  Documentation.all = $.makeArray($("[data-kind=documentation]").map(Documentation.fromNode));
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Example = function () {
  function Example() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Example);

    var debounce = { timeout: 500, method: "notifyWhenChangesStop" };
    this.javascript = ko.observable(state.javascript).extend({ rateLimit: debounce });
    this.html = ko.observable(state.html).extend({ rateLimit: debounce });
    this.css = state.css || '';

    this.finalJavascript = ko.pureComputed(this.computeFinalJs, this);
  }

  // Add ko.applyBindings as needed; return Error where appropriate.


  _createClass(Example, [{
    key: "computeFinalJs",
    value: function computeFinalJs() {
      var js = this.javascript();
      if (!js) {
        return new Error("The script is empty.");
      }
      if (js.indexOf('ko.applyBindings(') === -1) {
        if (js.indexOf(' viewModel =') !== -1) {
          // We guess the viewModel name ...
          return js + "\n\n/* Automatically Added */\n          ko.applyBindings(viewModel);";
        } else {
          return new Error("ko.applyBindings(view) is not called");
        }
      }
      return js;
    }
  }]);

  return Example;
}();

Example.stateMap = new Map();

Example.get = function (name) {
  var state = Example.stateMap.get(name);
  if (!state) {
    state = new Example(name);
    Example.stateMap.set(name, state);
  }
  return state;
};

Example.set = function (name, state) {
  var example = Example.stateMap.get(name);
  if (example) {
    example.javascript(state.javascript);
    example.html(state.html);
    return;
  }
  Example.stateMap.set(name, new Example(state));
};
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*globals Example */
/* eslint no-unused-vars: 0, camelcase:0*/

var EXTERNAL_INCLUDES = ["https://cdn.rawgit.com/knockout/tko/v4.0.0-alpha1/dist/ko.js"];

var LiveExampleComponent = function () {
  function LiveExampleComponent(params) {
    _classCallCheck(this, LiveExampleComponent);

    if (params.id) {
      this.example = Example.get(ko.unwrap(params.id));
    }
    if (params.base64) {
      var opts = this.example = new Example(JSON.parse(atob(params.base64)));
    }
    if (!this.example) {
      throw new Error("Example must be provided by id or base64 parameter");
    }
  }

  _createClass(LiveExampleComponent, [{
    key: "openCommonSettings",
    value: function openCommonSettings() {
      var ex = this.example;
      var dated = new Date().toLocaleString();
      var jsPrefix = "/**\n * Created from an example on the Knockout website\n * on " + new Date().toLocaleString() + "\n **/\n\n /** Example is as follows **/\n";
      return {
        html: ex.html(),
        js: jsPrefix + ex.finalJavascript(),
        title: "From Knockout example",
        description: "Created on " + dated
      };
    }
  }, {
    key: "openFormInNewWindow",
    value: function openFormInNewWindow(url, $fields) {
      var w = window.open("about:blank");
      var $form = $("<form action=\"" + url + "\" method=\"POST\"> </form>");
      $form.append($fields);
      w.document.write($form[0].outerHTML);
      w.document.forms[0].submit();
    }
  }, {
    key: "openFiddle",
    value: function openFiddle(self, evt) {
      // See: http://doc.jsfiddle.net/api/post.html
      evt.preventDefault();
      evt.stopPropagation();
      var fields = ko.utils.extend({
        dtd: "HTML 5",
        wrap: 'l',
        resources: EXTERNAL_INCLUDES.join(",")
      }, this.openCommonSettings());
      this.openFormInNewWindow("http://jsfiddle.net/api/post/library/pure/", $.map(fields, function (v, k) {
        return $("<input type='hidden' name='" + k + "'>").val(v);
      }));
    }
  }, {
    key: "openPen",
    value: function openPen(self, evt) {
      // See: http://blog.codepen.io/documentation/api/prefill/
      evt.preventDefault();
      evt.stopPropagation();
      var opts = ko.utils.extend({
        js_external: EXTERNAL_INCLUDES.join(";")
      }, this.openCommonSettings());
      var dataStr = JSON.stringify(opts).replace(/"/g, "&quot;").replace(/'/g, "&apos;");

      this.openFormInNewWindow("http://codepen.io/pen/define", $("<input type='hidden' name='data' value='" + dataStr + "'/>"));
    }
  }]);

  return LiveExampleComponent;
}();

ko.components.register('live-example', {
  viewModel: LiveExampleComponent,
  template: { element: "live-example" }
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*global Page, Documentation, marked, Search, PluginManager */
/*eslint no-unused-vars: 0*/

var Page = function () {
  function Page() {
    _classCallCheck(this, Page);

    // --- Main body template id ---
    this.body = ko.observable();
    this.title = ko.observable();
    this.body.subscribe(this.onBodyChange, this);

    // --- footer links/cdn ---
    this.links = window.links;
    this.cdn = window.cdn;

    // --- static info ---
    this.plugins = new PluginManager();
    this.books = ko.observableArray([]);

    // --- documentation ---
    this.docCatMap = new Map();
    Documentation.all.forEach(function (doc) {
      var cat = Documentation.categoriesMap[doc.category];
      var docList = this.docCatMap.get(cat);
      if (!docList) {
        docList = [];
        this.docCatMap.set(cat, docList);
      }
      docList.push(doc);
    }, this);

    // Sort the documentation items
    function sorter(a, b) {
      return a.title.localeCompare(b.title);
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.docCatMap.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var list = _step.value;
        list.sort(sorter);
      }

      // docCats: A sorted list of the documentation sections
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    this.docCats = Object.keys(Documentation.categoriesMap).sort().map(function (v) {
      return Documentation.categoriesMap[v];
    });

    // --- searching ---
    this.search = new Search();

    // --- page loading status ---
    // applicationCache progress
    this.reloadProgress = ko.observable();
    this.cacheIsUpdated = ko.observable(false);

    // page loading error
    this.errorMessage = ko.observable();

    // Preference for non-Single Page App
    var ls = window.localStorage;
    this.noSPA = ko.observable(Boolean(ls && ls.getItem('noSPA')));
    this.noSPA.subscribe(function (v) {
      return ls && ls.setItem('noSPA', v || "");
    });
  }

  _createClass(Page, [{
    key: 'pathToTemplate',
    value: function pathToTemplate(path) {
      return path.split('/').pop().replace('.html', '');
    }
  }, {
    key: 'open',
    value: function open(pinpoint) {
      console.log(" 📰  " + this.pathToTemplate(pinpoint));
      this.body(this.pathToTemplate(pinpoint));
    }
  }, {
    key: 'onBodyChange',
    value: function onBodyChange(templateId) {
      if (templateId) {
        var node = document.getElementById(templateId);
        this.title(node.getAttribute('data-title') || '');
      }
    }
  }, {
    key: 'registerPlugins',
    value: function registerPlugins(plugins) {
      this.plugins.register(plugins);
    }
  }, {
    key: 'registerBooks',
    value: function registerBooks(books) {
      this.books(Object.keys(books).map(function (key) {
        return books[key];
      }));
    }
  }]);

  return Page;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint no-unused-vars: [2, {"vars": "local"}]*/

var PluginManager = function () {
  function PluginManager() {
    _classCallCheck(this, PluginManager);

    this.pluginRepos = ko.observableArray();
    this.sortedPluginRepos = this.pluginRepos.filter(this.filter.bind(this)).sortBy(this.sortBy.bind(this)).map(this.nameToInstance.bind(this));
    this.pluginMap = new Map();
    this.pluginSort = ko.observable();
    this.pluginsLoaded = ko.observable(false).extend({ rateLimit: 15 });
    this.needle = ko.observable().extend({ rateLimit: 200 });
  }

  _createClass(PluginManager, [{
    key: 'register',
    value: function register(plugins) {
      Object.keys(plugins).forEach(function (repo) {
        var about = plugins[repo];
        this.pluginRepos.push(repo);
        this.pluginMap.set(repo, about);
      }, this);
      this.pluginsLoaded(true);
    }
  }, {
    key: 'filter',
    value: function filter(repo) {
      if (!this.pluginsLoaded()) {
        return false;
      }
      var about = this.pluginMap.get(repo);
      var needle = (this.needle() || '').toLowerCase();
      if (!needle) {
        return true;
      }
      if (repo.toLowerCase().indexOf(needle) >= 0) {
        return true;
      }
      if (!about) {
        return false;
      }
      return (about.description || '').toLowerCase().indexOf(needle) >= 0;
    }
  }, {
    key: 'sortBy',
    value: function sortBy(repo, descending) {
      this.pluginsLoaded(); // Create dependency.
      var about = this.pluginMap.get(repo);
      if (about) {
        return descending(about.stargazers_count);
      } else {
        return descending(-1);
      }
    }
  }, {
    key: 'nameToInstance',
    value: function nameToInstance(name) {
      return this.pluginMap.get(name);
    }
  }]);

  return PluginManager;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SearchResult = function SearchResult(template) {
  _classCallCheck(this, SearchResult);

  this.template = template;
  this.link = '/a/' + template.id + '.html';
  this.title = template.getAttribute('data-title') || '\u201C' + template.id + '\u201D';
};

var Search = function () {
  function Search() {
    _classCallCheck(this, Search);

    var searchRate = {
      timeout: 500,
      method: "notifyWhenChangesStop"
    };
    this.query = ko.observable().extend({ rateLimit: searchRate });
    this.results = ko.computed(this.computeResults, this);
    this.query.subscribe(this.onQueryChange, this);
    this.progress = ko.observable();
  }

  _createClass(Search, [{
    key: 'computeResults',
    value: function computeResults() {
      var q = (this.query() || '').trim().toLowerCase();
      if (!q) {
        return [];
      }
      return $('template').filter(function () {
        return $(this.content).text().toLowerCase().indexOf(q) !== -1;
      }).map(function (i, template) {
        return new SearchResult(template);
      });
    }
  }, {
    key: 'saveTemplate',
    value: function saveTemplate() {
      if ($root.body() !== 'search') {
        this.savedTemplate = $root.body();
        this.savedTitle = document.title;
      }
    }
  }, {
    key: 'restoreTemplate',
    value: function restoreTemplate() {
      if (this.savedTitle && this.query() !== null) {
        $root.body(this.savedTemplate);
        document.title = this.savedTitle;
      }
    }
  }, {
    key: 'onQueryChange',
    value: function onQueryChange() {
      if (!(this.query() || '').trim()) {
        this.restoreTemplate();
        return;
      }
      this.saveTemplate();
      $root.body("search");
      document.title = 'Knockout.js \u2013 Search \u201C' + this.query() + '\u201D';
    }
  }]);

  return Search;
}();
'use strict';

//
// animated template binding
// ---
// Waits for CSS3 transitions to complete on change before moving to the next.
//

var animationEvent = 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd';

ko.bindingHandlers.animatedTemplate = {
  init: function init(element, valueAccessor, ign1, ign2, bindingContext) {
    var $element = $(element);
    var obs = valueAccessor();

    var onTemplateChange = function onTemplateChange(templateId_) {
      var templateId = (templateId_ || '').replace('#', '');
      var templateNode = document.getElementById(templateId);
      if (!templateId) {
        $element.empty();
      } else if (!templateNode) {
        throw new Error('Cannot find template by id: ' + templateId);
      } else {
        var html = $(templateNode).html();
        $element.html('<div class=\'main-animated\'>' + html + '</div>');

        // See: http://stackoverflow.com/questions/9255279
        $element.one(animationEvent, function () {
          // Fake a scroll event so our `isAlmostInView`
          $(window).trigger("scroll");
        });

        ko.applyBindingsToDescendants(bindingContext, element);
      }
    };

    var subs = obs.subscribe(onTemplateChange);
    onTemplateChange(ko.unwrap(obs));

    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      subs.dispose();
    });

    return { controlsDescendantBindings: true };
  }
};
'use strict';

var languageThemeMap = {
  html: 'solarized_dark',
  javascript: 'solarized_dark'
};

function setupEditor(element, language, exampleName) {
  var example = ko.unwrap(exampleName);
  var editor = ace.edit(element);
  var session = editor.getSession();
  editor.setTheme('ace/theme/' + languageThemeMap[language]);
  editor.setOptions({
    highlightActiveLine: true,
    useSoftTabs: true,
    tabSize: 2,
    minLines: 3,
    maxLines: 30,
    wrap: true
  });
  session.setMode('ace/mode/' + language);
  editor.on('change', function () {
    example[language](editor.getValue());
  });
  example[language].subscribe(function (v) {
    if (editor.getValue() !== v) {
      editor.setValue(v);
    }
  });
  editor.setValue(example[language]());
  editor.clearSelection();
  ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
    return editor.destroy();
  });
  return editor;
}

//expected-doctype-but-got-end-tag
//expected-doctype-but-got-start-tag
//expected-doctype-but-got-chars

ko.bindingHandlers['edit-js'] = {
  /* highlight: "langauge" */
  init: function init(element, va) {
    whenAlmostInView(element, function () {
      return setupEditor(element, 'javascript', va());
    });
  }
};

ko.bindingHandlers['edit-html'] = {
  init: function init(element, va) {
    // Defer so the page rendering is faster
    // TODO: Wait until in view http://stackoverflow.com/a/7557433/19212
    whenAlmostInView(element, function () {
      return setupEditor(element, 'html', va());
    });
    // debugger
    // editor.session.setOptions({
    // // $worker.call('changeOptions', [{
    //   'expected-doctype-but-got-chars': false,
    //   'expected-doctype-but-got-end-tag': false,
    //   'expected-doctype-but-got-start-tag': false
    // })
  }
};
"use strict";

var readonlyThemeMap = {
  html: "solarized_light",
  javascript: "solarized_light"
};

var emap = {
  '&amp;': '&',
  '&lt;': '<'
};

function unescape(str) {
  return str.replace(/&amp;|&lt;/g, function (ent) {
    return emap[ent];
  });
}

ko.bindingHandlers.highlight = {
  setup: function setup(element, va) {
    var $e = $(element);
    var language = va();
    if (language !== 'html' && language !== 'javascript') {
      console.error("A language should be specified.", element);
      return;
    }
    var content = unescape($e.text());
    $e.empty();
    var editor = ace.edit(element);
    var session = editor.getSession();
    editor.setTheme("ace/theme/" + readonlyThemeMap[language]);
    editor.setOptions({
      highlightActiveLine: false,
      useSoftTabs: true,
      tabSize: 2,
      minLines: 1,
      wrap: true,
      maxLines: 35,
      readOnly: true
    });
    session.setMode("ace/mode/" + language);
    editor.setValue(content);
    editor.clearSelection();
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      return editor.destroy();
    });
  },

  init: function init(element, va) {
    whenAlmostInView(element, function () {
      return ko.bindingHandlers.highlight.setup(element, va);
    });
  }
};
"use strict";

/* eslint no-new-func: 0 */

// Save a copy for restoration/use
ko.originalApplyBindings = ko.applyBindings;
ko.components.originalRegister = ko.components.register;

ko.bindingHandlers.result = {
  init: function init(element, va) {
    whenAlmostInView(element, function () {
      return ko.bindingHandlers.result.setup(element, va);
    });
  },
  setup: function setup(element, va) {
    var $e = $(element);
    var example = ko.unwrap(va());
    var registeredComponents = new Set();

    function resetElement() {
      if (element.children[0]) {
        ko.cleanNode(element.children[0]);
      }
      $e.empty().append("<div class='example " + example.css + "'>");
    }
    resetElement();

    function onError(msg) {
      $(element).html("<div class='error'>Error: " + msg + "</div>");
    }

    function fakeRegister(name, settings) {
      ko.components.originalRegister(name, settings);
      registeredComponents.add(name);
    }

    function clearComponentRegister() {
      registeredComponents.forEach(function (v) {
        return ko.components.unregister(v);
      });
    }

    function refresh() {
      var script = example.finalJavascript();
      var html = example.html();

      if (script instanceof Error) {
        onError(script);
        return;
      }

      if (!html) {
        onError("There's no HTML to bind to.");
        return;
      }
      // Stub ko.applyBindings
      ko.applyBindings = function (e) {
        // We ignore the `node` argument in favour of the examples' node.
        ko.originalApplyBindings(e, element.children[0]);
      };

      ko.components.register = fakeRegister;

      try {
        resetElement();
        clearComponentRegister();
        $(element.children[0]).html(html);
        var fn = new Function('node', script);
        ko.dependencyDetection.ignore(fn, null, [element.children[0]]);
      } catch (e) {
        onError(e);
      }
    }

    ko.computed({
      disposeWhenNodeIsRemoved: element,
      read: refresh
    });

    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      clearComponentRegister();
    });

    return { controlsDescendantBindings: true };
  }
};
'use strict';

/* global setupEvents, Example, Documentation, API */
var appCacheUpdateCheckInterval = location.hostname === 'localhost' ? 2500 : 1000 * 60 * 15;

var nativeTemplating = 'content' in document.createElement('template');

function loadHtml(uri) {
  return Promise.resolve($.ajax(uri)).then(function (html) {
    if (typeof html !== "string") {
      console.error('Unable to get ' + uri + ':', html);
    } else {
      if (!nativeTemplating) {
        // Polyfill the <template> tag from the templates we load.
        // For a more involved polyfill, see e.g.
        //   http://jsfiddle.net/brianblakely/h3EmY/
        html = html.replace(/<\/?template/g, function (match) {
          if (match === "<template") {
            return "<script type='text/x-template'";
          } else {
            return "</script";
          }
        });
      }

      $('<div id=\'templates--' + uri + '\'>').append(html).appendTo(document.body);
    }
  });
}

function loadTemplates() {
  return loadHtml('build/templates.html');
}

function loadMarkdown() {
  return loadHtml("build/markdown.html");
}

function reCheckApplicationCache() {
  var ac = window.applicationCache;
  if (ac.status === ac.IDLE) {
    ac.update();
  }
  setTimeout(reCheckApplicationCache, appCacheUpdateCheckInterval);
}

function checkForApplicationUpdate() {
  var ac = window.applicationCache;
  if (!ac) {
    return Promise.resolve();
  }
  ac.addEventListener('progress', function (evt) {
    if (evt.lengthComputable) {
      window.$root.reloadProgress(evt.loaded / evt.total);
    } else {
      window.$root.reloadProgress(false);
    }
  }, false);
  ac.addEventListener('updateready', function () {
    window.$root.cacheIsUpdated(true);
  });
  if (ac.status === ac.UPDATEREADY) {
    // Reload the page if we are still initializing and an update is ready.
    location.reload();
  }
  reCheckApplicationCache();
  return Promise.resolve();
}

function getExamples() {
  return Promise.resolve($.ajax({
    url: 'build/examples.json',
    dataType: 'json'
  })).then(function (results) {
    return Object.keys(results).forEach(function (name) {
      var setting = results[name];
      Example.set(setting.id || name, setting);
    });
  });
}

function getBooks() {
  return Promise.resolve($.ajax({
    url: 'build/books.json',
    dataType: 'json'
  })).then(function (results) {
    return $root.registerBooks(results);
  });
}

function loadAPI() {
  return Promise.resolve($.ajax({
    url: 'build/api.json',
    dataType: 'json'
  })).then(function (results) {
    return results.api.forEach(function (apiFileList) {
      // We essentially have to flatten the api (FIXME)
      apiFileList.forEach(API.add);
    });
  });
}

function getPlugins() {
  return Promise.resolve($.ajax({
    url: 'build/plugins.json',
    dataType: 'json'
  })).then(function (results) {
    return $root.registerPlugins(results);
  });
}

function applyBindings() {
  window.$root = new Page();
  ko.applyBindings(window.$root);
}

function pageLoaded() {
  if (location.pathname.indexOf('.html') === -1) {
    window.$root.open("intro");
  }
}

function start() {
  Promise.all([loadTemplates(), loadMarkdown()]).then(Documentation.initialize).then(applyBindings).then(getExamples).then(loadAPI).then(getPlugins).then(getBooks).then(setupEvents).then(checkForApplicationUpdate).then(pageLoaded).catch(function (err) {
    window.$root.body("error");
    window.$root.errorMessage(err.message || err);
    console.error(err);
  });
}

$(start);
'use strict';

/*global setupEvents*/
/* eslint no-unused-vars: 0 */

var SCROLL_DEBOUNCE = 200;

function isLocal(anchor) {
  return location.protocol === anchor.protocol && location.host === anchor.host;
}

// Make sure in non-single-page-app mode that we link to the right relative
// link.
var anchorRoot = location.pathname.replace(/\/a\/.*\.html/, '');
function rewriteAnchorRoot(evt) {
  var anchor = evt.currentTarget;
  var href = anchor.getAttribute('href');
  // Skip non-local urls.
  if (!isLocal(anchor)) {
    return true;
  }
  // Already re-rooted
  if (anchor.pathname.indexOf(anchorRoot) === 0) {
    return true;
  }
  anchor.href = ('' + anchorRoot + anchor.pathname).replace('//', '/');
  return true;
}

function scrollToHash(anchor) {
  if (!anchor.hash) {
    $(window).scrollTop(0);
    return;
  }
  var target = document.getElementById(
  // We normalize the links – the docs use _ and - inconsistently and
  // seemingly interchangeably; we could go through and spot every difference
  // but this is just easier for now.
  anchor.hash.substring(1).replace(/_/g, '-'));
  if (!target) {
    throw new Error('Bad anchor: ' + anchor.hash + ' from ' + anchor.href);
  }
  // We defer until the layout is completed.
  setTimeout(function () {
    $("html, body").animate({
      scrollTop: $(target).offset().top
    }, 150);
  }, 15);
}

//
// For JS history see:
// https://github.com/devote/HTML5-History-API
//
function onAnchorClick(evt) {
  var anchor = this;
  rewriteAnchorRoot(evt);
  if ($root.noSPA()) {
    return true;
  }
  // Do not intercept clicks on things outside this page
  if (!isLocal(anchor)) {
    return true;
  }

  // Do not intercept clicks on an element in an example.
  if ($(anchor).parents("live-example").length !== 0) {
    return true;
  }

  try {
    var templateId = $root.pathToTemplate(anchor.pathname);
    // If the template isn't found, presume a hard link
    if (!document.getElementById(templateId)) {
      return true;
    }
    if ($root.body() !== templateId) {
      history.pushState(null, null, anchor.href);
      document.title = 'Knockout.js \u2013 ' + $(this).text();
      $root.open(templateId);
      $root.search.query(null);
    }
    scrollToHash(anchor);
  } catch (e) {
    console.log('Error/' + anchor.getAttribute('href'), e);
  }
  return false;
}

function onPopState() /* evt */{
  // Note https://github.com/devote/HTML5-History-API
  if ($root.noSPA()) {
    return;
  }
  $root.open(location.pathname);
}

function setupEvents() {
  if (window.history.pushState) {
    $(document.body).on('click', "a", onAnchorClick);
    $(window).on('popstate', onPopState);
  } else {
    $(document.body).on('click', rewriteAnchorRoot);
  }
  $(window).on('scroll', throttle(checkItemsInView, SCROLL_DEBOUNCE));
}
"use strict";

var inViewWatch = new Map();

// SEe also http://stackoverflow.com/a/7557433/19212
function isAlmostInView(el) {
  var rect = el.getBoundingClientRect();
  var winHeight = window.innerHeight || document.documentElement.clientHeight;

  // Items are almost in view when we've scrolled down to 200px above their
  // presence on the page i.e. just before the user gets to them.
  return rect.top < winHeight + 200;
}

function checkItemsInView() {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = inViewWatch.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var element = _step.value;

      if (isAlmostInView(element)) {
        // Invoke the callback.
        inViewWatch.get(element)();
        inViewWatch.delete(element);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

// Schedule the callback for when the element comes into view.
// This is in some ways a poor man's requestIdleCallback
// https://developers.google.com/web/updates/2015/08/27/using-requestidlecallback
function whenAlmostInView(element, callback) {
  if (isAlmostInView(element)) {
    setTimeout(callback, 1);
  } else {
    inViewWatch.set(element, callback);
    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
      inViewWatch.delete(element);
    });
  }
}
"use strict";

ko.filters.dateFormat = function (dateString) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "MMM Do YYYY";

  return moment(dateString).format(format);
};
"use strict";

window.links = [{ href: "https://groups.google.com/forum/#!forum/knockoutjs",
  title: "Google Groups",
  icon: "fa-google" }, { href: "http://stackoverflow.com/tags/knockout.js/info",
  title: "StackOverflow",
  icon: "fa-stack-overflow" }, { href: 'https://gitter.im/knockout/tko',
  title: "Gitter",
  icon: "fa-comments-o" }, { href: 'legacy/',
  title: "Legacy website",
  icon: "fa fa-history" }];

window.githubLinks = [{ href: "https://github.com/knockout/tko",
  title: "Repository",
  icon: "fa-github" }, { href: "https://github.com/knockout/tko/issues/",
  title: "Issues",
  icon: "fa-exclamation-circle" }, { href: 'https://github.com/knockout/tko/releases',
  title: "Releases",
  icon: "fa-certificate" }];

window.cdn = [{ name: "Microsoft CDN",
  version: "3.3.0",
  min: "http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.js",
  debug: "http://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.debug.js"
}, { name: "CloudFlare CDN",
  version: "3.3.0",
  min: "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js",
  debug: "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-debug.js"
}];
"use strict";

//
// Simple throttle.
//

function throttle(fn, interval) {
  var isWaiting = false;

  var wrap = function throttled() {
    if (isWaiting) {
      return;
    }
    isWaiting = true;
    setTimeout(function () {
      isWaiting = false;
      fn();
    }, interval);
  };

  return wrap;
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFQSS5qcyIsIkRvY3VtZW50YXRpb24uanMiLCJFeGFtcGxlLmpzIiwiTGl2ZUV4YW1wbGVDb21wb25lbnQuanMiLCJQYWdlLmpzIiwiUGx1Z2luTWFuYWdlci5qcyIsIlNlYXJjaC5qcyIsImJpbmRpbmdzLWFuaW1hdGVkVGVtcGxhdGUuanMiLCJiaW5kaW5ncy1lZGl0LmpzIiwiYmluZGluZ3MtaGlnaGxpZ2h0LmpzIiwiYmluZGluZ3MtcmVzdWx0LmpzIiwiZW50cnkuanMiLCJldmVudHMuanMiLCJpc0luVmlldy5qcyIsImtvZmlsdGVycy5qcyIsInNldHRpbmdzLmpzIiwidGhyb3R0bGUuanMiXSwibmFtZXMiOlsiQVBJIiwic3BlYyIsInR5cGUiLCJuYW1lIiwic291cmNlIiwibGluZSIsInB1cnBvc2UiLCJ2YXJzIiwicGFyYW1zIiwidXJsIiwiYnVpbGRVcmwiLCJ1cmxSb290IiwiaXRlbXMiLCJrbyIsIm9ic2VydmFibGVBcnJheSIsImFkZCIsInRva2VuIiwiY29uc29sZSIsImxvZyIsInB1c2giLCJEb2N1bWVudGF0aW9uIiwidGVtcGxhdGUiLCJ0aXRsZSIsImNhdGVnb3J5Iiwic3ViY2F0ZWdvcnkiLCJjYXRlZ29yaWVzTWFwIiwiZnJvbU5vZGUiLCJpIiwibm9kZSIsImdldEF0dHJpYnV0ZSIsImluaXRpYWxpemUiLCJhbGwiLCIkIiwibWFrZUFycmF5IiwibWFwIiwiRXhhbXBsZSIsInN0YXRlIiwiZGVib3VuY2UiLCJ0aW1lb3V0IiwibWV0aG9kIiwiamF2YXNjcmlwdCIsIm9ic2VydmFibGUiLCJleHRlbmQiLCJyYXRlTGltaXQiLCJodG1sIiwiY3NzIiwiZmluYWxKYXZhc2NyaXB0IiwicHVyZUNvbXB1dGVkIiwiY29tcHV0ZUZpbmFsSnMiLCJqcyIsIkVycm9yIiwiaW5kZXhPZiIsInN0YXRlTWFwIiwiTWFwIiwiZ2V0Iiwic2V0IiwiZXhhbXBsZSIsIkVYVEVSTkFMX0lOQ0xVREVTIiwiTGl2ZUV4YW1wbGVDb21wb25lbnQiLCJpZCIsInVud3JhcCIsImJhc2U2NCIsIm9wdHMiLCJKU09OIiwicGFyc2UiLCJhdG9iIiwiZXgiLCJkYXRlZCIsIkRhdGUiLCJ0b0xvY2FsZVN0cmluZyIsImpzUHJlZml4IiwiZGVzY3JpcHRpb24iLCIkZmllbGRzIiwidyIsIndpbmRvdyIsIm9wZW4iLCIkZm9ybSIsImFwcGVuZCIsImRvY3VtZW50Iiwid3JpdGUiLCJvdXRlckhUTUwiLCJmb3JtcyIsInN1Ym1pdCIsInNlbGYiLCJldnQiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsImZpZWxkcyIsInV0aWxzIiwiZHRkIiwid3JhcCIsInJlc291cmNlcyIsImpvaW4iLCJvcGVuQ29tbW9uU2V0dGluZ3MiLCJvcGVuRm9ybUluTmV3V2luZG93IiwidiIsImsiLCJ2YWwiLCJqc19leHRlcm5hbCIsImRhdGFTdHIiLCJzdHJpbmdpZnkiLCJyZXBsYWNlIiwiY29tcG9uZW50cyIsInJlZ2lzdGVyIiwidmlld01vZGVsIiwiZWxlbWVudCIsIlBhZ2UiLCJib2R5Iiwic3Vic2NyaWJlIiwib25Cb2R5Q2hhbmdlIiwibGlua3MiLCJjZG4iLCJwbHVnaW5zIiwiUGx1Z2luTWFuYWdlciIsImJvb2tzIiwiZG9jQ2F0TWFwIiwiZm9yRWFjaCIsImRvYyIsImNhdCIsImRvY0xpc3QiLCJzb3J0ZXIiLCJhIiwiYiIsImxvY2FsZUNvbXBhcmUiLCJ2YWx1ZXMiLCJsaXN0Iiwic29ydCIsImRvY0NhdHMiLCJPYmplY3QiLCJrZXlzIiwic2VhcmNoIiwiU2VhcmNoIiwicmVsb2FkUHJvZ3Jlc3MiLCJjYWNoZUlzVXBkYXRlZCIsImVycm9yTWVzc2FnZSIsImxzIiwibG9jYWxTdG9yYWdlIiwibm9TUEEiLCJCb29sZWFuIiwiZ2V0SXRlbSIsInNldEl0ZW0iLCJwYXRoIiwic3BsaXQiLCJwb3AiLCJwaW5wb2ludCIsInBhdGhUb1RlbXBsYXRlIiwidGVtcGxhdGVJZCIsImdldEVsZW1lbnRCeUlkIiwia2V5IiwicGx1Z2luUmVwb3MiLCJzb3J0ZWRQbHVnaW5SZXBvcyIsImZpbHRlciIsImJpbmQiLCJzb3J0QnkiLCJuYW1lVG9JbnN0YW5jZSIsInBsdWdpbk1hcCIsInBsdWdpblNvcnQiLCJwbHVnaW5zTG9hZGVkIiwibmVlZGxlIiwicmVwbyIsImFib3V0IiwidG9Mb3dlckNhc2UiLCJkZXNjZW5kaW5nIiwic3RhcmdhemVyc19jb3VudCIsIlNlYXJjaFJlc3VsdCIsImxpbmsiLCJzZWFyY2hSYXRlIiwicXVlcnkiLCJyZXN1bHRzIiwiY29tcHV0ZWQiLCJjb21wdXRlUmVzdWx0cyIsIm9uUXVlcnlDaGFuZ2UiLCJwcm9ncmVzcyIsInEiLCJ0cmltIiwiY29udGVudCIsInRleHQiLCIkcm9vdCIsInNhdmVkVGVtcGxhdGUiLCJzYXZlZFRpdGxlIiwicmVzdG9yZVRlbXBsYXRlIiwic2F2ZVRlbXBsYXRlIiwiYW5pbWF0aW9uRXZlbnQiLCJiaW5kaW5nSGFuZGxlcnMiLCJhbmltYXRlZFRlbXBsYXRlIiwiaW5pdCIsInZhbHVlQWNjZXNzb3IiLCJpZ24xIiwiaWduMiIsImJpbmRpbmdDb250ZXh0IiwiJGVsZW1lbnQiLCJvYnMiLCJvblRlbXBsYXRlQ2hhbmdlIiwidGVtcGxhdGVJZF8iLCJ0ZW1wbGF0ZU5vZGUiLCJlbXB0eSIsIm9uZSIsInRyaWdnZXIiLCJhcHBseUJpbmRpbmdzVG9EZXNjZW5kYW50cyIsInN1YnMiLCJkb21Ob2RlRGlzcG9zYWwiLCJhZGREaXNwb3NlQ2FsbGJhY2siLCJkaXNwb3NlIiwiY29udHJvbHNEZXNjZW5kYW50QmluZGluZ3MiLCJsYW5ndWFnZVRoZW1lTWFwIiwic2V0dXBFZGl0b3IiLCJsYW5ndWFnZSIsImV4YW1wbGVOYW1lIiwiZWRpdG9yIiwiYWNlIiwiZWRpdCIsInNlc3Npb24iLCJnZXRTZXNzaW9uIiwic2V0VGhlbWUiLCJzZXRPcHRpb25zIiwiaGlnaGxpZ2h0QWN0aXZlTGluZSIsInVzZVNvZnRUYWJzIiwidGFiU2l6ZSIsIm1pbkxpbmVzIiwibWF4TGluZXMiLCJzZXRNb2RlIiwib24iLCJnZXRWYWx1ZSIsInNldFZhbHVlIiwiY2xlYXJTZWxlY3Rpb24iLCJkZXN0cm95IiwidmEiLCJ3aGVuQWxtb3N0SW5WaWV3IiwicmVhZG9ubHlUaGVtZU1hcCIsImVtYXAiLCJ1bmVzY2FwZSIsInN0ciIsImVudCIsImhpZ2hsaWdodCIsInNldHVwIiwiJGUiLCJlcnJvciIsInJlYWRPbmx5Iiwib3JpZ2luYWxBcHBseUJpbmRpbmdzIiwiYXBwbHlCaW5kaW5ncyIsIm9yaWdpbmFsUmVnaXN0ZXIiLCJyZXN1bHQiLCJyZWdpc3RlcmVkQ29tcG9uZW50cyIsIlNldCIsInJlc2V0RWxlbWVudCIsImNoaWxkcmVuIiwiY2xlYW5Ob2RlIiwib25FcnJvciIsIm1zZyIsImZha2VSZWdpc3RlciIsInNldHRpbmdzIiwiY2xlYXJDb21wb25lbnRSZWdpc3RlciIsInVucmVnaXN0ZXIiLCJyZWZyZXNoIiwic2NyaXB0IiwiZSIsImZuIiwiRnVuY3Rpb24iLCJkZXBlbmRlbmN5RGV0ZWN0aW9uIiwiaWdub3JlIiwiZGlzcG9zZVdoZW5Ob2RlSXNSZW1vdmVkIiwicmVhZCIsImFwcENhY2hlVXBkYXRlQ2hlY2tJbnRlcnZhbCIsImxvY2F0aW9uIiwiaG9zdG5hbWUiLCJuYXRpdmVUZW1wbGF0aW5nIiwiY3JlYXRlRWxlbWVudCIsImxvYWRIdG1sIiwidXJpIiwiUHJvbWlzZSIsInJlc29sdmUiLCJhamF4IiwidGhlbiIsIm1hdGNoIiwiYXBwZW5kVG8iLCJsb2FkVGVtcGxhdGVzIiwibG9hZE1hcmtkb3duIiwicmVDaGVja0FwcGxpY2F0aW9uQ2FjaGUiLCJhYyIsImFwcGxpY2F0aW9uQ2FjaGUiLCJzdGF0dXMiLCJJRExFIiwidXBkYXRlIiwic2V0VGltZW91dCIsImNoZWNrRm9yQXBwbGljYXRpb25VcGRhdGUiLCJhZGRFdmVudExpc3RlbmVyIiwibGVuZ3RoQ29tcHV0YWJsZSIsImxvYWRlZCIsInRvdGFsIiwiVVBEQVRFUkVBRFkiLCJyZWxvYWQiLCJnZXRFeGFtcGxlcyIsImRhdGFUeXBlIiwic2V0dGluZyIsImdldEJvb2tzIiwicmVnaXN0ZXJCb29rcyIsImxvYWRBUEkiLCJhcGkiLCJhcGlGaWxlTGlzdCIsImdldFBsdWdpbnMiLCJyZWdpc3RlclBsdWdpbnMiLCJwYWdlTG9hZGVkIiwicGF0aG5hbWUiLCJzdGFydCIsInNldHVwRXZlbnRzIiwiY2F0Y2giLCJlcnIiLCJtZXNzYWdlIiwiU0NST0xMX0RFQk9VTkNFIiwiaXNMb2NhbCIsImFuY2hvciIsInByb3RvY29sIiwiaG9zdCIsImFuY2hvclJvb3QiLCJyZXdyaXRlQW5jaG9yUm9vdCIsImN1cnJlbnRUYXJnZXQiLCJocmVmIiwic2Nyb2xsVG9IYXNoIiwiaGFzaCIsInNjcm9sbFRvcCIsInRhcmdldCIsInN1YnN0cmluZyIsImFuaW1hdGUiLCJvZmZzZXQiLCJ0b3AiLCJvbkFuY2hvckNsaWNrIiwicGFyZW50cyIsImxlbmd0aCIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJvblBvcFN0YXRlIiwidGhyb3R0bGUiLCJjaGVja0l0ZW1zSW5WaWV3IiwiaW5WaWV3V2F0Y2giLCJpc0FsbW9zdEluVmlldyIsImVsIiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIndpbkhlaWdodCIsImlubmVySGVpZ2h0IiwiZG9jdW1lbnRFbGVtZW50IiwiY2xpZW50SGVpZ2h0IiwiZGVsZXRlIiwiY2FsbGJhY2siLCJmaWx0ZXJzIiwiZGF0ZUZvcm1hdCIsImRhdGVTdHJpbmciLCJmb3JtYXQiLCJtb21lbnQiLCJpY29uIiwiZ2l0aHViTGlua3MiLCJ2ZXJzaW9uIiwibWluIiwiZGVidWciLCJpbnRlcnZhbCIsImlzV2FpdGluZyIsInRocm90dGxlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7O0lBRU1BO0FBQ0osZUFBWUMsSUFBWixFQUFrQjtBQUFBOztBQUNoQixTQUFLQyxJQUFMLEdBQVlELEtBQUtDLElBQWpCO0FBQ0EsU0FBS0MsSUFBTCxHQUFZRixLQUFLRSxJQUFqQjtBQUNBLFNBQUtDLE1BQUwsR0FBY0gsS0FB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U0FBTyxZQURUO0FBRUV1VSxRQUFNLFdBRlIsRUFEbUIsRUFJbkIsRUFBRWpDLE1BQU0seUNBQVI7QUFDRXRTLFNBQU8sUUFEVDtBQUVFdVUsUUFBTSx1QkFGUixFQUptQixFQU9uQixFQUFFakMsTUFBTSwwQ0FBUjtBQUNFdFMsU0FBTyxVQURUO0FBRUV1VSxRQUFNLGdCQUZSLEVBUG1CLENBQXJCOztBQVlBblIsT0FBT3FDLEdBQVAsR0FBYSxDQUNYLEVBQUU1RyxNQUFNLGVBQVI7QUFDRTRWLFdBQVMsT0FEWDtBQUVFQyxPQUFLLDJEQUZQO0FBR0VDLFNBQU87QUFIVCxDQURXLEVBTVgsRUFBRTlWLE1BQU0sZ0JBQVI7QUFDRTRWLFdBQVMsT0FEWDtBQUVFQyxPQUFLLHVFQUZQO0FBR0VDLFNBQU87QUFIVCxDQU5XLENBQWI7OztBQzVCQTtBQUNBO0FBQ0E7O0FBRUEsU0FBU3RCLFFBQVQsQ0FBa0IzRSxFQUFsQixFQUFzQmtHLFFBQXRCLEVBQWdDO0FBQzlCLE1BQUlDLFlBQVksS0FBaEI7O0FBRUEsTUFBSXpRLE9BQU8sU0FBUzBRLFNBQVQsR0FBcUI7QUFDOUIsUUFBSUQsU0FBSixFQUFlO0FBQUU7QUFBUTtBQUN6QkEsZ0JBQVksSUFBWjtBQUNBeEUsZUFBVyxZQUFZO0FBQ3JCd0Usa0JBQVksS0FBWjtBQUNBbkc7QUFDRCxLQUhELEVBR0drRyxRQUhIO0FBSUQsR0FQRDs7QUFTQSxTQUFPeFEsSUFBUDtBQUNEIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuIEFQSSBjb252ZXJ0cyB0aGUgYG9waW5lYC1mbGF2b3VyZWQgZG9jdW1lbnRhdGlvbiBoZXJlLlxuXG4gSGVyZSBpcyBhIHNhbXBsZTpcbiovXG4vLyAvKi0tLVxuLy8gIHB1cnBvc2U6IGtub2Nrb3V0LXdpZGUgc2V0dGluZ3Ncbi8vICAqL1xuLy8gdmFyIHNldHRpbmdzID0geyAvKi4uLiovIH1cblxuY2xhc3MgQVBJIHtcbiAgY29uc3RydWN0b3Ioc3BlYykge1xuICAgIHRoaXMudHlwZSA9IHNwZWMudHlwZVxuICAgIHRoaXMubmFtZSA9IHNwZWMubmFtZVxuICAgIHRoaXMuc291cmNlID0gc3BlYy5zb3VyY2VcbiAgICB0aGlzLmxpbmUgPSBzcGVjLmxpbmVcbiAgICB0aGlzLnB1cnBvc2UgPSBzcGVjLnZhcnMucHVycG9zZVxuICAgIHRoaXMuc3BlYyA9IHNwZWMudmFycy5wYXJhbXNcbiAgICB0aGlzLnVybCA9IHRoaXMuYnVpbGRVcmwoc3BlYy5zb3VyY2UsIHNwZWMubGluZSlcbiAgfVxuXG4gIGJ1aWxkVXJsKHNvdXJjZSwgbGluZSkge1xuICAgIHJldHVybiBgJHtBUEkudXJsUm9vdH0ke3NvdXJjZX0jTCR7bGluZX1gXG4gIH1cbn1cblxuQVBJLnVybFJvb3QgPSBcImh0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC9rbm9ja291dC9ibG9iL21hc3Rlci9cIlxuXG5cbkFQSS5pdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheSgpXG5cbkFQSS5hZGQgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgY29uc29sZS5sb2coXCJUXCIsIHRva2VuKVxuICBBUEkuaXRlbXMucHVzaChuZXcgQVBJKHRva2VuKSlcbn1cbiIsIlxuY2xhc3MgRG9jdW1lbnRhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCB0aXRsZSwgY2F0ZWdvcnksIHN1YmNhdGVnb3J5KSB7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlXG4gICAgdGhpcy50aXRsZSA9IHRpdGxlXG4gICAgdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5XG4gICAgdGhpcy5zdWJjYXRlZ29yeSA9IHN1YmNhdGVnb3J5XG4gIH1cbn1cblxuRG9jdW1lbnRhdGlvbi5jYXRlZ29yaWVzTWFwID0ge1xuICAxOiBcIkdldHRpbmcgc3RhcnRlZFwiLFxuICAyOiBcIk9ic2VydmFibGVzXCIsXG4gIDM6IFwiQmluZGluZ3MgYW5kIENvbXBvbmVudHNcIixcbiAgNDogXCJCaW5kaW5ncyBpbmNsdWRlZFwiLFxuICA1OiBcIkZ1cnRoZXIgaW5mb3JtYXRpb25cIlxufVxuXG5Eb2N1bWVudGF0aW9uLmZyb21Ob2RlID0gZnVuY3Rpb24gKGksIG5vZGUpIHtcbiAgcmV0dXJuIG5ldyBEb2N1bWVudGF0aW9uKFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpLFxuICAgIG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJyksXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2F0JyksXG4gICAgbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3ViY2F0JylcbiAgKVxufVxuXG5Eb2N1bWVudGF0aW9uLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gIERvY3VtZW50YXRpb24uYWxsID0gJC5tYWtlQXJyYXkoXG4gICAgJChcIltkYXRhLWtpbmQ9ZG9jdW1lbnRhdGlvbl1cIikubWFwKERvY3VtZW50YXRpb24uZnJvbU5vZGUpXG4gIClcbn1cbiIsIlxuXG5jbGFzcyBFeGFtcGxlIHtcbiAgY29uc3RydWN0b3Ioc3RhdGUgPSB7fSkge1xuICAgIHZhciBkZWJvdW5jZSA9IHsgdGltZW91dDogNTAwLCBtZXRob2Q6IFwibm90aWZ5V2hlbkNoYW5nZXNTdG9wXCIgfVxuICAgIHRoaXMuamF2YXNjcmlwdCA9IGtvLm9ic2VydmFibGUoc3RhdGUuamF2YXNjcmlwdClcbiAgICAgIC5leHRlbmQoe3JhdGVMaW1pdDogZGVib3VuY2V9KVxuICAgIHRoaXMuaHRtbCA9IGtvLm9ic2VydmFibGUoc3RhdGUuaHRtbClcbiAgICAgIC5leHRlbmQoe3JhdGVMaW1pdDogZGVib3VuY2V9KVxuICAgIHRoaXMuY3NzID0gc3RhdGUuY3NzIHx8ICcnXG5cbiAgICB0aGlzLmZpbmFsSmF2YXNjcmlwdCA9IGtvLnB1cmVDb21wdXRlZCh0aGlzLmNvbXB1dGVGaW5hbEpzLCB0aGlzKVxuICB9XG5cbiAgLy8gQWRkIGtvLmFwcGx5QmluZGluZ3MgYXMgbmVlZGVkOyByZXR1cm4gRXJyb3Igd2hlcmUgYXBwcm9wcmlhdGUuXG4gIGNvbXB1dGVGaW5hbEpzKCkge1xuICAgIHZhciBqcyA9IHRoaXMuamF2YXNjcmlwdCgpXG4gICAgaWYgKCFqcykgeyByZXR1cm4gbmV3IEVycm9yKFwiVGhlIHNjcmlwdCBpcyBlbXB0eS5cIikgfVxuICAgIGlmIChqcy5pbmRleE9mKCdrby5hcHBseUJpbmRpbmdzKCcpID09PSAtMSkge1xuICAgICAgaWYgKGpzLmluZGV4T2YoJyB2aWV3TW9kZWwgPScpICE9PSAtMSkge1xuICAgICAgICAvLyBXZSBndWVzcyB0aGUgdmlld01vZGVsIG5hbWUgLi4uXG4gICAgICAgIHJldHVybiBgJHtqc31cXG5cXG4vKiBBdXRvbWF0aWNhbGx5IEFkZGVkICovXG4gICAgICAgICAga28uYXBwbHlCaW5kaW5ncyh2aWV3TW9kZWwpO2BcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJrby5hcHBseUJpbmRpbmdzKHZpZXcpIGlzIG5vdCBjYWxsZWRcIilcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGpzXG4gIH1cbn1cblxuRXhhbXBsZS5zdGF0ZU1hcCA9IG5ldyBNYXAoKVxuXG5FeGFtcGxlLmdldCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciBzdGF0ZSA9IEV4YW1wbGUuc3RhdGVNYXAuZ2V0KG5hbWUpXG4gIGlmICghc3RhdGUpIHtcbiAgICBzdGF0ZSA9IG5ldyBFeGFtcGxlKG5hbWUpXG4gICAgRXhhbXBsZS5zdGF0ZU1hcC5zZXQobmFtZSwgc3RhdGUpXG4gIH1cbiAgcmV0dXJuIHN0YXRlXG59XG5cblxuRXhhbXBsZS5zZXQgPSBmdW5jdGlvbiAobmFtZSwgc3RhdGUpIHtcbiAgdmFyIGV4YW1wbGUgPSBFeGFtcGxlLnN0YXRlTWFwLmdldChuYW1lKVxuICBpZiAoZXhhbXBsZSkge1xuICAgIGV4YW1wbGUuamF2YXNjcmlwdChzdGF0ZS5qYXZhc2NyaXB0KVxuICAgIGV4YW1wbGUuaHRtbChzdGF0ZS5odG1sKVxuICAgIHJldHVyblxuICB9XG4gIEV4YW1wbGUuc3RhdGVNYXAuc2V0KG5hbWUsIG5ldyBFeGFtcGxlKHN0YXRlKSlcbn1cbiIsIi8qZ2xvYmFscyBFeGFtcGxlICovXG4vKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAsIGNhbWVsY2FzZTowKi9cblxudmFyIEVYVEVSTkFMX0lOQ0xVREVTID0gW1xuICBcImh0dHBzOi8vY2RuLnJhd2dpdC5jb20va25vY2tvdXQvdGtvL3Y0LjAuMC1hbHBoYTEvZGlzdC9rby5qc1wiXG5dXG5cbmNsYXNzIExpdmVFeGFtcGxlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcy5pZCkge1xuICAgICAgdGhpcy5leGFtcGxlID0gRXhhbXBsZS5nZXQoa28udW53cmFwKHBhcmFtcy5pZCkpXG4gICAgfVxuICAgIGlmIChwYXJhbXMuYmFzZTY0KSB7XG4gICAgICB2YXIgb3B0cyA9XG4gICAgICB0aGlzLmV4YW1wbGUgPSBuZXcgRXhhbXBsZShKU09OLnBhcnNlKGF0b2IocGFyYW1zLmJhc2U2NCkpKVxuICAgIH1cbiAgICBpZiAoIXRoaXMuZXhhbXBsZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhhbXBsZSBtdXN0IGJlIHByb3ZpZGVkIGJ5IGlkIG9yIGJhc2U2NCBwYXJhbWV0ZXJcIilcbiAgICB9XG4gIH1cblxuICBvcGVuQ29tbW9uU2V0dGluZ3MoKSB7XG4gICAgdmFyIGV4ID0gdGhpcy5leGFtcGxlXG4gICAgdmFyIGRhdGVkID0gbmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpXG4gICAgdmFyIGpzUHJlZml4ID0gYC8qKlxuICogQ3JlYXRlZCBmcm9tIGFuIGV4YW1wbGUgb24gdGhlIEtub2Nrb3V0IHdlYnNpdGVcbiAqIG9uICR7bmV3IERhdGUoKS50b0xvY2FsZVN0cmluZygpfVxuICoqL1xuXG4gLyoqIEV4YW1wbGUgaXMgYXMgZm9sbG93cyAqKi9cbmBcbiAgICByZXR1cm4ge1xuICAgICAgaHRtbDogZXguaHRtbCgpLFxuICAgICAganM6IGpzUHJlZml4ICsgZXguZmluYWxKYXZhc2NyaXB0KCksXG4gICAgICB0aXRsZTogYEZyb20gS25vY2tvdXQgZXhhbXBsZWAsXG4gICAgICBkZXNjcmlwdGlvbjogYENyZWF0ZWQgb24gJHtkYXRlZH1gXG4gICAgfVxuICB9XG4gIFxuICBvcGVuRm9ybUluTmV3V2luZG93KHVybCwgJGZpZWxkcykge1xuICAgIHZhciB3ID0gd2luZG93Lm9wZW4oXCJhYm91dDpibGFua1wiKVxuICAgIHZhciAkZm9ybSA9ICQoYDxmb3JtIGFjdGlvbj1cIiR7dXJsfVwiIG1ldGhvZD1cIlBPU1RcIj4gPC9mb3JtPmApXG4gICAgJGZvcm0uYXBwZW5kKCRmaWVsZHMpXG4gICAgdy5kb2N1bWVudC53cml0ZSgkZm9ybVswXS5vdXRlckhUTUwpXG4gICAgdy5kb2N1bWVudC5mb3Jtc1swXS5zdWJtaXQoKVxuICB9XG5cbiAgb3BlbkZpZGRsZShzZWxmLCBldnQpIHtcbiAgICAvLyBTZWU6IGh0dHA6Ly9kb2MuanNmaWRkbGUubmV0L2FwaS9wb3N0Lmh0bWxcbiAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIHZhciBmaWVsZHMgPSBrby51dGlscy5leHRlbmQoe1xuICAgICAgZHRkOiBcIkhUTUwgNVwiLFxuICAgICAgd3JhcDogJ2wnLFxuICAgICAgcmVzb3VyY2VzOiBFWFRFUk5BTF9JTkNMVURFUy5qb2luKFwiLFwiKVxuICAgIH0sIHRoaXMub3BlbkNvbW1vblNldHRpbmdzKCkpXG4gICAgdGhpcy5vcGVuRm9ybUluTmV3V2luZG93KFxuICAgICAgXCJodHRwOi8vanNmaWRkbGUubmV0L2FwaS9wb3N0L2xpYnJhcnkvcHVyZS9cIiwgXG4gICAgICAkLm1hcChmaWVsZHMsICh2LCBrKSA9PiAkKGA8aW5wdXQgdHlwZT0naGlkZGVuJyBuYW1lPScke2t9Jz5gKS52YWwodikpXG4gICAgKVxuICB9XG5cbiAgb3BlblBlbihzZWxmLCBldnQpIHtcbiAgICAvLyBTZWU6IGh0dHA6Ly9ibG9nLmNvZGVwZW4uaW8vZG9jdW1lbnRhdGlvbi9hcGkvcHJlZmlsbC9cbiAgICBldnQucHJldmVudERlZmF1bHQoKVxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIHZhciBvcHRzID0ga28udXRpbHMuZXh0ZW5kKHtcbiAgICAgIGpzX2V4dGVybmFsOiBFWFRFUk5BTF9JTkNMVURFUy5qb2luKFwiO1wiKVxuICAgIH0sIHRoaXMub3BlbkNvbW1vblNldHRpbmdzKCkpXG4gICAgdmFyIGRhdGFTdHIgPSBKU09OLnN0cmluZ2lmeShvcHRzKVxuICAgICAgLnJlcGxhY2UoL1wiL2csIFwiJnF1b3Q7XCIpXG4gICAgICAucmVwbGFjZSgvJy9nLCBcIiZhcG9zO1wiKVxuXG4gICAgdGhpcy5vcGVuRm9ybUluTmV3V2luZG93KFxuICAgICAgXCJodHRwOi8vY29kZXBlbi5pby9wZW4vZGVmaW5lXCIsXG4gICAgICAkKGA8aW5wdXQgdHlwZT0naGlkZGVuJyBuYW1lPSdkYXRhJyB2YWx1ZT0nJHtkYXRhU3RyfScvPmApXG4gICAgKVxuICB9XG59XG5cbmtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ2xpdmUtZXhhbXBsZScsIHtcbiAgICB2aWV3TW9kZWw6IExpdmVFeGFtcGxlQ29tcG9uZW50LFxuICAgIHRlbXBsYXRlOiB7ZWxlbWVudDogXCJsaXZlLWV4YW1wbGVcIn1cbn0pXG4iLCIvKmdsb2JhbCBQYWdlLCBEb2N1bWVudGF0aW9uLCBtYXJrZWQsIFNlYXJjaCwgUGx1Z2luTWFuYWdlciAqL1xuLyplc2xpbnQgbm8tdW51c2VkLXZhcnM6IDAqL1xuXG5cbmNsYXNzIFBhZ2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyAtLS0gTWFpbiBib2R5IHRlbXBsYXRlIGlkIC0tLVxuICAgIHRoaXMuYm9keSA9IGtvLm9ic2VydmFibGUoKVxuICAgIHRoaXMudGl0bGUgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLmJvZHkuc3Vic2NyaWJlKHRoaXMub25Cb2R5Q2hhbmdlLCB0aGlzKVxuXG4gICAgLy8gLS0tIGZvb3RlciBsaW5rcy9jZG4gLS0tXG4gICAgdGhpcy5saW5rcyA9IHdpbmRvdy5saW5rc1xuICAgIHRoaXMuY2RuID0gd2luZG93LmNkblxuXG4gICAgLy8gLS0tIHN0YXRpYyBpbmZvIC0tLVxuICAgIHRoaXMucGx1Z2lucyA9IG5ldyBQbHVnaW5NYW5hZ2VyKClcbiAgICB0aGlzLmJvb2tzID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKVxuXG4gICAgLy8gLS0tIGRvY3VtZW50YXRpb24gLS0tXG4gICAgdGhpcy5kb2NDYXRNYXAgPSBuZXcgTWFwKClcbiAgICBEb2N1bWVudGF0aW9uLmFsbC5mb3JFYWNoKGZ1bmN0aW9uIChkb2MpIHtcbiAgICAgIHZhciBjYXQgPSBEb2N1bWVudGF0aW9uLmNhdGVnb3JpZXNNYXBbZG9jLmNhdGVnb3J5XVxuICAgICAgdmFyIGRvY0xpc3QgPSB0aGlzLmRvY0NhdE1hcC5nZXQoY2F0KVxuICAgICAgaWYgKCFkb2NMaXN0KSB7XG4gICAgICAgIGRvY0xpc3QgPSBbXVxuICAgICAgICB0aGlzLmRvY0NhdE1hcC5zZXQoY2F0LCBkb2NMaXN0KVxuICAgICAgfVxuICAgICAgZG9jTGlzdC5wdXNoKGRvYylcbiAgICB9LCB0aGlzKVxuXG4gICAgLy8gU29ydCB0aGUgZG9jdW1lbnRhdGlvbiBpdGVtc1xuICAgIGZ1bmN0aW9uIHNvcnRlcihhLCBiKSB7XG4gICAgICByZXR1cm4gYS50aXRsZS5sb2NhbGVDb21wYXJlKGIudGl0bGUpXG4gICAgfVxuICAgIGZvciAodmFyIGxpc3Qgb2YgdGhpcy5kb2NDYXRNYXAudmFsdWVzKCkpIHsgbGlzdC5zb3J0KHNvcnRlcikgfVxuXG4gICAgLy8gZG9jQ2F0czogQSBzb3J0ZWQgbGlzdCBvZiB0aGUgZG9jdW1lbnRhdGlvbiBzZWN0aW9uc1xuICAgIHRoaXMuZG9jQ2F0cyA9IE9iamVjdC5rZXlzKERvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcClcbiAgICAgIC5zb3J0KClcbiAgICAgIC5tYXAoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIERvY3VtZW50YXRpb24uY2F0ZWdvcmllc01hcFt2XSB9KVxuXG4gICAgLy8gLS0tIHNlYXJjaGluZyAtLS1cbiAgICB0aGlzLnNlYXJjaCA9IG5ldyBTZWFyY2goKVxuXG4gICAgLy8gLS0tIHBhZ2UgbG9hZGluZyBzdGF0dXMgLS0tXG4gICAgLy8gYXBwbGljYXRpb25DYWNoZSBwcm9ncmVzc1xuICAgIHRoaXMucmVsb2FkUHJvZ3Jlc3MgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLmNhY2hlSXNVcGRhdGVkID0ga28ub2JzZXJ2YWJsZShmYWxzZSlcblxuICAgIC8vIHBhZ2UgbG9hZGluZyBlcnJvclxuICAgIHRoaXMuZXJyb3JNZXNzYWdlID0ga28ub2JzZXJ2YWJsZSgpXG5cbiAgICAvLyBQcmVmZXJlbmNlIGZvciBub24tU2luZ2xlIFBhZ2UgQXBwXG4gICAgdmFyIGxzID0gd2luZG93LmxvY2FsU3RvcmFnZVxuICAgIHRoaXMubm9TUEEgPSBrby5vYnNlcnZhYmxlKEJvb2xlYW4obHMgJiYgbHMuZ2V0SXRlbSgnbm9TUEEnKSkpXG4gICAgdGhpcy5ub1NQQS5zdWJzY3JpYmUoKHYpID0+IGxzICYmIGxzLnNldEl0ZW0oJ25vU1BBJywgdiB8fCBcIlwiKSlcbiAgfVxuXG4gIHBhdGhUb1RlbXBsYXRlKHBhdGgpIHtcbiAgICByZXR1cm4gcGF0aC5zcGxpdCgnLycpLnBvcCgpLnJlcGxhY2UoJy5odG1sJywgJycpXG4gIH1cblxuICBvcGVuKHBpbnBvaW50KSB7XG4gICAgY29uc29sZS5sb2coXCIg8J+TsCAgXCIgKyB0aGlzLnBhdGhUb1RlbXBsYXRlKHBpbnBvaW50KSlcbiAgICB0aGlzLmJvZHkodGhpcy5wYXRoVG9UZW1wbGF0ZShwaW5wb2ludCkpXG4gIH1cblxuICBvbkJvZHlDaGFuZ2UodGVtcGxhdGVJZCkge1xuICAgIGlmICh0ZW1wbGF0ZUlkKSB7XG4gICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlSWQpXG4gICAgICB0aGlzLnRpdGxlKG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJykgfHwgJycpXG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJQbHVnaW5zKHBsdWdpbnMpIHtcbiAgICB0aGlzLnBsdWdpbnMucmVnaXN0ZXIocGx1Z2lucylcbiAgfVxuXG4gIHJlZ2lzdGVyQm9va3MoYm9va3MpIHtcbiAgICB0aGlzLmJvb2tzKE9iamVjdC5rZXlzKGJvb2tzKS5tYXAoa2V5ID0+IGJvb2tzW2tleV0pKVxuICB9XG59XG4iLCIvKiBlc2xpbnQgbm8tdW51c2VkLXZhcnM6IFsyLCB7XCJ2YXJzXCI6IFwibG9jYWxcIn1dKi9cblxuY2xhc3MgUGx1Z2luTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLnBsdWdpblJlcG9zID0ga28ub2JzZXJ2YWJsZUFycmF5KClcbiAgICB0aGlzLnNvcnRlZFBsdWdpblJlcG9zID0gdGhpcy5wbHVnaW5SZXBvc1xuICAgICAgLmZpbHRlcih0aGlzLmZpbHRlci5iaW5kKHRoaXMpKVxuICAgICAgLnNvcnRCeSh0aGlzLnNvcnRCeS5iaW5kKHRoaXMpKVxuICAgICAgLm1hcCh0aGlzLm5hbWVUb0luc3RhbmNlLmJpbmQodGhpcykpXG4gICAgdGhpcy5wbHVnaW5NYXAgPSBuZXcgTWFwKClcbiAgICB0aGlzLnBsdWdpblNvcnQgPSBrby5vYnNlcnZhYmxlKClcbiAgICB0aGlzLnBsdWdpbnNMb2FkZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKS5leHRlbmQoe3JhdGVMaW1pdDogMTV9KVxuICAgIHRoaXMubmVlZGxlID0ga28ub2JzZXJ2YWJsZSgpLmV4dGVuZCh7cmF0ZUxpbWl0OiAyMDB9KVxuICB9XG5cbiAgcmVnaXN0ZXIocGx1Z2lucykge1xuICAgIE9iamVjdC5rZXlzKHBsdWdpbnMpLmZvckVhY2goZnVuY3Rpb24gKHJlcG8pIHtcbiAgICAgIHZhciBhYm91dCA9IHBsdWdpbnNbcmVwb11cbiAgICAgIHRoaXMucGx1Z2luUmVwb3MucHVzaChyZXBvKVxuICAgICAgdGhpcy5wbHVnaW5NYXAuc2V0KHJlcG8sIGFib3V0KVxuICAgIH0sIHRoaXMpXG4gICAgdGhpcy5wbHVnaW5zTG9hZGVkKHRydWUpXG4gIH1cblxuICBmaWx0ZXIocmVwbykge1xuICAgIGlmICghdGhpcy5wbHVnaW5zTG9hZGVkKCkpIHsgcmV0dXJuIGZhbHNlIH1cbiAgICB2YXIgYWJvdXQgPSB0aGlzLnBsdWdpbk1hcC5nZXQocmVwbylcbiAgICB2YXIgbmVlZGxlID0gKHRoaXMubmVlZGxlKCkgfHwgJycpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoIW5lZWRsZSkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgaWYgKHJlcG8udG9Mb3dlckNhc2UoKS5pbmRleE9mKG5lZWRsZSkgPj0gMCkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgaWYgKCFhYm91dCkgeyByZXR1cm4gZmFsc2UgfVxuICAgIHJldHVybiAoYWJvdXQuZGVzY3JpcHRpb24gfHwgJycpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihuZWVkbGUpID49IDBcbiAgfVxuXG4gIHNvcnRCeShyZXBvLCBkZXNjZW5kaW5nKSB7XG4gICAgdGhpcy5wbHVnaW5zTG9hZGVkKCkgLy8gQ3JlYXRlIGRlcGVuZGVuY3kuXG4gICAgdmFyIGFib3V0ID0gdGhpcy5wbHVnaW5NYXAuZ2V0KHJlcG8pXG4gICAgaWYgKGFib3V0KSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGluZyhhYm91dC5zdGFyZ2F6ZXJzX2NvdW50KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGluZygtMSlcbiAgICB9XG4gIH1cblxuICBuYW1lVG9JbnN0YW5jZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2luTWFwLmdldChuYW1lKVxuICB9XG59XG4iLCJcbmNsYXNzIFNlYXJjaFJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlKSB7XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlXG4gICAgdGhpcy5saW5rID0gYC9hLyR7dGVtcGxhdGUuaWR9Lmh0bWxgXG4gICAgdGhpcy50aXRsZSA9IHRlbXBsYXRlLmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpIHx8IGDigJwke3RlbXBsYXRlLmlkfeKAnWBcbiAgfVxufVxuXG5cbmNsYXNzIFNlYXJjaCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHZhciBzZWFyY2hSYXRlID0ge1xuICAgICAgdGltZW91dDogNTAwLFxuICAgICAgbWV0aG9kOiBcIm5vdGlmeVdoZW5DaGFuZ2VzU3RvcFwiXG4gICAgfVxuICAgIHRoaXMucXVlcnkgPSBrby5vYnNlcnZhYmxlKCkuZXh0ZW5kKHtyYXRlTGltaXQ6IHNlYXJjaFJhdGV9KVxuICAgIHRoaXMucmVzdWx0cyA9IGtvLmNvbXB1dGVkKHRoaXMuY29tcHV0ZVJlc3VsdHMsIHRoaXMpXG4gICAgdGhpcy5xdWVyeS5zdWJzY3JpYmUodGhpcy5vblF1ZXJ5Q2hhbmdlLCB0aGlzKVxuICAgIHRoaXMucHJvZ3Jlc3MgPSBrby5vYnNlcnZhYmxlKClcbiAgfVxuXG4gIGNvbXB1dGVSZXN1bHRzKCkge1xuICAgIHZhciBxID0gKHRoaXMucXVlcnkoKSB8fCAnJykudHJpbSgpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoIXEpIHsgcmV0dXJuIFtdIH1cbiAgICByZXR1cm4gJChgdGVtcGxhdGVgKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkKHRoaXMuY29udGVudCkudGV4dCgpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihxKSAhPT0gLTFcbiAgICAgIH0pXG4gICAgICAubWFwKChpLCB0ZW1wbGF0ZSkgPT4gbmV3IFNlYXJjaFJlc3VsdCh0ZW1wbGF0ZSkpXG4gIH1cblxuICBzYXZlVGVtcGxhdGUoKSB7XG4gICAgaWYgKCRyb290LmJvZHkoKSAhPT0gJ3NlYXJjaCcpIHtcbiAgICAgIHRoaXMuc2F2ZWRUZW1wbGF0ZSA9ICRyb290LmJvZHkoKVxuICAgICAgdGhpcy5zYXZlZFRpdGxlID0gZG9jdW1lbnQudGl0bGVcbiAgICB9XG4gIH1cblxuICByZXN0b3JlVGVtcGxhdGUoKSB7XG4gICAgaWYgKHRoaXMuc2F2ZWRUaXRsZSAmJiB0aGlzLnF1ZXJ5KCkgIT09IG51bGwpIHtcbiAgICAgICRyb290LmJvZHkodGhpcy5zYXZlZFRlbXBsYXRlKVxuICAgICAgZG9jdW1lbnQudGl0bGUgPSB0aGlzLnNhdmVkVGl0bGVcbiAgICB9XG4gIH1cblxuICBvblF1ZXJ5Q2hhbmdlKCkge1xuICAgIGlmICghKHRoaXMucXVlcnkoKSB8fCAnJykudHJpbSgpKSB7XG4gICAgICB0aGlzLnJlc3RvcmVUZW1wbGF0ZSgpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5zYXZlVGVtcGxhdGUoKVxuICAgICRyb290LmJvZHkoXCJzZWFyY2hcIilcbiAgICBkb2N1bWVudC50aXRsZSA9IGBLbm9ja291dC5qcyDigJMgU2VhcmNoIOKAnCR7dGhpcy5xdWVyeSgpfeKAnWBcbiAgfVxufVxuIiwiLy9cbi8vIGFuaW1hdGVkIHRlbXBsYXRlIGJpbmRpbmdcbi8vIC0tLVxuLy8gV2FpdHMgZm9yIENTUzMgdHJhbnNpdGlvbnMgdG8gY29tcGxldGUgb24gY2hhbmdlIGJlZm9yZSBtb3ZpbmcgdG8gdGhlIG5leHQuXG4vL1xuXG52YXIgYW5pbWF0aW9uRXZlbnQgPSAnYW5pbWF0aW9uZW5kIHdlYmtpdEFuaW1hdGlvbkVuZCBvQW5pbWF0aW9uRW5kIE1TQW5pbWF0aW9uRW5kJ1xuXG5rby5iaW5kaW5nSGFuZGxlcnMuYW5pbWF0ZWRUZW1wbGF0ZSA9IHtcbiAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhbHVlQWNjZXNzb3IsIGlnbjEsIGlnbjIsIGJpbmRpbmdDb250ZXh0KSB7XG4gICAgdmFyICRlbGVtZW50ID0gJChlbGVtZW50KVxuICAgIHZhciBvYnMgPSB2YWx1ZUFjY2Vzc29yKClcblxuICAgIHZhciBvblRlbXBsYXRlQ2hhbmdlID0gZnVuY3Rpb24gKHRlbXBsYXRlSWRfKSB7XG4gICAgICB2YXIgdGVtcGxhdGVJZCA9ICh0ZW1wbGF0ZUlkXyB8fCAnJykucmVwbGFjZSgnIycsICcnKVxuICAgICAgdmFyIHRlbXBsYXRlTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlSWQpXG4gICAgICBpZiAoIXRlbXBsYXRlSWQpIHtcbiAgICAgICAgJGVsZW1lbnQuZW1wdHkoKVxuICAgICAgfSBlbHNlIGlmICghdGVtcGxhdGVOb2RlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgdGVtcGxhdGUgYnkgaWQ6ICR7dGVtcGxhdGVJZH1gKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGh0bWwgPSAkKHRlbXBsYXRlTm9kZSkuaHRtbCgpXG4gICAgICAgICRlbGVtZW50Lmh0bWwoYDxkaXYgY2xhc3M9J21haW4tYW5pbWF0ZWQnPiR7aHRtbH08L2Rpdj5gKVxuXG4gICAgICAgIC8vIFNlZTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85MjU1Mjc5XG4gICAgICAgICRlbGVtZW50Lm9uZShhbmltYXRpb25FdmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIEZha2UgYSBzY3JvbGwgZXZlbnQgc28gb3VyIGBpc0FsbW9zdEluVmlld2BcbiAgICAgICAgICAkKHdpbmRvdykudHJpZ2dlcihcInNjcm9sbFwiKVxuICAgICAgICB9KVxuXG4gICAgICAgIGtvLmFwcGx5QmluZGluZ3NUb0Rlc2NlbmRhbnRzKGJpbmRpbmdDb250ZXh0LCBlbGVtZW50KVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBzdWJzID0gb2JzLnN1YnNjcmliZShvblRlbXBsYXRlQ2hhbmdlKVxuICAgIG9uVGVtcGxhdGVDaGFuZ2Uoa28udW53cmFwKG9icykpXG5cbiAgICBrby51dGlscy5kb21Ob2RlRGlzcG9zYWwuYWRkRGlzcG9zZUNhbGxiYWNrKGVsZW1lbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHN1YnMuZGlzcG9zZSgpXG4gICAgfSlcblxuICAgIHJldHVybiB7IGNvbnRyb2xzRGVzY2VuZGFudEJpbmRpbmdzOiB0cnVlIH1cbiAgfVxufVxuIiwiXG52YXIgbGFuZ3VhZ2VUaGVtZU1hcCA9IHtcbiAgaHRtbDogJ3NvbGFyaXplZF9kYXJrJyxcbiAgamF2YXNjcmlwdDogJ3NvbGFyaXplZF9kYXJrJ1xufVxuXG5mdW5jdGlvbiBzZXR1cEVkaXRvcihlbGVtZW50LCBsYW5ndWFnZSwgZXhhbXBsZU5hbWUpIHtcbiAgdmFyIGV4YW1wbGUgPSBrby51bndyYXAoZXhhbXBsZU5hbWUpXG4gIHZhciBlZGl0b3IgPSBhY2UuZWRpdChlbGVtZW50KVxuICB2YXIgc2Vzc2lvbiA9IGVkaXRvci5nZXRTZXNzaW9uKClcbiAgZWRpdG9yLnNldFRoZW1lKGBhY2UvdGhlbWUvJHtsYW5ndWFnZVRoZW1lTWFwW2xhbmd1YWdlXX1gKVxuICBlZGl0b3Iuc2V0T3B0aW9ucyh7XG4gICAgaGlnaGxpZ2h0QWN0aXZlTGluZTogdHJ1ZSxcbiAgICB1c2VTb2Z0VGFiczogdHJ1ZSxcbiAgICB0YWJTaXplOiAyLFxuICAgIG1pbkxpbmVzOiAzLFxuICAgIG1heExpbmVzOiAzMCxcbiAgICB3cmFwOiB0cnVlXG4gIH0pXG4gIHNlc3Npb24uc2V0TW9kZShgYWNlL21vZGUvJHtsYW5ndWFnZX1gKVxuICBlZGl0b3Iub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHsgZXhhbXBsZVtsYW5ndWFnZV0oZWRpdG9yLmdldFZhbHVlKCkpIH0pXG4gIGV4YW1wbGVbbGFuZ3VhZ2VdLnN1YnNjcmliZShmdW5jdGlvbiAodikge1xuICAgIGlmIChlZGl0b3IuZ2V0VmFsdWUoKSAhPT0gdikge1xuICAgICAgZWRpdG9yLnNldFZhbHVlKHYpXG4gICAgfVxuICB9KVxuICBlZGl0b3Iuc2V0VmFsdWUoZXhhbXBsZVtsYW5ndWFnZV0oKSlcbiAgZWRpdG9yLmNsZWFyU2VsZWN0aW9uKClcbiAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCAoKSA9PiBlZGl0b3IuZGVzdHJveSgpKVxuICByZXR1cm4gZWRpdG9yXG59XG5cbi8vZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LWVuZC10YWdcbi8vZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LXN0YXJ0LXRhZ1xuLy9leHBlY3RlZC1kb2N0eXBlLWJ1dC1nb3QtY2hhcnNcblxua28uYmluZGluZ0hhbmRsZXJzWydlZGl0LWpzJ10gPSB7XG4gIC8qIGhpZ2hsaWdodDogXCJsYW5nYXVnZVwiICovXG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHdoZW5BbG1vc3RJblZpZXcoZWxlbWVudCwgKCkgPT4gc2V0dXBFZGl0b3IoZWxlbWVudCwgJ2phdmFzY3JpcHQnLCB2YSgpKSlcbiAgfVxufVxuXG5rby5iaW5kaW5nSGFuZGxlcnNbJ2VkaXQtaHRtbCddID0ge1xuICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgdmEpIHtcbiAgICAvLyBEZWZlciBzbyB0aGUgcGFnZSByZW5kZXJpbmcgaXMgZmFzdGVyXG4gICAgLy8gVE9ETzogV2FpdCB1bnRpbCBpbiB2aWV3IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzc1NTc0MzMvMTkyMTJcbiAgICB3aGVuQWxtb3N0SW5WaWV3KGVsZW1lbnQsICgpID0+IHNldHVwRWRpdG9yKGVsZW1lbnQsICdodG1sJywgdmEoKSkpXG4gICAgLy8gZGVidWdnZXJcbiAgICAvLyBlZGl0b3Iuc2Vzc2lvbi5zZXRPcHRpb25zKHtcbiAgICAvLyAvLyAkd29ya2VyLmNhbGwoJ2NoYW5nZU9wdGlvbnMnLCBbe1xuICAgIC8vICAgJ2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1jaGFycyc6IGZhbHNlLFxuICAgIC8vICAgJ2V4cGVjdGVkLWRvY3R5cGUtYnV0LWdvdC1lbmQtdGFnJzogZmFsc2UsXG4gICAgLy8gICAnZXhwZWN0ZWQtZG9jdHlwZS1idXQtZ290LXN0YXJ0LXRhZyc6IGZhbHNlXG4gICAgLy8gfSlcbiAgfVxufVxuIiwiXG5cbnZhciByZWFkb25seVRoZW1lTWFwID0ge1xuICBodG1sOiBcInNvbGFyaXplZF9saWdodFwiLFxuICBqYXZhc2NyaXB0OiBcInNvbGFyaXplZF9saWdodFwiXG59XG5cbnZhciBlbWFwID0ge1xuICAnJmFtcDsnOiAnJicsXG4gICcmbHQ7JzogJzwnXG59XG5cbmZ1bmN0aW9uIHVuZXNjYXBlKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoXG4gICAgLyZhbXA7fCZsdDsvZyxcbiAgICBmdW5jdGlvbiAoZW50KSB7IHJldHVybiBlbWFwW2VudF19XG4gIClcbn1cblxua28uYmluZGluZ0hhbmRsZXJzLmhpZ2hsaWdodCA9IHtcbiAgc2V0dXA6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHZhciAkZSA9ICQoZWxlbWVudClcbiAgICB2YXIgbGFuZ3VhZ2UgPSB2YSgpXG4gICAgaWYgKGxhbmd1YWdlICE9PSAnaHRtbCcgJiYgbGFuZ3VhZ2UgIT09ICdqYXZhc2NyaXB0Jykge1xuICAgICAgY29uc29sZS5lcnJvcihcIkEgbGFuZ3VhZ2Ugc2hvdWxkIGJlIHNwZWNpZmllZC5cIiwgZWxlbWVudClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB2YXIgY29udGVudCA9IHVuZXNjYXBlKCRlLnRleHQoKSlcbiAgICAkZS5lbXB0eSgpXG4gICAgdmFyIGVkaXRvciA9IGFjZS5lZGl0KGVsZW1lbnQpXG4gICAgdmFyIHNlc3Npb24gPSBlZGl0b3IuZ2V0U2Vzc2lvbigpXG4gICAgZWRpdG9yLnNldFRoZW1lKGBhY2UvdGhlbWUvJHtyZWFkb25seVRoZW1lTWFwW2xhbmd1YWdlXX1gKVxuICAgIGVkaXRvci5zZXRPcHRpb25zKHtcbiAgICAgIGhpZ2hsaWdodEFjdGl2ZUxpbmU6IGZhbHNlLFxuICAgICAgdXNlU29mdFRhYnM6IHRydWUsXG4gICAgICB0YWJTaXplOiAyLFxuICAgICAgbWluTGluZXM6IDEsXG4gICAgICB3cmFwOiB0cnVlLFxuICAgICAgbWF4TGluZXM6IDM1LFxuICAgICAgcmVhZE9ubHk6IHRydWVcbiAgICB9KVxuICAgIHNlc3Npb24uc2V0TW9kZShgYWNlL21vZGUvJHtsYW5ndWFnZX1gKVxuICAgIGVkaXRvci5zZXRWYWx1ZShjb250ZW50KVxuICAgIGVkaXRvci5jbGVhclNlbGVjdGlvbigpXG4gICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCAoKSA9PiBlZGl0b3IuZGVzdHJveSgpKVxuICB9LFxuXG4gIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCB2YSkge1xuICAgIHdoZW5BbG1vc3RJblZpZXcoZWxlbWVudCwgKCkgPT4ga28uYmluZGluZ0hhbmRsZXJzLmhpZ2hsaWdodC5zZXR1cChlbGVtZW50LCB2YSkpXG4gIH1cbn1cbiIsIi8qIGVzbGludCBuby1uZXctZnVuYzogMCAqL1xuXG4vLyBTYXZlIGEgY29weSBmb3IgcmVzdG9yYXRpb24vdXNlXG5rby5vcmlnaW5hbEFwcGx5QmluZGluZ3MgPSBrby5hcHBseUJpbmRpbmdzXG5rby5jb21wb25lbnRzLm9yaWdpbmFsUmVnaXN0ZXIgPSBrby5jb21wb25lbnRzLnJlZ2lzdGVyXG5cblxua28uYmluZGluZ0hhbmRsZXJzLnJlc3VsdCA9IHtcbiAgaW5pdDogZnVuY3Rpb24oZWxlbWVudCwgdmEpIHtcbiAgICB3aGVuQWxtb3N0SW5WaWV3KGVsZW1lbnQsICgpID0+IGtvLmJpbmRpbmdIYW5kbGVycy5yZXN1bHQuc2V0dXAoZWxlbWVudCwgdmEpKVxuICB9LFxuICBzZXR1cDogZnVuY3Rpb24gKGVsZW1lbnQsIHZhKSB7XG4gICAgdmFyICRlID0gJChlbGVtZW50KVxuICAgIHZhciBleGFtcGxlID0ga28udW53cmFwKHZhKCkpXG4gICAgdmFyIHJlZ2lzdGVyZWRDb21wb25lbnRzID0gbmV3IFNldCgpXG5cbiAgICBmdW5jdGlvbiByZXNldEVsZW1lbnQoKSB7XG4gICAgICBpZiAoZWxlbWVudC5jaGlsZHJlblswXSkge1xuICAgICAgICBrby5jbGVhbk5vZGUoZWxlbWVudC5jaGlsZHJlblswXSlcbiAgICAgIH1cbiAgICAgICRlLmVtcHR5KCkuYXBwZW5kKGA8ZGl2IGNsYXNzPSdleGFtcGxlICR7ZXhhbXBsZS5jc3N9Jz5gKVxuICAgIH1cbiAgICByZXNldEVsZW1lbnQoKVxuXG4gICAgZnVuY3Rpb24gb25FcnJvcihtc2cpIHtcbiAgICAgICQoZWxlbWVudClcbiAgICAgICAgLmh0bWwoYDxkaXYgY2xhc3M9J2Vycm9yJz5FcnJvcjogJHttc2d9PC9kaXY+YClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmYWtlUmVnaXN0ZXIobmFtZSwgc2V0dGluZ3MpIHtcbiAgICAgIGtvLmNvbXBvbmVudHMub3JpZ2luYWxSZWdpc3RlcihuYW1lLCBzZXR0aW5ncylcbiAgICAgIHJlZ2lzdGVyZWRDb21wb25lbnRzLmFkZChuYW1lKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyQ29tcG9uZW50UmVnaXN0ZXIoKSB7XG4gICAgICByZWdpc3RlcmVkQ29tcG9uZW50cy5mb3JFYWNoKCh2KSA9PiBrby5jb21wb25lbnRzLnVucmVnaXN0ZXIodikpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcbiAgICAgIHZhciBzY3JpcHQgPSBleGFtcGxlLmZpbmFsSmF2YXNjcmlwdCgpXG4gICAgICB2YXIgaHRtbCA9IGV4YW1wbGUuaHRtbCgpXG5cbiAgICAgIGlmIChzY3JpcHQgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICBvbkVycm9yKHNjcmlwdClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmICghaHRtbCkge1xuICAgICAgICBvbkVycm9yKFwiVGhlcmUncyBubyBIVE1MIHRvIGJpbmQgdG8uXCIpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgLy8gU3R1YiBrby5hcHBseUJpbmRpbmdzXG4gICAgICBrby5hcHBseUJpbmRpbmdzID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy8gV2UgaWdub3JlIHRoZSBgbm9kZWAgYXJndW1lbnQgaW4gZmF2b3VyIG9mIHRoZSBleGFtcGxlcycgbm9kZS5cbiAgICAgICAga28ub3JpZ2luYWxBcHBseUJpbmRpbmdzKGUsIGVsZW1lbnQuY2hpbGRyZW5bMF0pXG4gICAgICB9XG5cbiAgICAgIGtvLmNvbXBvbmVudHMucmVnaXN0ZXIgPSBmYWtlUmVnaXN0ZXJcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzZXRFbGVtZW50KClcbiAgICAgICAgY2xlYXJDb21wb25lbnRSZWdpc3RlcigpXG4gICAgICAgICQoZWxlbWVudC5jaGlsZHJlblswXSkuaHRtbChodG1sKVxuICAgICAgICB2YXIgZm4gPSBuZXcgRnVuY3Rpb24oJ25vZGUnLCBzY3JpcHQpXG4gICAgICAgIGtvLmRlcGVuZGVuY3lEZXRlY3Rpb24uaWdub3JlKGZuLCBudWxsLCBbZWxlbWVudC5jaGlsZHJlblswXV0pXG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgb25FcnJvcihlKVxuICAgICAgfVxuICAgIH1cblxuICAgIGtvLmNvbXB1dGVkKHtcbiAgICAgIGRpc3Bvc2VXaGVuTm9kZUlzUmVtb3ZlZDogZWxlbWVudCxcbiAgICAgIHJlYWQ6IHJlZnJlc2hcbiAgICB9KVxuXG4gICAga28udXRpbHMuZG9tTm9kZURpc3Bvc2FsLmFkZERpc3Bvc2VDYWxsYmFjayhlbGVtZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICBjbGVhckNvbXBvbmVudFJlZ2lzdGVyKClcbiAgICB9KVxuXG4gICAgcmV0dXJuIHtjb250cm9sc0Rlc2NlbmRhbnRCaW5kaW5nczogdHJ1ZX1cbiAgfVxufVxuIiwiLyogZ2xvYmFsIHNldHVwRXZlbnRzLCBFeGFtcGxlLCBEb2N1bWVudGF0aW9uLCBBUEkgKi9cbnZhciBhcHBDYWNoZVVwZGF0ZUNoZWNrSW50ZXJ2YWwgPSBsb2NhdGlvbi5ob3N0bmFtZSA9PT0gJ2xvY2FsaG9zdCcgPyAyNTAwIDogKDEwMDAgKiA2MCAqIDE1KVxuXG52YXIgbmF0aXZlVGVtcGxhdGluZyA9ICdjb250ZW50JyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpXG5cblxuZnVuY3Rpb24gbG9hZEh0bWwodXJpKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHVyaSkpXG4gICAgLnRoZW4oZnVuY3Rpb24gKGh0bWwpIHtcbiAgICAgIGlmICh0eXBlb2YgaHRtbCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBVbmFibGUgdG8gZ2V0ICR7dXJpfTpgLCBodG1sKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFuYXRpdmVUZW1wbGF0aW5nKSB7XG4gICAgICAgICAgLy8gUG9seWZpbGwgdGhlIDx0ZW1wbGF0ZT4gdGFnIGZyb20gdGhlIHRlbXBsYXRlcyB3ZSBsb2FkLlxuICAgICAgICAgIC8vIEZvciBhIG1vcmUgaW52b2x2ZWQgcG9seWZpbGwsIHNlZSBlLmcuXG4gICAgICAgICAgLy8gICBodHRwOi8vanNmaWRkbGUubmV0L2JyaWFuYmxha2VseS9oM0VtWS9cbiAgICAgICAgICBodG1sID0gaHRtbC5yZXBsYWNlKC88XFwvP3RlbXBsYXRlL2csIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgICAgICAgIGlmIChtYXRjaCA9PT0gXCI8dGVtcGxhdGVcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIjxzY3JpcHQgdHlwZT0ndGV4dC94LXRlbXBsYXRlJ1wiXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiPC9zY3JpcHRcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgJChgPGRpdiBpZD0ndGVtcGxhdGVzLS0ke3VyaX0nPmApXG4gICAgICAgICAgLmFwcGVuZChodG1sKVxuICAgICAgICAgIC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KVxuICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGxvYWRUZW1wbGF0ZXMoKSB7XG4gIHJldHVybiBsb2FkSHRtbCgnYnVpbGQvdGVtcGxhdGVzLmh0bWwnKVxufVxuXG5mdW5jdGlvbiBsb2FkTWFya2Rvd24oKSB7XG4gIHJldHVybiBsb2FkSHRtbChcImJ1aWxkL21hcmtkb3duLmh0bWxcIilcbn1cblxuXG5mdW5jdGlvbiByZUNoZWNrQXBwbGljYXRpb25DYWNoZSgpIHtcbiAgdmFyIGFjID0gd2luZG93LmFwcGxpY2F0aW9uQ2FjaGVcbiAgaWYgKGFjLnN0YXR1cyA9PT0gYWMuSURMRSkgeyBhYy51cGRhdGUoKSB9XG4gIHNldFRpbWVvdXQocmVDaGVja0FwcGxpY2F0aW9uQ2FjaGUsIGFwcENhY2hlVXBkYXRlQ2hlY2tJbnRlcnZhbClcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JBcHBsaWNhdGlvblVwZGF0ZSgpIHtcbiAgdmFyIGFjID0gd2luZG93LmFwcGxpY2F0aW9uQ2FjaGVcbiAgaWYgKCFhYykgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkgfVxuICBhYy5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGZ1bmN0aW9uKGV2dCkge1xuICAgIGlmIChldnQubGVuZ3RoQ29tcHV0YWJsZSkge1xuICAgICAgd2luZG93LiRyb290LnJlbG9hZFByb2dyZXNzKGV2dC5sb2FkZWQgLyBldnQudG90YWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy4kcm9vdC5yZWxvYWRQcm9ncmVzcyhmYWxzZSlcbiAgICB9XG4gIH0sIGZhbHNlKVxuICBhYy5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGVyZWFkeScsIGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuJHJvb3QuY2FjaGVJc1VwZGF0ZWQodHJ1ZSlcbiAgfSlcbiAgaWYgKGFjLnN0YXR1cyA9PT0gYWMuVVBEQVRFUkVBRFkpIHtcbiAgICAvLyBSZWxvYWQgdGhlIHBhZ2UgaWYgd2UgYXJlIHN0aWxsIGluaXRpYWxpemluZyBhbmQgYW4gdXBkYXRlIGlzIHJlYWR5LlxuICAgIGxvY2F0aW9uLnJlbG9hZCgpXG4gIH1cbiAgcmVDaGVja0FwcGxpY2F0aW9uQ2FjaGUoKVxuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbn1cblxuXG5mdW5jdGlvbiBnZXRFeGFtcGxlcygpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgoe1xuICAgIHVybDogJ2J1aWxkL2V4YW1wbGVzLmpzb24nLFxuICAgIGRhdGFUeXBlOiAnanNvbidcbiAgfSkpLnRoZW4oKHJlc3VsdHMpID0+XG4gICAgT2JqZWN0LmtleXMocmVzdWx0cykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgdmFyIHNldHRpbmcgPSByZXN1bHRzW25hbWVdXG4gICAgICBFeGFtcGxlLnNldChzZXR0aW5nLmlkIHx8IG5hbWUsIHNldHRpbmcpXG4gICAgfSlcbiAgKVxufVxuXG5mdW5jdGlvbiBnZXRCb29rcygpIHtcbiAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgkLmFqYXgoe1xuICAgIHVybDogJ2J1aWxkL2Jvb2tzLmpzb24nLFxuICAgIGRhdGFUeXBlOiAnanNvbidcbiAgfSkpXG4gIC50aGVuKChyZXN1bHRzKSA9PiAkcm9vdC5yZWdpc3RlckJvb2tzKHJlc3VsdHMpKVxufVxuXG5cbmZ1bmN0aW9uIGxvYWRBUEkoKSB7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoJC5hamF4KHtcbiAgICB1cmw6ICdidWlsZC9hcGkuanNvbicsXG4gICAgZGF0YVR5cGU6ICdqc29uJ1xuICB9KSkudGhlbigocmVzdWx0cykgPT5cbiAgICByZXN1bHRzLmFwaS5mb3JFYWNoKGZ1bmN0aW9uIChhcGlGaWxlTGlzdCkge1xuICAgICAgLy8gV2UgZXNzZW50aWFsbHkgaGF2ZSB0byBmbGF0dGVuIHRoZSBhcGkgKEZJWE1FKVxuICAgICAgYXBpRmlsZUxpc3QuZm9yRWFjaChBUEkuYWRkKVxuICAgIH0pXG4gIClcbn1cblxuXG5mdW5jdGlvbiBnZXRQbHVnaW5zKCkge1xuICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCQuYWpheCh7XG4gICAgdXJsOiAnYnVpbGQvcGx1Z2lucy5qc29uJyxcbiAgICBkYXRhVHlwZTogJ2pzb24nXG4gIH0pKS50aGVuKChyZXN1bHRzKSA9PiAkcm9vdC5yZWdpc3RlclBsdWdpbnMocmVzdWx0cykpXG59XG5cblxuZnVuY3Rpb24gYXBwbHlCaW5kaW5ncygpIHtcbiAgd2luZG93LiRyb290ID0gbmV3IFBhZ2UoKVxuICBrby5hcHBseUJpbmRpbmdzKHdpbmRvdy4kcm9vdClcbn1cblxuXG5mdW5jdGlvbiBwYWdlTG9hZGVkKCkge1xuICBpZiAobG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZignLmh0bWwnKSA9PT0gLTEpIHtcbiAgICB3aW5kb3cuJHJvb3Qub3BlbihcImludHJvXCIpXG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgUHJvbWlzZS5hbGwoW2xvYWRUZW1wbGF0ZXMoKSwgbG9hZE1hcmtkb3duKCldKVxuICAgIC50aGVuKERvY3VtZW50YXRpb24uaW5pdGlhbGl6ZSlcbiAgICAudGhlbihhcHBseUJpbmRpbmdzKVxuICAgIC50aGVuKGdldEV4YW1wbGVzKVxuICAgIC50aGVuKGxvYWRBUEkpXG4gICAgLnRoZW4oZ2V0UGx1Z2lucylcbiAgICAudGhlbihnZXRCb29rcylcbiAgICAudGhlbihzZXR1cEV2ZW50cylcbiAgICAudGhlbihjaGVja0ZvckFwcGxpY2F0aW9uVXBkYXRlKVxuICAgIC50aGVuKHBhZ2VMb2FkZWQpXG4gICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHdpbmRvdy4kcm9vdC5ib2R5KFwiZXJyb3JcIilcbiAgICAgIHdpbmRvdy4kcm9vdC5lcnJvck1lc3NhZ2UoZXJyLm1lc3NhZ2UgfHwgZXJyKVxuICAgICAgY29uc29sZS5lcnJvcihlcnIpXG4gICAgfSlcbn1cblxuJChzdGFydClcbiIsIi8qZ2xvYmFsIHNldHVwRXZlbnRzKi9cbi8qIGVzbGludCBuby11bnVzZWQtdmFyczogMCAqL1xuXG52YXIgU0NST0xMX0RFQk9VTkNFID0gMjAwXG5cbmZ1bmN0aW9uIGlzTG9jYWwoYW5jaG9yKSB7XG4gIHJldHVybiAobG9jYXRpb24ucHJvdG9jb2wgPT09IGFuY2hvci5wcm90b2NvbCAmJlxuICAgICAgICAgIGxvY2F0aW9uLmhvc3QgPT09IGFuY2hvci5ob3N0KVxufVxuXG4vLyBNYWtlIHN1cmUgaW4gbm9uLXNpbmdsZS1wYWdlLWFwcCBtb2RlIHRoYXQgd2UgbGluayB0byB0aGUgcmlnaHQgcmVsYXRpdmVcbi8vIGxpbmsuXG52YXIgYW5jaG9yUm9vdCA9IGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL2FcXC8uKlxcLmh0bWwvLCAnJylcbmZ1bmN0aW9uIHJld3JpdGVBbmNob3JSb290KGV2dCkge1xuICB2YXIgYW5jaG9yID0gZXZ0LmN1cnJlbnRUYXJnZXRcbiAgdmFyIGhyZWYgPSBhbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJylcbiAgLy8gU2tpcCBub24tbG9jYWwgdXJscy5cbiAgaWYgKCFpc0xvY2FsKGFuY2hvcikpIHsgcmV0dXJuIHRydWUgfVxuICAvLyBBbHJlYWR5IHJlLXJvb3RlZFxuICBpZiAoYW5jaG9yLnBhdGhuYW1lLmluZGV4T2YoYW5jaG9yUm9vdCkgPT09IDApIHsgcmV0dXJuIHRydWUgfVxuICBhbmNob3IuaHJlZiA9IGAke2FuY2hvclJvb3R9JHthbmNob3IucGF0aG5hbWV9YC5yZXBsYWNlKCcvLycsICcvJylcbiAgcmV0dXJuIHRydWVcbn1cblxuXG5mdW5jdGlvbiBzY3JvbGxUb0hhc2goYW5jaG9yKSB7XG4gIGlmICghYW5jaG9yLmhhc2gpIHtcbiAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKDApXG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgIC8vIFdlIG5vcm1hbGl6ZSB0aGUgbGlua3Mg4oCTIHRoZSBkb2NzIHVzZSBfIGFuZCAtIGluY29uc2lzdGVudGx5IGFuZFxuICAgIC8vIHNlZW1pbmdseSBpbnRlcmNoYW5nZWFibHk7IHdlIGNvdWxkIGdvIHRocm91Z2ggYW5kIHNwb3QgZXZlcnkgZGlmZmVyZW5jZVxuICAgIC8vIGJ1dCB0aGlzIGlzIGp1c3QgZWFzaWVyIGZvciBub3cuXG4gICAgYW5jaG9yLmhhc2guc3Vic3RyaW5nKDEpLnJlcGxhY2UoL18vZywgJy0nKVxuICApXG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBCYWQgYW5jaG9yOiAke2FuY2hvci5oYXNofSBmcm9tICR7YW5jaG9yLmhyZWZ9YClcbiAgfVxuICAvLyBXZSBkZWZlciB1bnRpbCB0aGUgbGF5b3V0IGlzIGNvbXBsZXRlZC5cbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7XG4gICAgICBzY3JvbGxUb3A6ICQodGFyZ2V0KS5vZmZzZXQoKS50b3BcbiAgICB9LCAxNTApXG4gIH0sIDE1KVxufVxuXG4vL1xuLy8gRm9yIEpTIGhpc3Rvcnkgc2VlOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Rldm90ZS9IVE1MNS1IaXN0b3J5LUFQSVxuLy9cbmZ1bmN0aW9uIG9uQW5jaG9yQ2xpY2soZXZ0KSB7XG4gIHZhciBhbmNob3IgPSB0aGlzXG4gIHJld3JpdGVBbmNob3JSb290KGV2dClcbiAgaWYgKCRyb290Lm5vU1BBKCkpIHsgcmV0dXJuIHRydWUgfVxuICAvLyBEbyBub3QgaW50ZXJjZXB0IGNsaWNrcyBvbiB0aGluZ3Mgb3V0c2lkZSB0aGlzIHBhZ2VcbiAgaWYgKCFpc0xvY2FsKGFuY2hvcikpIHsgcmV0dXJuIHRydWUgfVxuXG4gIC8vIERvIG5vdCBpbnRlcmNlcHQgY2xpY2tzIG9uIGFuIGVsZW1lbnQgaW4gYW4gZXhhbXBsZS5cbiAgaWYgKCQoYW5jaG9yKS5wYXJlbnRzKFwibGl2ZS1leGFtcGxlXCIpLmxlbmd0aCAhPT0gMCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICB0cnkge1xuICAgIHZhciB0ZW1wbGF0ZUlkID0gJHJvb3QucGF0aFRvVGVtcGxhdGUoYW5jaG9yLnBhdGhuYW1lKVxuICAgIC8vIElmIHRoZSB0ZW1wbGF0ZSBpc24ndCBmb3VuZCwgcHJlc3VtZSBhIGhhcmQgbGlua1xuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJZCkpIHsgcmV0dXJuIHRydWUgfVxuICAgIGlmICgkcm9vdC5ib2R5KCkgIT09IHRlbXBsYXRlSWQpIHtcbiAgICAgIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIGFuY2hvci5ocmVmKVxuICAgICAgZG9jdW1lbnQudGl0bGUgPSBgS25vY2tvdXQuanMg4oCTICR7JCh0aGlzKS50ZXh0KCl9YFxuICAgICAgJHJvb3Qub3Blbih0ZW1wbGF0ZUlkKVxuICAgICAgJHJvb3Quc2VhcmNoLnF1ZXJ5KG51bGwpXG4gICAgfVxuICAgIHNjcm9sbFRvSGFzaChhbmNob3IpXG4gIH0gY2F0Y2goZSkge1xuICAgIGNvbnNvbGUubG9nKGBFcnJvci8ke2FuY2hvci5nZXRBdHRyaWJ1dGUoJ2hyZWYnKX1gLCBlKVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG5cbmZ1bmN0aW9uIG9uUG9wU3RhdGUoLyogZXZ0ICovKSB7XG4gIC8vIE5vdGUgaHR0cHM6Ly9naXRodWIuY29tL2Rldm90ZS9IVE1MNS1IaXN0b3J5LUFQSVxuICBpZiAoJHJvb3Qubm9TUEEoKSkgeyByZXR1cm4gfVxuICAkcm9vdC5vcGVuKGxvY2F0aW9uLnBhdGhuYW1lKVxufVxuXG5cbmZ1bmN0aW9uIHNldHVwRXZlbnRzKCkge1xuICBpZiAod2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKSB7XG4gICAgJChkb2N1bWVudC5ib2R5KS5vbignY2xpY2snLCBcImFcIiwgb25BbmNob3JDbGljaylcbiAgICAkKHdpbmRvdykub24oJ3BvcHN0YXRlJywgb25Qb3BTdGF0ZSlcbiAgfSBlbHNlIHtcbiAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCdjbGljaycsIHJld3JpdGVBbmNob3JSb290KVxuICB9XG4gICQod2luZG93KS5vbignc2Nyb2xsJywgdGhyb3R0bGUoY2hlY2tJdGVtc0luVmlldywgU0NST0xMX0RFQk9VTkNFKSlcbn1cbiIsIlxuXG52YXIgaW5WaWV3V2F0Y2ggPSBuZXcgTWFwKClcblxuXG4vLyBTRWUgYWxzbyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83NTU3NDMzLzE5MjEyXG5mdW5jdGlvbiBpc0FsbW9zdEluVmlldyhlbCkge1xuICB2YXIgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gIHZhciB3aW5IZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxuXG4gIC8vIEl0ZW1zIGFyZSBhbG1vc3QgaW4gdmlldyB3aGVuIHdlJ3ZlIHNjcm9sbGVkIGRvd24gdG8gMjAwcHggYWJvdmUgdGhlaXJcbiAgLy8gcHJlc2VuY2Ugb24gdGhlIHBhZ2UgaS5lLiBqdXN0IGJlZm9yZSB0aGUgdXNlciBnZXRzIHRvIHRoZW0uXG4gIHJldHVybiByZWN0LnRvcCA8IHdpbkhlaWdodCArIDIwMFxufVxuXG5cbmZ1bmN0aW9uIGNoZWNrSXRlbXNJblZpZXcoKSB7XG4gIGZvciAodmFyIGVsZW1lbnQgb2YgaW5WaWV3V2F0Y2gua2V5cygpKSB7XG4gICAgaWYgKGlzQWxtb3N0SW5WaWV3KGVsZW1lbnQpKSB7XG4gICAgICAvLyBJbnZva2UgdGhlIGNhbGxiYWNrLlxuICAgICAgaW5WaWV3V2F0Y2guZ2V0KGVsZW1lbnQpKClcbiAgICAgIGluVmlld1dhdGNoLmRlbGV0ZShlbGVtZW50KVxuICAgIH1cbiAgfVxufVxuXG5cbi8vIFNjaGVkdWxlIHRoZSBjYWxsYmFjayBmb3Igd2hlbiB0aGUgZWxlbWVudCBjb21lcyBpbnRvIHZpZXcuXG4vLyBUaGlzIGlzIGluIHNvbWUgd2F5cyBhIHBvb3IgbWFuJ3MgcmVxdWVzdElkbGVDYWxsYmFja1xuLy8gaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vd2ViL3VwZGF0ZXMvMjAxNS8wOC8yNy91c2luZy1yZXF1ZXN0aWRsZWNhbGxiYWNrXG5mdW5jdGlvbiB3aGVuQWxtb3N0SW5WaWV3KGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gIGlmIChpc0FsbW9zdEluVmlldyhlbGVtZW50KSkge1xuICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIDEpXG4gIH0gZWxzZSB7XG4gICAgaW5WaWV3V2F0Y2guc2V0KGVsZW1lbnQsIGNhbGxiYWNrKVxuICAgIGtvLnV0aWxzLmRvbU5vZGVEaXNwb3NhbC5hZGREaXNwb3NlQ2FsbGJhY2soZWxlbWVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgaW5WaWV3V2F0Y2guZGVsZXRlKGVsZW1lbnQpXG4gICAgfSlcbiAgfVxufVxuIiwiXG5cbmtvLmZpbHRlcnMuZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIChkYXRlU3RyaW5nLCBmb3JtYXQgPSBcIk1NTSBEbyBZWVlZXCIpIHtcbiAgcmV0dXJuIG1vbWVudChkYXRlU3RyaW5nKS5mb3JtYXQoZm9ybWF0KVxufVxuIiwiXG53aW5kb3cubGlua3MgPSBbXG4gIHsgaHJlZjogXCJodHRwczovL2dyb3Vwcy5nb29nbGUuY29tL2ZvcnVtLyMhZm9ydW0va25vY2tvdXRqc1wiLFxuICAgIHRpdGxlOiBcIkdvb2dsZSBHcm91cHNcIixcbiAgICBpY29uOiBcImZhLWdvb2dsZVwifSxcbiAgeyBocmVmOiBcImh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS90YWdzL2tub2Nrb3V0LmpzL2luZm9cIixcbiAgICB0aXRsZTogXCJTdGFja092ZXJmbG93XCIsXG4gICAgaWNvbjogXCJmYS1zdGFjay1vdmVyZmxvd1wifSxcbiAgeyBocmVmOiAnaHR0cHM6Ly9naXR0ZXIuaW0va25vY2tvdXQvdGtvJyxcbiAgICB0aXRsZTogXCJHaXR0ZXJcIixcbiAgICBpY29uOiBcImZhLWNvbW1lbnRzLW9cIn0sXG4gIHsgaHJlZjogJ2xlZ2FjeS8nLFxuICAgIHRpdGxlOiBcIkxlZ2FjeSB3ZWJzaXRlXCIsXG4gICAgaWNvbjogXCJmYSBmYS1oaXN0b3J5XCJ9XG5dXG5cbndpbmRvdy5naXRodWJMaW5rcyA9IFtcbiAgeyBocmVmOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9rbm9ja291dC90a29cIixcbiAgICB0aXRsZTogXCJSZXBvc2l0b3J5XCIsXG4gICAgaWNvbjogXCJmYS1naXRodWJcIn0sXG4gIHsgaHJlZjogXCJodHRwczovL2dpdGh1Yi5jb20va25vY2tvdXQvdGtvL2lzc3Vlcy9cIixcbiAgICB0aXRsZTogXCJJc3N1ZXNcIixcbiAgICBpY29uOiBcImZhLWV4Y2xhbWF0aW9uLWNpcmNsZVwifSxcbiAgeyBocmVmOiAnaHR0cHM6Ly9naXRodWIuY29tL2tub2Nrb3V0L3Rrby9yZWxlYXNlcycsXG4gICAgdGl0bGU6IFwiUmVsZWFzZXNcIixcbiAgICBpY29uOiBcImZhLWNlcnRpZmljYXRlXCJ9XG5dXG5cbndpbmRvdy5jZG4gPSBbXG4gIHsgbmFtZTogXCJNaWNyb3NvZnQgQ0ROXCIsXG4gICAgdmVyc2lvbjogXCIzLjMuMFwiLFxuICAgIG1pbjogXCJodHRwOi8vYWpheC5hc3BuZXRjZG4uY29tL2FqYXgva25vY2tvdXQva25vY2tvdXQtMy4zLjAuanNcIixcbiAgICBkZWJ1ZzogXCJodHRwOi8vYWpheC5hc3BuZXRjZG4uY29tL2FqYXgva25vY2tvdXQva25vY2tvdXQtMy4zLjAuZGVidWcuanNcIlxuICB9LFxuICB7IG5hbWU6IFwiQ2xvdWRGbGFyZSBDRE5cIixcbiAgICB2ZXJzaW9uOiBcIjMuMy4wXCIsXG4gICAgbWluOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2tub2Nrb3V0LzMuMy4wL2tub2Nrb3V0LW1pbi5qc1wiLFxuICAgIGRlYnVnOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2tub2Nrb3V0LzMuMy4wL2tub2Nrb3V0LWRlYnVnLmpzXCJcbiAgfVxuXVxuIiwiLy9cbi8vIFNpbXBsZSB0aHJvdHRsZS5cbi8vXG5cbmZ1bmN0aW9uIHRocm90dGxlKGZuLCBpbnRlcnZhbCkge1xuICB2YXIgaXNXYWl0aW5nID0gZmFsc2VcblxuICB2YXIgd3JhcCA9IGZ1bmN0aW9uIHRocm90dGxlZCgpIHtcbiAgICBpZiAoaXNXYWl0aW5nKSB7IHJldHVybiB9XG4gICAgaXNXYWl0aW5nID0gdHJ1ZVxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaXNXYWl0aW5nID0gZmFsc2VcbiAgICAgIGZuKClcbiAgICB9LCBpbnRlcnZhbClcbiAgfVxuXG4gIHJldHVybiB3cmFwXG59XG4iXX0=
