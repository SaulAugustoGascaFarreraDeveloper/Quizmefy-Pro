"use client"
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import React from 'react'
import D3WordCloud from "react-d3-cloud"

type Props = {
    formattedTopics: {text:string,value: number}[] 
}

const CustomWordCloud = ({formattedTopics}: Props) => {

    const theme = useTheme()
    const router = useRouter()


    const data = [
        {
            text: "Hey!",
            value: 3
        },
        {
            text: "Hi",
            value: 5
        },
        {
            text: "Computer",
            value: 13
        },
        {
            text: "NextJS",
            value: 8
        },
        {
            text: "Live",
            value: 7
        },
    ]


    const fontSizeMappper = (word: {value: number}) => {
        return Math.log2(word.value) * 5 + 1
    }

  return (
    <>
        <D3WordCloud height={550} font="Times" fontSize={fontSizeMappper} rotate={0}
         padding={10}
         fill={theme.theme == "dark" ? 'white' : 'black' }
         data={formattedTopics}
         onWordClick={(event,word) => {
            router.push(`/quiz?topic=${word.text}`)
         }}
         
         />
    </>
  )
}

export default CustomWordCloud