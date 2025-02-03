# Airtable API Wrapper

A simple JavaScript wrapper for the Airtable API, allowing easy interaction with Airtable bases.

## Installation

Install the package using npm:

```bash
npm install airtable dotenv
```

## Setup

Before using the package, create a `.env` file in your project root and add your Airtable API credentials:

```env
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
```

Then, import and initialize the module:

Set your script type to module

```javascript
import airInstance from "airtable-api";
import dotenv from "dotenv";
dotenv.config();

const airExport = airInstance();
```

Alternatively, you can provide your API key and Base ID directly:

```javascript
const airEx = airExport("your_api_key", "your_base_id");
```

#### Accessing Multiple Airtable Bases:

```javascript
const airtableInstance1 = airtable(apiKey1, baseID1);
const airtableInstance2 = airtable(apiKey2, baseID2);
```

### Using Environment Variables on Other Platforms

If you are deploying your application on platforms like Vercel, Netlify, or Heroku, ensure that you set the environment variables in their respective dashboards:

- **Vercel**: Add `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` in the project's Environment Variables section.
- **Netlify**: Navigate to Site Settings > Build & Deploy > Environment and set the variables.
- **Heroku**: Use `heroku config:set AIRTABLE_API_KEY=your_api_key AIRTABLE_BASE_ID=your_base_id`.

## Usage

Be sure to set the table name you want to use data from.

### Select/Change Table Name

takes a ("string") \*\*Be sure the table name exists in airtable.

```javascript
airtable.selectTable("table_name");
```

### List Table Names

Show all the names of the tables within the base schema

```javascript
const tables = await airExport.listTables(); // Ensure you await this
console.log(tables); // This will print the list of tables
```

### List All Records

Show all records in selected table.

```javascript
const records = await airtable.listRecords();
console.log(records);
```

### Get Record by ID

takes ("string")

```javascript
const record = await airtable.getRecordById("rec123456");
console.log(record);
```

### Create a Record

Takes (object)
Be sure your object has field names corrisopnding to your table.
\*List a record or records to check the object of a record to use as a template. Leaveing a item "" blank or leaving it out of your object will make it blank. ie: Status: "";

```javascript
const newRecord = await airtable.createRecord({
  Name: "New Entry",
  Status: "Active",
});
console.log(newRecord);
```

### Update a Record

takes ("id", object)
\*List a record or records to check the object of a record to use as a template. Leaveing a item "" blank ie: Status: ""; List only items in your object you desire to update. Leaving an item out of the object will keep its original value.

```javascript
const updatedRecord = await airtable.updateRecord("rec123456", {
  Status: "Updated",
});
console.log(updatedRecord);
```

### Delete a Record

Deletes by record ID ("string")

```javascript
await airtable.deleteRecord("rec123456");
console.log("Record deleted");
```

### Filter Records

The filterRecords function allows you to filter records in your Airtable base based on field values. You can apply filters on various field types like Single Line Text, Number, Single Select, Date, etc.
Takes a string.
Example: `{Field Name}="value"`

```javascript
const filteredRecords = await airtable.filterRecords("{Status} = 'Active'");
```

Where filterFormula is a string representing the filter condition.

#### Field Types & Examples

[https://support.airtable.com/docs/formula-field-reference]
| Field Type | Filter Condition Example | Description |
| -------------------------- | ---------------------------------- | ------------------------------------------------------------------------ |
| **Single Line Text** | `{Name} = "John Doe"` | Filters records where the `Name` field is exactly "John Doe". |
| **Single Select** | `{Status} = "Active"` | Filters records where the `Status` field is set to "Active". |
| **Number** | `{Price} > 100` | Filters records where the `Price` field is greater than 100. |
| **Date** | `{Start Date} >= "2023-01-01"` | Filters records where the `Start Date` is on or after January 1st, 2023. |
| **Checkbox** | `{Is Active} = TRUE` | Filters records where the `Is Active` checkbox is checked (TRUE). |
| **Multiple Select** | `FIND('Red', ARRAYJOIN({Colors}))` | Filters records where the `Colors` field contains the value "Red". |
| **Formula** | `{Calculated Field} = 50` | Filters records where the value in the `Calculated Field` is 50. |
| **Attachment** | `{File} = BLANK()` | Filters records where the `File` attachment field is empty. |
| **Link to another record** | `{Linked Record} = "Record ID"` | Filters records where the linked record matches a specific ID. |

### Sort Records

```javascript
const sortedRecords = await airtable.sortRecordList("Name", "asc");
console.log(sortedRecords);
```

### Example Usage of `filterRecords`

The `filterRecords` function allows you to filter records based on specific conditions using Airtable's filter formulas. Below are some example usage scenarios based on different field types:

#### Example 1: Filtering by Single Line Text

```javascript
const filter = `{Name} = "John Doe"`;
const filteredRecords = await airEx.filterRecords(filter);
```

This filters records where the Name field is exactly "John Doe".

#### Example 2: Filtering by Single Select

```javascript
const filter = `{Status} = "Active"`;
const filteredRecords = await airEx.filterRecords(filter);
```

This filters records where the Status field is set to "Active".

#### Example 3: Filtering by Number

```javascript
const filter = `{Price} > 100`;
const filteredRecords = await airEx.filterRecords(filter);
```

This filters records where the Price field is greater than 100.

#### Example 4: Filtering by Date

```javascript
const filter = `{Start Date} >= "2023-01-01"`;
const filteredRecords = await airEx.filterRecords(filter);
```

This filters records where the Start Date is on or after January 1st, 2023.

#### Example 5: Filtering by Checkbox

```javascript
const filter = `{Is Active} = TRUE`;
const filteredRecords = await airEx.filterRecords(filter);
```

This filters records where the Is Active checkbox is checked (TRUE).

#### Example 6: Filtering by Multiple Select

```javascript
const filter = `FIND('Red', ARRAYJOIN({Colors}))`;
const filteredRecords = await airEx.filterRecords(filter);
```

This filters records where the Colors field contains the value "Red".

#### Example 7: Filtering by Formula Field

```javascript
const filter = `{Calculated Field} = 50`;
const filteredRecords = await airEx.filterRecords(filter);
```

This filters records where the value in the Calculated Field is 50.

#### Example 8: Filtering by Attachment (Empty)

```javascript
const filter = `{File} = BLANK()`;
const filteredRecords = await airEx.filterRecords(filter);
```

This filters records where the File attachment field is empty.

#### Example 9: Filtering by Link to Another Record

```javascript
const filter = `{Linked Record} = "Record ID"`;
const filteredRecords = await airEx.filterRecords(filter);
```

This filters records where the linked record matches a specific ID.

## Error Handling

All functions return a Promise. Make sure to use `try/catch` when calling async functions:

```javascript
try {
  const records = await airtable.listRecords();
  console.log(records);
} catch (error) {
  console.error("Error fetching records:", error);
}
```

## License

This project is licensed under the MIT License.
