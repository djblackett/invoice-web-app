// import patientData from "../data/patients-full";
// import {NewEntry, NewPatientEntry, NonSensitivePatientEntry, Patient} from "../types";
// import { v1 as uuid } from "uuid";
// const patients: Patient[] = patientData;
//
// const getEntries = (): Patient[] => {
//   return patients;
// };
//
// const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
//   return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
//     id,
//     name,
//     dateOfBirth,
//     gender,
//     occupation,
//     entries
//   }));
// };
//
// const addPatient = (patientEntry: NewPatientEntry) => {
//   const patient = { id: uuid(), ...patientEntry };
//   patients.push(patient);
//   console.log("patient added");
//   return patient;
// };
//
// const addEntry = (newEntry: NewEntry, id: string) => {
//   const entry = {id: uuid(), ...newEntry};
//   const patient = patients.find(p => p.id === id);
//   patient?.entries.push(entry);
//   console.log("entry added to", patient?.name);
//   return entry;
// };
//
// export default {
//   getEntries,
//   addPatient,
//   addEntry,
//   getNonSensitiveEntries,
// };
