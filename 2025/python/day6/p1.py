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

cursor = 0
math_arr = []
for line in content.split("\n"):
  if line != "":
    math_arr.append([])

    for value in line.split(" "):
      if (value != ""):
        math_arr[cursor].append(value)
    cursor += 1

operator_arr = math_arr.pop()

total = 0

for i in range(0, len(operator_arr)):
  op = ops[operator_arr[i]]

  result = 0
  for j in range(0, len(math_arr)):
    if j == 0:
      result = int(math_arr[j][i])
    else:
      result = op(result, int(math_arr[j][i]))
  
  total += result
    
print (f"Total Result: {total}")
