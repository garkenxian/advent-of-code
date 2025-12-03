import os
import operator

test_mode = False

def rotate_dial(current_position, direction, increment):
  operator_map = {
    "L" : operator.sub,
    "R" : operator.add
  }

  o = operator_map[direction]
  zero_count = 0

  print("Rotating...", end="")

  for i in range(1, increment + 1):
    current_position = o(current_position, 1)

    if (current_position < 0):
      current_position += 100

    if (current_position >= 100):
      current_position -= 100

    if (current_position == 0):
      zero_count += 1

    print(f"{current_position}{"*" if current_position == 0 else ""} => ", end="")

  return current_position, zero_count

fn = "p1_test.txt" if test_mode else "p1_input.txt"

script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, fn)

with open(file_path, 'r') as file:
  rotations = file.read()

print(rotations)

current_position = 50
zero_count = 0


for rotation in rotations.split('\n'):
  if rotation != "":
    direction = rotation[0]
    increment = int(rotation[1:])

    current_position, internal_zero_count = rotate_dial(
                                    current_position=current_position, 
                                    direction=direction, 
                                    increment= increment)
    
    print(f"\nRotation: {rotation:>3s}.  New Postion: {current_position:3d}. Zero Count: {internal_zero_count}")
    zero_count += internal_zero_count

print(f"Password = {zero_count}")



    
  
