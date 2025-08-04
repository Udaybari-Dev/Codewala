import axios from 'axios';
import dotenv from 'dotenv';

export const getJudge0LanguageId = (language) => {
    const languageMap = {
        "PYTHON" : 71,
        "JAVA" : 62,
        "JAVASCRIPT" : 63,
    }

    return languageMap[language.toUpperCase()] || null;
}


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResults = async (tokens, maxAttempts = 10) => {
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const { data } = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
        params: {
          tokens: tokens.map(t => typeof t === 'string' ? t : t.token).join(','),
          base64_encoded: false,
        },
      });

      const results = data?.submissions || [];

      const areAllResultsValid = results.length === tokens.length &&
        results.every(r => r && r.status && typeof r.status.id === 'number');

      if (!areAllResultsValid) {
        console.warn("⚠️ Some results are null or missing status. Retrying...");
        await sleep(1000);
        attempts++;
        continue;
      }

      const isAllDone = results.every(
        (r) => r.status.id !== 1 && r.status.id !== 2 // 1: In Queue, 2: Processing
      );

      if (isAllDone) return results;

      await sleep(1000);
      attempts++;

    } catch (err) {
      console.error("❌ Error in pollBatchResults:", err.response?.data || err.message);
      throw new Error("Failed to poll Judge0 results");
    }
  }

  throw new Error("❌ Polling timed out after 10 attempts");
};


export const submitBatch = async (submissions) => {
  try {
    const { data } = await axios.post(
      `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
         submissions 
      });
     
      console.log("Submission Results:", data);

    
    return data;

  } catch (error) {
    console.error("Error in submission:", error.response?.data || error.message);
    throw error;
  }
};



// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve , ms)) ;


// export const pollBatchResults = async (tokens) => { 

//     while(true){
//         try{
//         const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
//             params:{
//                 tokens: tokens.join(","),
//                 base64_encoded: false,

//             }
//         })
//         const results = data.submissions;
//         const isAllDone = results.every(
//             (result) => result.status.id !== 1 && result.status.id !== 2) // 1: In Queue, 2: Processing
//         if(isAllDone)  return results;
//         await sleep(1000); // Wait for 1 second before checking again

//     }
//         catch (err) {
//             console.error("❌ Error in pollBatchResults:", err.response?.data || err.message);
//             throw new Error("Failed to poll  Judge0 results");
//         }
//     }
// }


//gpt or github keka 


// export const pollBatchResults = async (tokens) => {
//   while (true) {
//     const { data } = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
//       params: {
//         tokens: tokens.join(","),
//         base64_encoded: false,
//       },
//     });

//     const results = data.submissions;

//     const isAllDone = results.every(
//       (r) => r.status.id !== 1 && r.status.id !== 2
//     );

//     if (isAllDone) return results;

//     await sleep(1000);
//   }
// };

// export const submitBatch = async (submissions) => {
//   try {
//     const { data } = await axios.post(
//       `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
//       { submissions }
//     );

//     // Fix: Judge0 returns array of token objects, not a `tokens` field
//     if (!Array.isArray(data)) {
//       throw new Error("Judge0 did not return token array");
//     }

//     const tokens = data.map(item => item.token).filter(Boolean);

//     if (tokens.length === 0) {
//       throw new Error("Judge0 did not return any valid tokens");
//     }

//     return tokens;
//   } catch (error) {
//     console.error("❌ Error in submitBatch:", error.response?.data || error.message);
//     throw error;
//   }
// };


// const getLanguageById = (lang)=>{

//     const language = {
//         "c++":54,
//         "java":62,
//         "javascript":63
//     }


//     return language[lang.toLowerCase()];
// }


// const submitBatch = async (submissions)=>{


// const options = {
//   method: 'POST',
//   url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//   params: {
//     base64_encoded: 'false'
//   },
//   headers: {
//     'x-rapidapi-key': process.env.JUDGE0_KEY,
//     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
//     'Content-Type': 'application/json'
//   },
//   data: {
//     submissions
//   }
// };

// async function fetchData() {
// 	try {
// 		const response = await axios.request(options);
// 		return response.data;
// 	} catch (error) {
// 		console.error(error);
// 	}
// }

//  return await fetchData();

// }


// const waiting = async(timer)=>{
//   setTimeout(()=>{
//     return 1;
//   },timer);
// }

// // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

// const submitToken = async(resultToken)=>{

// const options = {
//   method: 'GET',
//   url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//   params: {
//     tokens: resultToken.join(","),
//     base64_encoded: 'false',
//     fields: '*'
//   },
//   headers: {
//     'x-rapidapi-key': process.env.JUDGE0_KEY,
//     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
//   }
// };

// async function fetchData() {
// 	try {
// 		const response = await axios.request(options);
// 		return response.data;
// 	} catch (error) {
// 		console.error(error);
// 	}
// }


//  while(true){

//  const result =  await fetchData();

//   const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);

//   if(IsResultObtained)
//     return result.submissions;

  
//   await waiting(1000);
// }


// }


