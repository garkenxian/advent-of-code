import os

test_mode = False

fn = "_test.txt" if test_mode else "_input.txt"

def is_in_existing_range(test_range, ranges):
  for r in ranges:
    if test_range[0] >= r[0] and test_range[1] <= r[1]:
      return True

  return False

def is_encompassing_existing_range(test_range, ranges):
  result = False

  range_to_remove = None
  range_to_add = None

  for r in ranges:
    if test_range[0] <= r[0] and test_range[1] >= r[1]:
      range_to_remove = r
      range_to_add = test_range
      break

  if range_to_add is not None and range_to_remove is not None:
    ranges.remove(range_to_remove)
    ranges.append(range_to_add)
    result = True
      
  return result

def is_start_in_existing_range(test_range, ranges):
  result = False

  range_to_remove = None
  range_to_add = None

  for r in ranges:
    if test_range[0] >= r[0] and test_range[0] <= r[1] and test_range[1] >= r[1]:
      range_to_remove = r
      range_to_add = [r[0], test_range[1]]
      break

  if range_to_add is not None and range_to_remove is not None:
    ranges.remove(range_to_remove)
    ranges.append(range_to_add)
    result = True

  return result

def is_end_in_existing_range(test_range, ranges):
  result = False

  range_to_remove = None
  range_to_add = None

  for r in ranges:
    if test_range[0] <= r[0] and test_range[1] >= r[0] and test_range[1] <= r[1]:
      range_to_remove = r
      range_to_add = [test_range[0], r[1]]
      break

  if range_to_add is not None and range_to_remove is not None:
    ranges.remove(range_to_remove)
    ranges.append(range_to_add)
    result = True

  return result

script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, fn)

with open(file_path, 'r') as file:
  content = file.read()

ranges = []

for line in content.split("\n"):
  if line != "":
    rng = line.split("-")
    ranges.append([int(rng[0]), int(rng[1])])
  else:
    break

sorted_ranges = sorted(ranges, key=lambda x: x[0])

distinct_ranges = []

for r in sorted_ranges:
  ## is range fully inside another range:: ignore this range
  result = is_in_existing_range(r, distinct_ranges) \
        or is_encompassing_existing_range(r, distinct_ranges) \
        or is_start_in_existing_range(r, distinct_ranges) \
        or is_end_in_existing_range(r, distinct_ranges)
  
  if not result:
    distinct_ranges.append(r)

# print(distinct_ranges)

fresh_item_count = 0

for r in distinct_ranges:
  fresh_item_count += (r[1] - r[0]) + 1

print (f"Fresh Item Count: {fresh_item_count}")
