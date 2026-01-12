import { syncUser } from '@/lib/syncUser';
import React from 'react'
import CreateProblemForm from './create-problem-form';

export const dynamic = "force-dynamic";

const CreateProblemPage = async () => {

  const user = await syncUser();
  
  if (user.role !== "ADMIN") {
    return (
      <div>Unauthorized</div>
    );
  }
  return (
    <div className="container mx-auto">
      <CreateProblemForm />
    </div>
  )
}

export default CreateProblemPage