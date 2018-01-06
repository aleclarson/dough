// Testing the main file
describe(".after(html)", function() {

  //var work = false;

  // Default callback for the tests
  function callback(cl){
    return '<a class="bla ' + cl + '">Link</a>';
  }




  beforeEach(function(){
    expect(u('.bla').length).to.equal(0);
  });

  afterEach(function(){
    u('.bla').remove();
  });



  it("should be a function", function() {
    expect(work ? typeof base.after : false).to.equal('function');
  });

  it("can add content in the right place", function() {
    if (work) base.after('<a class="bla">Link</a>');

    size('.bla', 1)('.base + .bla', 1);
  });

  it("accepts a callback that will be called once", function(){
    if (work) base.after(callback);

    size('.bla', 1)('.base + .bla', 1);
  });

  it("accepts a single parameter", function(){
    if (work) base.after(callback, ['a']);

    size('.base + .bla.a', 1);
  });

  it("can add as many as the array", function(){
    if (work) base.after(callback, ['a', 'b']);

    expect(base.html().match('function')).to.equal(null);
    size('.base ~ .bla', 2)('.base ~ .bla.a', 1)('.base ~ .bla.b', 1);
    size('.base + .bla.a + .bla.b', 1);
  });
});


// Testing the main file
describe(".append(html)", function() {

  // Default callback for the tests
  function callback(cl){
    return '<a class="bla ' + cl + '">Link</a>';
  }

  beforeEach(function(){
    expect(u('.bla, .blu').length).to.equal(0);
  });

  afterEach(function(){

    // Just in case it stringifies the callback
    expect(base.html().match('function')).to.equal(null);
    u('.bla, .blu').remove();
  });



  it("should be a function", function() {
    expect(typeof base.append).to.equal('function');
  });

  it("can be called empty", function() {
    base.append();
  });

  it("can be called with empty string", function() {
    base.append("");
  });

  it("a function looping data has right footprint", function() {
    base.append(function(value, index, node, j){
      if (['a', 'b'].indexOf(value) === -1) throw new Error("Not an element");
      if (value === 'a') same(index, 0);
      if (value === 'b') same(index, 1);
      same(node, base.first());
      same(j, 0)
    }, ['a', 'b']);
  });


  it("a function looping a number has right footprint", function() {
    var iterations = 0;
    base.append(function(value, index, node, j){
      if ([0, 1].indexOf(value) === -1) throw new Error("Not an element");
      if (value === 0) same(index, 0);
      if (value === 1) same(index, 1);
      same(node, base.first());
      same(j, 0);
      iterations++;
    }, 2);
    same(iterations, 2);
  });



  // HTML
  describe("HTML string", function(){
    it("can add a link", function() {
      base.append('<a class="bla">Link</a>');
      size('.base > .bla', 1);
    });

    it("can add sibling links", function() {
      base.append('<a class="bla">Link</a><a class="bla">Link</a>');
      size('.base > .bla', 2);
    });

    it("can add nested content", function() {
      base.append('<strong class="bla"><a>Link</a></strong>');
      size('.base > .bla > a', 1);
    });

    it("can append a table row", function() {
      u('table.tbl').append('<tr><td>Hi</td></tr>');
    });

    it("can add just text", function() {
      var frag = u('<div>').append('Hello world!\n');
      same(frag.html(), 'Hello world!\n');
    });
  });

  describe("HTML string looped with array", function(){

    it("insert two links", function() {
      base.append('<a class="bla">Link</a>', ['a', 'b']);
      size('.base > .bla', 2)('.base > .bla:last-child', 1);
    });

    it("can add nested content", function() {
      base.append('<strong class="bla"><a>Link</a></strong>', ['a', 'b']);
      size('.base > .bla > a', 2);
    });

    it("can append simple text", function() {
      var frag = u('<div>').append('Hello!\n', ['a', 'b']);
      same(frag.html(), 'Hello!\nHello!\n');
    });
  });



  // Callback
  describe("Callback", function(){
    it("can add a link", function() {
      base.append(function(){ return '<a class="bla">Link</a>'; });
      size('.base > .bla', 1)('.base > .bla:last-child', 1);
    });

    it("can add sibling links", function() {
      base.append(function(){ return '<a class="bla">Link</a><a class="bla">Link</a>'; });
      size('.base > .bla', 2)('.base > .bla:last-child', 1);
    });

    it("can add nested content", function() {
      base.append(function(){ return '<strong class="bla"><a>Link</a></strong>'; });
      size('.base > .bla > a', 1);
    });

    it("can add just text", function() {
      var frag = u('<div>').append(function(){ return 'Hello world!\n'; });
      same(frag.html(), 'Hello world!\n');
    });
  });

  describe("Callback looped with array", function(){

    it("can add sibling links", function() {
      base.append(function(v){ return '<a class="bla">Link</a>'; }, ['a', 'b']);
      size('.base > .bla', 2)('.base > .bla:last-child', 1);
    });

    it("can add nested content", function() {
      base.append(function(){ return '<strong class="bla"><a>Link</a></strong>'; }, ['a', 'b']);
      size('.base > .bla > a', 2);
    });

    it("can add just text", function() {
      var frag = u('<div>').append(function(){ return 'Hello world!\n'; }, ['a', 'b']);
      same(frag.html(), 'Hello world!\nHello world!\n');
    });

    it("can add content with a callback and data", function() {
      base.append(callback, ['a', 'b']);
      size('.base > .bla', 2)('.base > .bla.a', 1)('.base > .bla.b', 1);
      size('.bla.a + .bla.b', 1)('.bla.b + .bla.a', 0)('.base > .bla.b:last-child', 1);
    });
  });



  describe("Umbrella instance", function(){
    it("Accepts a simple one", function(){
      base.append(u('<div class="bla"></div>'));
      size('.base > .bla', 1)('.base > .bla:last-child', 1);
    });

    it("Keeps the events when appending", function(done){
      base.append(u('<div class="bla">').on('click', function(){ done(); }));
      size('.base > .bla', 1)('.base > .bla:last-child', 1);
      u('.base .bla').trigger('click');
    });

    it("Clones multiple events when appending", function(done){
      base.append(u('<div class="bla">').on('click touch', function(){ done(); }));
      size('.base > .bla', 1)('.base > .bla:last-child', 1);
      u('.base .bla').trigger('touch');
    });
  });



  it("can generate some text", function(){
    var list = u("<div>");
    if (work) list.append(function(n){ return n + "\n" }, ['a', 'b']);

    expect(list.children().length).to.equal(0);
    expect(list.html()).to.equal('a\nb\n');
  });

  it("can generate some text with number", function(){
    var list = u("<div>");
    if (work) list.append(function(n){ return n + "\n" }, 2);

    expect(list.children().length).to.equal(0);
    expect(list.html()).to.equal('0\n1\n');
  });

  it("isn't called any time with 0", function(){
    u('<div>').append(function(n){ throw new Error("Shouldn't be called"); }, 0);
  });



  // Node
  it("can append an html node", function() {
    base.append(u('<div class="bla">').first());
    size('.bla', 1);
  });

  it("should append supplied html to each targeted element and not only the last instance", function() {
    base.append(u('<span class="test-span"></span><span class="test-span"></span><span class="test-span"></span><span class="test-span"></span>'));
    base.append(u('<a class="append-me"></a>'));

    u(".test-span").append(u(".append-me"));

    size(".test-span .append-me", 4);
  });
});


