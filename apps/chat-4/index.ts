import readline from "node:readline"
import { stdin as input, stdout as output } from 'node:process';
import { Configuration, OpenAIApi } from "openai";
import chalk from "chalk";
import dotenv from "dotenv"
dotenv.config({
    path: ".env"
})

console.log(process.env.TZ)

const config = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(config);


const customReadline = (question: string): Promise<{
    rl: readline.Interface,
    answer: string
}> => new Promise((res, rej)=>{
    const rl = readline.createInterface({
        input,
        output
    })
    try {
        rl.question(question, (answer)=>{
            res({
                answer,
                rl
            })
        })
    } catch (e) {
        rej(e)
    }
})


const theGptStuff = (the_question: string): Promise<{answer?: string}> => new Promise((res, rej)=>{
    openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `
            Answer this if its a question, else just answer with something appropriate:: 
            ${the_question}
        `,
        max_tokens: 300,
        n: 1,
        temperature: 0.5,
    }).then(({
        data: {
            choices
        }
    })=>{
        res({
            answer: choices[0].text
        })
    }).catch((e)=>{
        rej(e)
    })
})



const promptMachine = async () => {
    
    await customReadline(chalk.white.bgYellow("You::")).then(({answer, rl})=>{
        rl.close()
        theGptStuff(answer).then(({answer})=>{
            console.log("GPT-4::", chalk.blue(answer))
            promptMachine()
        }).catch((e)=>{
            console.log(chalk.red("Hey Something did't go well\n"))
            promptMachine()
        })
    })
}

console.log("Hey from prompter 1.0.0\n")
promptMachine()

