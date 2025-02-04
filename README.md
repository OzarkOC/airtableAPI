# Airtable API Wrapper

A simple JavaScript wrapper for the Airtable API, allowing easy interaction with Airtable bases.

## Installation

Install the package using npm:

```bash
npm install airtable dotenv
```

## Setup

NPM to add node module:

```console
npm i airtable-api
```

Before using the package, create a `.env` file in your project root and add your Airtable API credentials:

```env
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
```

Then, import and initialize the module:

- Set your script type to module

```html
<script type="module" src="your/script/source.js"></script>
```

- Import placed in script:

```javascript
import airInstance from "airtable-api";
import dotenv from "dotenv";
dotenv.config();

const airExport = airInstance();
```

Alternatively, you can provide your API key and Base ID directly,:

NOTE: Only recomended on backend servers. API Keys should not be revealed on client-side.

```javascript
const airExport2 = airInstance("your_api_key", "your_base_id");
```

#### Accessing Multiple Airtable Bases:

```javascript
const airExport1 = airInstance(apiKey1, baseID1);
const airExport2 = airIntance(apiKey2, baseID2);
```

### Using Environment Variables on Other Platforms

If you are deploying your application on platforms like Vercel, Netlify, or Heroku, ensure that you set the environment variables in their respective dashboards:

- **Vercel**: Add `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` in the project's Environment Variables section.
- **Netlify**: Navigate to Site Settings > Build & Deploy > Environment and set the variables.
- **Heroku**: Use `heroku config:set AIRTABLE_API_KEY=your_api_key AIRTABLE_BASE_ID=your_base_id`.

## Usage

Be sure to set the table name you want to use data from first.

### selectTable()

**Description**  
Sets the table name for the Airtable API operations. Make sure the table name exists in Airtable.

**Parameters**

- **tableName**: (string) The name of the table to set.

**Returns**

- None.

**Example Usage**

```javascript
await airExport.selectTable("table_name");
```

### getFullMetadata()

**Description**  
Fetches full metadata for all tables in a specified Airtable base. This function is used as the foundation for both `listTables()` and `getFieldNames()`.

**Parameters**

- **None**

**Returns**

- A list of all tables and their metadata within the Airtable base.

**Example Usage**

```javascript
const tablesMetadata = await airExport.getFullMetadata();
console.log(tablesMetadata); // Output: Array of table objects with metadata.
```

### getFieldNames()

**Description**
Fetches the field names for a specified table in a given Airtable base. It utilizes the getFullMetadata() function to get all table metadata and finds the relevant table by its name, returning an array of field names for that table.

**Parameters**

- **None**

**Returns**

- An array of strings representing the field names in the specified table.

**Example Usage**

```javascript
const fieldNames = await airExport.getFieldNames("Table1");
console.log(fieldNames); // Output: Array of field names for "Table1" (e.g., ["Field1", "Field2", "Field3"]).
```

### listTables()

**Description**  
Fetches all the names of the tables within the Airtable base schema.

**Parameters**

- **None**

**Returns**

- A list of table names within the Airtable base.

**Example Usage**

```javascript
const tables = await airtable.listTables();
console.log(tables); // Output: ["Table1", "Table2", "Table3"]
```

### listRecords()

**Description**  
Fetches all records from the currently selected table.

**Parameters**

- **None**

**Returns**

- An array of all records from the currently selected table.

**Example Usage**

```javascript
const records = await aiExport.listRecords();
console.log(records); // Output: Array of records from the selected table.
```

### getRecordById()

**Description**  
Fetches a single record by its ID from the currently selected table.

**Parameters**

- **recordId**: (string) The ID of the record to fetch.

**Returns**

- The record with the specified ID.

**Example Usage**

```javascript
const record = await airExport.getRecordById("rec123456");
console.log(record);
```

### createRecord()

**Description**  
Creates a new record in the currently selected table.

**Parameters**

- **recordData**: (object) The data for the new record. The object must include field names corresponding to the table's fields. To leave fields blank, do not add them to the object.

**Returns**

- The newly created record.

**Example Usage**" blank or leaving it out of your object will make it blank. ie: Status: "";

