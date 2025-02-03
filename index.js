import Airtable from "airtable";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

if (!process.env.AIRTABLE_API_KEY) {
  throw new Error(`Missing Airtable API KEY in Environment Variables`);
}

if (!process.env.AIRTABLE_BASE_ID) {
  throw new Error(`Missing Airtable Base Id in Environment Variables`);
}

const airInstance = (
  apiKey = process.env.AIRTABLE_API_KEY,
  baseId = process.env.AIRTABLE_BASE_ID
) => {
  const base = new Airtable({ apiKey }).base(baseId);
  let table = base("cms");

  // Function to format record data
  const recordData = (record) => ({
    id: record.id,
    fields: record.fields,
  });

  // FUNCTIONS
  const selectTable = (tableName) => {
    table = base(tableName);
  };

  const listTables = async () => {
    const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      return response.data.tables.map((table) => table.name);
    } catch (error) {
      console.error("Error fetching table names:", error.message);
      throw error; // Ensure the error is propagated
    }
  };
  const listRecords = async () => {
    try {
      const records = await table.select().firstPage();
      return records.map(recordData);
    } catch (err) {
      console.error("Error listing records:", err);
      throw err;
    }
  };

  const getRecordById = async (id) => {
    try {
      const record = await table.find(id);
      return recordData(record);
    } catch (err) {
      console.error(`Error fetching record with ID ${id}:`, err);
      throw err;
    }
  };

  const createRecord = async (fields) => {
    try {
      const createdRecord = await table.create(fields);
      return recordData(createdRecord);
    } catch (err) {
      console.error("Error creating record:", err);
      throw err;
    }
  };
  const updateRecord = async (id, fields) => {
    try {
      const updatedRecord = await table.update(id, fields);
      return recordData(updatedRecord);
    } catch (err) {
      console.error(`Error updating record with ID ${id}:`, err);
      throw err;
    }
  };

  const deleteRecord = async (id) => {
    try {
      const deletedRecord = await table.destroy(id);
      return recordData(deletedRecord);
    } catch (err) {
      console.error(`Error deleting record with ID ${id}:`, err);
      throw err;
    }
  };
  const filterRecords = async (filter) => {
    try {
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
      const records = await table
        .select({ sort: [{ field, direction }] })
        .firstPage();
      return records.map(recordData);
    } catch (err) {
      console.error("Error sorting records:", err);
      throw err;
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
  };
};

export default airInstance;
