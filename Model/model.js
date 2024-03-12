const mongoose = require('mongoose'); 

// Define the Agent schema and model
const agentSchema = new mongoose.Schema({
  agent_name: String,
  agency_id: String,
  isActive: String
});
const Agent = mongoose.model('Agent', agentSchema);

// Define the User schema and model
const userSchema = new mongoose.Schema({
  user_id: String, // or mongoose.Schema.Types.ObjectId if you want Mongoose to generate the ID
  first_name: String,
  email: String,
  gender: String,
  dob: Date,
  address: String,
  city: String,
  state: String,
  zip: String,
  phone_number: String,
  primary: Boolean,
  hasActiveClientPolicy: Boolean
});
const User = mongoose.model('User', userSchema);

// Define the Account schema and model
const accountSchema = new mongoose.Schema({
  account_name: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  account_type: String
});
const Account = mongoose.model('Account', accountSchema);

// Define the LOB schema and model
const lobSchema = new mongoose.Schema({
  category_name: String,
  category_id: String // or mongoose.Schema.Types.ObjectId if you want Mongoose to generate the ID
});
const LOB = mongoose.model('LOB', lobSchema);

// Define the Carrier schema and model
const carrierSchema = new mongoose.Schema({
  company_name: String
});
const Carrier = mongoose.model('Carrier', carrierSchema);

// Define the Policy schema and model
const policySchema = new mongoose.Schema({
  policy_number: String,
  premium_amount_written: Number,
  premium_amount: Number,
  policy_type: String,
  policy_start_date: Date,
  policy_end_date: Date,
  csr: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  carrier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier' },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LOB' },
  policy_mode: Number,
  producer: String
});
const Policy = mongoose.model('Policy', policySchema);

// Export the models (if you are using separate modules)
module.exports = { Agent, User, Account, LOB, Carrier, Policy };
