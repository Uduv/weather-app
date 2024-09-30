import React from 'react'

export default function Dashboard() {
  return (
    <div>
    <iframe 
      title="Weather Dashboard"
      style={{background: '#21313C', border: 'none', borderRadius: '20px', boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)', width: '95vw', height: '100vh'}} 
      src="https://charts.mongodb.com/charts-project-0-mxqgaks/embed/dashboards?id=66fa9b55-97d9-4edd-80ef-10736a8b7ac7&theme=dark&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=true&scalingWidth=scale&scalingHeight=fixed">

    </iframe>
    </div>
  )
}


