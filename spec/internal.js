
describe(".args(arguments)", function() {
  
  it("should be defined", function() {
    expect(typeof u().args).to.equal('function');
  });
  
  it("accepts zero parameters", function(){
    expect(u().args()).to.deep.equal([]);
  });
  
  it("accepts falsy", function(){
    expect(u().args(null)).to.deep.equal([]);
    expect(u().args(false)).to.deep.equal([]);
    expect(u().args(undefined)).to.deep.equal([]);
    expect(u().args("")).to.deep.equal([]);
    expect(u().args([])).to.deep.equal([]);
  });
  
  it("doesn't accept two parameters", function(){
    expect(u().args('a', 'b')).to.deep.equal(['a']);
  });
  
  it("accepts an umbrella instance", function(){
    expect(u().args(u(['a', 'b']))).to.deep.equal(['a', 'b']);
    expect(u().args(u(['a', 'b']).nodes)).to.deep.equal(['a', 'b']);
  });
  
  
  describe("works with a single string", function(){
    it("single string", function(){
      expect(u().args('a')).to.deep.equal(['a']);
    });
    
    it("splits a string with space", function(){
      expect(u().args('a b ')).to.deep.equal(['a', 'b']);
    });
    
    it("splits a string with comma", function(){
      expect(u().args('a,b,')).to.deep.equal(['a', 'b']);
    });
    
    it("splits a string with space and comma", function(){
      expect(u().args('a, b, ')).to.deep.equal(['a', 'b']);
    });
    
    it("splits a string with enter", function(){
      expect(u().args('a\nb\t')).to.deep.equal(['a', 'b']);
    });
  });
  
  
  describe("works with different arrays", function(){
    
    it("single element", function(){
      expect(u().args(['a'])).to.deep.equal(['a']);
    });
    
    it("single element", function(){
      expect(u().args(['a', 'b', 'c'])).to.deep.equal(['a', 'b', 'c']);
    });
    
    it("splits a string with space", function(){
      expect(u().args(['a b', 'c d'])).to.deep.equal(['a', 'b', 'c', 'd']);
    });
    
    it("splits a string with comma", function(){
      expect(u().args(['a,b', 'c,d'])).to.deep.equal(['a', 'b', 'c', 'd']);
    });
    
    it("splits a string with space and comma", function(){
      expect(u().args(['a, b', 'c, d'])).to.deep.equal(['a', 'b', 'c', 'd']);
    });
    
    it("splits a string with whitespaces", function(){
      expect(u().args(['a\nb', 'c\td'])).to.deep.equal(['a', 'b', 'c', 'd']);
    });
  });
  
  
  describe("works with a function", function(){
    
    it("single element", function(){
      expect(u().args(['a'])).to.deep.equal(['a']);
    });
    
    it("single element", function(){
      expect(u().args(['a', 'b', 'c'])).to.deep.equal(['a', 'b', 'c']);
    });
    
    it("splits a string with space", function(){
      expect(u().args(['a b', 'c d'])).to.deep.equal(['a', 'b', 'c', 'd']);
    });
    
    it("splits a string with comma", function(){
      expect(u().args(['a,b', 'c,d'])).to.deep.equal(['a', 'b', 'c', 'd']);
    });
    
    it("splits a string with space and comma", function(){
      expect(u().args(['a, b', 'c, d'])).to.deep.equal(['a', 'b', 'c', 'd']);
    });
    
    it("splits a string with whitespaces", function(){
      expect(u().args(['a\nb', 'c\td'])).to.deep.equal(['a', 'b', 'c', 'd']);
    });
  });
  
  
});

