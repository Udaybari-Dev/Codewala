import e from 'express';
import {db} from '../libs/db.js';





export const createProblem  = async (req , res)=> {
    // goign to get the all data from the request body

    // loop through the data and create the problem in the database

    const { tittle , description , difficulty , tags ,
          examples ,  constraints , testcases , 
          codeSnippets , referenceSolutions } = req.body;

    // going to check the user role once again 

    if(req.user.role !== 'ADMIN'){
        return res.status(403).json({message: "you are not allowed to cvreate a problem"})
    }


    try {
        for(const [language , solutionCode] of Object.entries(codeSnippets)){
            const languageId = getJudge0LanguageId(language);

            if(!languageId){
                return  res.status(400).json({error : `Language: ${language} is not supported`});
            }


            // array of submission for each language testcases 
            const submissions = testcases.map(({input , output}) =>({
                soruce_code : solutionCode ,
                language_id : languageId,
                stdin : input,
                expected_output : output,

            }))

            const submissionResult = await submitBatch(submissions)

            const tokens = submissionResult.map((res) =>res.token);
            
            const results = await pollBatchResults(tokens);


        }
        
    } catch (error) {
        
    }





}

export const getAllProblem = async (req , res)=> {}

export const getProblemByID = async (req , res)=> {}

export const updateProblem = async (req , res)=> {}

export const deleteProblem = async (req , res)=> {}

export const getAllProblemsSolvedByUser = async (req , res)=> {}

