export const getJudge0LanguageId = (language) => {
    const languageMap = {
        "PYTHON" : 71,
        "JAVA" : 62,
        "JAVASCRIPT" : 63,
    }

    return languageMap[language.toUpperCase()] || null;
}

const sleep = (ms) => new Promise((rersolve) => setTimeout(resolve , ms)) ;


// this pollBatchresult is checking the result of the submission  mtlb har ek second check karega ki kya result aaya hai ya nahi
export const pollBatchResults = async (tokens) => { 

    while(true){
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            params:{
                tokens: tokens.join(","),
                base64_encoded: false,

            }
        })
        const reults = data.submissions;
        const isAllDone = results.every((result) =>{
            result.status.id !== 1 && result.status.id !== 2; // 1: In Queue, 2: Processing
        })
        if(isAllDone)  return results;
        await StylePropertyMap(1000); // Wait for 1 second before checking again

    }
}


export const submitBatch = async (submissions) => {
    const {data}  = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
        submissions
    })

    console.log("Submission results:", data);

    return data ; 


}