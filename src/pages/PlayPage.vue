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
  // position：落下中のテトロミノ位置情報
  const tetromino = reactive({
    current: Tetromino.random(),
    position: { x: 3, y: 0 },
  })

  // 引数：Fieldの座標x,y
  // テトロミノタイプの識別id
  // 処理：
  const classBlockColor = (_x: number, _y: number) => {
    // 現在の落下中のテトロミノpositionを分割代入
    const { x, y } = tetromino.position

    // 落下中のリアクティブなTetrominoインスタンスdataを分割代入
    // data：tetrominos[TETROMINO_TYPE]
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

    // 落下中のテトロミノposition.yが指定した_yより下,かつテトロミノの縦幅分(cols)の範囲内だったら
    if (y <= _y && _y < y + data.length) {
      // 落下中のposition.yからテトロミノの縦幅内の_yまでの距離cols
      // このcols内は同じ色
      const cols = data[_y - y]
      if (x <= _x && _x < x + cols.length) {
        if (cols[_x - x] > 0) {
          return Tetromino.id(cols[_x - x] as TETROMINO_TYPE)
        }
      }
    }

    // 上記いずれの条件にも当てはまらければ、空白を返却する
    return ''
  }

  setInterval(() => {
    // リアクティブのfield情報に静的なfield情報を上書き
    tetris.field = Field.deepCopy(staticField)

    // 落下中のテトロミノposition.y++
    tetromino.position.y++

    tetris.field.update(tetromino.current.data, tetromino.position)
  }, 1 * 1000)

  tetris.field.update(tetromino.current.data, tetromino.position)
</script>

<template>
  <h1>プレイ画面</h1>
  <h2>ユーザ名: {{ $route.query.name }}</h2>

  <div class="container">
    <table class="field" style="border-collapse: collapse">
      <tr v-for="(row, y) in tetris.field.data" :key="y">
        <td
          class="block"
          v-for="(col, x) in row"
          v-bind:class="classBlockColor(x, y)"
          :key="() => `${x}${y}`"
        >
          {{ col }}
        </td>
      </tr>
    </table>
  </div>
</template>

<style lang="stylus" scoped>
  .container
    display:flex
    justify-content: center
    align-items: stretch
  .field
    border: ridge 0.4em #2c3e50
    border-top: none
    background: #ccc

  .block
    width: 1em
    height: 1em
    border: 0.1px solid #95a5a6
    &-i
      background: #3498db
    &-o
      background: #f1c40f
    &-t
      background: #9b59b6
    &-j
      background: #1e3799
    &-l
      background: #e67e22
    &-s
      background: #2ecc71
    &-z
      background: #e74c3c
</style>
