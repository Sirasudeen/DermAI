/*
 * Real rows from the SNOMED CT dermatology subset the retrieval index is built
 * on (backend/RagMicroService/data/Final_Dermatology_SNOMED.csv). Used for the
 * hero lens and the ticker so the marketing surface shows the actual corpus
 * rather than invented copy.
 */

export const CORPUS_SIZE = 40780;

export const CONCEPTS = [
  { id: "128045006", term: "Cellulitis" },
  { id: "200965009", term: "Plaque psoriasis" },
  { id: "135841008", term: "Dry eczema" },
  { id: "10347006", term: "Solar urticaria" },
  { id: "200933006", term: "Ocular rosacea" },
  { id: "186535001", term: "Eczema herpeticum" },
  { id: "195382003", term: "Spider nevus" },
  { id: "200775004", term: "Atopic neurodermatitis" },
  { id: "186289000", term: "Tinea nigra" },
  { id: "10065003", term: "Excoriated acne" },
  { id: "200707008", term: "Impetigo simplex" },
  { id: "191966002", term: "Psychogenic pruritus" },
  { id: "200766001", term: "Parakeratosis" },
  { id: "200969003", term: "Rupioid psoriasis" },
  { id: "196572005", term: "Sublingual keratosis" },
  { id: "194005002", term: "Orbital cellulitis" },
];

/* Questions phrased the way people actually type them, not clinically. */
export const COMPLAINTS = [
  "the patch behind my knee has been flaking for three weeks",
  "is this mole different from last summer or am I imagining it",
  "my scalp itches but there's no dandruff",
  "red bumps only where my watch strap sits",
  "what's the difference between eczema and psoriasis",
  "the rash goes away indoors and comes back in the sun",
  "cracked skin on my fingertips every winter",
  "should a spot that bleeds once be checked",
];
