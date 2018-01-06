// Testing the main file
describe(".attr(name, value)", function() {
  
  
  
  afterEach(function(){
    base.first().removeAttribute('title');
    expect(!base.attr('title')).to.equal(true);
  });
  
  
  it("should be a function", function() {
    expect(typeof base.attr).to.equal('function');
  });

  it("can add an attribute with two params", function() {
    base.attr('title', 'Hello');
    expect(base.attr('title')).to.equal('Hello');
  });

  it("can remove an attribute with two params", function() {
    base.attr('title', 'Hello').attr('title', '');
    expect(base.attr('title')).to.equal('');
  });

  it("can add an attribute with an object", function() {
    base.attr({title: 'Hello'});
    expect(base.attr('title')).to.equal('Hello');
  });

  it("can read the first element attribute", function() {
    base.first().setAttribute('title', 'Hello');
    expect(base.attr('title')).to.equal('Hello');
  });

  it("can be called with no nodes", function() {
    expect(u('dfsdf').attr('title')).to.equal('');
  });
});


// Testing the main file
describe(".data(name, value)", function() {
  it("should be a function", function() {
    expect(typeof base.data).to.equal('function');
  });

  it("can add an attribute with two params", function() {
    base.data('title', 'Hello');
    expect(base.data('title')).to.equal('Hello');
    base.first().removeAttribute('data-title');
    expect(!base.data('title')).to.equal(true);
  });

  it("can add an attribute with an object", function() {
    base.data({title: 'Hello'});
    expect(base.data('title')).to.equal('Hello');
  });

  it("can read the first element attribute", function() {
    base.first().setAttribute('data-title', 'Hello');
    expect(base.data('title')).to.equal('Hello');
  });

  it("can be called with no nodes", function() {
    expect(u('dfsdf').data('title')).to.equal('');
  });
});


describe('.size()', function() {

  it('should be a function', function() {
    expect(typeof base.size).to.equal('function');
  });

  it('should return this Umbrella Object', function() {
    size(u('li').scroll(), u('li').length);
  });

  it('can get the right size', function() {
    var size = u('body').size();
    expect(size).to.deep.equal(u('body').first().getBoundingClientRect());
  });

  it('can get the height', function() {
    var size = u('body').size();
    expect(Math.round(size.height)).to.equal(u('body').first().clientHeight);
  });
});
