# コンセプト

* ベースにjQueryを使う
* なるべく定番の処理は短く記述できるように
* FORMの値をViewModel, Viewをバインドする
* イベントは複数登録できるようにする
* Observerパターンにする->する必要がないかもしれない

## イベント

```
events: {
  submit_calc: {
    click: function() {...}
  },
  submit_calc: {
    click: function() {...}
  }
}
```







# アイデア


## 考察事項

* なるべく最低限の定義だけで自動でやってくれたほうがいい
* ある程度割り切りは必要
* 複数のViewModelやModelが必要かどうか?
* 自動バインドの仕組み
* 元がinput/selectの何か?
* バインドするDOMはattributeかvalかtextか(valかtextは自動がいい)
* Knockoutを参考に
  * http://www.buildinsider.net/web/bookjslib111/89
* バインドは1つのDOMで1つでも構わない
  * バインドは値が取れるようにしておくだけでOk
  * 変換/フォーマット機構は欲しい
    * なるべく基本機能は、新たに関数を作らなくてすむようにする
* イベントは1つのDOMに複数必要
