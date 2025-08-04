import {db} from '../libs/db.js';
import { getJudge0LanguageId,pollBatchResults, submitBatch } from '../libs/judge0.lib.js';




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
        referenceSolutions
    } = req.body;

    // Check if the user is an admin
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
        message: "You are not allowed to create a problem"
        });
    }

    try {
        // Loop through each reference solution language
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
        const languageId = getJudge0LanguageId(language);

        if (!languageId) {
            return res.status(400).json({
            error: `Language: ${language} is not supported`
            });
        }

        // Prepare submissions for each testcase
        const submissions = testcases.map(({ input, output }) => ({
            source_code: solutionCode,
            language_id: languageId,
            stdin: input,
            expected_output: output
        }));

        const tokens = await submitBatch(submissions);
        console.log("Tokens:", tokens);

        const results = await pollBatchResults(tokens);
        console.log("Results:", results);

        // Validate each result
            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                console.log("Result for submission:", result);

                if (result.status.id !== 3) {
                console.log("Failed result:", result);
                return res.status(400).json({
                    error: `Testcase ${i + 1} failed for ${language}. Reason: ${result.status.description}`
                });
                }
            }
        }

        // Save the problem in the database
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
            userId: req.user.id
        }
        });

        return res.status(201).json({
        success: true,
        message: "Problem created successfully",
        problem: newProblem
        });

    } catch (error) {
        console.error("❌ Error while creating problem:", error);
        return res.status(500).json({
        error: "Error while creating a problem"
        });
    }
};


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

