import React from 'react'
import { getProblemById } from '@/app/action/serverActions'
import ProblemWorkspace from '@/components/ProblemWorkspace'

export const dynamic = "force-dynamic";

const ProblemPage = async ({ params }) => {
    const { id } = await params
    const problem = await getProblemById(id)

    if (!problem) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-2xl font-bold">Problem not found</h1>
                <p className="text-muted-foreground">The problem you are looking for does not exist.</p>
            </div>
        )
    }

    return (
        <div className="-mt-8 -mx-4 pb-4">
            {/* 
         Negative margin to break out of the container padding from layout 
         to give a more full-screen IDE feel 
      */}
            <ProblemWorkspace problem={problem} />
        </div>
    )
}

export default ProblemPage