
import csv
import os

print('Script started')
mha_mapping = {};
with open(r'C:\Users\kobby\Downloads\gitProjects\milcalc\packages\data\pay_data\taxes\mha_data.csv', 'r') as f:
    reader = csv.reader(f)
    next(reader) # Skip header
    for row in reader:
        if len(row) >= 2:
            mha_code = row[0].strip()
            mha_name = row[1].strip()
            if ',' in mha_name:
                city, state = mha_name.rsplit(',', 1)
                mha_mapping[(state.strip(), city.strip())] = (mha_code, mha_name)

print('MHA mapping created')

with open(r'C:\Users\kobby\Downloads\gitProjects\milcalc\packages\data\pay_data\taxes\ZIP_Locale_Detail_new.csv', 'w', newline='') as outfile:
    writer = csv.writer(outfile)
    print('New file created')
    
    with open(r'C:\Users\kobby\Downloads\gitProjects\milcalc\packages\data\pay_data\taxes\ZIP_Locale_Detail.csv', 'r') as infile:
        reader = csv.reader(infile)
        
        header = next(reader)
        writer.writerow(header + ['MHA_CODE', 'MHA_NAME'])
        print('Header written to new file')
        
        for i, row in enumerate(reader):
            state = row[3].strip()
            city = row[2].strip()
            
            mha_code, mha_name = mha_mapping.get((state, city), (None, None))
            
            writer.writerow(row + [mha_code, mha_name])
            if (i+1) % 1000 == 0:
                print(f'Processed {i+1} rows')

print('Finished writing new file')

os.remove(r'C:\Users\kobby\Downloads\gitProjects\milcalc\packages\data\pay_data\taxes\ZIP_Locale_Detail.csv')
print('Old file removed')
os.rename(r'C:\Users\kobby\Downloads\gitProjects\milcalc\packages\data\pay_data\taxes\ZIP_Locale_Detail_new.csv', r'C:\Users\kobby\Downloads\gitProjects\milcalc\packages\data\pay_data\taxes\ZIP_Locale_Detail.csv')
print('New file renamed')
