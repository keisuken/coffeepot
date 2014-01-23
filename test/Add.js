describe("足し算アプリ", function() {

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
        result = $('#result').text();
        expect(result).toBe('3579');
        done();
      }, 100);
    });

  });

  describe("入力をクリアする", function() {

    var result = '';
    $('#result').text(result);
    $('#value_a').val(1234);
    $('#value_b').val(2345);

    it("value_aをクリアすると2345と表示される", function(done) {
      $('#clear_a').trigger('click');
      setTimeout(function() {
        result = $('#result').text();
        expect(result).toBe('2345');
        done();
      }, 100);
    });

    it("value_bをクリアすると0と表示される", function(done) {
      $('#clear_b').trigger('click');
      setTimeout(function() {
        result = $('#result').text();
        expect(result).toBe('0');
        done();
      }, 100);
    });

  });

});