// Testing the main file
describe(".before(html)", function() {

  // Default callback for the tests
  function callback(cl){
    return '<a class="bla ' + cl + '">Link</a>';
  }

  beforeEach(function(){
    expect(u('.bla').length).to.equal(0);
  });

  afterEach(function(){
    u('.bla').remove();
  });

  it("should be a function", function() {
    expect(typeof base.after).to.equal('function');
  });

  it("can add content in the right place", function() {
    base.before('<a class="bla">Link</a>');
    expect(u('.bla').length).to.equal(1);
    expect(base.parent().find('.base, .bla').length).to.equal(2);
    expect(base.parent().find('.bla ~ .base').length).to.equal(1);
  });

  it("second parameter defaults to ''", function(){
    if (work) base.before(callback);

    expect(base.html().match('function')).to.equal(null);
    size('.bla', 1)('.bla + .base', 1);
  });

  it("can add a single one", function(){
    if (work) base.before(callback, ['a']);

    expect(base.html().match('function')).to.equal(null);
    size('.bla', 1)('.bla.a', 1)('.bla.a + .base', 1);
  });

  it("can add as many as the array", function(){
    if (work) base.before(callback, ['a', 'b']);

    expect(base.html().match('function')).to.equal(null);
    size('.bla', 2)('.bla.a', 1)('.bla.b', 1)('.bla.a + .bla.b + .base', 1);
  });
});


  // Testing the main file
