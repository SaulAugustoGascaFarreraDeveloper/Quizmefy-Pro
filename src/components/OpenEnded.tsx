"use client"
import { cn, formatTimeDelta } from '@/lib/utils'
import { Game, Question } from '@prisma/client'
import { differenceInSeconds } from 'date-fns'
import { BarChart, ChevronRight, Loader2, Timer } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button, buttonVariants } from './ui/button'
import { useToast } from './ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { checkAnswerSchema } from '@/schemas/form/quiz'
import { z } from 'zod'
import axios from 'axios'
import BlankAnswerInput from './BlankAnswerInput'
import Link from 'next/link'

type Props = {
  game: Game & {
    questions: Pick<Question,'id' | 'question' | 'answer'>[]
  },
  user: string | null
}

const OpenEnded = ({game,user}: Props) => {

  const [questionIndex,setQuestionIndex] = useState(0)


  const [blankAnswer,setBlankAnswer] = useState<string>("")

  const { toast } = useToast()

  const [hasEnded,setHasEnded] = useState<boolean>(false)

  const [now,setNow] = useState<Date>(new Date())


  const currentQuestion = useMemo(() => {

    return game.questions[questionIndex]

},[questionIndex,game.questions])



useEffect(() => {

  const interval = setInterval(() => {
      if(!hasEnded)
      {
          setNow(new Date())
      }
  },1000)


  return () => {
      clearInterval(interval)
  }

},[hasEnded])





const {mutate: checkAnswer,isLoading:isChecking} = useMutation({
  mutationFn: async () => {

      let filledAnswer = blankAnswer

      document.querySelectorAll('#user-blank-input').forEach(input => {
        filledAnswer = filledAnswer.replace("_____",input.value)
        input.value = ""
      })

      const payload: z.infer<typeof checkAnswerSchema> = {
          questionId: currentQuestion.id,
          userAnswer: filledAnswer
      }

      const response = await axios.post("/api/checkanswer",payload)

      return response.data
  }
})


const handleNext = useCallback(() => {

  checkAnswer(undefined,{
      onSuccess: ({percentageSimilarity}) => {
         

        toast({
          title: `You answer is ${percentageSimilarity}% similar to the correct answer`,
          description: `answers are matched based on similarity comparisons`
        })

          if(questionIndex === game.questions.length - 1)
          {
              setHasEnded(true)
              return
          }

          setQuestionIndex((prev) => prev + 1)
      }
  })

},[checkAnswer,toast,isChecking,questionIndex,game.questions.length])



//add keyboard event to navigate from options
useEffect(() => {

  const handleKeydown = (event: KeyboardEvent) => {


      if(event.key == "Enter")
      {
          handleNext()
      }

  }

  document.addEventListener('keydown',handleKeydown)

  return () => {
      document.removeEventListener('keydown',handleKeydown)
  }

},[handleNext])


if(hasEnded)
{
    return(
        <div className="absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="px-4 mt-2  text-white font-semibold bg-green-700 dark:bg-green-500 rounded-md whitespace-nowrap">
            {user?.split(" ")[0]}, You completed in  {formatTimeDelta(differenceInSeconds(now,game.timeStarted))}
            </div>
            <Link href={`/statistics/${game.id}`} className={cn(buttonVariants(),"mt-2 animate-pulse")}  >
                View statistics
                <BarChart className='w-4 h-4 ml-2' />
            </Link>
        </div>
    )
}



  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]">
            <div className="flex flex-row justify-between">

                <div className="flex flex-col">

                        <p>
                            <span className='text-slate-700 dark:text-slate-200'>Topic:</span>
                            <span className='px-2 py-1 ml-1 text-white rounded-lg bg-slate-800 dark:bg-slate-500'>{game.topic}</span>
                        </p>

                        <div className="flex self-start mt-1 text-slate-700 dark:text-slate-200">
                            <Timer className='mr-2' />
                            {formatTimeDelta(differenceInSeconds(now,game.timeStarted))}
                        </div>
                    
                </div>

                

                {/* <MCQCounter correctAnswers={correctAnswers} wrongAnswers={wrongAnswers} /> */}
            </div>

            <Card className='w-full mt-4'>

                <CardHeader className='flex flex-row items-center'>
                    <CardTitle className='mr-5 text-center divide-y divide-zinc-600/50'>
                            <div>
                               {questionIndex + 1}
                            </div>
                            <div className='text-base text-slate-400 '>
                                    {game.questions.length}
                            </div>
                    </CardTitle>

                    <CardDescription className='text-grow text-lg'>
                        {currentQuestion.question}
                    </CardDescription>
                </CardHeader>

            </Card>


            <div className="flex flex-col items-center justify-center w-full mt-4">

                <BlankAnswerInput answer={currentQuestion.answer} setBlankAnswer={setBlankAnswer} />

                <Button disabled={isChecking} className='mt-2' onClick={handleNext} >
                    {isChecking && <Loader2 className='w-4 h-4 animate-spin mr-2' />}
                    Next <ChevronRight className='w-4 h-4 ml-2' />
                </Button>

            </div>
    </div>
  )
}

export default OpenEnded