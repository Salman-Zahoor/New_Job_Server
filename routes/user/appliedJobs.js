const express = require("express");
const router = express.Router();
const UserAppliedJobs = require("../../model/user/appliedjobs");
const Jobs = require("../../model/orginization/postJob");
const User = require("../../model/user/userAuthentication");
const Resume = require("../../model/user/resume");
const CoverLetter = require("../../model/user/coverLetter");
const natural = require('natural');
const fs = require('fs');
const Tokenizer = new natural.WordTokenizer();
const TfIdf = new natural.TfIdf();
const stemmer = require('natural').PorterStemmer;
const stopwords = require('stopword').eng; // Import English stop words

// router.post("/applyJobs", async (req, res) => {
//   const { companyId, userId, jobId } = req.body;
//   try {
//     const user = await User.findOne({ _id: userId });
//     const resume = await Resume.findOne({ userId: userId });
//     const coverLetter = await CoverLetter.findOne({ userId: userId });
//     const data = await Jobs.findOne({
//       _id: jobId,
//     });
//     const jobStringify = JSON.stringify(data)
//     // fs.writeFileSync('job.txt', jobStringify, 'utf8')
//     // const jobOutput = fs.readFileSync('job.txt', 'utf8')
//     const resumeStrigify = JSON.stringify(resume);
//     // fs.writeFileSync('resume.txt', resumeStrigify, 'utf8');
//     // const resumeTextOutput = fs.readFileSync('resume.txt', 'utf8');
//     const tokens = natural.PorterStemmer.tokenizeAndStem(resumeStrigify);
//     const jobTokens = natural.PorterStemmer.tokenizeAndStem(jobStringify);
//     // const jobOject = JSON.parse(jobOutput);
//     // Initialize the score to 0
//     let score = 0;

//     // Iterate over the tokens and check for each keyword
//     tokens.forEach(token => {
//       if (jobTokens.includes(token)) {
//         // If the keyword is found, increment the score
//         score += 1;
//       }
//     });

//     console.log(tokens, "tokenstokenstokenstokens")

//     console.log(jobTokens, "jobTokensjobTokensjobTokensjobTokens")

//     console.log(score, "score")


//     // Calculate the percentage of the score
//     const percentage = (score / jobTokens?.length) * 200;
//     console.log(percentage);
//     const threshold = 40;

//     // Check if the percentage is greater than the threshold
//     if (percentage > threshold) {
//       let candidate = {
//         userId: userId,
//         userDetails: user,
//         resume: resume,
//         coverLetter:coverLetter,
//         score:percentage,
//       };

//       if (data) {
//         console.log(data, "DATAAAAAAAAAA");
//         let tempArr = data.appliedCandidate;
//         let fav = data.favourite;
//         fav.push(userId);
//         tempArr.push(candidate);
//         const appliedJob = new UserAppliedJobs({ companyId, userId, jobId });
//         const updateJob = await Jobs.findByIdAndUpdate(
//           { _id: jobId },
//           { appliedCandidate: tempArr, appliedCandidateIds: fav },
//           {
//             new: true,
//             useFindAndModify: true,
//           }
//         );
//         const result = await appliedJob.save();

//         res.send({
//           data: data,
//           status: "ok",
//           message: `Applied Successfully and your resume score for this job is ${Math.round(percentage)}%`,
//         });
//       } else {
//         res.status(400).send({
//           status: "error",
//           message: "no data found",
//         });
//       }
//     } else {
//       return res.status(400).json({
//         status: "error",
//         message: `You are not eligible for this job because your resume matches ${Math.round(percentage)}%`,
//       });
//     }

//   } catch (error) {
//     console.log(error, "ERRRRRRRRRRR");
//     res.status(400).send({
//       status: "error",
//       message: "something went wrong",
//     });
//   }
// });
// const natural = require('natural');




// router.post("/applyJobs", async (req, res) => {
//   const { companyId, userId, jobId } = req.body;
//   try {
//     const user = await User.findOne({ _id: userId });
//     const resume = await Resume.findOne({ userId: userId });
//     const coverLetter = await CoverLetter.findOne({ userId: userId });
//     const data = await Jobs.findOne({ _id: jobId });
    
//     const tokens = natural.PorterStemmer.tokenizeAndStem(JSON.stringify(resume.about));
//     const jobTokens = natural.PorterStemmer.tokenizeAndStem(JSON.stringify(data.description));
//     // TF-IDF Calculation
//     TfIdf.addDocument(tokens);
//     TfIdf.addDocument(jobTokens);
//     let tfidfScore = 0;
//     tokens.forEach(token => {
//       tfidfScore += TfIdf.tfidf(token, 0); // Calculate TF-IDF score for each token in resume
//     });

//     // Initialize the score to 0
//     let score = 0;

