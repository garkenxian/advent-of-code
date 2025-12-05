import os

test_mode = False

fn = "_test.txt" if test_mode else "_input.txt"

def is_fresh(ingredient, ranges):
  for r in ranges:
    if ingredient >= r[0] and ingredient <= r[1]:
      return True
    
  return False

script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, fn)

with open(file_path, 'r') as file:
  content = file.read()

ranges = []
ingredients = []

do_ranges = True
for line in content.split("\n"):
  if do_ranges:
    if line != "":
      rng = line.split("-")
      ranges.append([int(rng[0]), int(rng[1])])
    else:
      do_ranges = False
  else:
    if line != "":
      ingredients.append(int(line))

fresh_count = 0
for i in ingredients:
  fresh_count += 1 if is_fresh(i, ranges) else 0

print(f"Fresh Count: {fresh_count}")