```javascript
const newRecord = await airExport.createRecord({
  Name: "New Entry",
  Status: "Active",
});
console.log(newRecord);
```

### updateRecord()

**Description**  
Updates an existing record in the currently selected table.

**Parameters**

- **recordId**: (string) The ID of the record to update.
- **updateData**: (object) The data to update. Only fields provided in the object will be updated.

**Returns**

- The updated record.

**Example Usage**

```javascript
const updatedRecord = await airExport.updateRecord("rec123456", {
  Status: "Updated",
});
console.log(updatedRecord);
```

### deleteRecord()

**Description**  
Deletes a record by its ID from the currently selected table.

**Parameters**

- **recordId**: (string) The ID of the record to delete.

**Returns**

- None.

**Example Usage**

```javascript
await airExport.deleteRecord("rec123456");
```

### sortRecordList()

**Description**  
Sorts the records in the selected table by a specific field in either ascending or descending order.

**Parameters**

- **fieldName**: (string) The field to sort by.
- **order**: (string) Either "asc" for ascending or "desc" for descending.

**Returns**

- A sorted array of records.

**Example Usage**

```javascript
const sortedRecords = await airExport.sortRecordList("Name", "asc");
console.log(sortedRecords);
```

### filterRecords()

**Description**  
Filters records in the selected table based on a given condition using Airtable's filter formula syntax.

**Parameters**

- **filterFormula**: (string) The filter condition to apply.

**Returns**

- An array of records that match the filter condition.

**Example Usage**
Example: `{Field Name}="value"`

```javascript
const filteredRecords = await airExport.filterRecords("{Status} = 'Active'");
```

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

### Example Usage of `filterRecords`

The `filterRecords` function allows you to filter records based on specific conditions using Airtable's filter formulas. Below are some example usage scenarios based on different field types:

#### Example 1: Filtering by Single Line Text

```javascript
const filter = `{Name} = "John Doe"`;
const filteredRecords = await airExport.filterRecords(filter);
```

This filters records where the Name field is exactly "John Doe".

#### Example 2: Filtering by Single Select

```javascript
const filter = `{Status} = "Active"`;
const filteredRecords = await airExport.filterRecords(filter);
```

This filters records where the Status field is set to "Active".

#### Example 3: Filtering by Number

```javascript
const filter = `{Price} > 100`;
const filteredRecords = await airExport.filterRecords(filter);
```

This filters records where the Price field is greater than 100.

#### Example 4: Filtering by Date

```javascript
const filter = `{Start Date} >= "2023-01-01"`;
const filteredRecords = await airExport.filterRecords(filter);
```

This filters records where the Start Date is on or after January 1st, 2023.

#### Example 5: Filtering by Checkbox

```javascript
const filter = `{Is Active} = TRUE`;
const filteredRecords = await airExport.filterRecords(filter);
```

This filters records where the Is Active checkbox is checked (TRUE).

#### Example 6: Filtering by Multiple Select

```javascript
const filter = `FIND('Red', ARRAYJOIN({Colors}))`;
const filteredRecords = await airExport.filterRecords(filter);
```

This filters records where the Colors field contains the value "Red".

#### Example 7: Filtering by Formula Field

```javascript
const filter = `{Calculated Field} = 50`;
const filteredRecords = await airExport.filterRecords(filter);
```

This filters records where the value in the Calculated Field is 50.

#### Example 8: Filtering by Attachment (Empty)

```javascript
const filter = `{File} = BLANK()`;
const filteredRecords = await airExport.filterRecords(filter);
```

This filters records where the File attachment field is empty.

#### Example 9: Filtering by Link to Another Record

```javascript
const filter = `{Linked Record} = "Record ID"`;
const filteredRecords = await airExport.filterRecords(filter);
```

This filters records where the linked record matches a specific ID.

## Error Handling

All functions return a Promise. Make sure to use `try/catch` when calling async functions:

```javascript
try {
  const records = await airExport.listRecords();
  console.log(records);
} catch (error) {
  console.error("Error fetching records:", error);
}
```

## License

This project is licensed under the MIT License.
