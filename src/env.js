import 'dotenv/config';

const mongo_uri = process.env.MONGO_URI;
const db_name = process.env.db_name;

export {mongo_uri, db_name}