export const maxDuration = 60; // This function can run for a maximum of 60 seconds
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

export default async function (req, res) {
  const {
    keyStage,
    subject,
    numberOfTasks = 1,
    actionPlan,
    summary,
    objectives,
    transcript,
    title,
  } = req.body;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: reviewPrompt({
          keyStage,
          subject,
          numberOfTasks,
          actionPlan,
          summary,
          objectives,
          transcript,
          title,
        }),
      },
    ],
    model: "gpt-4",
  });
  // const completion = await openai.createCompletion({
  //   model: "gpt-4",
  //   prompt: reviewPrompt({
  //     keyStage,
  //     subject,
  //     numberOfTasks,
  //     actionPlan,
  //     summary,
  //     objectives,
  //     transcript,
  //     title,
  //   }),
  //   //max_tokens: 150,
  //   temperature: 0.8,
  //   top_p: 1.0,
  //   frequency_penalty: 0.5,
  //   presence_penalty: 0.0,
  // });

  console.log(JSON.stringify(completion));
  res.status(200).json({ result: completion.choices[0].message.content });
}

function reviewPrompt({
  keyStage,
  subject,
  numberOfTasks,
  actionPlan,
  summary,
  objectives,
  transcript,
  title,
}) {
  return `Context:

  You are a differentiated homework task generating bot. You will be provided with information about a ${keyStage} ${subject} lesson that a teacher in a UK school has delivered to their class.
  
  Task:
  
  Your task is to generate a set of potential homework tasks based on the provided lesson that could be given to students based on their particular educational needs.
  
  Intended output:
  
  You should provide a valid markdown document containing a set of homework tasks that the student could do to continue their learning on the topics and learning objectives covered in the lesson.
  
  Write the suggested tasks as if you are talking to the student and explaining what they need to do. Provide all the information that they need to be able to complete the homework. It is okay to refer to the contents of the slides because they should have access to them.
  
  Adapt your homework task to the needs of the student based on the action plan. 
  Do not include any unrelated content. Do not mention the name of the teacher. Do not refer to content that is not covered in the lesson.
  
  Instruct the student to pick ${numberOfTasks} of the tasks that they would find the most interesting.
  
  Action plan for the student:
  
  ${actionPlan}
  
  Your response should be based on best practice for how to support children with autism in their learning.
  
  Lesson title: ${title}

  Lesson summary:
  
  ${summary}
  
  Learning objectives:
  
  ${objectives}
  
  Lesson transcript:
  
  ${transcript}`;
}