describe(".eacharg([], function(){})", function() {
    
  it("should be defined", function() {
    expect(typeof base.each).to.equal('function');
  });
  
  it("no data, everything is is okay", function(){
    base.eacharg();
    base.eacharg("");
    base.eacharg("", function(){});
    base.eacharg(false);
    base.eacharg(false, function(){});
    base.eacharg(undefined);
    base.eacharg(undefined, function(){});
    base.eacharg(function(){ return false; });
    base.eacharg(function(){ return false; }, function(){});
  });
  
  it("only first arguments gives an error", function(){
    expect(base.eacharg.bind(base, ["a"])).to.throw();
  });
  
  it("has the right this", function(){
    u(['a', 'b']).eacharg(['a'], function(node, arg){
      expect(this instanceof u).to.equal(true);
    });
  });
  
  it("returns an umbrella object", function(){
    var ret = u(['a', 'b']).eacharg(['a'], function(){});
    expect(ret instanceof u).to.equal(true);
  });
  
  
  // STRING
  describe('loops over an string', function(){
    
    it("accepts commas as separation", function() {
      var values = ['aA', 'aB', 'bA', 'bB'];
      u(['a', 'b']).eacharg('A,B,', function(node, arg){
        expect(node + arg).to.equal(values.shift());
      });
    });
      
    it("accepts space as separation", function() {
      var values = ['aA', 'aB', 'bA', 'bB'];
      u(['a', 'b']).eacharg('A B ', function(node, arg){
        expect(node + arg).to.equal(values.shift());
      });
    });
    
    it("accepts commas and spaces as separation", function() {
      var values = ['aA', 'aB', 'bA', 'bB'];
      u(['a', 'b']).eacharg('A, B, ', function(node, arg){
        expect(node + arg).to.equal(values.shift());
      });
    });
    
    it("accepts other whitespace as separation", function() {
      var values = ['aA', 'aB', 'bA', 'bB'];
      u(['a', 'b']).eacharg('A\nB\n', function(node, arg){
        expect(node + arg).to.equal(values.shift());
      });
    });
  });
  
  
  // ARRAY
  describe("loops over an array", function(){
    
    it("accepts an array of elements", function() {
      var values = ['aA', 'aB', 'bA', 'bB'];
      u(['a', 'b']).eacharg(['A', 'B', ''], function(node, arg){
        expect(node + arg).to.equal(values.shift());
      });
    });

    it("accepts an array with space-separated elements", function() {
      var values = ['aA', 'aB', 'bA', 'bB'];
      u(['a', 'b']).eacharg(['A B '], function(node, arg){
        expect(node + arg).to.equal(values.shift());
      });
    });

    it("accepts an array with comma-separated elements", function() {
      var values = ['aA', 'aB', 'bA', 'bB'];
      u(['a', 'b']).eacharg(['A,B,'], function(node, arg){
        expect(node + arg).to.equal(values.shift());
      });
    });

    it("accepts an array with comma and space separation", function() {
      var values = ['aA', 'aB', 'bA', 'bB'];
      u(['a', 'b']).eacharg(['A, B, '], function(node, arg){
        expect(node + arg).to.equal(values.shift());
      });
    });
    
    it("accepts an array with other whitespace as separation", function() {
      var values = ['aA', 'aB', 'bA', 'bB'];
      u(['a', 'b']).eacharg(['A\nB\n'], function(node, arg){
        expect(node + arg).to.equal(values.shift());
      });
    });

    it("accepts an array with a combination", function() {
      var values = ['aA', 'aB', 'aC', 'bA', 'bB', 'bC'];
      u(['a', 'b']).eacharg(['A, B', 'C, '], function(node, arg){
        expect(node + arg).to.equal(values.shift());
      });
    });
  });
  
  
  // FUNCTION
  describe("loops over a function return", function(){
    
    var called = false;
    beforeEach(function(){
      called = false;
    });
    
    it("accepts commas as separation", function() {
      var values = ['aA', 'aB', 'bA', 'bB'];
      u(['a', 'b']).eacharg(function(){ return 'A,B,'; }, function(node, arg){
        expect(node + arg).to.equal(values.shift());
        called = true;
      });
      expect(called).to.equal(true);
    });
    
    it("accepts space as separation", function() {
      var values = ['aA', 'aB', 'bA', 'bB'];
      u(['a', 'b']).eacharg(function(){ return 'A B '; }, function(node, arg){
        expect(node + arg).to.equal(values.shift());
        called = true;
      });
      expect(called).to.equal(true);
    });
    
    it("accepts commas and spaces as separation", function() {
      var values = ['aA', 'aB', 'bA', 'bB'];
      u(['a', 'b']).eacharg(function(){ return 'A, B, '; }, function(node, arg){
        expect(node + arg).to.equal(values.shift());
        called = true;
      });
      expect(called).to.equal(true);
    });
    
    it("accepts other whitespace as separation", function() {
      var values = ['aA', 'aB', 'bA', 'bB'];
      u(['a', 'b']).eacharg(function(){ return 'A\nB\n'; }, function(node, arg){
        expect(node + arg).to.equal(values.shift());
        called = true;
      });
      expect(called).to.equal(true);
    });
    
    it("accepts an array of elements", function() {
      var values = ['aA', 'aB', 'bA', 'bB'];
      u(['a', 'b']).eacharg(function(){ return ['A', 'B', '']; }, function(node, arg){
        expect(node + arg).to.equal(values.shift());
        called = true;
      });
      expect(called).to.equal(true);
    });

    it("accepts an array with space-separated elements", function() {
      var values = ['aA', 'aB', 'bA', 'bB'];
      u(['a', 'b']).eacharg(function(){ return ['A B ']; }, function(node, arg){
        expect(node + arg).to.equal(values.shift());
        called = true;
      });
      expect(called).to.equal(true);
    });

    it("accepts an array with comma-separated elements", function() {
      var values = ['aA', 'aB', 'bA', 'bB'];
      u(['a', 'b']).eacharg(function(){ return ['A,B,']; }, function(node, arg){
        expect(node + arg).to.equal(values.shift());
        called = true;
      });
      expect(called).to.equal(true);
    });

    it("accepts an array with comma and space separation", function() {
      var values = ['aA', 'aB', 'bA', 'bB'];
      u(['a', 'b']).eacharg(function(){ return ['A, B, ']; }, function(node, arg){
        expect(node + arg).to.equal(values.shift());
        called = true;
      });
      expect(called).to.equal(true);
    });
    
    it("accepts an array with other whitespace as separation", function() {
      var values = ['aA', 'aB', 'bA', 'bB'];
      u(['a', 'b']).eacharg(function(){ return ['A\nB\n']; }, function(node, arg){
        expect(node + arg).to.equal(values.shift());
        called = true;
      });
      expect(called).to.equal(true);
    });

    it("accepts an array with a combination", function() {
      var values = ['aA', 'aB', 'aC', 'bA', 'bB', 'bC'];
      u(['a', 'b']).eacharg(function(){ return ['A, B', 'C, ']; }, function(node, arg){
        expect(node + arg).to.equal(values.shift());
        called = true;
      });
      expect(called).to.equal(true);
    });
  });
});