describe(".clone(options)", function() {
  afterEach(function(){
    u('.container').remove();
  });

  describe("clone() nodes without events", function() {
    beforeEach(function() {
      base.append('<div class="container">\
        <div class="testClone1">Hello</div>\
        <div class="cloneDestination">Goodbye</div>\
      </div>');
    });

    it("should be a function", function() {
      isFn(base.clone);
    });

    it("should clone a single simple node", function() {
      u('.cloneDestination').append(u('.testClone1'));
      size('.container > .testClone1', 1);
      size('.cloneDestination > .testClone1', 1);
      size('.testClone1', 2);
      expect(u('.cloneDestination > .testClone1').text()).to.eq('Hello');
    });

    it("should clone nested nodes", function() {
      u('.testClone1').append('<div class="testClone2">Hi</div>');

      size('.container > .testClone1 > .testClone2', 1);
      expect(u('.testClone2').text()).to.eq('Hi');
    });
  });



  describe("clone() nodes with events", function() {
    beforeEach(function() {
      base.append('<div class="container">\
        <div class="testClone1">Hello</div>\
        <div class="testClone2">\
          <div class="testCloneWithEvents1">\
            click, touch, etc\
          </div>\
        </div>\
        <div class="cloneDestination"></div>\
      </div>');
    });

    it("should clone a node and its events by default", function(done) {
      u('<div>').on('click', function(e){
        u(e.target).off('click');
        done();
      }).clone().trigger('click').trigger('click');
    });

    it("should clone nested nodes and their events by default", function(done) {
      u('.testCloneWithEvents1').on('click', function() { done(); });
      u('.cloneDestination').append(u('.testClone2'));
      u('.cloneDestination > .testClone2 > .testCloneWithEvents1').trigger('click');
    });
  });



  describe("clone() form elements", function() {
    before(function() {
      u('form.clone [type=text]').first().value = 'test input';
      u('form.clone [type=checkbox]').first().checked = true;
      u('form.clone [type=radio]').first().checked = true;
      u('form.clone select').first().value = 'b';
      u('form.clone textarea').first().value = 'test textarea';
    });

    afterEach(function(){
      u('.destination').html("");
    });

    it("has the correct values initially", function(){
      expect(u('form.clone [type=text]').first().value).to.equal('test input', 'beforeClone');
      expect(u('form.clone [type=checkbox]').first().checked).to.equal(true, 'beforeClone');
      expect(u('form.clone [type=radio]').first().checked).to.equal(true, 'beforeClone');
      expect(u('form.clone select').first().value).to.equal('b', 'beforeClone');
      expect(u('form.clone textarea').first().value).to.equal('test textarea', 'beforeClone');
    });


    it ("clones a full form correctly", function(){
      u('.destination').append(u('form.clone'));
      expect(u('.destination [type=text]').length).to.equal(1);
      expect(u('.destination [type=text]').first().value).to.equal('test input');
      expect(u('.destination [type=checkbox]').first().checked).to.equal(true);
      expect(u('.destination [type=radio]').first().checked).to.equal(true);
      expect(u('.destination select').first().value).to.equal('b');
      expect(u('.destination textarea').first().value).to.equal('test textarea');
    });

    it ("should clone a text input and its value by default", function() {
      u('.destination').append(u('form.clone [type=text]'));
      expect(u('.destination [type=text]').first().value).to.eq('test input');
    });

    it ("should clone a checkbox input and its value by default", function() {
      u('.destination').append(u('form.clone [type=checkbox]'));
      expect(u('.destination [type=checkbox]').first().checked).to.eq(true);
    });

    it ("should clone a radio input and its value by default", function() {
      u('.destination').append(u('form.clone [type=radio]'));
      expect(u('.destination [type=radio]').first().checked).to.eq(true);
    });


    it ("should clone a textarea input and its value by default", function() {
      u('.destination').append(u('form.clone textarea'));
      expect(u('.destination textarea').first().value).to.eq('test textarea');
    });

    it ("should clone a select input and its value by default", function() {
      u('.destination').append(u('form.clone select'));
      expect(u('.destination select').first().value).to.eq('b');
    });
  });




  describe(".clone() and node data attributes", function() {
    beforeEach(function() {
      base.append('<div class="container"><div class="testCloneData" data-foo="bar"></div><div class="destination"></div></div>');
    });

    it("should clone node data attributes", function() {
      u('.destination').append(u('.testCloneData'));
      expect(u('.destination .testCloneData').data('foo')).to.eq('bar');
    });
  });
});


