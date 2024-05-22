import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
export const appRouter = router({
    authCallback:publicProcedure.query(async ()=>{
                const {getUser}= getKindeServerSession();
                const user = await getUser();
                if (!user?.email || !user.id){
                    throw new TRPCError({code:'UNAUTHORIZED'})
                }
                
                const dbUser = await db.user.findFirst({
                    where:{
                        id: user.id,
                    }
                })
                if(!dbUser){
                    await db.user.create({
                        data:{
                            id: user.id,
                            email:user.email,
                        }
                    })
                }

                return {success:true}  
    }),
    getUserFiles: privateProcedure.query(async({ctx})=>{
        const {userId,User} = ctx
        return await db.file.findMany({
            where:{
                userId
            } 
        })        
    })
});
export type AppRouter = typeof appRouter;