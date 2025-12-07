import os
import operator

test_mode = False

fn = "_test.txt" if test_mode else "_input.txt"

script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, fn)

with open(file_path, 'r') as file:
  content = file.read()

# print(content)

ops = {
  "*" : operator.mul,
  "+" : operator.add
}

lines = []
for line in content.split("\n"):
  if line != "":
    lines.append(line)

## flip the array to make it easier to process
arr_string = ""
for i in range(len(lines[0]) -1, -1, -1):
  if (arr_string != ""):
    arr_string += "\n"
  for j in range(0, len(lines)):
    arr_string += lines[j][i]

print(arr_string)
## now turn into math problems
problems = []
nums = []
o = None
for line2 in arr_string.split("\n"):
  if not line2.strip():
    problems.append([o, nums])
    nums = []
    o = None
  else:
    if line2[-1] in ["+", "*"]:
      o = ops[line2[-1]]
      line2 = line2[:-1]
    nums.append(int(line2))

## final add
problems.append([o, nums])

# print (problems)
total = 0
for problem in problems:
  result = problem[1][0]
  for i in range(1, len(problem[1])):
    result = problem[0](result, problem[1][i])

  total += result

print (f"Total: {total}")
  