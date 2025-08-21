import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.libs.js";

export const createProblem = async (req, res) => {
        const {
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            testcases,
            codeSnippets,
            referenceSolutions,
        } = req.body;

  // going to check the user role once again

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
      }

      //
      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result-----", result);
        // console.log(
        //   `Testcase ${i + 1} and Language ${language} ----- result ${JSON.stringify(result.status.description)}`
        // );
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      sucess: true,
      message: "Message Created Successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.error("Error creating problem:", error.response?.data || error.message || error);

    return res.status(500).json({
      error: "Error While Creating Problem",
    });
  }
};



// export const createProblem = async (req, res) => {

//             // Temporary debug - add this at the start of createProblem function
//         console.log("Testing language mapping:");
//         console.log("cpp ->", getLanguageId("cpp"));
//         console.log("java ->", getLanguageId("java")); 
//         console.log("javascript ->", getLanguageId("javascript"));

            
//         const {
//             title,
//             description,
//             difficulty,
//             tags,
//             examples,
//             constraints,
//             testcases,
//             codeSnippets,
//             referenceSolution
//         } = req.body;

//         try{
        
//             for(const {language,completeCode} of referenceSolution){
//                 // source_code:
//                 // language_id:
//                 // stdin: 
//                 // expectedOutput:
//         // 1st debugger
//                 console.log("Processing language:", language);
//                 console.log("Complete code:", completeCode);
                
//                 const languageId = getLanguageId(language);
//                 console.log("Got language ID:", languageId);
//         //2nd debugger     
//             if (!languageId) {
//                 return res.status(400).send(`Unsupported language: ${language}`);
//          }

//                 // const languageId = getLanguageId(language);
                
//                 // I am creating Batch submission
//                 const submissions = testcases.map((testcase)=>({
//                     source_code:completeCode,
//                     language_id: languageId,
//                     stdin: testcase.input,
//                     expected_output: testcase.output
//                 }));
//         //3rd 
//                 console.log("Submissions to send:", JSON.stringify(submissions, null, 2));

//                 const submitResult = await submitBatch(submissions);
//                 console.log(submitResult);

//                 const resultToken = submitResult.map((value)=> value.token);

//                 // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
                
//             const testResult = await submitToken(resultToken);
//             console.log(testResult);
//             for(const test of testResult){
//                 console.log("=== Test Result Debug ===");
//                 console.log("Status ID:", test.status_id);
//                 console.log("Status Description:", test.status?.description);
//                 console.log("Compile Output:", test.compile_output);
//                 console.log("Stderr:", test.stderr);
//                 console.log("Message:", test.message);
//                 console.log("========================");
    
//     if(test.status_id === 6) {
//         return res.status(400).send(`Compilation Error: ${test.compile_output || test.stderr || 'Unknown compilation error'}`);
//     }
//     // ... rest of your error handling
// }


//             for(const test of testResult){
//                 if(test.status_id!=3){
//                 return res.status(400).send("Reference solution failed on test cases.");
//                 }
//             }
//             }

//             // We can store it in our DB
//             const newProblem =  await db.problem.create({
//             data: {
//                     title,
//                     description,
//                     difficulty,
//                     tags,
//                     examples,
//                     constraints,
//                     testcases,
//                     codeSnippets,
//                     referenceSolution,
//                     userId: req.user.id
//             }
//             });
//             res.status(201).json({ message: "Problem Saved Successfully", problem: newProblem });
//         } 
//         catch (err) {
//             console.error(err);
//             res.status(400).send("Error: " + err.message);
//         }
// };


//     // Check if the user is an admin
//     if (req.user.role !== 'ADMIN') {
//         return res.status(403).json({
//         message: "You are not allowed to create a problem"
//         });
//     }

//     try {
//         // Loop through each reference solution language
//         for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
//         const languageId = getJudge0LanguageId(language);

//         if (!languageId) {
//             return res.status(400).json({
//             error: `Language: ${language} is not supported`
//             });
//         }
//         // Prepare submissions for each testcase
//         const submissions = testcases.map(({ input, output }) => ({
//             source_code: solutionCode,
//             language_id: languageId,
//             stdin: input,
//             expected_output: output,
//             enable_network: true  // <-- Add this
//         }));

//         const tokens = await submitBatch(submissions);
//         console.log("Tokens:", tokens);

//         const results = await pollBatchResults(tokens);
//         console.log("Results:", results);