// Testing the main file
describe(".empty()", function() {

  beforeEach(function() {
    base.append('\
      <div class="empty-test"> \
        <p></p> \
        <p></p> \
      </div> \
    ');

    expect(u('.empty-test').length).to.equal(1);
    expect(u('.empty-test p').length).to.equal(2);
  });

  afterEach(function() {
    u('.empty-test').remove();
  });


  it("should be defined", function() {
    expect(typeof base.empty).to.equal('function');
  });

  it("can be called even without any node", function() {
    expect(u('.empty-test div').length).to.equal(0);
    u('.empty-test div').empty();
  });

  it("will clean text-only nodes", function() {
    u('.empty-test').html('Hello world');
    expect(u('.empty-test').html()).to.equal('Hello world');
    u('.empty-test').empty();
    expect(u('.empty-test').html()).to.equal('');
  });

  it("will clean mixed nodes", function() {
    u('.empty-test').html('Hello world!<p>How <strong>are you</strong>?</p>');
    u('.empty-test').empty();
    expect(u('.empty-test').html()).to.equal('');
  });

  it("should return an instance of umbrella with the empty nodes", function() {
    var result = u('.empty-test').empty();

    expect(result).to.be.instanceof(u);
    expect(result.nodes).to.have.length(1);
    expect(result.attr('class')).to.equal('empty-test');
  });

  it("empty element", function() {
    u('.empty-test').empty();
    expect(u('.empty-test p').length).to.equal(0);
  });
});


// Testing the main file
describe(".html(content)", function() {
  
  it("should be a function", function() {
    expect(typeof base.hasClass).to.equal('function');
  });
  
  it("can get the html content", function() {
    expect(base.find('#world').html()).to.equal('Hello world');
  });
  
  it("can set the html content", function() {
    expect(base.find('#world').html()).not.to.equal('hello');
    base.find('#world').html('hello');
    expect(base.find('#world').html()).to.equal('hello');
    base.find('#world').html('Hello world');
  });
});

