import os

def is_invalid(id):
    def split_id(id, segment_length):
        return[id[i:i+segment_length] for i in range(0, len(str(id)), segment_length)]

    id_string = str(id)
    mid = len(id_string) // 2

    for i in range(1, mid + 1):
        if (len(id_string) % i == 0):
            ## only do this if we can evenly divide the length into equal chunks
            if (len(list(set(split_id(id_string, i)))) == 1):
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
        #print(i, end="")
        if (is_invalid(i)):
            #print("**")
            invalid_aggregation += i
        # else:
        #     print("")

print(f"Invalid Aggregation: {invalid_aggregation}")
