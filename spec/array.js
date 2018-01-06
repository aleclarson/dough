describe(".array()", function() {

  it("should be defined", function() {
    expect(typeof base.array).to.equal('function');
  });

  it("empty gives an error", function(){
    same(base.array(), [base.html()]);
  });

  it("can loop as each()", function() {
    u([0, 1, 2, 3]).array(function(node, i){
      expect(node).to.equal(i);
    });
  });

  it("can loop a real element", function() {
    base.array(function(node, i){
      expect(u(node).hasClass('base')).to.equal(true);
      expect(i).to.equal(0);
    });
  });

  it("can remove an element", function() {
    var final = u([1, 2, 3, 4]).array(function(node, i){
      if (i !== 0) return node;
    });
    expect(final.length).to.equal(3);
  });

  it("can remove several elements", function() {
    var final = u([1, 2, 3, 4]).array(function(node, i){
      if (i >= 3) return node;
    });
    expect(final.length).to.equal(1);
  });

  it("can add an element", function() {
    var final = u([1, 2, 3, 4]).array(function(node, i){
      return i === 0 ? [node, 'a'] : node;
    });
    expect(final.length).to.equal(5);
  });

  it("can add an many elements", function() {
    var final = u([1, 2, 3, 4]).array(function(node, i){
      return [node + 'a', node + 'b', node + 'c'];
    });
    expect(final.length).to.equal(12);
  });

  it("has the right this", function(){
    u(['a', 'b']).array(function(node, i){
      expect(this instanceof u).to.equal(true);
    });
  });

  it("returns a simple array", function(){
    var ret = u(['a', 'b']).array(function(){});
    expect(Array.isArray(ret)).to.equal(true);
  });
});


describe(".each(function(){})", function() {
    
  it("should be defined", function() {
    expect(typeof base.each).to.equal('function');
  });
  
  it("empty gives an error", function(done){
    try {
      u([0, 1, 2]).each();
    } catch (e) {
      return done();
    }
    throw "Shouldn't get here";
  });

  it("can loop", function() {
    u([0, 1, 2, 3]).each(function(node, i){
      expect(node).to.equal(i);
    });
    
    u([3, 4, 5, 6]).each(function(node, i){
      expect(node).to.equal(i + 3);
    });
  });

  it("can loop a real element", function() {
    base.each(function(node, i){
      expect(u(node).hasClass('base')).to.equal(true);
      expect(i).to.equal(0);
    });
  });
  
  it("has the right this", function(){
    u(['a', 'b']).each(function(node, i){
      expect(this instanceof u).to.equal(true);
    });
  });
  
  it("returns an umbrella object", function(){
    var ret = u(['a', 'b']).each(function(){});
    expect(ret instanceof u).to.equal(true);
  });
});

// Testing the main file
describe(".filter(selector)", function() {
  
  it("should be defined", function() {
    expect(typeof base.filter).to.equal('function');
  });

  it("can be called empty", function() {
    base.filter();
    base.filter("");
  });

  it("stays the same", function() {
    expect(base.filter('.base').length).to.equal(1);
  });

  it("gets only one", function() {
    expect(base.find('a').filter('#world').length).to.equal(1);
  });

  it("accepts a function", function() {
    expect(base.filter(function(){ return true; }).length).to.equal(1);
    expect(base.filter(function(){ return false; }).length).to.equal(0);
  });

  it("accepts an object", function() {
    expect(base.filter(base).length).to.equal(1);
    expect(base.filter(u('.bla')).length).to.equal(0);
  });
  
  it("returns the same if called empty", function() {
    expect(base.find('.not-test li').filter().length).to.equal(base.find('.not-test li').length);
    expect(base.find('.not-test li').filter('').length).to.equal(base.find('.not-test li').length);
    expect(base.find('.not-test li').filter(null).length).to.equal(base.find('.not-test li').length);
    expect(base.find('.not-test li').filter(undefined).length).to.equal(base.find('.not-test li').length);
    expect(base.find('.not-test li').filter(false).length).to.equal(base.find('.not-test li').length);
  });
});

var list = u('<ul>').append(function(i){ return '<li>'+i+'</li>'; }, 10).find('li');

describe(".map(function(){})", function() {

  it("should be defined", function() {
    expect(typeof base.map).to.equal('function');
  });

  it("empty gives an error", function(){
    same(u([0, 1, 2]).map(), u([0, 1, 2]));
  });

  it("can loop as each()", function() {
    u([0, 1, 2, 3]).map(function(node, i){
      expect(node).to.equal(i);
    });

    u([3, 4, 5, 6]).map(function(node, i){
      expect(node).to.equal(i + 3);
    });
  });

  it("can loop a real element", function() {
    base.map(function(node, i){
      expect(u(node).hasClass('base')).to.equal(true);
      expect(i).to.equal(0);
    });
  });

  it("accepts return of single element", function(){
    var els = list.map(function(node){
      return node;
    }).each(function(node, i){
      expect(i).to.equal(parseInt(node.innerHTML));
    });
  });

  it("accepts return of string and parses it", function(){
    list.map(function(node){
      return '<li>' + node.innerHTML + '</li>';
    }).each(function(node, i){
      expect(i).to.equal(parseInt(node.innerHTML));
    });
  });

  it("accepts return of two elements string", function(){
    list.map(function(node, i){
      return '<span>' + (i * 2) + '</span>' +
        '<span>' + (i * 2 + 1) + '</span>';
    }).each(function(node, i){
      expect(i).to.equal(parseInt(node.innerHTML));
    });
  });

  it("accepts return of array of elements", function(){
    var els = list.map(function(node, i){
      return [node];
    }).each(function(node, i){
      expect(i).to.equal(parseInt(node.innerHTML));
    });
  });

  it("accepts return of array of two elements", function(){
    same(list.map(function(node, i){
      var newNode = u('<li>').html('a').first();
      return [node, newNode];
    }).length, 20);
  });

  it("accepts return of umbrella instance", function(){
    var els = list.map(function(node, i){
      return u(node);
    }).each(function(node, i){
      expect(i).to.equal(parseInt(node.innerHTML));
    });
  });

  it("falsy removes them", function(){
    expect(list.map(function(){ return false; }).length).to.equal(0);
    expect(list.map(function(){ return null; }).length).to.equal(0);
    expect(list.map(function(){ return undefined; }).length).to.equal(0);
    expect(list.map(function(){ return ''; }).length).to.equal(0);
    expect(list.map(function(){ return 0; }).length).to.equal(0);
    expect(list.map(function(){}).length).to.equal(0);
  });

  it("can remove a single element", function() {
    var final = u([1, 2, 3, 4]).map(function(node, i){
      return i === 0 ? false : node;
    });
    expect(final.length).to.equal(3);
  });

  it("can remove several elements", function() {
    var final = u([1, 2, 3, 4]).map(function(node, i){
      return i < 3 ? false : node;
    });
    expect(final.length).to.equal(1);
  });

  it("can add an element", function() {
    var final = u([1, 2, 3, 4]).map(function(node, i){
      return i === 0 ? [node, 'a'] : node;
    });
    expect(final.length).to.equal(5);
  });

  it("can add an many elements", function() {
    var final = u([1, 2, 3, 4]).map(function(node, i){
      return [node + 'a', node + 'b', node + 'c'];
    });
    expect(final.length).to.equal(12);
  });

  it("has the right this", function(){
    u(['a', 'b']).map(function(node, i){
      expect(this instanceof u).to.equal(true);
    });
  });

  it("returns an umbrella object", function(){
    var ret = u(['a', 'b']).map(function(){});
    expect(ret instanceof u).to.equal(true);
  });
});