// Testing the main file
describe(".prepend()", function() {

  // Default callback for the tests
  function callback(cl){
    return '<a class="bla ' + cl + '">Link</a>';
  }

  beforeEach(function(){

    // Just in case it stringifies the callback
    expect(base.html().match('function')).to.equal(null);
    expect(u('.bla, .blu').length).to.equal(0);
  });

  afterEach(function(){
    u('.bla, .blu').remove();
  });

  it("should be a function", function() {
    expect(typeof base.prepend).to.equal('function');
  });

  it("can add content in the right place", function() {
    base.prepend('<a class="bla">Link</a>');
    size('.base > .bla', 1);
  });

  it("can add content with a callback", function() {
    base.prepend(callback);
    size('.base > .bla', 1)('.base > .bla:first-child', 1);
  });

  it("is called as many times as data in the second param", function() {
    base.prepend('<a class="bla">Link</a>', ["a", "b"]);
    size('.base > .bla', 2)('.base > .bla:first-child', 1);
  });

  it("can add content inverted with a callback and data", function() {
    base.prepend(callback, ["a", "b"]);
    //throw "Error";
    size('.base > .bla', 2)('.base > .bla.a', 1)('.base > .bla.b', 1);
    size('.bla.a + .bla.b', 1)('.bla.b + .bla.a', 0)('.base > .bla.a:first-child', 1);
  });

  it("can generate some text", function(){
    var list = u("<div>");
    if (work) list.prepend  (function(n){ return n + "\n" }, ['a', 'b']);

    expect(list.children().length).to.equal(0);
    expect(list.html()).to.equal('a\nb\n');
  });
});


// Testing the main file
describe(".remove()", function() {

  beforeEach(function() {
    base.append('\
      <ul class="remove-test"> \
        <li></li> \
        <li></li> \
      </ul> \
    ');

    expect(u('.remove-test').length).to.equal(1);
    expect(u('.remove-test li').length).to.equal(2);
  });

  afterEach(function() {
    u('.remove-test').remove();
  });


  it("should be defined", function() {
    expect(typeof base.remove).to.equal('function');
  });

  it("can be called even without any node", function() {
    expect(u('.remove-test div').length).to.equal(0);
    u('.remove-test div').remove();
  });

  it("can be called even without parentNode", function() {
    var children = u('.remove-test li');
    children.remove();
    expect(children.first().parentNode).to.be.null;
    children.remove(); // Remove them again
  });

  it("should return an instance of umbrella with the removed nodes", function() {
    var result = u('.remove-test').remove();

    expect(result).to.be.instanceof(u);
    expect(result.nodes).to.have.length(1);
    expect(result.attr('class')).to.equal('remove-test');
    expect(result.children().nodes).to.have.length(2); // Two li children.
  });

  it("removes a single element", function() {
    u('.remove-test').remove();
    expect(u('.remove-test').length).to.equal(0);
  });

  it("removes several elements", function() {
    u('.remove-test li').remove();
    expect(u('.remove-test li').length).to.equal(0);
  });
});


// Based on
if(u(document.createDocumentFragment()).append('<div>').children().length == 0) {
  Object.defineProperty(DocumentFragment.prototype, "children", {"get" : function() {
    var arr = [],
      child = this.firstChild;

    while (child) {
      if (child.nodeType == 1) arr.push(child);
      child = child.nextSibling;
    }

    return arr;
  }});
};


