var listOfClasses = getListOfClasses();

describe(".addClass()", function() {

  beforeEach(function(){
    base.removeClass('bla blu blo');
    hasClass('bla blu blo', true);
  });

  afterEach(function(){
    base.removeClass('bla blu blo');
    hasClass('bla blu blo', true);
  });



  it("should be defined", function() {
    isFn(work ? base.addClass : false);
  });

  it("can be called empty", function() {
    base.addClass();
    base.addClass("");
    base.addClass([]);
    base.addClass("","");
    base.addClass(" ");

    if (!work) throw "Forced failure";
  });

  it("can be concatenated", function() {
    if (work) base.addClass('bla').addClass('blu');
    hasClass('bla')('blu');
  });

  it("returns the same instance", function() {
    var inst = false;
    if (work) inst = base.addClass('bla,blu');
    same(base, inst);
  });

  it("adds a single class", function() {
    if (work) base.addClass('bla');
    hasClass('bla');
  });



  describe("single argument", function(){
    listOfClasses.forEach(function(part){
      it("accepts " + part.it, function(){
        if (work) base.addClass(part.from);
        hasClass('bla blu blo');
      });
    });
  });

  describe("single function argument uses the return value", function(){
    listOfClasses.forEach(function(part){
      it("accepts as a return value " + part.it, function(){
        if (work) base.addClass(function() { return part.from; });
        hasClass('bla blu blo');
      });
    });
  });

  describe("multiple functions uses the return value", function(){
    function add(arg){ return function(){ return arg; }; }
    listOfClasses.forEach(function(part){
      it("accepts as a return value " + part.it, function(){
        if (work) base.addClass(add(part.from), add("bli"));
        hasClass('bla blu blo bli');
      });
    });
  });

  describe("several arguments", function(){
    listOfClasses.filter(function(part){
      return Array.isArray(part.from);
    }).forEach(function(part){
      it("used .apply() with " + part.it, function(){
        if (work) base.addClass.apply(base, part.from);
        hasClass('bla blu blo');
      });
    });
  });


  describe("callback uses the arguments", function(){

    // Testing the main file
    function addTest(node, i){
      return 'test' + i;
    }

    it("adds classes with callback", function(){
      if (work) base.addClass(addTest);

      hasClass('test0');

      base.removeClass('test0');
      expect(base.hasClass('test0')).to.equal(false);
    });

    it("adds many classes with callback", function(){
      if (work) base.find('li').addClass(addTest);

      base.find('li').each(function(node, i){
        hasClass('test' + i, false, node);
        u(node).removeClass('test' + i);
      });
    });

  });
});


// Testing the main file
describe(".hasClass(name)", function() {
  
  it("should be a function", function() {
    expect(typeof base.hasClass).to.equal('function');
  });
  
  it("can check a single class", function() {
    expect(base.find('#world').hasClass('hello')).to.equal(true);
  });
  
  it("works as AND", function() {
    expect(base.find('#world').hasClass('hello nonexisting')).to.equal(false);
  });
  
  it("can check multiple classes with space", function() {
    expect(base.find('#world').hasClass('hello world')).to.equal(true);
  });
  
  it("can check multiple classes with comma", function() {
    expect(base.find('#world').hasClass('hello,world')).to.equal(true);
  });
  
  it("can check multiple classes as arguments", function() {
    expect(base.find('#world').hasClass('hello', 'world')).to.equal(true);
  });
});

// Testing the main file
describe(".is(selector)", function() {

  it("should be defined", function() {
    expect(typeof base.is).to.equal('function');
  });

  it("can be called empty", function() {
    base.is();
    base.is("");
  });

  it("accepts a selector", function() {
    expect(base.is('.base')).to.equal(true);
    expect(base.is('div')).to.equal(true);
  });

  it("accepts a function", function() {
    expect(base.is(function(){ return true; })).to.equal(true);
    expect(base.is(function(){ return false; })).to.equal(false);
    base.is(function(node){
      expect(u(node).is('.base')).to.equal(true);
    });
  });

  it("accepts an object", function() {
    expect(base.is(base)).to.equal(true);
    expect(base.is(u('.bla'))).to.equal(false);
    base.is(function(node){
      expect(u(node).is(base)).to.equal(true);
    });
  });
});


describe(".not(elems)", function() {

  beforeEach(function() {
    base.append('\
      <ul class="not-test"> \
        <li class="filter"></li> \
        <li class="filter"></li> \
        <li></li> \
      </ul>');

    expect(u('.not-test').length).to.equal(1);
    expect(u('.not-test li').length).to.equal(3);
  });

  afterEach(function() {
    u('.not-test').remove();
    expect(u('.not-test').length).to.equal(0);
  });

  it("should be a function", function() {
    expect(typeof base.not).to.equal('function');
  });

  it("can be called empty", function() {
    base.not();
    base.not('');
    base.not(null);
    base.not(undefined);
    base.not(false);
  });

  it("returns same if called empty", function() {
    expect(base.find('.not-test li').not().length).to.equal(base.find('.not-test li').length);
    expect(base.find('.not-test li').not('').length).to.equal(base.find('.not-test li').length);
    expect(base.find('.not-test li').not(null).length).to.equal(base.find('.not-test li').length);
    expect(base.find('.not-test li').not(undefined).length).to.equal(base.find('.not-test li').length);
    expect(base.find('.not-test li').not(false).length).to.equal(base.find('.not-test li').length);
  });

  it("filter single element", function() {
    expect(base.find('.not-test li').not(u(u('.not-test li').first())).length).to.equal(2);
  });

  it("filter multiple elements", function() {
    expect(base.find('.not-test li').not(u('.not-test li.filter')).length).to.equal(1);
  });

  it("filter selector elements", function() {
    expect(base.find('.not-test li').not('.filter').length).to.equal(1);
  });

});


