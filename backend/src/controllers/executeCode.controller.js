import { pollBatchResults, submitBatch } from "../libs/judge0.libs.js";


export const executeCode = async (req , res) =>{

    try {
        const {source_code , language_id , stdin , expected_outputs , problemId  }  = req.body;
        const useriId = req.user.id;

        // validate test case 
        if(
            !Array.isArray(stdin) ||
            stdin.length == 0 ||
            !Array.isArray(expected_outputs) ||
            expected_outputs.length !== stdin.length
        )
        {
            return res.status(400).json({error : "Invalid test cases"})
        }
        
        // prepare each testcases for the judge0  btahc submission
        const submissions =  stdin.map((input) => ({
            source_code,
            language_id,
            stdin : input,
        }));

        // send this batch submission to judge0
        const submitResponse =  await submitBatch(submissions);
        const tokens = submitResponse.map((res) => res.token);

        // poll judge0 for result of all submittted test cases 
        const result = await pollBatchResults(tokens);


        console.log('Result..........')
        console.log(result);

        res.status(200).json({message : "Code executed successfully" , result})

    } catch (error) {
        console.error("Error while executing code" , error);

    }

}