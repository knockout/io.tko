/*globals Example */
/* eslint no-unused-vars: 0, camelcase:0*/

var EXTERNAL_INCLUDES = [
  "https://cdn.rawgit.com/knockout/tko/v4.0.0-alpha1/dist/ko.js"
]

class LiveExampleComponent {
  constructor(params) {
    if (params.id) {
      this.example = Example.get(ko.unwrap(params.id))
    }
    if (params.base64) {
      var opts =
      this.example = new Example(JSON.parse(atob(params.base64)))
    }
    if (!this.example) {
      throw new Error("Example must be provided by id or base64 parameter")
    }
  }

  openCommonSettings() {
    var ex = this.example
    var dated = new Date().toLocaleString()
    var jsPrefix = `/**
 * Created from an example on the Knockout website
 * on ${new Date().toLocaleString()}
 **/

 /** Example is as follows **/
`
    return {
      html: ex.html(),
      js: jsPrefix + ex.finalJavascript(),
      title: `From Knockout example`,
      description: `Created on ${dated}`
    }
  }
  
  openFormInNewWindow(url, $fields) {
    var w = window.open("about:blank")
    var $form = $(`<form action="${url}" method="POST"> </form>`)
    $form.append($fields)
    w.document.write($form[0].outerHTML)
    w.document.forms[0].submit()
  }

  openFiddle(self, evt) {
    // See: http://doc.jsfiddle.net/api/post.html
    evt.preventDefault()
    evt.stopPropagation()
    var fields = ko.utils.extend({
      dtd: "HTML 5",
      wrap: 'l',
      resources: EXTERNAL_INCLUDES.join(",")
    }, this.openCommonSettings())
    this.openFormInNewWindow(
      "http://jsfiddle.net/api/post/library/pure/", 
      $.map(fields, (v, k) => $(`<input type='hidden' name='${k}'>`).val(v))
    )
  }

  openPen(self, evt) {
    // See: http://blog.codepen.io/documentation/api/prefill/
    evt.preventDefault()
    evt.stopPropagation()
    var opts = ko.utils.extend({
      js_external: EXTERNAL_INCLUDES.join(";")
    }, this.openCommonSettings())
    var dataStr = JSON.stringify(opts)
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")

    this.openFormInNewWindow(
      "http://codepen.io/pen/define",
      $(`<input type='hidden' name='data' value='${dataStr}'/>`)
    )
  }
}

ko.components.register('live-example', {
    viewModel: LiveExampleComponent,
    template: {element: "live-example"}
})
