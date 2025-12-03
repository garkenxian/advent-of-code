import os

test_mode = False

fn = "_test.txt" if test_mode else "_input.txt"

script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, fn)

def find_largest_digit(bank):
  for i in range(9,0,-1):
    if (bank.find(str(i)) > -1):
      return i
        
def get_largest_possible_value(bank, current_value):
  print(f"... Working with Subbank {bank}")
  first_digit = bank[0]
    
  ## shortcut this mess.  if first (digit * 10 + 9) is less than the current value, dont look for the second value
  if (((int(first_digit) * 10) + 9) > current_value):
    second_digit = find_largest_digit(bank[1:])
  else:
    print(f"... Skipping Second Digit Search")
    second_digit = 9
  return int(f"{first_digit}{second_digit}")

def find_voltage(bank):
    bank_length = len(bank)
    current_value = 0

    for i in range(0, bank_length - 1):
        potential_value = get_largest_possible_value(bank[i:], current_value)
        print(f"... Found Potential Value: {potential_value}")

        if potential_value > current_value:
            print(f"...... Setting Current Value: {potential_value}")
            current_value = potential_value

    return current_value

with open(file_path, 'r') as file:
  content = file.read()

print(content)

total_voltage = 0
for bank in content.split("\n"):
    if (bank != ""):
        print(f"Working with Bank: {bank}")
        voltage = find_voltage(bank)
        print(f"Bank : {bank} | Voltage : {voltage}")
        total_voltage += voltage
   
print (f"Total Voltage: {total_voltage}")
