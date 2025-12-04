import os
import copy

test_mode = False

fn = "_test.txt" if test_mode else "_input.txt"

script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, fn)

with open(file_path, 'r') as file:
  content = file.read()

arr = []
for line in content.split("\n"):
  if line != "":
    arr.append(list(line))

move_arr = copy.deepcopy(arr)

width = len(arr[0])
length = len(arr)

movable_count = 0
for l in range(0, length):
  for w in range(0, width):
    item = arr[l][w]
    print (f"{w}:{l} = {item}")

    if (item == "@"):
      print ("Checking...")

      #iterate throught nw,n,ne,w,e,sw,s,se
      near_count = 0
      for nsi in [-1, 0, 1]:
        for ewi in [-1, 0, 1]:

          cl = l + nsi
          cw = w + ewi
          # print(f"### {cw}:{cl}")

          if (cw >= 0 and cw < width and cl >= 0 and cl < length):
            if not (nsi == 0 and ewi == 0):
              check_item = arr[cl][cw]
              #print(f"... {cw}:{cl} = {check_item}")
              if check_item == "@":
                near_count += 1
      
      if near_count < 4:
        print (f"{w}:{l} is movable")
        move_arr[l][w] = "x"
        movable_count += 1
    else:
      print ("No Need to check")

print (f"Movable Count = {movable_count}")

for ll in move_arr:
  print("".join(ll))
    