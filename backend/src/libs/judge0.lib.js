export const getJudge0LanguageId = (language) => {
    const languageMap = {
        "PYTHON" : 71,
        "JAVA" : 62,
        "JAVASCRIPT" : 63,
    }

    return languageMap[language.toUpperCase()] || null;
}

// this pollBatchresult is checking the result of the submission
export const pollBatchResults = async (tokens) => { 

    while(true){
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            params:{
                tokens: tokens.join(","),
                
            }


    })

}}

export const submitBatch = async (submissions) => {
    const {data}  = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
        submissions
    })

    console.log("Submission results:", data);

    return data ; 


}