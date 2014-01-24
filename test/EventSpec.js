describe("スイッチ", function() {

  beforeEach(function() {

    var ViewModel = {
      bindings: {
        switch_status: 'text',
        sex: ['val:int', function(value) {this.values.preview_sex = value}],
        preview_sex: 'text'
      },
      events: {
        switch_on: {
          click: function(e) {e.stopImmediatePropagation();this.values.switch_status = 'on';}
        },
        switch_off: {
          click: function(e) {e.stopImmediatePropagation();this.values.switch_status = 'off';}
        },
        switch_toggle: {
          click: function(e) {
            e.stopImmediatePropagation();
            this.values.switch_status =
              this.values.switch_status === 'on' ? 'off' : 'on';
          }
        }
      }
    };

    var Model = {
    };

    CP.set(ViewModel, Model);

  });

  describe("スイッチをOn", function() {

    beforeEach(function() {
      $('#switch_status').text('');
      $('#switch_on').trigger('click');
    });

    it("スイッチOn時onと表示される", function(done) {
      setTimeout(function() {
        var result = $('#switch_status').text();
        expect(result).toBe('on');
        done();
      }, 10);
    });
  });

  describe("スイッチをOff", function() {

    beforeEach(function() {
      $('#switch_status').text('');
      $('#switch_off').trigger('click');
    });

    it("スイッチOff時offと表示される", function(done) {
      setTimeout(function() {
        var result = $('#switch_status').text();
        expect(result).toBe('off');
        done();
      }, 10);
    });
  });

  describe("スイッチOn時トグルする", function() {

    beforeEach(function() {
      $('#switch_status').text('on');
      $('#switch_toggle').trigger('click');
    });

    it("スイッチがoffと表示される", function(done) {
      setTimeout(function() {
        var result = $('#switch_status').text();
        expect(result).toBe('off');
        done();
      }, 10);
    });

  });

  describe("スイッチOff時トグルする", function() {

    beforeEach(function() {
      $('#switch_status').text('off');
      $('#switch_toggle').trigger('click');
    });

    it("スイッチがonと表示される", function(done) {
      setTimeout(function() {
        var result = $('#switch_status').text();
        expect(result).toBe('on');
        done();
      }, 10);
    });

  });

  describe("SexをMaleに設定", function() {
    beforeEach(function() {
      $('#preview_sex').text('');
      $('#sex').val(1);
      $('#sex').trigger('change');
    });
    it("1と表示される", function(done) {
      setTimeout(function() {
        var result = $('#preview_sex').text();
        expect(result).toBe('1');
        done();
      }, 10);
    });
  });

  describe("SexをFemaleに設定", function() {
    beforeEach(function() {
      $('#preview_sex').text('');
      $('#sex').val(2);
      $('#sex').trigger('change');
    });
    it("2と表示される", function(done) {
      setTimeout(function() {
        var result = $('#preview_sex').text();
        expect(result).toBe('2');
        done();
      }, 10);
    });
  });

});
