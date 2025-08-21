import axios from 'axios';
import dotenv from 'dotenv';


export const getJudge0LanguageId = (language) => {
        const languageMap = {
            "PYTHON": 71,
            "JAVA": 62,
            "JAVASCRIPT": 63,
        };
    return languageMap[language.toUpperCase()];
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResults = async (tokens) => {
        while (true) {
                const { data } = await axios.get(
                `${process.env.JUDGE0_API_URL}/submissions/batch`,
                {
                    params: {
                    tokens: tokens.join(","),
                    base64_encoded: false,
                    },
                    headers: {
                    "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
                    "X-RapidAPI-Host": process.env.JUDGE0_API_HOST,
                    },
                }
                );

                const results = data.submissions;

                const isAllDone = results.every(
                (r) => r.status.id !== 1 && r.status.id !== 2
                );

                if (isAllDone) return results;
                await sleep(1000);
            }
};

export const submitBatch = async (submissions) => {
        try {
                const response = await axios.post(
                `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
                { submissions },
                {
                    headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
                    "X-RapidAPI-Host": process.env.JUDGE0_API_HOST,
                    },
                }
                );

                return response.data;
        } catch (error) {
                console.error("Judge0 Error:", error.response?.data || error.message);
                throw error;
        }
};







// export function getLanguageName(languageId){
//     const LANGUAGE_NAMES = {
//         74: "TypeScript",
//         63: "JavaScript",
//         71: "Python",
//         62: "Java",
//     }

//     return LANGUAGE_NAMES[languageId] || "Unknown"
// }
