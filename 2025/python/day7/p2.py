import os
import copy

test_mode = False

fn = "_test.txt" if test_mode else "_input.txt"

def print_graph(graph):
  graph_string = ""

  for line in graph:
    graph_string += "".join(line)
    graph_string += "\n"

  print(graph_string)

def get_yx(yx):
  _yx = yx.split(":")
  return int(_yx[0]), int(_yx[1])

script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, fn)

with open(file_path, 'r') as file:
  content = file.read()

lines = []
for line in content.split("\n"):
  if line != "":
    lines.append(list(line))

timelines = []

## find first line for S
Sx = lines[0].index("S")
lines[1][Sx] = "|"

timelines = {}
upcoming_timelines = {
  Sx:1
}

for y in range(2, len(lines), 2):
  timelines = copy.deepcopy(upcoming_timelines)
  upcoming_timelines = {}
  timeline_cache = {}
  for x in timelines:
    if x not in timeline_cache:
      split_action = False
      south_char = lines[y][x]

      split_action = south_char == "^"
      timeline_cache[x] = split_action
    else:
      split_action = timeline_cache[x]

    current_timelines = timelines[x]

    if split_action:
      if (x + 1) in upcoming_timelines:
        upcoming_timelines[x + 1] += current_timelines
      else:
        upcoming_timelines[x + 1] = current_timelines

      if (x - 1) in upcoming_timelines:
        upcoming_timelines[x - 1] += current_timelines
      else:
        upcoming_timelines[x - 1] = current_timelines
    else:
      if (x) in upcoming_timelines:
        upcoming_timelines[x] += current_timelines
      else:
        upcoming_timelines[x] = current_timelines

total = 0

for timeline in upcoming_timelines:
  total += upcoming_timelines[timeline]


print(f"Total Timelines: {total}")
