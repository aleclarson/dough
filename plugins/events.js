
const u = require('./core');

// Removes the callback to the event listener for each node
u.prototype.off = function (events) {
  return this.eacharg(events, function (node, event) {
    u(node._e ? node._e[event] : []).each(function (cb) {
      node.removeEventListener(event, cb);
    });
  });
};


// Attach a callback to the specified events
u.prototype.on = function (events, cb, cb2) {
  if (typeof cb === 'string') {
    var sel = cb;
    cb = function (e) {
      var args = arguments;
      u(e.currentTarget).find(sel).each(function (target) {
        if (target === e.target || target.contains(e.target)) {
          try {
            Object.defineProperty(e, 'currentTarget', {
              get: function () {
                return target;
              }
            });
          } catch (err) {}
          cb2.apply(target, args);
        }
      });
    };
  }

  // Add the custom data as arguments to the callback
  var callback = function (e) {
    return cb.apply(this, [e].concat(e.detail || []));
  };

  return this.eacharg(events, function (node, event) {
    node.addEventListener(event, callback);

    // Store it so we can dereference it with `.off()` later on
    node._e = node._e || {};
    node._e[event] = node._e[event] || [];
    node._e[event].push(callback);
  });
};


// Call an event manually on all the nodes
u.prototype.trigger = function (events) {
  var data = this.slice(arguments).slice(1);

  return this.eacharg(events, function (node, event) {
    var ev;

    // Allow the event to bubble up and to be cancelable (as default)
    var opts = { bubbles: true, cancelable: true, detail: data };

    try {
      // Accept different types of event names or an event itself
      ev = new window.CustomEvent(event, opts);
    } catch (e) {
      ev = document.createEvent('CustomEvent');
      ev.initCustomEvent(event, true, true, data);
    }

    node.dispatchEvent(ev);
  });
};
