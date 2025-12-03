import os

def is_invalid(id):
    ## double number check
    if (len(str(id)) % 2 == 0):
        mid = len(str(id)) // 2
        first_half = str(id)[:mid]
        second_half = str(id)[mid:]

        if (first_half == second_half):
            return True
        
    return False

test_mode = False
fn = "_test.txt" if test_mode else "_input.txt"

script_dir = os.path.dirname(os.path.abspath(__file__))
full_path = os.path.join(script_dir, fn)

with open(full_path, 'r') as file:
    content = file.read()

invalid_aggregation=0

for rng in content.split(","):
    rng_split = rng.split("-")

    start_num = int(rng_split[0])
    end_num = int(rng_split[1])

    for i in range(start_num, end_num + 1):
        print(i, end="")
        if (is_invalid(i)):
            print("**")
            invalid_aggregation += i
        else:
            print("")

print(f"Invalid Aggregation: {invalid_aggregation}")
