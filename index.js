import Airtable from "airtable";
import dotenv from "dotenv";

dotenv.config();

const airExport = (apiKey, baseId) => {
  const base = new Airtable({
    apiKey: apiKey || process.env.AIRTABLE_API_KEY, // Default to process.env if not provided
  }).base(baseId || process.env.AIRTABLE_BASE_ID); // Default to process.env if not provided

  let table = base("cms");

  // FUNCTIONS
  const setTableName = (tableName) => {
    table = base(tableName);
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

  const recordData = (record) => ({
    id: record.id,
    fields: record.fields,
  });

  const searchArray = (search, arrField) =>
    `FIND('${search}', ARRAYJOIN(${arrField}))`;

  // Return all functions
  return {
    listRecords,
    setTableName,
    getRecordById,
    createRecord,
    updateRecord,
    deleteRecord,
    filterRecords,
    sortRecordList,
    searchArray,
  };
};

export default airExport;
