describe("Bindings", function() {

  var ViewModel = null;
  var Model = null;

  beforeEach(function() {

    ViewModel = {
      bindings: {
        name: 'val:text:trim,max(10)',
        amount: 'val:int:trim:comma3'
      }
    };

    Model = {
    };

    CP.set(ViewModel, Model);

  });

  describe("Name(名前)", function() {

    it("nameに' Foo 'をキー入力するとFoo/ Foo と取得/表示される", function(done) {
      $('#name').val(' Foo ');
      $('#name').trigger('keydown');
      setTimeout(function() {
        expect(ViewModel.values.name).toBe('Foo');
        expect($('#name').val()).toBe(' Foo ');
        done();
      }, 10);
    });

    it("nameに' Foo 'を入力変更するとFoo/Fooと取得/表示される", function(done) {
      $('#name').val(' Foo ');
      $('#name').trigger('change');
      setTimeout(function() {
        expect(ViewModel.values.name).toBe('Foo');
        expect($('#name').val()).toBe('Foo');
        done();
      }, 10);
    });

    it("nameにFooBooBarBuzzをキー入力するとFooBooBarB/FooBooBarBuzzと取得/表示される", function(done) {
      $('#name').val('FooBooBarBuzz');
      $('#name').trigger('keydown');
      setTimeout(function() {
        expect(ViewModel.values.name).toBe('FooBooBarB');
        expect($('#name').val()).toBe('FooBooBarBuzz');
        done();
      }, 10);
    });

    it("nameにFooBooBarBuzzを入力変更するとFooBooBarB/FooBarBと取得/表示される", function(done) {
      $('#name').val('FooBooBarBuzz');
      $('#name').trigger('change');
      setTimeout(function() {
        expect(ViewModel.values.name).toBe('FooBooBarB');
        expect($('#name').val()).toBe('FooBooBarB');
        done();
      }, 10);
    });

  });

  describe("Amount(数量)", function() {

    it("amountに' 123abc456 'をキー入力すると123456/ 123abc456 が取得/表示される", function(done) {
      $('#amount').val(' 123abc456 ');
      $('#amount').trigger('keydown');
      setTimeout(function() {
        expect(ViewModel.values.amount).toBe(123456);
        expect($('#amount').val()).toBe(' 123abc456 ');
        done();
      }, 10);
    });
    
    it("amountに' 123abc456 'を入力変更すると123456/123,456が取得/表示できる", function(done) {
      $('#amount').val('123abc456');
      $('#amount').trigger('change');
      setTimeout(function() {
        expect(ViewModel.values.amount).toBe(123456);
        expect($('#amount').val()).toBe('123,456');
        done();
      }, 10);
    });

  });

});
