import { syncUser } from "@/lib/syncUser";
export default async function Home() {
  const user = await syncUser();
  console.log(user)
  return (
  
    <div className="flex min-h-screen items-center justify-center font-sans ">
      <h1>home</h1>

    </div>
  );
}
