// Generated by IcedCoffeeScript 108.0.11
(function() {
  var ChunkStream, stream,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  stream = require('stream');

  exports.ChunkStream = ChunkStream = (function(_super) {
    __extends(ChunkStream, _super);

    function ChunkStream(transform_func, block_size, exact_chunking) {
      var highWaterMark;
      this.transform_func = transform_func;
      this.block_size = block_size;
      this.exact_chunking = exact_chunking;
      this.extra = null;
      highWaterMark = this.exact_chunking ? this.block_size : null;
      ChunkStream.__super__.constructor.call(this, {
        highWaterMark: highWaterMark
      });
    }

    ChunkStream.prototype._transform = function(chunk, encoding, cb) {
      var extra, remainder;
      if ((this.extra.length + chunk.length) < this.block_size) {
        extra = Buffer.concat([this.buffer, chunk]);
        cb();
        return;
      }
      if (this.extra) {
        chunk = Buffer.concat([this.extra, chunk]);
        this.extra = null;
      }
      if (this.exact_chunking) {
        remainder = chunk.length - this.block_size;
      } else {
        remainder = chunk.length % this.block_size;
      }
      if (remainder !== 0) {
        this.extra = chunk.slice(chunk.length - remainder, chunk.length);
        chunk = chunk.slice(0, chunk.length - remainder);
      }
      this.push(this.transform_func(chunk));
      return cb();
    };

    ChunkStream.prototype._flush = function(cb) {
      if (this.exact_chunking) {
        while (true) {
          push(this.transform_func(this.extra.slice(0, this.block_size)));
          this.extra = this.extra.slice(this.block_size);
          if (this.extra.length !== 0) {
            break;
          }
        }
      } else {
        this.push(this.transform_func(this.extra));
      }
      return cb();
    };

    return ChunkStream;

  })(stream.Transform);

}).call(this);