// Testing the main file
describe(".removeClass()", function() {

  //var work = false;

  beforeEach(function(){
    base.addClass('bla blu blo');
    hasClass('bla blu blo');
  });

  afterEach(function(){
    base.removeClass('bla blu blo');
    hasClass('bla blu blo', true);
  });

  it("should be defined", function() {
    isFn(work ? base.removeClass : false);
  });

  it("can be called empty", function() {
    base.removeClass();
    base.removeClass("");
    base.removeClass([]);
    base.removeClass("","");
    base.removeClass(" ");

    if (!work) throw "Force failure";
  });

  it("removes a single class", function() {
    if (work) base.removeClass('bla');
    hasClass('bla', true);
  });

  it("can be concatenated", function() {
    if (work) base.removeClass('bla').removeClass('blu');
    hasClass('bla blu', true);
  });




  describe("single argument", function(){
    base.addClass('bla blu blo');
    listOfClasses.forEach(function(part){
      it("accepts " + part.it, function(){
        if (work) base.removeClass(part.from);
        hasClass('bla blu blo', true);
      });
    });
  });

  describe("single function argument uses the return value", function(){
    base.addClass('bla blu blo');
    listOfClasses.forEach(function(part){
      it("accepts as a return value " + part.it, function(){
        if (work) base.removeClass(function() { return part.from; });
        hasClass('bla blu blo', true);
      });
    });
  });

  describe("multiple functions uses the return value", function(){
    function add(arg){ return function(){ return arg; }; }
    listOfClasses.forEach(function(part){
      it("accepts as a return value " + part.it, function(){
        if (work) base.removeClass(add(part.from), add("bli"));
        hasClass('bla blu blo bli', true);
      });
    });
  });

  describe("several arguments", function(){
    listOfClasses.filter(function(part){
      return Array.isArray(part.from);
    }).forEach(function(part){
      it("used .apply() with " + part.it, function(){
        if (work) base.removeClass.apply(base, part.from);
        hasClass('bla blu blo', true);
      });
    });
  });
});


// Testing the main file
describe(".toggleClass(name1, name2, ...)", function() {
  
  beforeEach(function(){
    base.addClass('blu');
    expect(base.hasClass('bla')).to.equal(false);
    expect(base.hasClass('blu')).to.equal(true);
  });
  
  afterEach(function(){
    base.removeClass('bla');
    base.addClass('blu');
  });
  
  it("should be defined", function() {
    expect(typeof base.toggleClass).to.equal('function');
  });

  it("can be called empty", function() {
    base.toggleClass();
    base.toggleClass("");
    base.toggleClass([]);
    base.toggleClass("","");
    base.toggleClass(" ");
  });

  it("adds a class by toggling", function() {
    base.toggleClass('bla');
    expect(base.hasClass('bla')).to.equal(true);
  });

  it("removes a class by toggling", function() {
    base.toggleClass('blu');
    expect(base.hasClass('blu')).to.equal(false);
  });

  it("can be concatenated", function() {
    base.toggleClass('bla').toggleClass('bla');
    expect(base.hasClass('bla')).to.equal(false);
  });
  
  it("can do double toggle and stays the same", function() {
    base.toggleClass('bla bla');
    expect(base.hasClass('bla')).to.equal(false);
  });
  
  it("toggles several classes separated by comma", function() {
    len = base.toggleClass('bla,blu').length;
    expect(len).to.equal(1);
  });
  
  
  // Second Parameter
  it("can be called with a second parameter to force a addClass", function() {
    base.toggleClass('blu', true);
    expect(base.hasClass('blu')).to.equal(true);
  });

  it("can be called with a second parameter to force a removeClass", function() {
    base.toggleClass('blu', false);
    expect(base.hasClass('blu')).to.equal(false);
  });

  it("ignores the second parameter if string", function() {
    base.toggleClass('blu', 'peter');
    expect(base.hasClass('blu')).to.equal(false);
    expect(base.hasClass('peter')).to.equal(false);
    
    base.toggleClass('blu', 'peter');
    expect(base.hasClass('blu')).to.equal(true);
  });

  it("ignores the second parameter if falsy but not false", function() {
    base.toggleClass('blu', null);
    expect(base.hasClass('blu')).to.equal(false);
    
    base.toggleClass('blu', null);
    expect(base.hasClass('blu')).to.equal(true);
  
    base.toggleClass('blu', undefined);
    expect(base.hasClass('blu')).to.equal(false);
    
    base.toggleClass('blu', undefined);
    expect(base.hasClass('blu')).to.equal(true);
  
    base.toggleClass('blu', 0);
    expect(base.hasClass('blu')).to.equal(false);
    
    base.toggleClass('blu', 0);
    expect(base.hasClass('blu')).to.equal(true);
  
    base.toggleClass('blu', '');
    expect(base.hasClass('blu')).to.equal(false);
    
    base.toggleClass('blu', '');
    expect(base.hasClass('blu')).to.equal(true);
  });
});
