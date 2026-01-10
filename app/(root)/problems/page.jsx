
import React from 'react'
import { getAllProblemsForListing } from '@/app/action/serverActions'
import ProblemTable from '@/components/ProblemTable'

export const dynamic = "force-dynamic";

const ProblemsPage = async () => {
  const { problems, userRole } = await getAllProblemsForListing();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Problems</h1>
          <p className="text-muted-foreground">
            Challenge yourself with our curated list of problems.
          </p>
        </div>
        <ProblemTable problems={problems} userRole={userRole} />
      </div>
    </div>
  )
}

export default ProblemsPage