//     // Iterate over the tokens and check for each keyword
//     tokens.forEach(token => {
//       if (jobTokens.includes(token)) {
//         // If the keyword is found, increment the score
//         score += 1;
//       }
//     });

//     // Calculate the percentage of the score
//     const percentage = (score / tokens.length) * 100; // using tokens.length instead of jobTokens.length

//     const threshold = 40;

//     // Check if the percentage is greater than the threshold
//     if (percentage > threshold) {
//       let candidate = {
//         userId: userId,
//         userDetails: user,
//         resume: resume,
//         coverLetter: coverLetter,
//         score: percentage, // corrected: score should be the percentage
//         tfidfScore: tfidfScore,
        
//       };

//       if (data) {
//         let tempArr = data.appliedCandidate;
//         let fav = data.favourite;
//         fav.push(userId);
//         tempArr.push(candidate);
//         const appliedJob = new UserAppliedJobs({ companyId, userId, jobId });
//         const updateJob = await Jobs.findByIdAndUpdate(
//           { _id: jobId },
//           { appliedCandidate: tempArr, appliedCandidateIds: fav },
//           {
//             new: true,
//             useFindAndModify: true,
//           }
//         );
//         const result = await appliedJob.save();

//         res.send({
//           data: data,
//           status: "ok",
//           message: `Applied Successfully and your resume score for this job is ${Math.round(percentage)}%`,
//         });
//       } else {
//         res.status(400).send({
//           status: "error",
//           message: "no data found",
//         });
//       }
//     } else {
//       return res.status(400).json({
//         status: "error",
//         message: `You are not eligible for this job because your resume matches ${Math.round(percentage)}%`,
//       });
//     }

//   } catch (error) {
//     console.log(error, "ERRRRRRRRRRR");
//     res.status(400).send({
//       status: "error",
//       message: "something went wrong",
//     });
//   }
// });


function calculateCosineSimilarity(text1Tokens, text2Tokens) {
  // Calculate term frequencies for each text
  const text1Tf = {};
  text1Tokens.forEach(token => {
    text1Tf[token] = (text1Tf[token] || 0) + 1;
  });
  const text2Tf = {};
  text2Tokens.forEach(token => {
    text2Tf[token] = (text2Tf[token] || 0) + 1;
  });

  // Calculate dot product and vector magnitudes
  let dotProduct = 0;
  let text1Magnitude = 0;
  let text2Magnitude = 0;

  for (let i = 0; i < text1Tokens.length; i++) {
    const token = text1Tokens[i];
    const tf1 = text1Tf[token] || 0;
    const tf2 = text2Tf[token] || 0;
    dotProduct += tf1 * tf2;

    // Use term frequencies (tf) to calculate vector magnitudes
    text1Magnitude += tf1 * tf1;
    text2Magnitude += tf2 * tf2;
  }

  // Handle cases where either magnitude is 0 (no common words)
  if (text1Magnitude === 0 || text2Magnitude === 0) {
    return 0;
  }

  // Calculate cosine similarity
  return dotProduct / (Math.sqrt(text1Magnitude) * Math.sqrt(text2Magnitude));
}



function preprocessText(text) {
  // 1. Tokenization (split text into words)
  const tokens = Tokenizer.tokenize(text.toLowerCase()); // Convert to lowercase for case-insensitivity

  // 2. Stemming (reduce words to their base form)
  const stemmedTokens = tokens.map(token => stemmer.stem(token));

  // 3. Stopword removal (remove common words)
  const filteredTokens = stemmedTokens.filter(token => !stopwords.includes(token));

  // 4. Redundancy removal (optional, could involve techniques like stemming or n-grams)
  // You could implement additional logic here to remove redundant words or phrases
  // (e.g., using a set to store unique words or applying stemming more aggressively)

  return filteredTokens;
}


// Function to calculate Jaccard similarity
function calculateJaccardSimilarity(text1Tokens, text2Tokens) {
  // Create sets of unique tokens for both texts
  const text1Set = new Set(text1Tokens);
  const text2Set = new Set(text2Tokens);

  // Calculate intersection (common tokens) and union (all unique tokens)
  const intersection = new Set([...text1Set].filter(token => text2Set.has(token)));
  const union = new Set([...text1Set, ...text2Set]);

  // Calculate Jaccard similarity as the ratio of intersection to union
  return intersection.size / union.size;
}



