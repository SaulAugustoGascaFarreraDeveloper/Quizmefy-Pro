import QuizCreation from '@/components/QuizCreation'
import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  searchParams:{
    topic?: string
  }
}


export const metadata  ={
    title: "Quiz | Quizmefy"
}

const QuizPage = async ({searchParams}: Props) => {

    const session = await getAuthSession()

    if(!session?.user)
    {
        return redirect("/")
    }

  return (
    <div>
      <QuizCreation topicParam={searchParams.topic ?? ""} />
    </div>
  )
}

export default QuizPage