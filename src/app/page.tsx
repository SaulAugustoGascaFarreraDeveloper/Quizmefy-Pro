import SignInButton from '@/components/SignInButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAuthSession } from '@/lib/nextauth'
import {redirect} from "next/navigation"

export default async function Home() {

  const session = await getAuthSession()

  if(session?.user)
  {
    return redirect('/dashboard')
  }

  return (
    <div className='absolute top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2'>

          <Card className='w-[300px] mb-3'>

          <CardHeader>
            <CardTitle>Developed by Saul  Gasca </CardTitle>
            <CardDescription>
              <strong className='text-black dark:text-white'>email: </strong>sgfarreradev@gmail.com
              
            </CardDescription>
            <CardDescription>
              <strong className='text-black dark:text-white'>github:</strong> <a className='underline' href='https://github.com/SaulAugustoGascaFarreraDeveloper/Quizmefy-Pro'>Quizmefy Repository</a>           
              </CardDescription>
          </CardHeader>


        </Card>


      <Card className='w-[300px] '>

        <CardHeader>
          <CardTitle>Welcome to Quizmefy !</CardTitle>
          <CardDescription className='dark:text-white'>
            Quizmefy is a quiz beta app that allows you to create and share quizzes with your friends,
            where the AI generate the quizzes
          </CardDescription>
        </CardHeader>

        <CardContent>
          
          <SignInButton text='Sign in with Google!'  />
        </CardContent>

      </Card>

    </div>
  )
}