// Testing the replace plugin main file
describe(".replace(newValue)", function() {

  afterEach(function(){
    base.find('button.update').remove();
  });

  it("should be a function", function() {
    expect(typeof base.replace).to.equal('function');
  });

  it("replace the single node string case", function() {
    base.append('<a class="save">Save</a>');

    base.find('a.save').replace('<button class="update">Update</button>');
    size('.base > button.update', 1);

    base.find('button.update').remove();
  });

  it("returns the correct values", function(){
    base.append('<a class="save">Save</a>');
    var button = base.find('a.save').replace('<button class="update">Update</button>').first();
    expect(button.nodeName).to.equal('BUTTON');
    expect(u(button).closest('body').length).to.equal(1);


    base.find('button.update').remove();
  });

  it("replace multi nodes string case", function() {
    base.append('<a class="save">Save</a><a class="save">Save</a>');

    base.find('a.save').replace('<button class="update">Update</button>');
    size('.base > button.update', 2);

    base.find('button.update').remove();
  });

  it("replace the single node function case", function() {
    base.append('<a class="save">Save</a>');

    base.find('a.save').replace(function(link){
      return '<button class="update">' + link.innerHTML  + '</button>';
    });
    size('.base > button.update', 1);

    base.find('button.update').remove();
  });

  it("replace multi nodes function case", function() {
    base.append('<a class="save">Save</a><a class="save">Save</a>');

    base.find('a.save').replace(function(link){
      return '<button class="update">' + link.innerHTML  + '</button>';
    });
    size('.base > button.update', 2);

    base.find('button.update').remove();
  });
});


// Testing the main file
describe(".text(content)", function() {

  it("should be a function", function() {
    expect(typeof base.hasClass).to.equal('function');
  });

  it("can get the text content", function() {
    expect(base.find('#world').text()).to.equal('Hello world');
  });

  it("can set the text content", function() {
    expect(base.find('#world').text()).not.to.equal('hello!');
    base.find('#world').text('hello!');
    expect(base.find('#world').text()).to.equal('hello!');
  });
});


// Testing the main file
describe(".wrap()", function() {
  beforeEach(function(){
    base.append('<button class="example">Link1</button>');
    size('.base > .example', 1);
  });

  afterEach(function(){
    u('.example, .example-wrapper').remove();
  });

  it("should be a function", function() {
    expect(typeof base.wrap).to.equal('function');
  });

  it("should correctly wrap a single element using a chained umbrella.js function", function() {
    u('.example').wrap('<a>').attr({ href: 'http://google.com/', class: 'example-wrapper' });
    size('.example-wrapper > .example', 1);
  });

  it("should correctly wrap a single formatted selector", function() {
    u('.example').wrap('<a href="http://google.com/" class="example-wrapper">');
    size('.example-wrapper > .example', 1);
  });

  it("should wrap multiple elements using a chained umbrella.js function", function() {
    base.append('<button class="example">Link1</button>');

    u('.example').wrap('<a>').addClass('example-wrapper');
    size('.example-wrapper .example', 2);
  });

  it("when wrapping  multiple elements it should return a copy of the original node", function() {
    base.append('<button class="example">Link2</button>');

    var wrappedNodes = u('.example').wrap('<a>').addClass('example-wrapper');
    expect(wrappedNodes.nodes[0].innerText).to.equal('Link1')
    expect(wrappedNodes.nodes[1].innerText).to.equal('Link2')
  });

  it("should add all specified attributes to the wrapper element using a chained umbrella js function", function() {
    u('.example').wrap('<a>').attr({ href: 'http://google.com/', class: 'example-wrapper' });
    expect(u('.example-wrapper').attr('href')).to.equal('http://google.com/');
  });

  it("should add all specified attributes to the wrapper element using a formatted selector", function() {
    u('.example').wrap('<a href="http://google.com/" class="example-wrapper">');
    expect(u('.example-wrapper').attr('href')).to.equal('http://google.com/');
  });

  it("should support nested selector arguments", function() {
    u('.example').wrap('<div id="one"><div id="two"></div></div>');
    size('#one #two .example', 1);
  });

  it("should support nested selector arguments with more than one nested child", function() {
    u('.example').wrap('<div id="a1"><div id="b1"><div id="c1"></div></div><div id="b2"><div id="c2"><div id="d1"></div></div></div></div>');
    size('#a1 #b1 #c1 .example', 1);
  });

  it("should only append to the last child of the nested selector argument's first child", function() {
    u('.example').wrap('<div id="a1"><div id="b1"><div id="c1"></div></div><div id="b2"><div id="c2"><div id="d1"></div></div></div></div>');
    size('#a2 #b2 #c2 #d1 .example', 0);
  });
});
