import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";
const Page=async ()=>{
          const { getUser } = getKindeServerSession();
          const user = await getUser();
          if(!user?.email || !user.id) redirect('/auth-callback?orgin=dasboard')
          const dbUser = await db.user.findFirst({
            where:{
              id:user.id
            }
          })
          if(!dbUser){ redirect('/auth-callback?orgin=dasboard')}
    return (
        <div>
            <h1><Dashboard/></h1>
        </div>
    )
}
export default Page;