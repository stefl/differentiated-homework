export const maxDuration = 60; // This function can run for a maximum of 60 seconds
import { OpenAIStream, OpenAIStreamPayload } from "../../../utils/OpenAIStream";

export async function POST(req: Request): Promise<Response> {
  const {
    keyStage,
    subject,
    numberOfTasks = 1,
    maxTasks = 5,
    actionPlan,
    summary,
    objectives,
    transcript,
    title,
    task,
  } = (await req.json()) as {
    keyStage?: string;
    subject?: string;
    numberOfTasks?: string;
    actionPlan?: string;
    summary?: string;
    objectives?: string;
    transcript?: string;
    title?: string;
    maxTasks?: string;
    task?: string;
  };

  console.log("Got request");

  const payload: OpenAIStreamPayload = {
    messages: [
      {
        role: "user",
        content: reviewPrompt({
          keyStage,
          subject,
          numberOfTasks,
          maxTasks,
          actionPlan,
          summary,
          objectives,
          transcript,
          title,
          task,
        }),
      },
    ],
    model: "gpt-4",
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2000,
    stream: true,
    n: 1,
  };

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

  // console.log(JSON.stringify(completion));
  // res.status(200).json({ result: completion.choices[0].message.content });

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}

function reviewPrompt({
  keyStage,
  subject,
  numberOfTasks,
  maxTasks,
  actionPlan,
  summary,
  objectives,
  transcript,
  title,
  task,
}) {
  const taskDefinition = task
    ? `Generate tasks based on this task definition: ${task}.`
    : `Generate tasks based upon the inputs provided`;

  return `Context:

  You are a differentiated homework task generating bot. You will be provided with information about a ${keyStage} ${subject} lesson that a teacher in a UK school has delivered to their class.
  
  Task:
  
  Your task is to generate a set of potential homework tasks based on the provided lesson that could be given to students based on their particular educational needs.

  ${taskDefinition}

  Intended output:
  
  You should provide a valid markdown document containing a set of homework tasks that the student could do to continue their learning on the topics and learning objectives covered in the lesson.
  
  Write the suggested tasks as if you are talking to the student and explaining what they need to do. Provide all the information that they need to be able to complete the homework. It is okay to refer to the contents of the slides because they should have access to them.
  
  Adapt your homework task to the needs of the student based on the action plan. 
  Do not include any unrelated content. Do not mention the name of the teacher. Do not refer to content that is not covered in the lesson.
  
  Instruct the student to pick ${numberOfTasks} out of maximum ${maxTasks} tasks that they would find the most interesting.
  
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
