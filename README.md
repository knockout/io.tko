# TKO Homepage

This is the Github pages for the Knockout repository.

## Layout

All the tasks to create and update the site are though gulp.

For specifics, check the `gulpfile.js`.


The `config.yaml` file contains a number of settings for the gulp tasks.


Generally speaking, everything served comes from the `a/` or `build/` directories.

### HTML

The document pages start as markdown in `markdown/`. Headers and footers are
added from `config.yaml`.

The pages are built as both single-page and multi-page.

### Scripts

Scripts from third parties are included in the header of `config.yaml` from
CDNs, or included in `libs.js` based on the `libs.js` settings of `config.yaml`.

Inline scripts are aggregated in no particular order and transpiled with Babel using ES2015 presets into `app.js`.


### Assets

CSS is compiled from less in `less/`.

Images are symlinked from the `build/` directory.

The markdown for each "page" is compiled into `build/markdown.html` (which is only used for the single-page app).

Arbitrary HTML templates are included from `templates/` in `build/templates.html`

Examples (`build/examples.json`) are compiled from the `examples/` directory.  Examples are included by reference from the markdown files, like this:

```html
<live-example params='id: "textinput-binding"'></live-example>
```

Then in `examples/textinput-binding.yaml` specify the name, html, and javascript:

```yaml
name: textInput binding example
html: |-
  <p>Login name: <input data-bind="textInput: userName" /></p>
  <p>Password: <input type="password" data-bind="textInput: userPassword" /></p>

  ViewModel:
  <pre data-bind="text: $root|json"></pre>
javascript: |-
  ko.applyBindings({
      userName: ko.observable(""),        // Initially blank
      userPassword: ko.observable("abc")  // Prepopulate
  });
```


Books (`build/books.json`) are listed in `config.yaml`

Plugins (`build/plugins.json`) are listed in `config.yaml`


## Future / TODO

- Internationalization (`a/` becomes `en/`, `fr/` etc)
- Versioning of documents and access to old versions
- API documentation from the source
- Clean up the legacy / Jekyll from the old KO docs
- Fix access to legacy docs