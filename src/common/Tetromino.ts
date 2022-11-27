// tetrominoの形をArray<Array<number>>で表現
const tetrominos = [
  [[0]],
  [[1, 1, 1, 1]],
  [
    [2, 2],
    [2, 2],
  ],
  [
    [0, 3, 3],
    [3, 3, 0],
  ],
  [
    [4, 4, 0],
    [0, 4, 4],
  ],
  [
    [0, 0, 5],
    [5, 5, 5],
  ],
  [
    [6, 0, 0],
    [6, 6, 6],
  ],
  [
    [0, 7, 0],
    [7, 7, 7],
  ],
]

// typeの配列
const TETROMINO_TYPE = {
  I: 1, // I-テトリミノ（水色）
  O: 2, // O-テトリミノ（黄色）
  S: 3, // S-テトリミノ（緑）
  Z: 4, // Z-テトリミノ（赤）
  J: 5, // J-テトリミノ（青）
  L: 6, // L-テトリミノ（オレンジ）
  T: 7, // T-テトリミノ（紫）s
} as const

// tyoeof:変数を型に変換
// keyof:オブジェクト型のプロパティ名(key名)を取得

// TETROMINO_TYPEを型に変換->Keyを取得
// TETROMINO_TYPE型[keyのUnion type]
// valueのunion型 1 | 2| 3 | 4 | 5 | 6 | 7 を表現
export type TETROMINO_TYPE = typeof TETROMINO_TYPE[keyof typeof TETROMINO_TYPE]

export class Tetromino {
  private type: TETROMINO_TYPE

  // constractor引数に渡されたtypeをプロパティとして保持
  constructor(type: TETROMINO_TYPE) {
    this.type = type
  }

  // 引数に渡されたTETROMINO_TYPEからblockクラスを返す
  static id(type: TETROMINO_TYPE): string {
    switch (type) {
      case TETROMINO_TYPE.I:
        return 'block-i'
      case TETROMINO_TYPE.O:
        return 'block-o'
      case TETROMINO_TYPE.S:
        return 'block-s'
      case TETROMINO_TYPE.Z:
        return 'block-z'
      case TETROMINO_TYPE.J:
        return 'block-j'
      case TETROMINO_TYPE.L:
        return 'block-l'
      case TETROMINO_TYPE.T:
        return 'block-t'
      default:
        return ''
    }
  }

  // Getterを宣言:Tetromino.dataでアクセス
  // globalな定数tetrominos[Union型:1～9]を返す(0は空のテトロミノ)
  get data(): number[][] {
    return tetrominos[this.type]
  }

  static random(): Tetromino {
    const tetrominoTypes = tetrominos.length - 1
    const type = Math.floor(Math.random() * tetrominoTypes) + 1

    // 型アセーション：typeをnumber型からTETROMINO_TYPE型に上書き
    // typeをコンストラクタに渡しTetrominoクラスをインスタンス化して返す
    return new Tetromino(type as TETROMINO_TYPE)
  }
}
