import os
import operator

test_mode = False

fn = "p1_test.txt" if test_mode else "p1_input.txt"

script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, fn)

with open(file_path, 'r') as file:
  rotations = file.read()

print(rotations)

current_position = 50
zero_count = 0
operator_map = {
  "L" : operator.sub,
  "R" : operator.add
}

for rotation in rotations.split('\n'):
  if rotation != "":
    direction = rotation[0]
    increment = int(rotation[1:])

    current_position = operator_map[direction](current_position, increment)

    while(current_position < 0 or current_position >= 100):
      if (current_position < 0):
        current_position += 100

      if (current_position >= 100):
        current_position -= 100

    print(f"Rotation: {rotation:>3s}.  New Position: {current_position} {"*" if current_position == 0 else ""}")

    if (current_position == 0):
      zero_count += 1

print(f"Zero Count: {zero_count}")

    
  
