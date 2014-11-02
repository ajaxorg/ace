defmodule HelloModule do
  # A "Hello world" function
  def some_fun do
    IO.puts "Juhu Kinners!"
  end
  # A private function
  defp priv do
    is_regex ~r"""
       This is a regex
       spanning several
       lines.
    """
    x = elem({ :a, :b, :c }, 0)  #=> :a
  end
end

test_fun = fn(x) ->
  cond do
    x > 10 ->
      :greater_than_ten
    true ->
      :maybe_ten
  end
end