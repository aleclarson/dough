describe('.off()', function() {

  var listener = function() {
    throw 'Shouldn\'t be called';
  };

  beforeEach(function() {
    base.append('<ul class="temp"><li class="off-single-test">1</li>\
    <li class="off-multiple-test">2</li>\
    <li class="off-multiple-test">3</li>\
    </ul>');
  });

  afterEach(function(){
    base.find(".temp").remove();
    expect(u(".temp").length).to.equal(0);
  });

  it('should be defined', function() {
    expect(typeof base.off).to.equal('function');
  });

  it('on works', function(done) {
    u('.off-single-test').on('click', function(){ done(); });
    u('.off-single-test').trigger('click');
  });

  it('removes event from single element', function() {
    u('.off-single-test').on('click', listener);
    u('.off-single-test').off('click');
    u('.off-single-test').trigger('click');
  });

  it('removes event from multiple elements', function() {
    u('.off-multiple-test').on('click', listener);
    u('.off-multiple-test').off('click');
    u('.off-multiple-test').trigger('click');
  });

  it('removes event multiple times', function() {
    u('.off-multiple-test').on('click', listener);
    u('.off-multiple-test').on('click', function(){
      throw "Error";
    });
    u('.off-multiple-test').off('click');
    u('.off-multiple-test').trigger('click');
  });

  it('removes multiple events', function() {
    u('.off-multiple-test').on('click mouseover', listener);
    u('.off-multiple-test').off('click mouseover');
    u('.off-multiple-test').trigger('mouseover');
  });

  it('does not remove manual event', function(done) {
    u('.off-single-test').first().addEventListener('click', function(){
      done();
    });
    u('.off-single-test').off('click');
    u('.off-single-test').trigger('click');
  });
});


// Note: node._e['submit'] and other events will appear as [null] in PhantomJS
// but they work as expected
describe(".on(event, fn)", function() {

  beforeEach(function(){
    base.append('<div class="clickable"><a>Hi</a></div>');
  });

  afterEach(function(){
    u('.clickable').remove();
    base.off('click');
  });

  it("should be defined", function() {
    expect(typeof base.on).to.equal('function');
  });

  it("triggers the event", function(done) {
    base.find('.clickable').on('click', function(e){
      expect(e.target).to.equal(this);
      done();
    });
    base.find('.clickable').trigger('click');
  });

  it("triggers the event twice", function(done) {
    var i = 1;
    base.find('.clickable').on('click submit', function(e){
      expect(e.target).to.equal(this);
      i++;
      if (i === 3) {
        done();
      }
    });
    base.find('.clickable').trigger('click');
    base.find('.clickable').trigger('submit');
  });

  it("can do event delegation", function(done) {
    base.on('click', '.clickable', function(e){
      expect(e.target.className).to.equal('clickable');
      done();
    });
    base.find('.clickable').trigger('click');
    base.off('click');
  });

  it("event delegation has proper parameters", function(done) {
    base.on('click', 'li', function(e){
      expect(e.target.tagName).to.equal('A');

      // This fails on circleci and local because phantomjs's webkit is too old
      if (!mocha || !mocha.env) {
        expect(e.currentTarget.tagName).to.equal('LI');
      } else {
        console.log("Test not run. currentTarget:", e.currentTarget.tagName);
      }
      expect(this.tagName).to.equal('LI');
      done();
    });
    base.find('#world').trigger('click');
    base.off('click');
  });

  it("event delegation not triggered by others", function() {
    base.on('click', '.clickable', function(e){
      throw new Error("Should never get here");
    });
    base.find('ul').not('.clickable').trigger('click');
    base.off('click');
  });

  it("triggers the delegated event when child element is target", function(done) {
    base.on('click', '.clickable', function(e) {
      expect(e.target.tagName).to.equal('A');
      expect(e.target.className).to.not.equal('clickable');
      done();
    });
    base.find('.clickable a').trigger('click');
  });

  it("triggers the event with custom data", function(done) {
    base.find('.clickable').on('click', function(e, a){
      same(!!e, true);
      same(e.detail, ['a']);
      same(a, 'a');
      done();
    });
    base.find('.clickable').trigger('click', 'a');
  });
    it("triggers the delegated event with custom data", function(done) {
      base.on('click', '.clickable', function(e, a){
        same(!!e, true);
        same(e.detail, ['a']);
        same(a, 'a');
        done();
      });
      base.find('.clickable').trigger('click', 'a');
    });

  it("triggers the event with custom data object", function(done) {
    base.find('.clickable').on('click', function(e, a){
      same(!!e, true);
      same(e.detail, [{ a: 'b' }]);
      same(a, { a: 'b' });
      done();
    });
    base.find('.clickable').trigger('click', { a: 'b' });
  });

  it("triggers the event with custom data object", function(done) {
    base.on('click', '.clickable', function(e, a){
      same(!!e, true);
      same(e.detail, [{ a: 'b' }]);
      same(a, { a: 'b' });
      done();
    });
    base.find('.clickable').trigger('click', { a: 'b' });
  });

  it("triggers the event with custom data values", function(done) {
    base.find('.clickable').on('click', function(e, a, b){
      same(!!e, true);
      same(e.detail, ['a', 'b']);
      same(a, 'a');
      same(b, 'b');
      done();
    });
    base.find('.clickable').trigger('click', 'a', 'b');
  });

  it("triggers the event with custom data values", function(done) {
    base.on('click', '.clickable', function(e, a, b){
      same(!!e, true);
      same(e.detail, ['a', 'b']);
      same(a, 'a');
      same(b, 'b');
      done();
    });
    base.find('.clickable').trigger('click', 'a', 'b');
  });
});


// Testing the main file
describe(".trigger()", function() {

  afterEach(function(){
    base.off('click bla');
  });

  it("should be a function", function() {
    isFn(base.trigger);
  });

  it("can trigger a click", function() {
    base.on('click', function(e){
      expect(!!e).to.equal(true);
    });
    base.trigger('click');
  });

  it("can be concatenated", function() {
    base.on('click', function(e){
      expect(!!e).to.equal(true);
    });
    base.trigger('click').trigger('click');
  });

  it("can trigger an event in the wrong element", function() {
    base.on('click', function(e){
      expect(!!e).to.equal(true);
    });
    base.trigger('click');
  });

  it("doesn't trigger all events", function() {
    base.on('click', function(e){
      throw "Shouldn't be called";
    });
    base.trigger('submit');
  });

  it("triggers custom event", function(done) {
    base.on('bla', function(e){
      expect(!!e).to.equal(true);
      done();
    });
    base.trigger('bla');
  });

  it("passes data", function(done) {
    base.on('click', function(e, go){
      expect(!!e).to.equal(true);
      same(e.detail, ["good"]);
      same(go, "good");
      done();
    });
    base.trigger('click', 'good');
  });
});
