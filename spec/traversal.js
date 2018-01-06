// Testing the main file
describe(".children(selector)", function() {
  
  afterEach(function(){
    // A previous bug that would change the inner of the original reference
    expect(base.length).to.equal(1);
  });
  
  it("should be a function", function() {
    expect(typeof base.children).to.equal('function');
  });
  
  it("can select the children of ul", function() {
    expect(base.find('ul').children().length).to.equal(3);
  });
  
  it("can filter the children", function() {
    expect(base.find('ul').children(':first-child').length).to.equal(1);
  });
  
  it("okay with no children", function() {
    expect(base.find('ul').children('.nonexist').length).to.equal(0);
  });
});

// Testing the main file
describe(".closest(selector)", function() {

  afterEach(function(){
    // A previous bug that would change the inner of the original reference
    expect(base.length).to.equal(1);
  });

  it("should be a function", function() {
    expect(typeof base.closest).to.equal('function');
  });

  it("can select the children of ul", function() {
    expect(base.find('li').closest('ul').length).to.equal(1);
  });

  it("is okay with no ancestors", function() {
    expect(base.closest('.nonexist').length).to.equal(0);
  });
});


// Testing the main file
describe(".find(selector)", function() {

  it("should be a function", function() {
    expect(typeof base.find).to.equal('function');
  });

  it("can be empty and it selects all", function() {
    expect(base.find().length).to.equal(base.find('*').length);
  });

  it("can select the list ul", function() {
    expect(base.find('ul').length).to.equal(1);
  });

  it("cannot select body", function() {
    expect(base.find('body').length).to.equal(0);
  });

  it("doesn't select duplicates", function(){
    expect(u("*").find('.brand a').length).to.equal(1);
  });
});


// Testing the main file
describe(".first()", function() {
  
  it("should be a function", function() {
    expect(typeof base.first).to.equal('function');
  });
  
  it("the first element is an HTML element", function() {
    expect(base.find("li").first().nodeType).to.equal(1);
  });
  
  it("can get the first li and it's a LI", function() {
    expect(base.find("li").first().nodeName).to.equal('LI');
  });
});

// Testing the main file
describe(".last()", function() {

  it("should be a function", function() {
    expect(typeof base.last).to.equal('function');
  });

  it("the last element is an HTML element", function() {
    expect(base.find("li").last().nodeType).to.equal(1);
  });

  it("can get the last li and it's a LI", function() {
    expect(base.find("li").last().nodeName).to.equal('LI');
  });

  it("returns false for non existing element", function() {
  	expect(u('.non-existing').last()).to.equal(false);
  });

  it("actually returns the last element", function() {
  	base.append('<a class="last-test">Node 1</a> <div class="last-test">Node 2</div>');
  	expect(u('.last-test').last().nodeName).to.equal('DIV');
  });

});


describe('.parent()', function() {

  it('should be defined', function() {
    expect(typeof base.parent).to.equal('function');
  });

  it('can loop the li', function() {
    expect(u('li').parent().is('ol, ul')).to.equal(true);
  });
  
  it('can retrieve all paragraphs', function() {
    expect(u('a').parent('p').is('p')).to.equal(true);
    expect(u('a').parent('p')).not.to.equal(u('a').parent());
  });
});


// Testing the main file
describe(".siblings(selector)", function() {
  
  beforeEach(function() {
    base.append('\
      <ul class="siblings-test"> \
        <li id="siblings-1" class="selected"></li> \
        <li id="siblings-2"></li> \
        <li id="siblings-3"></li> \
      </ul> \
      <ul class="siblings-test"> \
        <li id="siblings-4"></li> \
        <li id="siblings-5" class="selected"></li> \
        <li id="siblings-6"></li> \
      </ul> \
    ');

    expect(u('.siblings-test').nodes.length).to.equal(2);
    expect(u('.siblings-test li').nodes.length).to.equal(6);
  });

  afterEach(function() {
    u('.siblings-test').remove();
    expect(u('.siblings-test').nodes.length).to.equal(0);
  });
  
  it("should be a function", function() {
    expect(typeof base.siblings).to.equal('function');
  });
  
  it("can select multiple siblings", function() {
    expect(base.find('#siblings-2').siblings().nodes.length).to.equal(2);
  });
  
  it("can filter the siblings", function() {
    expect(base.find('#siblings-1').siblings('#siblings-2').nodes.length).to.equal(1);
  });
  
  it("can handle non existant siblings ", function() {
    expect(base.find('#siblings-2').siblings('.nonexist').nodes.length).to.equal(0);
  });

  it("can handle multiple nodes", function() {
    expect(base.find('.siblings-test').children('.selected').siblings().nodes.length).to.equal(4);
  });
});