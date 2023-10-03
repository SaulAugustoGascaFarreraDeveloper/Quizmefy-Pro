import { prisma } from "@/lib/db"
import { checkAnswerSchema } from "@/schemas/form/quiz"
import { NextResponse } from "next/server"
import { ZodError } from "zod"
import {compareTwoStrings} from "string-similarity"

export const POST = async (req: Request,res: Response) => {

    try{

        const body = await req.json()

        const {questionId,userAnswer} = checkAnswerSchema.parse(body)

        const question = await prisma.question.findUnique({
            where:{
                id: questionId
            }
        })

        if(!question)
        {
            return NextResponse.json({
                error: "Question not Found"
            },{
                status: 404
            })
        }

        await prisma.question.update({
            where: {
                id: questionId
            },
            data:{
                userAnswer: userAnswer
            }
        })

        if(question.questionType === "mcq")
        {
            const isCorrect = question.answer.toLowerCase().trim() === userAnswer.toLowerCase().trim()

            await prisma.question.update({
                where:{
                    id: questionId
                },
                data:{
                    isCorrect: isCorrect
                }
            })


            return NextResponse.json({
                isCorrect
            },{
                status: 200
            })
        }
        else if(question.questionType === "open_ended")
        {
            let percentageSimilarity = compareTwoStrings(userAnswer.toLowerCase().trim(),question.answer.toLowerCase().trim())
            percentageSimilarity = Math.round(percentageSimilarity * 100)

            await prisma.question.update({
                where:{
                    id: questionId
                },
                data:{
                    percentageCorrect: percentageSimilarity
                }
            })

            return NextResponse.json({
                percentageSimilarity
            },{
                status: 200
            })
        }


    }catch(error)
    {
        if(error instanceof ZodError)
        {
            return NextResponse.json({
                error: error.issues
            },{
                status: 400
            })
        }
    }

}