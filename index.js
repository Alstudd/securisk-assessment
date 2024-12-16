const data = require("./src/assets/demo.json");

function findDuplicateQuestionsWithDetails(subtopicName) {
  const subtopic = data.subtopics.find((sub) => sub.name === subtopicName);
  if (!subtopic) return {};

  const questions = subtopic.questionSets.map((qset) => qset.quest);
  console.log("Total Number of Questions:", questions.length);

  const duplicates = {};
  const allDuplicateIndexes = [];

  questions.forEach((question, index) => {
    if (!duplicates[question]) {
      duplicates[question] = { count: 0, indexes: [] };
    }
    duplicates[question].count += 1;
    duplicates[question].indexes.push(index);
  });

  const result = {};
  Object.keys(duplicates).forEach((question) => {
    if (duplicates[question].count > 1) {
      const filteredIndexes = duplicates[question].indexes.slice(1);
      result[question] = {
        count: duplicates[question].count - 1,
        indexes: filteredIndexes,
      };

      allDuplicateIndexes.push(...filteredIndexes);
    }
  });

  allDuplicateIndexes.sort((a, b) => a - b);

  return { duplicates: result, mergedIndexes: allDuplicateIndexes };
}

const subtopicArr = [
  "Time management",
  "Change management",
  "Communication skills",
  "Emotional intelligence",
  "Delegation",
  "Stress management",
  "Leadership",
  "Team-building",
  "Conflict management",
  "Negotiation skills",
  "Coaching and mentorship",
  "Innovation and creativity",
  "Client relationship",
  "Networking",
  "Decision-making and problem-solving",
];

subtopicArr.forEach((subtopic) => {
  console.log(`\n\nSubtopic: ${subtopic}`);
  const { duplicates, mergedIndexes } =
    findDuplicateQuestionsWithDetails(subtopic);
  // console.log("Duplicate Questions:", duplicates);
  console.log("Total Duplicate Questions:", mergedIndexes.length);
  console.log("All Duplicate Indexes (Sorted):", mergedIndexes);
});

// const fs = require("fs");
// const data = require("./src/assets/demo.json");

// function findAndDeleteDuplicateQuestions(subtopicName) {
//   const subtopic = data.subtopics.find((sub) => sub.name === subtopicName);
//   if (!subtopic) return { deletedCount: 0 };

//   const questions = subtopic.questionSets.map((qset) => qset.quest);
//   console.log(`\nSubtopic: ${subtopicName}`);
//   console.log("Total Number of Questions:", questions.length);

//   const duplicates = {};
//   const duplicateIndexes = [];

//   questions.forEach((question, index) => {
//     if (!duplicates[question]) {
//       duplicates[question] = { count: 0, indexes: [] };
//     }
//     duplicates[question].count += 1;
//     duplicates[question].indexes.push(index);
//   });

//   Object.keys(duplicates).forEach((question) => {
//     if (duplicates[question].count > 1) {
//       duplicateIndexes.push(...duplicates[question].indexes.slice(1));
//     }
//   });

//   duplicateIndexes.sort((a, b) => b - a);

//   duplicateIndexes.forEach((index) => {
//     subtopic.questionSets.splice(index, 1);
//   });

//   const deletedCount = duplicateIndexes.length;

//   console.log(
//     `Total Duplicate Questions Found and Deleted (Excluding First): ${deletedCount}`,
//   );
//   return { deletedCount };
// }

// const subtopicArr = [
//   "Time management",
//   "Change management",
//   "Communication skills",
//   "Emotional intelligence",
//   "Delegation",
//   "Stress management",
//   "Leadership",
//   "Team-building",
//   "Conflict management",
//   "Negotiation skills",
//   "Coaching and mentorship",
//   "Innovation and creativity",
//   "Client relationship",
//   "Networking",
//   "Decision-making and problem-solving",
// ];

// subtopicArr.forEach((subtopic) => {
//   const { deletedCount } = findAndDeleteDuplicateQuestions(subtopic);
//   if (deletedCount > 0) {
//     console.log(`Duplicate questions were removed from ${subtopic}.`);
//   }
// });

// fs.writeFileSync(
//   "./src/assets/demo_updated.json",
//   JSON.stringify(data, null, 2),
//   "utf8",
// );

// console.log("\nUpdated file saved as 'demo_updated.json'.");
