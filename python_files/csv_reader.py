import csv

def csv_to_dict():
    with open('demo_data.csv', 'r') as csvfile:
        # Create a CSV reader object
        csvreader = csv.reader(csvfile)

        # Iterate over each row in the CSV file
        rows = []
        for row in csvreader:
            # Convert the row to a list and add it to the list of rows
            rows.append(list(row))
        
        prop_dict = {}
        
        for prop in rows[1:]:
            if prop[1] not in prop_dict:
                prop_dict[prop[1]] = []
            prop_dict[prop[1]].append((prop[2], prop[3], prop[4]))

        return prop_dict    

# Replace function input with path to input after demo
# print(csv_to_dict())