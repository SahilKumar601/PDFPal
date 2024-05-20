import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
export const appRouter = router({
    authCallback:publicProcedure.query(()=>{
        async function fetchuser(){
            try {
                const {getUser}= getKindeServerSession();
                const user = await getUser();
                if (!user || !user.id){
                    throw new TRPCError({code:'UNAUTHORIZED'})
                }
                // check in Database
                return {success:true}
            } catch (error) {
                console.log(error);
            }   
        }
    })
});
export type AppRouter = typeof appRouter;