router.post("/applyJobs", async (req, res) => {
  const { companyId, userId, jobId } = req.body;

  try {
    const user = await User.findOne({ _id: userId });
    const resume = await Resume.findOne({ userId: userId });
    const coverLetter = await CoverLetter.findOne({ userId: userId });
    const data = await Jobs.findOne({ _id: jobId });

    // Preprocessing steps
    const resumeTokens = preprocessText(JSON.stringify(resume)); // Apply preprocessing to resume
    const jobTokens = preprocessText(JSON.stringify(data)); // Apply preprocessing to job description

    // TF-IDF Calculation with stopword removal
    TfIdf.addDocument(resumeTokens);
    TfIdf.addDocument(jobTokens);
    let tfidfScore = 0;
    resumeTokens.forEach(token => {
      if (!stopwords.includes(token)) { // Exclude stopwords from TF-IDF calculation
        tfidfScore += TfIdf.tfidf(token, 0);
      }
    });

    // Jaccard Similarity
    const jaccardSimilarity = calculateJaccardSimilarity(resumeTokens, jobTokens);

    // Monge-Elkan Similarity (Optional, as it's not mentioned in the prompt)
    // Replace with your implementation of Monge-Elkan similarity calculation if needed

    // Cosine Similarity
    const cosineSimilarity = calculateCosineSimilarity(resumeTokens, jobTokens);

    // Calculate weighted score using TF-IDF, Jaccard, and Cosine (weights can be adjusted)
    const weightedScore = (jaccardSimilarity * 0.3) + (cosineSimilarity * 0.3);
    console.log(weightedScore,"weightedScoreweightedScoreweightedScoreweightedScore");
    return

    const threshold = 40; // Adjust threshold as needed

    // Check if weighted score exceeds the threshold
    if (weightedScore > threshold) {
      let candidate = {
        userId: userId,
        userDetails: user,
        resume: resume,
        coverLetter: coverLetter,
        score: Math.round(weightedScore * 200), // Percentage score
        tfidfScore: tfidfScore,
      };

      if (data) {
        let tempArr = data.appliedCandidate;
        let fav = data.favourite;
        fav.push(userId);
        tempArr.push(candidate);
        const appliedJob = new UserAppliedJobs({ companyId, userId, jobId });
        const updateJob = await Jobs.findByIdAndUpdate(
          { _id: jobId },
          { appliedCandidate: tempArr, appliedCandidateIds: fav },
          { new: true, useFindAndModify: true }
        );
        const result = await appliedJob.save();

        res.send({
          data: data,
          status: "ok",
          message: `Applied Successfully and your resume score for this job is ${Math.round(weightedScore * 200)}%`,
        });
      } else {
        res.status(400).send({
          status: "error",
          message: "no data found",
        });
      }
    } else {
      return res.status(400).json({
        status: "error",
        message: `You are not eligible for this job because your resume matches only ${Math.round(weightedScore * 200)}% of the requirements.`,
      });
    }
  } catch (error) {
    console.log(error, "ERRRRRRRRRRR");
    res.status(400).send({
      status: "error",
      message: "something went wrong",
    });
  }
});

router.post("/getAppliedJobs", async (req, res) => {
  try {
    let tempArr = [];
    const find = await UserAppliedJobs.find(req.body);
    await Promise.all(
      find.map(async (data) => {
        let jobs = await Jobs.findOne({ _id: data.jobId, isActive: true });
        tempArr.push(jobs);
        // console.log(jobs,"Array");
        // console.log(data._id,"idddddddd");
      })
    );
    // console.log(find,"myyyArray");
    console.log(tempArr,"tempArrrrrrrrrrrrr");
    res.send({
      data: tempArr,
      status: "ok",
      message: "Succesful",
    });
  } catch (error) {
    console.log(error,"errorrrrrrrr");
    res.status(400).send({
      status: "error",
      message: "something went wrong",
    });
  }
});

router.get("/getJobsByCompanyId/:id", async (req, res) => {
  try {
    const {id}= req.params;
    const find = await Jobs.find({companyId:id,isActive:true});
    res.status(200).send({
      data: find,
      status: "ok",
      message: "Succesful",
    });
  } catch (error) {
    console.log(error,"errorrrrrrrr");
    res.status(400).send({
      status: "error",
      message: "something went wrong",
    });
  }
});

router.delete("/removeAppliedJobs", async (req, res) => {
  const { userId, orginizationId, jobId } = req.body;
  try {
    const data = await Jobs.findOne({
      _id: jobId,
    });
    console.log(data, "datadatadatadata");

    if (!data) {
      res.status(400).send({
        status: "error",
        message: "Data not found",
      });
    } else {
      const index = data.appliedCandidate.indexOf(userId);
      console.log(data.appliedCandidate, "djdjkjdkdkjkjdjk");
      data.appliedCandidate.splice(index, 1);
      const updatedRes = await Jobs.findByIdAndUpdate(
        { _id: data.id },
        { appliedCandidate: data.appliedCandidate },
        {
          new: true,
        }
      );
      let deletedResult = await UserAppliedJobs.deleteOne({
        orginizationId,
        userId,
        jobId,
      });
      res.status(200).send({
        status: "ok",
        message: "Removed Successfully",
      });
    }
  } catch (error) {
    console.log(error, "ERRRRRRRRRRR");
    res.status(400).send({
      status: "error",
      message: "Something went wrong",
    });
  }
});

module.exports = router;