// Testing the main file
describe(".select(selector)", function() {

  it("should be a function", function() {
    expect(typeof base.select).to.equal('function');
  });

  it("is fine-tuned for context (use css with that)", function() {
    var withContext = u().select('a', u('.brand').first())[0];
    var withCss = u().select.byCss('.brand a')[0];
    expect(withContext).to.equal(withCss);
  });

  it("can select by class", function(){
    expect(u().select('.base').length).to.equal(1);
    expect(u().select('.base')).to.not.equal(null);
  });

  it("can select by tag", function(){
    expect(u().select('li').length).to.be.above(1);
    expect(u().select('li')[0].nodeName).to.equal('LI');
  });

  it("can select by id", function(){
    expect(u().select('#base')).to.not.equal(null);
    expect(u().select('#base').nodeName).to.equal('DIV');
  });

  it("can select by complex selector", function() {
    expect(u().select('.brand a').length).to.equal(1);
    expect(u().select('.brand a')[0].nodeName).to.equal('A');
  });

  it("can create one element", function(){
    expect(u('<div>').length).to.equal(1);
    expect(u('<div>').first().nodeName).to.equal('DIV');
  });

  it("can create many elements", function(){
    expect(u('<p></p><p></p>').length).to.equal(2);
    expect(u('<p></p><p></p>').first().nodeName).to.equal('P');
  });

  it("can have spaces before or after", function(){
    expect(u(' <p></p><p></p>').length).to.equal(2);
    expect(u('<p></p><p></p>').first().nodeName).to.equal('P');

    expect(u('<p></p><p></p> ').length).to.equal(2);
    expect(u('<p></p><p></p> ').first().nodeName).to.equal('P');
  });

  it("can create table stuff", function() {
    size('<table>Hello</table>', 1);
    size('<th>Hello</th>', 1);
    size('<tr>Hello</tr>', 1);
    size('<td>Hello</td>', 1);
  });

  it("can create list stuff", function() {
    size('<ul><li>A</li></ul>', 1);
    size('<li>B</li>', 1);
  });
});


describe(".slice()", function() {

  it("should be a function", function() {
    expect(typeof base.slice).to.equal('function');
  });

  it("can be called empty", function() {
    same(base.slice(), []);
    same(base.slice(''), []);
    same(base.slice(null), []);
    same(base.slice(undefined), []);
    same(base.slice(false), []);
  });

  it("can slice an array", function() {
    same(base.slice(['a', 'b']), ['a', 'b']);
  });

  it("ignores a string", function() {
    same(base.slice('Hello world'), []);
  });

  it("ignores a function", function() {
    same(base.slice(function(){}), []);
  });

  it("accepts a simple number", function() {
    same(base.slice(5), [5]);
  });

  it("converts a simple object to array", function() {
    same(base.slice({ a: 'b' }), [{ a: 'b' }]);
  });

  it("accepts an XMLRequest", function() {
    var request = new XMLHttpRequest;
    same(base.slice(request), [request]);
  });

  it("accepts the document", function() {
    same(base.slice(document), [document]);
  });

  it("accepts an argument list", function() {
    (function(){
      same(base.slice(arguments), ['a', 'b']);
    })('a', 'b');
  });
});
