describe("足し算", function() {

  beforeEach(function() {

    var ViewModel = {
      bindings: {
        value_a: ['val:int', function(value) {this.printResult();}],
        value_b: ['val:int', function(value) {this.printResult();}],
        result: 'text:text'
      },
      events: {
        clear_a: {
          click: function(e) {this.values.value_a = 0;}
        },
        clear_b: {
          click: function(e) {this.values.value_b = 0;}
        }
      },
      printResult: function() {
        var values = this.values;
        var result = this.Model.calc([values.value_a, values.value_b]);
        values.result = result;
      }
    };

    var Model = {
      calc: function(values) {
        var sum = 0;
        $.each(values, function(i, value) {
          sum += value;
        });
        return sum;
      }
    };

    CP.set(ViewModel, Model);

  });


  describe("2つの入力を足す", function() {

    it("1234と2345を入力したら3579と表示される", function(done) {
      var result = '';
      $('#result').text(result);
      $('#value_a').val(1234);
      $('#value_a').trigger('change');
      $('#value_b').val(2345);
      $('#value_b').trigger('change');
      setTimeout(function() {
        var result = $('#result').text();
        expect(result).toBe('3579');
        done();
      }, 10);
    });

  });

  describe("value_aをクリアする", function() {

    beforeEach(function() {
      var result = '';
      $('#result').text(result);
      $('#value_a').val(1234);
      $('#value_b').val(2345);
      $('#clear_a').trigger('click');
    });

    it("2345と表示される", function(done) {
      setTimeout(function() {
        var result = $('#result').text();
        expect(result).toBe('2345');
        done();
      }, 10);
    });

  });

  describe("value_aとvalue_bをクリアする", function() {

    beforeEach(function() {
      var result = '';
      $('#result').text(result);
      $('#value_a').val(1234);
      $('#value_b').val(2345);
      $('#clear_a').trigger('click');
      $('#clear_b').trigger('click');
    });

    it("0と表示される", function(done) {
      setTimeout(function() {
        var result = $('#result').text();
        expect(result).toBe('0');
        done();
      }, 10);
    });

  });

});
