export class Field {
  // number型の配列 in 配列
  private field: number[][]

  // null許容number型の配列 in 配列
  constructor(data?: number[][]) {
    // dataは設置済テトロミノのfield情報
    if (data) {
      this.field = data
    } else {
      const row = 20
      const column = 10

      // new Arrayで配列を作成する際<>を使用し型注釈を行う
      // 配列の中にnumber型のみ入る配列をrow個作成
      const data = new Array<Array<number>>(row)

      for (let i = 0; i < row; i++) {
        // 配列の中身を0で初期化
        const fieldColumn = new Array(column).fill(0)
        // fieldColumn.fill('test') number型で型注釈していないのでノーエラー
        data[i] = fieldColumn
      }

      this.field = data
    }
  }

  // Field.dataでアクセス
  get data(): number[][] {
    return this.field
  }

  // クラス内のメソッド定義はconst,let宣言なし
  // 引数：data,position
  // 処理：fieldのdata配列内容をposition(x,y)分スライド
  // 戻値：void
  update = (data: number[][], position: { x: number; y: number }): void => {
    for (var i = 0; i < data.length; i++) {
      const cols = data[i]
      for (var j = 0; j < cols.length; j++) {
        const block = cols[j]
        if (block > 0) {
          this.field[i + position.y][j + position.x] = block
        }
      }
    }
  }

  // 戻値、引数：Fieldクラス
  // 処理：引数のFieldクラスのdataを取り出し、newDataで新しいFiledインスタンスを返す
  static deepCopy = (field: Field): Field => {
    const data = field.data
    const newFieldData = new Array<Array<number>>(data.length)
    // array.entries()
    for (const [i, rows] of data.entries()) {
      newFieldData[i] = new Array(rows.length)
      for (const [j] of rows.entries()) {
        newFieldData[i][j] = data[i][j]
      }
    }

    return new Field(newFieldData)
  }
}