//         // Validate each result
//             for (let i = 0; i < results.length; i++) {
//                 const result = results[i];
//                 console.log("Result for submission:", result);

//                 if (result.status.id !== 3) {
//                 console.log("Failed result:", result);
//                 return res.status(400).json({
//                     error: `Testcase ${i + 1} failed for ${language}. Reason: ${result.status.description}`
//                 });
//                 }
//             }
//         }

//         // Save the problem in the database
//         const newProblem = await db.problem.create({
//         data: {
//             title,
//             description,
//             difficulty,
//             tags,
//             examples,
//             constraints,
//             testcases,
//             codeSnippets,
//             referenceSolutions,
//             userId: req.user.id
//         }
//         });

//         return res.status(201).json({
//         success: true,
//         message: "Problem created successfully",
//         problem: newProblem
//         });

//     } catch (error) {
//         console.error("❌ Error while creating problem:", error);
//         return res.status(500).json({
//         error: "Error while creating a problem"
//         });
//     }
// };

// export const createProblem = async (req, res) => {
//     try {
//         const {
//             title,
//             description,
//             difficulty,
//             tags,
//             example,
//             constraints,
//             testcases,
//             codeSnippets,
//             referenceSolutions
//         } = req.body;

//         if (!req.user?.id) {
//             return res.status(401).json({ message: "Unauthorized: User not found" });
//         }

//         // Step 1: Validate each codeSnippet using Judge0
//         for (const [language, solutionCode] of Object.entries(codeSnippets)) {
//             const languageId = getJudge0LanguageId(language);

//             if (!languageId) {
//                 return res.status(400).json({ error: `Language ${language} is not supported` });
//             }

//             const submissions = testcases.map(({ input, output }) => ({
//                 source_code: solutionCode,
//                 language_id: languageId,
//                 stdin: input,
//                 expected_output: output,
//             }));

//             const tokens = await submitBatch(submissions);
//             console.log(tokens);
            
//             const results = await pollBatchResults(tokens);

//             for (let i = 0; i < results.length; i++) {
//                 const result = results[i];
//                 if (result.status?.id !== 3) {
//                     console.log(`❌ Testcase ${i + 1} failed for ${language}:`, result);
//                     return res.status(400).json({
//                         error: `Testcase ${i + 1} failed for ${language}. Reason: ${result.status.description}`
//                     });
//                 }
//             }
//         }

//         // Step 2: Store problem in DB if all languages passed
//         const problem = await db.problem.create({
//             data: {
//                 title,
//                 description,
//                 difficulty,
//                 tags,
//                 example,
//                 constraints,
//                 testcases,
//                 codeSnippets,
//                 referenceSolutions,
//                 user: {
//                     connect: {
//                         id: req.user.id,
//                     },
//                 },
//             },
//         });

//         return res.status(201).json({
//             message: "Problem created and verified successfully",
//             problem,
//         });

//     } catch (error) {
//         console.error("❌ Error while creating problem:", error);
//         return res.status(500).json({
//             message: "Internal server error while creating problem",
//             error: error.message,
//         });
//     }
// };

// export const createProblem = async (req, res) => {
//     try {
//         const {
//             title, 
//             description,
//             difficulty,
//             tags,
//             example,
//             constraints,
//             testcases,
//             codeSnippets,
//             referenceSolutions
//         } = req.body;

//         // Debug: Check incoming user
//         if (!req.user?.id) {
//             return res.status(401).json({ message: "Unauthorized: No user ID found" });
//         }

//         const problem = await db.problem.create({
//             data: {
//                 title,
//                 description,
//                 difficulty,
//                 tags,
//                 example,
//                 constraints,
//                 testcases,
//                 codeSnippets,
//                 referenceSolutions,
//                 user: {
//                     connect: {
//                         id: req.user.id, // ✅ safe FK connection
//                     },
//                 },
//             },
//         });

//         res.status(201).json({
//             message: "Problem created successfully",
//             problem,
//         });

//     } catch (error) {
//         console.error("❌ Error while creating a problem:", error);
//         res.status(500).json({
//             message: "Internal server error while creating a problem",
//             error: error.message,
//         });
//     }
// };


export const getAllProblem = async (req , res)=> {}

export const getProblemByID = async (req , res)=> {}

export const updateProblem = async (req , res)=> {}

export const deleteProblem = async (req , res)=> {}

export const getAllProblemsSolvedByUser = async (req , res)=> {}

