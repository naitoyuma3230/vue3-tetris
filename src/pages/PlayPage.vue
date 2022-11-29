<script lang="ts" setup>
  import { reactive } from 'vue'
  import { Tetromino, TETROMINO_TYPE } from '../common/Tetromino'
  import { Field } from '../common/Field'

  // 静的な状態を保持するFieldインスタンス
  let staticField = new Field()

  // tetorisオブジェクトで設置済み情報をリアクティブに保持
  // fieldプロパティとしてFieldクラスをインスタンス化
  const tetris = reactive({
    field: new Field(),
  })

  // tetrominoオブジェクトでテトロミノ情報をリアクティブに保持
  // current：落下中のテトロミノtype(番号)
  // position：落下中のテトロミノ位置情報(左上)
  const tetromino = reactive({
    current: Tetromino.random(),
    position: { x: 3, y: 0 },
  })

  // 引数：Fieldの座標x,y
  // テトロミノタイプの識別id
  // 引数のFieldの座標_X,_Yと落下中のテトリスの位置、種類からその座標のクラスを判別する
  const classBlockColor = (_x: number, _y: number) => {
    // 現在の落下中のテトロミノpositionを分割代入
    const { x, y } = tetromino.position

    // 落下中のリアクティブなTetrominoインスタンスdataを分割代入
    // data：tetrominos[TETROMINO_TYPE]：テトリスの形を表す配列
    const { data } = tetromino.current

    // リアクティブなFieldインスタンスのdata(現在のフィールド情報)を取得
    // 座標x,yを指定して、その座標にあるテトロミノtype(number型)を取得
    const type = tetris.field.data[y][x]

    // 指定した座標が空白以外ならテトリミノの形id
    if (type > 0) {
      // 引数に渡されたTETROMINO_TYPEからblockクラスを返す
      // Tetorominoクラスの静的メソッド
      return Tetromino.id(type as TETROMINO_TYPE)
    }

    // 落下中のテトロミノposition.yが指定した_yより上で(下なら無条件で空)
    // かつ_yがテトロミノの縦幅分の範囲内だったら
    if (y <= _y && _y < y + data.length) {
      // 落下中のposition.yからテトリミノの縦幅内の座標_yまでの距離
      // テトリスの形上の設定上、縦幅(_y-y)は1～2cols
      const cols = data[_y - y]

      // 指定_xがposition.yより右にある
      // かつ、_xがxからテトロミノの横幅(cols)の範囲内だったら
      if (x <= _x && _x < x + cols.length) {
        // 配列内にも空の部分には0が含まれるため、判定する
        if (cols[_x - x] > 0) {
          return Tetromino.id(cols[_x - x] as TETROMINO_TYPE)
        }
      }
    }

    // 上記いずれの条件にも当てはまらければ、空白を返却する
    return ''
  }

  const canDropCurrentTetromino = (): boolean => {
    const { x, y } = tetromino.position
    const droppedPosition = { x, y: y + 1 }

    const data = tetromino.current.data
    // 現在のField状態からテトリミノが下に落下できるか
    return tetris.field.canMove(data, droppedPosition)
  }

  const nextTetrisField = () => {
    const data = tetromino.current.data
    const position = tetromino.position

    tetris.field.update(data, position)

    // 落下中のテトロミノを含むField情報を落下済状態としてstaticFieldで保存する
    staticField = new Field(tetris.field.data)

    tetris.field = Field.deepCopy(staticField)

    tetromino.current = Tetromino.random()
    tetromino.position = { x: 3, y: 0 }
  }

  setInterval(() => {
    // リアクティブのfield情報に静的なfield情報を上書き
    tetris.field = Field.deepCopy(staticField)

    if (canDropCurrentTetromino()) {
      // 落下中のテトロミノposition.y++
      tetromino.position.y++
    } else {
      nextTetrisField()
    }
  }, 1 * 1000)

  tetris.field.update(tetromino.current.data, tetromino.position)
</script>

<template>
  <h1>プレイ画面</h1>
  <h2>ユーザ名: {{ $route.query.name }}</h2>

  <div class="container">
    <table class="field">
      <tr v-for="(row, y) in tetris.field.data" :key="y">
        <td
          class="block"
          v-for="(col, x) in row"
          :key="() => `${x}${y}`"
          :class="classBlockColor(x, y)"
        >
          {{ col }}
        </td>
      </tr>
    </table>
  </div>
</template>

<style lang="stylus" scoped>
  .block
    margin: 0
    border: 1px solid #ccc
    height: 1em;
    width: 1em;
    &-i
      background: #3498db;
    &-o
      background: #f1c40f;
    &-t
      background: #9b59b6;
    &-j
      background: #1e3799;
    &-l
      background: #e67e22;
    &-s
      background: #2ecc71;
    &-z
      background: #e74c3c;

  .tetromino-preview
    width: 6.5em;
    height: 5em;
    padding: 0.1em;
    border: solid 0.5px;
</style>
