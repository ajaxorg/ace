//http://www.scala-lang.org/node/227
/* Defines a new method 'sort' for array objects */
object implicits extends Application {
  implicit def arrayWrapper[A : ClassManifest](x: Array[A]) =
    new {
      def sort(p: (A, A) => Boolean) = {
        util.Sorting.stableSort(x, p); x
      }
    }
  val x = Array(2, 3, 1, 4)
  println("x = "+ x.sort((x: Int, y: Int) => x < y))
}