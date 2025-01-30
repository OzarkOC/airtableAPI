# Airtable API Wrapper

A simple JavaScript wrapper for the Airtable API, allowing easy interaction with Airtable bases.

## Installation

Install the package using npm:

```sh
npm install airtable dotenv
```

## Setup

Before using the package, create a `.env` file in your project root and add your Airtable API credentials:

```env
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
```

Then, import and initialize the module:

```javascript
import airExport from "./path-to-your-file.js";

dotenv.config();

const airtable = airExport();
```

Alternatively, you can provide your API key and Base ID directly:

```javascript
const airtable = airExport("your_api_key", "your_base_id");
```

## Usage

### List All Records

```javascript
const records = await airtable.listRecords();
console.log(records);
```

### Get Record by ID

```javascript
const record = await airtable.getRecordById("rec123456");
console.log(record);
```

### Create a Record

```javascript
const newRecord = await airtable.createRecord({
  Name: "New Entry",
  Status: "Active",
});
console.log(newRecord);
```

### Update a Record

```javascript
const updatedRecord = await airtable.updateRecord("rec123456", {
  Status: "Updated",
});
console.log(updatedRecord);
```

### Delete a Record

```javascript
await airtable.deleteRecord("rec123456");
console.log("Record deleted");
```

### Filter Records

```javascript
const filteredRecords = await airtable.filterRecords("Status = 'Active'");
console.log(filteredRecords);
```

### Sort Records

```javascript
const sortedRecords = await airtable.sortRecordList("Name", "asc");
console.log(sortedRecords);
```

### Change Table Name

```javascript
airtable.setTableName("new_table_name");
```

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
