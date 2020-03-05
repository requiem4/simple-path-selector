/**
 * Created by Alexander Luzhanovskyi
 * Created at 05.03.2020 09:48
 */
/**
 * SmcBox component.
 * Helps us to load styles and append itself to body
 * @type {{
 *  directiveName: string,
 *  appendSmcBox: SmcBox.appendSmcBox,
 *  setSmcBoxPath: SmcBox.setSmcBoxPath,
 *  appendSmcBoxStyles: SmcBox.appendSmcBoxStyles
 *  }}
 */
const SmcBox = {
  directiveName: 'smc-path-box',
  defaultTitle: 'Selector path: ',
  styleLink: '../assets/css/app.css',
  setSmcBoxPath: function (path) {
    var box = document.querySelector(this.directiveName)
    box.innerHTML = this.defaultTitle + path
  },
  appendSmcBox: function (appendTo) {
    var box = document.createElement(this.directiveName)
    box.innerHTML = this.defaultTitle
    appendTo.append(box)
  },
  appendSmcBoxStyles: function (appendTo) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = this.styleLink;
    appendTo.appendChild(link);
  },
}
/**
 * DomElement component.
 * Helps us to get and set DOM Element Path.
 * Add hover attribute to DOM Element.
 *
 * @type {{getParentElements: (function(*=): []),
 * onMouseClick: DomElement.onMouseClick,
 * hoverAttribute: string,
 * getElementPath: (function(): string),
 * showQuantityInPath: boolean "Check if we need to show Element number",
 * showClassInPath: boolean "Check if we need to add Class in Element Path",
 * onMouseEnter: DomElement.onMouseEnter,
 * setFullElementPath: (function(*): string),
 * onMouseLeave: DomElement.onMouseLeave,
 * currentElementPath: string}}
 */
const DomElement = {
  hoverAttribute: 'data-smc-hover',
  currentElementPath: '',
  showClassInPath: false,
  showQuantityInPath: true,
  getParentElements: function (element) {
    let elements = []
    let body = document.querySelector('body')
    while (element) {
      var parentNode = element.parentNode
      element.numberInDom = 0
      if (parentNode) {
        element.numberInDom = Array.from(parentNode.children).indexOf(element)
      }
      elements.unshift(element);
      if (element.id || parentNode.isEqualNode(body)) {
        break;
      }
      element = element.parentNode;
    }
    return elements
  },
  setFullElementPath: function (elements) {
    this.currentElementPath = '';
    elements.forEach((element, index) => {
      this.currentElementPath += element.nodeName.toLowerCase()
      /**
       * Add element ID to path if exists
       */
      if (element.id) {
        this.currentElementPath += ' #' + element.id
      }
      /**
       * Add element Class to path if exists. Check if we set option showInClassPath
       */
      if (element.className && this.showClassInPath) {
        this.currentElementPath += ' .' + element.className
      }
      /**
       * Add element number in parent node. Check if we set option showQuantityInPath
       */
      if (this.showQuantityInPath) {
        this.currentElementPath += ' :eq(' + element.numberInDom + ')'
      }
      /**
       * Check if not last element
       */
      if (index !== (elements.length - 1)) {
        this.currentElementPath += ' > '
      }
    })
    return this.currentElementPath
  },
  getElementPath: function () {
    return this.currentElementPath;
  },
  onMouseClick: function (event) {
    event.preventDefault();
    let element = event.target
    let elements = DomElement.getParentElements(element)
    let path = DomElement.setFullElementPath(elements)
    SmcBox.setSmcBoxPath(path)
  },
  onMouseEnter: function (event) {
    const hoverElement = event.target
    if (!hoverElement.hasAttribute(DomElement.hoverAttribute)) {
      hoverElement.setAttribute(DomElement.hoverAttribute, true)
    }
  },
  onMouseLeave: function (event) {
    const hoverElement = event.target
    if (hoverElement.hasAttribute(DomElement.hoverAttribute)) {
      hoverElement.removeAttribute(DomElement.hoverAttribute)
    }
  }
}
/**
 * Start our app
 * 1. Set up onmousemove Event
 * 2. Append Smc Box to the page
 * 3. Append Smc Styles to the page
 */
document.addEventListener('DOMContentLoaded', function () {
  var body = document.querySelector('body')
  var head = document.querySelector('head');

  /**
   * When we trigger mouse we add
   * onmouseenter, onclick and onmouseleave Event
   * Trigger onmouseenter Event
   * @param event
   */
  function onMouseMove(event) {
    event.target.onmouseenter = DomElement.onMouseEnter
    event.target.onclick = DomElement.onMouseClick
    event.target.onmouseleave = DomElement.onMouseLeave
    if (event && event.target) {
      event.target.onmouseenter(event)
    }
  }

  body.onmousemove = onMouseMove

  SmcBox.appendSmcBox(body)
  SmcBox.appendSmcBoxStyles(head)
});

