import React from 'react'
import { Card } from './ui/card'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Separator } from './ui/separator'

type Props = {
    correctAnswers: number,
    wrongAnswers: number
}

const MCQCounter = ({correctAnswers,wrongAnswers}: Props) => {
  return (
    <Card className='flex flex-row items-center justify-center p-2'>
        <CheckCircle2  size={30} className='dark:text-green-500 text-[green]' />
        <span className='mx-2 text-2xl text-[green] dark:text-green-500'>{correctAnswers}</span>
        <Separator orientation='vertical' />
        <span className='mx-2 text-2xl text-[red] dark:text-red-500'>{wrongAnswers}</span>
        <XCircle size={30} className='dark:text-red-500 text-[red]'  />
    </Card>
  )
}

export default MCQCounter