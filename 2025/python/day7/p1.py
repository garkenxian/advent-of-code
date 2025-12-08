import os

test_mode = False

fn = "_test.txt" if test_mode else "_input.txt"

def print_graph(graph):
  graph_string = ""

  for line in graph:
    graph_string += "".join(line)
    graph_string += "\n"

  print(graph_string)

script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, fn)

with open(file_path, 'r') as file:
  content = file.read()

lines = []
for line in content.split("\n"):
  if line != "":
    lines.append(list(line))

## find first line for S
Sx = lines[0].index("S")

lines[1][Sx] = "|"
split_counter = 0

for y in range(2, len(lines)):
  # print_graph(lines)
  for x in range(0, len(lines[y])):
    current_char = lines[y][x]
    north_char = lines[y-1][x]

    if north_char == "|":
      if current_char == ".":
        lines[y][x] = "|"
      elif current_char == "^":
        lines[y][x - 1] = "|"
        lines[y][x + 1] = "|"
        split_counter += 1


print (f"Total Splits: {split_counter}")
        

  
  
