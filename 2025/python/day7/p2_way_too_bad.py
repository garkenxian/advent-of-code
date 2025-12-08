import os
import copy
from datetime import datetime, timedelta

test_mode = False

fn = "_test.txt" if test_mode else "_input.txt"

def print_graph(graph):
  graph_string = ""

  for line in graph:
    graph_string += "".join(line)
    graph_string += "\n"

  # print(graph_string)
  return graph_string

timer = datetime.now()

def generate_variant_route(variant_count, decimal_number = 0):
  binary_string = format(decimal_number, f"0{variant_count}b")
  binary_array = [int(bit) for bit in binary_string]

  return binary_array

def increment_variant_route(variant_route, variant_count):
  global timer
  stringified_list = [str(num) for num in variant_route]
  dec_number = int("".join(stringified_list), 2)
  dec_number += 1

  largest_possible_value = (2 ** variant_count) - 1

  if (datetime.now() > timer):
    print(f"On Loop {dec_number + 1} of {largest_possible_value}")
    timer = datetime.now() + timedelta(seconds=10)

  ok_to_proceed = dec_number <= largest_possible_value

  new_variant_route = generate_variant_route(variant_count, dec_number) if ok_to_proceed else None

  return ok_to_proceed, new_variant_route

script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, fn)

with open(file_path, 'r') as file:
  content = file.read()

default_lines = []
for line in content.split("\n"):
  if line != "":
    default_lines.append(list(line))

## find first line for S
default_cursor = default_lines[0].index("S")

default_lines[1][default_cursor] = "|"

timeline_graphs = []

## determine number of variant pointspy
variant_count = 0
for line in default_lines:
  if "^" in line:
    variant_count += 1

variant_route = generate_variant_route(variant_count)
ok_to_proceed = True

print (f"Number of possible variant points: {variant_count}")
variant_paths = []

while(ok_to_proceed):
  lines = copy.deepcopy(default_lines)
  cursor = default_cursor
  for y in range(2, len(lines),2):
    current_char = lines[y][cursor]

    if current_char == "^":
      variant_point = int(((y)/2) - 1)
      if variant_route[variant_point] == 0:
        cursor = cursor - 1
      else:
        cursor = cursor + 1
    lines[y][cursor] = "|"
    lines[y+1][cursor] = "|"

  final_graph = print_graph(lines)

  if final_graph not in variant_paths:
    variant_paths.append(final_graph)
  
  ok_to_proceed, variant_route = increment_variant_route(variant_route, variant_count)

print(f"Final Count: {len(variant_paths)}")
