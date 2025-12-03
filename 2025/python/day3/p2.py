import os

test_mode = False

fn = "_test.txt" if test_mode else "_input.txt"

script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, fn)

def find_largest_digit(bank):
  li = [int(char) for char in bank]
  mv = max(li)
  i = bank.index(str(mv))

  return mv, i
  

def find_voltage(bank):
  digits = ""
  cursor = 0

  for i in range(12, 0, -1):
    last_allowed_cursor = len(bank) - i   
    sub_bank = bank[cursor: last_allowed_cursor + 1]
    digit, index = find_largest_digit(sub_bank)
    cursor += index + 1
    digits += str(digit)

  return int(digits)
      
with open(file_path, 'r') as file:
  content = file.read()

total_voltage = 0
for bank in content.split("\n"):
    if (bank != ""):
        print(f"Working with Bank: {bank}")
        voltage = find_voltage(bank)
        print(f"Bank : {bank} | Voltage : {voltage}")
        total_voltage += voltage
   
print (f"Total Voltage: {total_voltage}")
