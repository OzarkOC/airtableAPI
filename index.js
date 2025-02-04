import Airtable from "airtable";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const airInstance = (
  apiKey = process.env.AIRTABLE_API_KEY,
  baseId = process.env.AIRTABLE_BASE_ID
) => {
  if (!apiKey) {
    throw new Error(`Missing Airtable API KEY in Environment Variables`);
  }

  if (!baseId) {
    throw new Error(`Missing Airtable Base Id in Environment Variables`);
  }
  const base = new Airtable({ apiKey }).base(baseId);
  let table;

  // Function to format record data
  const recordData = (record) => ({
    id: record.id,
    fields: record.fields,
  });

  // FUNCTIONS

  const getFullMetadata = async () => {
    const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      return response.data.tables; // Return full metadata
    } catch (error) {
      console.error("Error fetching table metadata:", error.message);
      throw error;
    }
  };

  const listTables = async () => {
    try {
      const tables = await getFullMetadata(); // Reuse the metadata function
      return tables.map((t) => t.name); // Just return names
    } catch (error) {
      console.error("Error listing table names:", error.message);
      throw error;
    }
  };
  const selectTable = async (tableName) => {
    try {
      const tables = await listTables();
      const check = tables.find((t) => t === tableName);
      if (!check) {
        throw new Error(
          `Table "${tableName}" not found in the metadata: Check the name of the table you wish to select.`
        );
      }
      table = base(tableName);
    } catch (err) {
      console.error(`Error selecting table "${tableName}":`, err.message);
    }
  };
  const tableErrHandler = () => {
    if (!table) {
      throw new Error(
        "Please use await selectTable(tableName) before initializing function"
      );
    }
    return;
  };
  const listRecords = async () => {
    try {
      tableErrHandler();
      const records = await table.select().firstPage();
      return records.map(recordData);
    } catch (err) {
      console.error("Error listing records:", err);
      throw err;
    }
  };

  const getRecordById = async (id) => {
    try {
      tableErrHandler();
      const record = await table.find(id);
      return recordData(record);
    } catch (err) {
      console.error(`Error fetching record with ID ${id}:`, err);
      throw err;
    }
  };

  const createRecord = async (fields) => {
    try {
      tableErrHandler();
      const createdRecord = await table.create(fields);
      return recordData(createdRecord);
    } catch (err) {
      console.error("Error creating record:", err);
      throw err;
    }
  };
  const updateRecord = async (id, fields) => {
    try {
      tableErrHandler();
      const updatedRecord = await table.update(id, fields);
      return recordData(updatedRecord);
    } catch (err) {
      console.error(`Error updating record with ID ${id}:`, err);
      throw err;
    }
  };

  const deleteRecord = async (id) => {
    try {
      tableErrHandler();
      const deletedRecord = await table.destroy(id);
      return recordData(deletedRecord);
    } catch (err) {
      console.error(`Error deleting record with ID ${id}:`, err);
      throw err;
    }
  };
  const filterRecords = async (filter) => {
    try {
      tableErrHandler();
      const records = await table
        .select({ filterByFormula: filter })
        .firstPage();
      return records.map(recordData);
    } catch (err) {
      console.error("Error filtering records:", err);
      throw err;
    }
  };

  const sortRecordList = async (field, direction) => {
    try {
      tableErrHandler();
      const records = await table
        .select({ sort: [{ field, direction }] })
        .firstPage();
      return records.map(recordData);
    } catch (err) {
      console.error("Error sorting records:", err);
      throw err;
    }
  };

  const getFieldNames = async () => {
    try {
      tableErrHandler();
      const tables = await getFullMetadata(); // Reuse the metadata function
      const tableMetadata = tables.find((t) => t.name === table.name); // Use the selected table's name

      if (!tableMetadata) throw new Error(`Table "${table.name}" not found`);

      // Now that we have the table metadata, return the field names
      return tableMetadata.fields.map((field) => field.name);
    } catch (error) {
      console.error("Error fetching field names:", error.message);
      throw error;
    }
  };

  const searchArray = (search, arrField) =>
    `FIND('${search}', ARRAYJOIN(${arrField}))`;

  // Return all functions
  return {
    listRecords,
    selectTable,
    getRecordById,
    createRecord,
    updateRecord,
    deleteRecord,
    filterRecords,
    sortRecordList,
    searchArray,
    listTables,
    getFieldNames,
    getFullMetadata,
  };
};

export default airInstance;
