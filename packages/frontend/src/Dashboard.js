import React from 'react'

export default function Dashboard() {
  return (
    <div>
    <iframe 
      title="Weather Dashboard"
      style={{background: '#21313C', border: 'none', borderRadius: '20px', boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)', width: '95vw', height: '100vh'}} 
      src="https://charts.mongodb.com/charts-project-0-dcvjfon/embed/dashboards?id=66df3492-4888-431d-8f6b-641460a74581&theme=dark&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=true&scalingWidth=fix&scalingHeight=fix">

    </iframe>
    </div>
  )
}


