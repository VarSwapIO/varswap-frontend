import { secondsToTime } from '@/helpers/utils';
import React, { useEffect, useState } from 'react'


const TYPE_TO_TEXT: { [key: string]: string } = {
  days: 'D',
  hours: "H",
  minutes: "M",
  seconds: "S"
}

const calculateTimeLeft = (end_time: number) => {
  let difference = end_time < +new Date().getTime() ? 0 : end_time - +new Date().getTime();
  const formatted = secondsToTime(difference);
  let time_arr = []
  for (const key in formatted) {
    if (Object.prototype.hasOwnProperty.call(formatted, key)) {
      const element = formatted?.[key]
      const time_obj = {
        value: element < 10 ? `0${element}` : element,
        title: TYPE_TO_TEXT?.[key]
      }
      time_arr.push(time_obj)
    }
  }
  return time_arr
}

const TimeBoxCountDown = ({ end_time }: { end_time: string | number }) => {

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(+end_time))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(+end_time))
    }, 1000)
    return () => clearInterval(timer)
  }, [end_time])

  if (timeLeft?.length === 0) {
    return <p>----</p>
  }

  return (
    <div className='flex gap-2 items-center'>
      {
        timeLeft?.map((t: any, index: number) => (
          <div key={index} className='flex items-center rounded-md p-1 shadow-sm border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold dark:text-white text-slate-900'>
            <p>{t?.value}</p>
            <p className='ml-0.5'>{t?.title}</p>
          </div>
        ))
      }
    </div>
  )
}

export default TimeBoxCountDown