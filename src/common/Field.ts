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

  // 指定したテトリミノがテトリスのフィールド内で移動可能かどうか判定する
  // 引数: data には、テトリミノの二次元配列を指定する
  // 引数: position には、テトリミノの位置を指定する。指定した位置にテトリミノが移動可能か判定する
  canMove = (data: number[][], position: { x: number; y: number }): boolean => {
    const y_max = this.field.length
    const x_max = this.field[0].length

    if (position.y >= y_max) return false

    for (var i = 0; i < data.length; i++) {
      const rows = data[i]
      for (var j = 0; j < rows.length; j++) {
        const block = rows[j]
        // Fieldを走査して座標j,iにブロックが存在する時
        if (block > 0) {
          // Y_max:Field下端の座標
          // position.y:テトリミノの上端座標
          // position.y + i:テトリミノの下端座標
          if (
            // テトリミノがField下端にはみ出る
            i + position.y > y_max - 1 ||
            // テトリスがField左端にはみ出る(j < 0:移動先が－座標の場合)
            0 > j + position.x ||
            // テトリスがField右端にはみ出る
            j + position.x > x_max - 1 ||
            // 移動先に設置済テトリスが存在する
            this.field[i + position.y][j + position.x] > 0
          ) {
            return false
          }
        }
      }
    }

    return true
  }
}
